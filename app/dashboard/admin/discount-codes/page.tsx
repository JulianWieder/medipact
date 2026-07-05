import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DiscountCodesClient from "./DiscountCodesClient";

const ADMIN_ROLES = new Set(["mediator", "admin"]);

export default async function AdminDiscountCodesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/dashboard/admin/discount-codes");

  const role = session.user.role;
  if (!role || !ADMIN_ROLES.has(role)) {
    redirect("/dashboard");
  }

  return <DiscountCodesClient />;
}
