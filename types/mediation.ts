export type MediationStatus = "draft" | "active" | "pending" | "completed";

export type MediationPhase =
  | "einleitung"
  | "themensammlung"
  | "interessen"
  | "optionen"
  | "verhandlung"
  | "abschluss";

export type ParticipantRole =
  | "initiator"
  | "party_a"
  | "party_b"
  | "mediator"
  | "observer";

export interface MediationParticipant {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: ParticipantRole;
}

export interface MediationCase {
  id: string;
  title: string;
  type: "trennung" | "erbe" | "nachbarschaft";
  status: MediationStatus;
  phase: MediationPhase;
  progress: number;
  participants: MediationParticipant[];
  createdAt: string;
  updatedAt: string;
}
