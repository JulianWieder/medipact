import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogbuchNewClient from "./LogbuchNewClient";

export default async function NewLogbuchPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return <LogbuchNewClient />;
}
