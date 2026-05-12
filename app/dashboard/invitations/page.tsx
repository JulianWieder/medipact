import InvitationsClient from "./InvitationsClient";

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function InvitationsPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return <InvitationsClient token={token ?? ""} />;
}
