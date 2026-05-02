export async function advanceMediation(id: string) {
  const res = await fetch(`/api/mediations/${id}/advance`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Mediation konnte nicht weitergeschaltet werden");
  }

  return res.json();
}
