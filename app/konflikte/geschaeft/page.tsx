import { permanentRedirect } from "next/navigation";

// Die Business-Mediation heißt jetzt Online Dispute Resolution (ODR).
// Alte URL bleibt als 308-Redirect erhalten (Backlinks/SEO).
export default function GeschaeftRedirect() {
  permanentRedirect("/konflikte/odr");
}
