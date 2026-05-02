import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

async function getMediations() {
  return [
    {
      id: "m1",
      title: "Erbschaft Weber",
      phase: "interests",
      status: "active",
      progress: 65,
    },
  ];
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const mediations = await getMediations();

  return <DashboardClient mediations={mediations} />;
}
