import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

type MediationPhase =
  | "intake"
  | "clarification"
  | "interests"
  | "options"
  | "agreement";

const phaseOrder: MediationPhase[] = [
  "intake",
  "clarification",
  "interests",
  "options",
  "agreement",
];

const mediation = {
  id: "m1",
  title: "Erbschaft Weber",
  phase: "interests" as MediationPhase,
  status: "active",
  progress: 65,
};

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();

  if (!authResult.ok) {
    return authResult.response;
  }

  if (params.id !== mediation.id) {
    return NextResponse.json(
      { error: "Mediation nicht gefunden" },
      { status: 404 },
    );
  }

  const currentIndex = phaseOrder.indexOf(mediation.phase);

  if (currentIndex === -1) {
    return NextResponse.json(
      { error: "Ungültige aktuelle Phase" },
      { status: 400 },
    );
  }

  if (currentIndex === phaseOrder.length - 1) {
    return NextResponse.json(
      { error: "Mediation ist bereits in der letzten Phase" },
      { status: 409 },
    );
  }

  const nextPhase = phaseOrder[currentIndex + 1];

  const updatedMediation = {
    ...mediation,
    phase: nextPhase,
    progress: Math.round(((currentIndex + 2) / phaseOrder.length) * 100),
  };

  return NextResponse.json(updatedMediation);
}
