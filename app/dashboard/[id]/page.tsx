import MediationClient from "./MediationClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MediationPage({ params }: PageProps) {
  const { id } = await params;

  return <MediationClient mediationId={id} />;
}
