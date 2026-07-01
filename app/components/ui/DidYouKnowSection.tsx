"use client";

import { useState } from "react";
import { CrossfadePanel } from "@/app/components/ui/TabSwitcher";

/**
 * Standard pattern: "Wussten Sie schon?" fact carousel
 * (supremecourt.gov-inspired "Did You Know" module, modernized).
 *
 * Renders one fact at a time on a dark, serif-headlined background to
 * project institutional authority/trust — paired with manual prev/next
 * controls and a "01 / 0n" counter instead of the dated table-and-photo
 * layout of the original. Content crossfades via CrossfadePanel
 * (see TabSwitcher.tsx).
 *
 * Pass `facts` to use page-specific content; falls back to
 * `mediationFacts` (general mediation/history) if omitted. A second set,
 * `mediationsgesetzFacts` (German mediation law specifics), is exported
 * for pages with a more legal/institutional angle, e.g. /about.
 */
export type DidYouKnowFact = {
  eyebrow: string;
  text: string;
};

export const mediationFacts: DidYouKnowFact[] = [
  {
    eyebrow: "Ursprung der Methode",
    text: "Das Harvard Negotiation Project wurde 1979 gegründet. Daraus entstand 1981 der Welt-Bestseller „Getting to Yes“ von Roger Fisher und William Ury – die Grundlage des Prinzips, das medipact heute digital umsetzt: Interessen statt Positionen.",
  },
  {
    eyebrow: "Gesetzlich verankert",
    text: "Seit dem 26. Juli 2012 regelt das deutsche Mediationsgesetz Mediation als eigenständiges, rechtlich anerkanntes Verfahren – auf Grundlage einer EU-Richtlinie, die außergerichtliche Streitbeilegung in ganz Europa stärken sollte.",
  },
  {
    eyebrow: "Vertraulichkeit ist Pflicht",
    text: "§ 4 Mediationsgesetz verpflichtet den Mediator gesetzlich zur Verschwiegenheit über alles, was während der Mediation besprochen wird – mit nur wenigen, klar geregelten Ausnahmen.",
  },
  {
    eyebrow: "Niemand entscheidet über Ihren Kopf",
    text: "§ 1 Mediationsgesetz definiert den Mediator als unabhängige, neutrale Person ohne eigene Entscheidungsbefugnis. Anders als bei einem Gerichtsurteil bestimmen ausschließlich die Parteien selbst das Ergebnis.",
  },
  {
    eyebrow: "Aus einer Einigung wird ein verbindliches Dokument",
    text: "Eine Mediationsvereinbarung ist zunächst privatrechtlich – sie kann aber z. B. durch notarielle Beurkundung oder einen Anwaltsvergleich rechtlich bindend und vollstreckbar gemacht werden.",
  },
  {
    eyebrow: "Auch Gerichte setzen auf Mediation",
    text: "Seit der Reform des § 278 Abs. 5 ZPO durch das Mediationsgesetz können Gerichte Parteien an einen speziell ausgebildeten „Güterichter“ verweisen – ein zusätzliches Zeichen dafür, dass eine außergerichtliche Einigung oft der bessere erste Weg ist.",
  },
  {
    eyebrow: "Kosten müssen vorab klar sein",
    text: "§ 2 Abs. 4 Mediationsgesetz verpflichtet den Mediator, die Parteien zu Beginn über die voraussichtlichen Kosten des Verfahrens zu informieren – Transparenz ist also keine Kulanz, sondern gesetzliche Pflicht.",
  },
  {
    eyebrow: "Vier Prinzipien statt Verhandlungstaktik",
    text: "Das Harvard-Konzept beruht auf vier Grundsätzen: Menschen und Probleme trennen, Interessen statt Positionen verhandeln, Optionen zum gegenseitigen Vorteil entwickeln und auf objektiven Kriterien bestehen. medipact strukturiert digitale Mediation entlang genau dieser vier Schritte.",
  },
  {
    eyebrow: "Die beste Alternative kennen",
    text: "„Getting to Yes“ prägte den Begriff BATNA (Best Alternative To a Negotiated Agreement) – die beste Alternative, falls keine Einigung gelingt. Wer seine BATNA kennt, verhandelt selbstbewusster und lässt sich nicht zu einem schlechteren Ergebnis drängen.",
  },
  {
    eyebrow: "Ein Bestseller mit globaler Wirkung",
    text: "„Getting to Yes“ wurde seit 1981 in über 35 Sprachen übersetzt und mehr als 15 Millionen Mal verkauft. Das Prinzipien-basierte Verhandeln prägt bis heute Wirtschaft, Diplomatie und – über das Mediationsgesetz – auch deutsches Recht.",
  },
];

