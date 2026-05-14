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

  if (!session.backendAccessToken) {
    console.error("backendFetch: session exists but backendAccessToken is missing — session cookie is stale, user must re-login");
    return {
      ok: false,
      status: 401,
      data: { error: "Sitzung abgelaufen – bitte neu einloggen" } as T,
    };
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
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

  const data = (await res.json().catch(() => null)) as T | null;

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}
