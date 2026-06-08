import { auth } from "@/auth";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
type BackendFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function backendFetch<T = unknown>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<{
  ok: boolean;
  status: number;
  data: T | null;
}> {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      status: 401,
      data: { error: "Nicht authentifiziert" } as T,
    };
  }

  // Der jwt-Callback in auth.ts versucht das Access-Token proaktiv per
  // Refresh-Token zu erneuern. Ist das fehlgeschlagen (z. B. weil auch das
  // Refresh-Token abgelaufen ist), markiert er die Session mit `error`.
  // In dem Fall lohnt sich kein weiterer Versuch — der Nutzer muss sich neu
  // einloggen, und das soll auch klar im UI ankommen statt lautlos zu scheitern.
  if (session.error === "RefreshAccessTokenError" || session.error === "RefreshTokenMissing") {
    return {
      ok: false,
      status: 401,
      data: { error: "Sitzung abgelaufen – bitte neu einloggen", reauth: true } as T,
    };
  }

  if (!session.backendAccessToken) {
    console.error("backendFetch: session exists but backendAccessToken is missing — session cookie is stale, user must re-login");
    return {
      ok: false,
      status: 401,
      data: { error: "Sitzung abgelaufen – bitte neu einloggen", reauth: true } as T,
    };
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session.backendAccessToken
          ? { Authorization: `Bearer ${session.backendAccessToken}` }
          : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
  } catch (err) {
    console.error(`backendFetch: network error reaching ${API_BASE_URL}${path}`, err);
    return {
      ok: false,
      status: 503,
      data: { error: "Backend nicht erreichbar" } as T,
    };
  }

  // Auch ein frisch erneuertes Token kann das Backend ablehnen (z. B. wenn der
  // Nutzer in der Zwischenzeit gelöscht/gesperrt wurde). Auch hier dem Aufrufer
  // signalisieren, dass ein Re-Login nötig ist, statt nur den rohen 401 zurückzugeben.
  if (res.status === 401) {
    const data = (await res.json().catch(() => null)) as T | null;
    return {
      ok: false,
      status: 401,
      data: (data ?? { error: "Sitzung abgelaufen – bitte neu einloggen", reauth: true }) as T,
    };
  }

  const data = (await res.json().catch(() => null)) as T | null;

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}
