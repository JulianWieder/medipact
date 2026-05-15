import { backendFetch } from "@/lib/backend";

export async function advanceMediation(id: string) {
  return backendFetch(`/mediations/${id}/advance`, {
    method: "POST",
  });
}

export async function createMediation(payload: {
  title?: string;
  mediation_type: string;
  description?: string;
  priority?: string;
  role?: string;
}) {
  return backendFetch<{
    mediation_id: number;
    title: string;
    mediation_type: string;
  }>("/mediations", {
    method: "POST",
    body: payload,
  });
}

export async function getMediation(id: string | number) {
  return backendFetch<{
    mediation_id: number;
    title: string;
    mediation_type: string;
    description: string | null;
    priority: string | null;
    status: string;
    phase: string | null;
    role: string;
  }>(`/mediations/${id}`);
}

export async function getMyMediations() {
  return backendFetch<
    {
      mediation_id: number;
      title: string;
      role: string;
    }[]
  >("/mediations/me");
}

export async function updateMediation(
  id: string | number,
  payload: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    phase?: string;
  },
) {
  return backendFetch(`/mediations/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function createInvite(
  mediationId: string | number,
  payload: {
    invited_email?: string;
    role?: string;
  },
) {
  return backendFetch<{ invite_url: string }>(
    `/mediations/${mediationId}/invites`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export async function acceptInvite(token: string) {
  return backendFetch<{ mediation_id: number; status: string }>(
    `/invites/${token}/accept`,
    {
      method: "POST",
    },
  );
}