export const mediationsgesetzFacts: DidYouKnowFact[] = [
  {
    eyebrow: "Seit 2012 geltendes Recht",
    text: "Das Mediationsgesetz trat am 26. Juli 2012 in Kraft. Es setzt eine EU-Richtlinie um, die außergerichtliche Streitbeilegung als gleichwertigen Weg neben dem Gerichtsverfahren etablieren sollte.",
  },
  {
    eyebrow: "Verschwiegenheit ist gesetzlich geregelt",
    text: "Nach § 4 Mediationsgesetz ist der Mediator zur Vertraulichkeit verpflichtet – nicht aus Kulanz, sondern als gesetzliche Pflicht mit nur wenigen klar definierten Ausnahmen.",
  },
  {
    eyebrow: "Klare Rollenverteilung",
    text: "§ 1 Mediationsgesetz definiert den Mediator als unabhängige, neutrale Person ohne eigene Entscheidungsbefugnis, die die Parteien durch das Verfahren führt. Die Entscheidung bleibt bei den Parteien.",
  },
  {
    eyebrow: "Wurzeln in der Praxis, nicht der Theorie",
    text: "Das moderne Prinzipien-basierte Verhandeln geht auf das 1979 gegründete Harvard Negotiation Project zurück – seit Jahrzehnten in Wirtschaft, Recht und Diplomatie erprobt.",
  },
  {
    eyebrow: "Kostentransparenz ist Gesetz",
    text: "§ 2 Abs. 4 Mediationsgesetz schreibt vor, dass der Mediator die Parteien vor Beginn über die voraussichtlichen Kosten aufklären muss – ein zentraler Unterschied zum oft schwer kalkulierbaren Kostenrisiko eines Gerichtsverfahrens.",
  },
  {
    eyebrow: "Auch die Justiz verweist auf Mediation",
    text: "Über § 278 Abs. 5 ZPO können Zivilgerichte Parteien an einen gerichtsinternen „Güterichter“ verweisen, der speziell in Mediationstechniken ausgebildet ist – ein institutioneller Beleg dafür, dass der Gesetzgeber außergerichtliche Einigung aktiv fördert.",
  },
  {
    eyebrow: "Aus zwei Autoren wurden drei",
    text: "Die Originalausgabe von „Getting to Yes“ (1981) stammt von Roger Fisher und William Ury. Zur Überarbeitung 1991 kam Bruce Patton als dritter Autor hinzu – seither gilt das Werk in seiner heutigen Form als Standardwerk des Harvard Negotiation Project.",
  },
  {
    eyebrow: "Vom Hörsaal in die Diplomatie",
    text: "Die Methode des Harvard Negotiation Project wird nicht nur in Wirtschaft und Mediation gelehrt, sondern auch in internationalen Verhandlungen und der Diplomatie eingesetzt – als Gegenentwurf zum reinen Positionsverhandeln.",
  },
];

export const trennungFacts: DidYouKnowFact[] = [
  {
    eyebrow: "Das Trennungsjahr ist Pflicht",
    text: "§ 1566 Abs. 1 BGB setzt für eine einvernehmliche Scheidung ein volles Trennungsjahr voraus. Genau dieser Zeitraum bietet sich an, um Unterhalt, Betreuung und Finanzen strukturiert statt im Streit zu klären.",
  },
  {
    eyebrow: "Die meisten Paare einigen sich",
    text: "2024 wurden laut Statistischem Bundesamt rund 129.300 Ehen geschieden – bei 90 % davon stimmte der Ehepartner dem Scheidungsantrag zu. Einvernehmlichkeit ist also der Normalfall, nicht die Ausnahme.",
  },
  {
    eyebrow: "Kinder sind oft mitbetroffen",
    text: "Mehr als die Hälfte (50,8 %) der 2024 geschiedenen Ehen hatte minderjährige Kinder. Eine sachliche Einigung über Betreuung und Unterhalt wirkt sich direkt auf deren Alltag aus.",
  },
  {
    eyebrow: "Lange Ehen, viele offene Fragen",
    text: "Im Schnitt waren 2024 geschiedene Paare 14 Jahre und 8 Monate verheiratet – entsprechend verflochten sind in der Regel Finanzen, Versorgungsausgleich und gemeinsames Eigentum.",
  },
  {
    eyebrow: "Der Versorgungsausgleich läuft automatisch",
    text: "Nach § 1 VersAusglG teilt das Familiengericht während der Ehe erworbene Rentenansprüche von Amts wegen zur Hälfte auf – ohne dass eine Partei das beantragen muss. Nur bei Ehen unter drei Jahren erfolgt er nur auf Antrag.",
  },
];

