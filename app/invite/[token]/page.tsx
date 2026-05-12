import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!token) {
    return <div>Einladungslink ist ungültig.</div>;
  }

  const isValidInvite = token.length > 20;

  if (!isValidInvite) {
    return <div>Einladung ungültig oder abgelaufen.</div>;
  }

  redirect(`/auth/register?invite=${encodeURIComponent(token)}`);
}
