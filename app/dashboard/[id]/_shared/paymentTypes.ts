// Gemeinsame Typen des Bezahl-Status (GET /api/mediations/{id}/price).
//
// Liegen hier statt im Freischaltungs-Block, weil seit der freiwilligen
// Kostenübernahme zwei Komponenten denselben Payload lesen: der Bezahl-Block
// und der Übernahme-Block.

export type PartyStatus = {
  participant_id: number;
  role: string;
  name: string | null;
  owes: boolean;
  paid: boolean;
  authorized?: boolean;
  amount_due_eur: number;
  is_you: boolean;
  /** Wer trägt den Anteil dieser Partei – null = sie selbst. */
  covered_by_participant_id?: number | null;
  covered_by_name?: string | null;
};

export type AddonOffer = {
  key: string;
  label: string;
  description: string;
  price_eur: number;
};

/** Partei, deren Anteil ich freiwillig übernehmen könnte. */
export type CoverageOffer = {
  participant_id: number;
  name: string | null;
  role: string;
  amount_eur: number;
  /** "bundle" = geht in meinen noch offenen Betrag ein (eine Zahlung),
   *  "separate" = mein Anteil steht fest, die Übernahme braucht eine eigene. */
  mode: "bundle" | "separate";
};

export type PayStatus = {
  is_paid: boolean;
  all_owing_paid: boolean;
  addons_available?: AddonOffer[];
  coverage_offers?: CoverageOffer[];
  you: {
    owes: boolean;
    base_due_eur: number;
    discount_code: string | null;
    discount_amount_eur: number;
    addons?: { key: string; price_eur: number }[];
    addons_total_eur?: number;
    own_due_eur?: number;
    coverage_due_eur?: number;
    amount_due_eur: number;
    paid: boolean;
    authorized?: boolean;
    billing_address_complete?: boolean;
    covered_by?: { participant_id: number; name: string | null } | null;
    covers?: {
      participant_id: number;
      name: string | null;
      amount_eur: number;
      settled: boolean;
    }[];
  };
  participants: PartyStatus[];
  warning?: string;
};
