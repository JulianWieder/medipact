import { auth } from "@/auth";
import { LogoutButton } from "@/app/components/ui/logout-button";

export async function DashboardHeader() {
  const session = await auth();

  const username =
    session?.user?.name || session?.user?.email?.split("@")[0] || "User";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container h-16 flex items-center justify-between">
        <div className="font-black text-xl text-slate-900">medipact</div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">Eingeloggt als</span>

          <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
            {username.charAt(0).toUpperCase()}
          </div>

          <span className="text-sm font-semibold text-slate-900">
            {username}
          </span>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
