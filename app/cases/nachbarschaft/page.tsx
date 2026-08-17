import { permanentRedirect } from "next/navigation";

// caseStudies["nachbarschaft"] no longer exists — this generic case was
// split into nachbarschaft-laerm/-zaun/-parken (see app/content/caseStudies.tsx
// and the new /cases overview). Redirecting instead of crashing on the
// missing data. This file can be deleted entirely once it's safe to do a
// `git rm app/cases/nachbarschaft/page.tsx`.
//
// permanentRedirect (308) statt redirect (307): die Aufteilung ist
// dauerhaft, also soll Google den alten Index-Eintrag ersetzen und die
// Linkkraft weitergeben. Ein 307 signalisiert das Gegenteil — dass die
// alte URL zurueckkommt — und haelt sie im Index. So machen es auch
// app/konflikte/geschaeft und app/konflikte/wg.
export default function Page() {
  permanentRedirect("/cases");
}
