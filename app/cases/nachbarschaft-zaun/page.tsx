import type { Metadata } from "next";
import { CaseStudyTemplate } from "@/app/components/templates/CaseStudyTemplate";
import { caseStudies } from "@/app/content/caseStudies";

export const metadata: Metadata = {
  title: "Fallbeispiel Grenzstreit: Familien Krüger & Hoffmann | medipact",
  description:
    "Ein neuer Zaun, zwei Meinungen zur Grundstücksgrenze: Wie zwei Familien den Grenzstreit per Mediation schnell und ohne Gerichtskosten beilegten – die Nachbarschaft blieb intakt.",
  alternates: { canonical: "https://medipact.de/cases/nachbarschaft-zaun" },
};

export default function Page() {
  return (
    <CaseStudyTemplate
      {...caseStudies["nachbarschaft-zaun"]}
      breadcrumbs={[
        { label: "Fallbeispiele", href: "/cases" },
        { label: "Nachbarschaft", href: "/konflikte/nachbarschaft" },
        { label: "Familien Krüger & Hoffmann" },
      ]}
      relatedCases={[
        { label: "Nächtlicher Lärm", href: "/cases/nachbarschaft-laerm" },
        { label: "Parkplatz blockiert", href: "/cases/nachbarschaft-parken" },
      ]}
      faq={[
        {
          question: "Wer bestimmt, wo die Grundstücksgrenze wirklich verläuft?",
          answer:
            "Verbindlich nur das Liegenschaftskataster bzw. eine amtliche Vermessung. Die Mediation klärt den wichtigeren Teil: wie beide Seiten fair mit dem Ergebnis umgehen, ohne dass die Beziehung zerbricht.",
        },
        {
          question: "Muss ein Grenzstreit vor Gericht geklärt werden?",
          answer:
            "Nein – in vielen Bundesländern ist vor einer Nachbarschaftsklage sogar erst ein außergerichtlicher Schlichtungsversuch vorgeschrieben. Eine Mediationsvereinbarung ist schriftlich bindend und meist schneller.",
        },
        {
          question: "Was kostet ein Zaunstreit vor Gericht?",
          answer:
            "Vermessung, Anwälte und Verfahren summieren sich schnell auf mehrere tausend Euro. Die Mediation kostet bei medipact ab €20 pro Partei – und beide Familien grüßen sich noch.",
        },
      ]}
    />
  );
}
