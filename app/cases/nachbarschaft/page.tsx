import { redirect } from "next/navigation";

// caseStudies["nachbarschaft"] no longer exists — this generic case was
// split into nachbarschaft-laerm/-zaun/-parken (see app/content/caseStudies.tsx
// and the new /cases overview). Redirecting instead of crashing on the
// missing data. This file can be deleted entirely once it's safe to do a
// `git rm app/cases/nachbarschaft/page.tsx`.
export default function Page() {
  redirect("/cases");
}
