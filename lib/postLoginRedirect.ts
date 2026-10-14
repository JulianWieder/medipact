/**
 * Weiterleitung nach erfolgreichem Login (E-Mail oder Google).
 *
 * Explizites Ziel (z.B. Einladungslink) hat Vorrang vor dem rollenbasierten
 * Routing: Firmen-Admin / Mediator / Admin -> Workspace, Privatpersonen
 * (Partei) -> Dashboard. callbackUrl muss bereits auf relative Pfade
 * geprüft sein (kein Open Redirect).
 */
export async function redirectAfterLogin(callbackUrl: string): Promise<void> {
  if (callbackUrl) {
    window.location.href = callbackUrl;
    return;
  }

  let target = "/dashboard";
  try {
    const roleRes = await fetch("/api/auth/me/role", { cache: "no-store" });
    if (roleRes.ok) {
      const info = await roleRes.json();
      if (["firm_admin", "mediator", "admin"].includes(info?.role)) target = "/workspace";
    }
  } catch {}
  window.location.href = target;
}
