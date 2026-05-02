"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { status } = useSession();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    loadMediations();
  }, [status]);

  async function loadMediations() {
    const res = await fetch("/api/mediations");

    if (!res.ok) {
      const text = await res.text();
      console.error("Fehler beim Laden", res.status, text);
      return;
    }

    const result = await res.json();
    setData(result);
  }

  if (status === "loading") {
    return <p>Lade Session...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Bitte einloggen</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
   {data.map((item) => (
  <div key={item.id}>{item.title}</div>
))}
    </div>
  );
}