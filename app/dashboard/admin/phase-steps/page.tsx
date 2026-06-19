import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminPhaseStepsClient from "./AdminPhaseStepsClient";

const ADMIN_ROLES = new Set(["mediator", "admin"]);

export default async function AdminPhaseStepsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/dashboard/admin/phase-steps");

  const role = session.user.role;
  if (!role || !ADMIN_ROLES.has(role)) {
    redirect("/dashboard");
  }

  return <AdminPhaseStepsClient />;
}
