import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Lärmstreit mit Nachbarn: Familie Schneider | medipact",
  description:
    "Laute Musik bis in die Nacht, mehrfache Polizeieinsätze: Wie eine Nachbarschaftsmediation verbindliche Ruhezeiten schuf, die beide Seiten akzeptieren – ohne Gericht.",
  alternates: { canonical: "https://medipact.de/cases/nachbarschaft-laerm" },
};

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["nachbarschaft-laerm"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Nachbarschaft", href: "/konflikte/nachbarschaft" },
        { label: "Familie Schneider" },
      ]}
      relatedCases={[
        { label: "Zaun auf der Grenze", href: "/cases/nachbarschaft-zaun" },
        { label: "Parkplatz blockiert", href: "/cases/nachbarschaft-parken" },
      ]}
      faq={[
        {
          question: "Welche Ruhezeiten gelten bei Lärm durch Nachbarn?",
          answer:
            "Die Nachtruhe gilt in der Regel von 22 bis 6 Uhr, geregelt über Landesrecht und Hausordnung. Papier allein stoppt aber keinen Dauerkonflikt – die Mediation schuf hier Regeln, die beide Seiten selbst vereinbart haben.",
        },
        {
          question: "Was tun, wenn Gespräche mit dem Nachbarn nur noch eskalieren?",
          answer:
            "Ein neutraler Mediator entschärft das Muster aus Vorwurf und Gegenvorwurf. Polizeieinsätze beenden nur den Abend, nicht den Konflikt – nach der Mediation gab es bei Familie Schneider keinen einzigen mehr.",
        },
        {
          question: "Was kostet eine Nachbarschaftsmediation?",
          answer:
            "Bei medipact ab €249 pro Partei, meist in wenigen Wochen abgeschlossen – deutlich günstiger als eine Unterlassungsklage mit Anwalt und ungewissem Ausgang.",
        },
      ]}
    />
  );
}
