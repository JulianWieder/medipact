import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewsletterAdminClient from "./NewsletterAdminClient";

// Lesen dürfen Mediatoren und Admins, versenden nur Admins – die harte Grenze
// zieht das Backend (routers/newsletter.py), hier geht es nur um die Sichtbarkeit.
const ADMIN_ROLES = new Set(["mediator", "admin"]);

export default async function AdminNewsletterPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/dashboard/admin/newsletter");

  const role = session.user.role;
  if (!role || !ADMIN_ROLES.has(role)) {
    redirect("/dashboard");
  }

  return <NewsletterAdminClient canSend={role === "admin"} />;
}
