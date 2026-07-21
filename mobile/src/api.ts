// Direkter Client für die medipact-FastAPI (KEIN Next-Proxy wie im Web).
//
// Voraussetzung auf dem Server: nginx-Location, die https://medipact.de/backend/
// auf 127.0.0.1:8000 durchreicht (siehe mobile/README.md). Auth läuft über die
// JWT-Endpunkte /auth/login und /auth/refresh; die Tokens liegen im SecureStore
// des Geräts (Keychain/Keystore), NICHT in AsyncStorage.
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const API_URL: string = (
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  "https://medipact.de/backend"
).replace(/\/$/, "");

const ACCESS_KEY = "medipact_access_token";
const REFRESH_KEY = "medipact_refresh_token";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export async function loadTokens(): Promise<boolean> {
  accessToken = await SecureStore.getItemAsync(ACCESS_KEY);
  refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
  return refreshToken != null;
}

async function saveTokens(access: string, refresh: string): Promise<void> {
  accessToken = access;
  refreshToken = refresh;
  await SecureStore.setItemAsync(ACCESS_KEY, access);
  await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function clearTokens(): Promise<void> {
  accessToken = null;
  refreshToken = null;
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

/** Authorization-Header z. B. für <Image source={{ headers }}> (Datei-Route). */
export function authHeaders(): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

/** Das Backend liefert Datei-URLs mit Web-Proxy-Präfix "/api/..." –
 *  für den Direktzugriff auf die FastAPI muss das Präfix weg. */
export function fileUrl(url: string): string {
  return `${API_URL}${url.replace(/^\/api/, "")}`;
}

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, detail: unknown) {
    const msg =
      typeof detail === "object" && detail != null && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : `Fehler (${status})`;
    super(msg);
    this.status = status;
    this.detail = detail;
  }
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      await clearTokens();
      return false;
    }
    const body = await res.json();
    await saveTokens(body.access_token, body.refresh_token);
    return true;
  } catch {
    return false;
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  form?: FormData;
};

/** Zentraler Fetch mit Bearer-Token und automatischem Refresh bei 401. */
export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const doFetch = () =>
    fetch(`${API_URL}${path}`, {
      method: opts.method ?? (opts.body !== undefined || opts.form ? "POST" : "GET"),
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        // Bei FormData setzt fetch den multipart-Boundary-Header selbst.
        ...(opts.form ? {} : { "Content-Type": "application/json" }),
      },
      body: opts.form ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
    });

  let res = await doFetch();
  if (res.status === 401 && (await tryRefresh())) {
    res = await doFetch();
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

export async function login(
  email: string,
  password: string,
): Promise<{ id: number; email: string; name: string; role: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  await saveTokens(body.access_token, body.refresh_token);
  return body.user;
}

export async function logout(): Promise<void> {
  await clearTokens();
}