export const nachbarschaftFacts: DidYouKnowFact[] = [
  {
    eyebrow: "Lärm ist der Streitgrund Nr. 1",
    text: "In Umfragen nennen rund 43 % der Deutschen Lärm oder Ruhestörung als Auslöser für Ärger mit Nachbarn – kein anderes Thema sorgt so häufig für Konflikte.",
  },
  {
    eyebrow: "Haustiere spalten die Nachbarschaft",
    text: "Bellende Hunde, streunende Katzen oder Tiergeräusche sind mit rund 17 % der zweithäufigste Streitgrund zwischen Nachbarn – noch vor Bäumen, Grenzen oder Müll.",
  },
  {
    eyebrow: "Bäume und Hecken wachsen sich zum Streit aus",
    text: "Überhängende Äste und Wurzeln darf der betroffene Nachbar laut § 910 BGB abschneiden, wenn sie die Nutzung seines Grundstücks beeinträchtigen – ein Recht, das in der Praxis oft eskaliert statt zu klären.",
  },
  {
    eyebrow: "Nicht jede Störung ist unzulässig",
    text: "§ 906 BGB verpflichtet dazu, ortsübliche und nur unwesentliche Beeinträchtigungen – etwa normale Gartengeräusche – hinzunehmen. Wo genau diese Grenze verläuft, ist in der Praxis oft der eigentliche Streitpunkt.",
  },
  {
    eyebrow: "Nachbarrecht ist Ländersache",
    text: "Anders als das BGB regeln die Nachbarrechtsgesetze der einzelnen Bundesländer Details zu Grenzabständen, Hecken oder Lärmschutz – die Rechtslage unterscheidet sich also je nach Wohnort.",
  },
  {
    eyebrow: "Ein Schlichtungsversuch ist oft Pflicht",
    text: "In neun Bundesländern muss vor einer Nachbarschaftsklage zwingend ein Schlichtungsversuch bei der örtlichen Schiedsstelle erfolgen – ein Zeichen dafür, dass der Gesetzgeber selbst eine außergerichtliche Klärung bevorzugt.",
  },
];

export const erbschaftFacts: DidYouKnowFact[] = [
  {
    eyebrow: "Der Pflichtteil ist gesetzlich garantiert",
    text: "§ 2303 BGB sichert engen Angehörigen – Kindern, Ehepartnern, teils Eltern – auch bei Enterbung die Hälfte des gesetzlichen Erbteils als Pflichtteil zu.",
  },
  {
    eyebrow: "Pflichtteilsansprüche verjähren schnell",
    text: "Anders als oft angenommen verjähren Pflichtteilsansprüche bereits nach drei Jahren (§§ 195, 199 BGB) – wer zu lange wartet, verliert seinen Anspruch unabhängig davon, wie berechtigt er war.",
  },
  {
    eyebrow: "Der Auskunftsanspruch reicht weiter",
    text: "Der Anspruch auf Auskunft über den Nachlass nach § 2314 BGB kann auch dann noch durchsetzbar sein, wenn die eigentliche Pflichtteilsforderung bereits droht zu verjähren – ein oft übersehenes Detail in Erbstreitigkeiten.",
  },
  {
    eyebrow: "Jeder Miterbe kann die Auflösung verlangen",
    text: "§ 2042 BGB gibt jedem Mitglied einer Erbengemeinschaft das praktisch zeitlich unbegrenzte Recht, die Auseinandersetzung zu verlangen – unabhängig von der Höhe des eigenen Anteils und notfalls auch gegen den Willen der anderen Erben.",
  },
];

function FactCounter({ index, total }: { index: number; total: number }) {
  return (
    <div className="font-display text-sm tracking-[0.2em] text-accent-300">
      {String(index + 1).padStart(2, "0")}
      <span className="text-white/30"> / </span>
      {String(total).padStart(2, "0")}
    </div>
  );
}

export function DidYouKnowSection({
  facts = mediationFacts,
  heading = "Wussten Sie schon?",
  eyebrow = "Hintergrundwissen",
}: {
  facts?: DidYouKnowFact[];
  heading?: string;
  eyebrow?: string;
}) {
  const [active, setActive] = useState(0);
  const fact = facts[active];

  function go(delta: number) {
    setActive((i) => (i + delta + facts.length) % facts.length);
  }

  return (
    <section className="section section-strong">
      <div className="container max-w-4xl">
        <div className="eyebrow text-accent-300">{eyebrow}</div>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
          <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-start">
            <FactCounter index={active} total={facts.length} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Vorheriger Fakt"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent-400 hover:text-accent-300"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Nächster Fakt"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent-400 hover:text-accent-300"
              >
                →
              </button>
            </div>
          </div>

          <CrossfadePanel activeKey={fact.eyebrow} className="border-l border-white/10 pl-8 sm:pl-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
              {fact.eyebrow}
            </p>
            <p className="mt-4 font-display text-xl leading-relaxed text-white sm:text-2xl">
              {fact.text}
            </p>
          </CrossfadePanel>
        </div>

        <div className="mt-10 flex gap-2">
          {facts.map((f, i) => (
            <button
              key={f.eyebrow}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Fakt ${i + 1} anzeigen`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-accent-400" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
