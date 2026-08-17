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

export const mietverhaeltnisFacts: DidYouKnowFact[] = [
  {
    eyebrow: "Immer das Amtsgericht",
    text: "Nach § 23 Nr. 2a GVG ist für Streitigkeiten aus einem Wohnraummietverhältnis ausschließlich das Amtsgericht zuständig – und zwar ohne Rücksicht auf den Wert des Streitgegenstands. Anders als sonst im Zivilrecht entscheidet die Höhe der Forderung hier also nicht über das Gericht.",
  },
  {
    eyebrow: "Zwölf Monate – in beide Richtungen",
    text: "§ 556 Abs. 3 BGB gibt dem Vermieter zwölf Monate nach Ende des Abrechnungszeitraums, um abzurechnen; danach ist eine Nachforderung ausgeschlossen. Dieselbe Frist hat der Mieter, um Einwendungen zu erheben – gerechnet ab Zugang der Abrechnung. Wer schweigt, verliert also auf beiden Seiten.",
  },
  {
    eyebrow: "Die Minderung entsteht von selbst",
    text: "Ein Mangel mindert die Miete nach § 536 BGB kraft Gesetzes – es braucht dafür keine Zustimmung des Vermieters und keinen Gerichtsbeschluss. Gestritten wird deshalb fast nie über das Ob, sondern über die Höhe und darum, ab wann der Mangel angezeigt war.",
  },
  {
    eyebrow: "Drei Kaltmieten, in drei Raten",
    text: "§ 551 BGB begrenzt die Mietsicherheit auf das Dreifache der Nettokaltmiete und gibt dem Mieter ausdrücklich das Recht, sie in drei gleichen Monatsraten zu zahlen. Abweichende Vereinbarungen zum Nachteil des Mieters sind unwirksam.",
  },
  {
    eyebrow: "Der Streitwert hängt an der Jahresmiete",
    text: "Geht es um Bestand oder Dauer des Mietverhältnisses, bemisst sich der Streitwert nach § 41 GKG am Entgelt für den strittigen Zeitraum – höchstens am Jahresbetrag. Eine Räumungsklage ist damit unabhängig von der Dauer des Streits mit einer Jahresmiete bewertet.",
  },
  {
    eyebrow: "Der Konflikt überdauert das Urteil",
    text: "Anders als bei einem einmaligen Kaufvertrag läuft das Mietverhältnis nach dem Prozess in aller Regel weiter – mit denselben Beteiligten, derselben Abrechnung im nächsten Jahr und derselben Heizung. Genau deshalb löst ein gewonnener Prozess hier seltener als anderswo das eigentliche Problem.",
  },
];

export const arbeitsplatzFacts: DidYouKnowFact[] = [
  {
    eyebrow: "Gewinnen kostet trotzdem",
    text: "§ 12a Abs. 1 ArbGG schließt in der ersten Instanz vor dem Arbeitsgericht den Anspruch der obsiegenden Partei auf Erstattung der Anwaltskosten aus. Wer den Prozess gewinnt, zahlt seinen Anwalt also selbst – eine Besonderheit, die es im übrigen Zivilrecht nicht gibt.",
  },
  {
    eyebrow: "Jedes Verfahren beginnt mit einem Einigungsversuch",
    text: "Nach § 54 ArbGG startet die mündliche Verhandlung zwingend mit der Güteverhandlung vor dem Vorsitzenden – dem Versuch einer gütlichen Einigung. Der Gesetzgeber stellt die Verständigung im Arbeitsrecht also an den Anfang, nicht ans Ende.",
  },
  {
    eyebrow: "Drei Wochen, dann ist die Kündigung wirksam",
    text: "§ 4 KSchG lässt für die Kündigungsschutzklage nur drei Wochen ab Zugang der schriftlichen Kündigung. Die Frist läuft unabhängig davon weiter, ob parallel verhandelt oder mediiert wird – sie ist der Grund, warum Klarheit im Arbeitskonflikt früh entstehen muss.",
  },
  {
    eyebrow: "Das Beschwerderecht steht im Gesetz",
    text: "§ 84 BetrVG gibt jeder beschäftigten Person das Recht, sich bei den zuständigen Stellen im Betrieb zu beschweren, wenn sie sich benachteiligt oder ungerecht behandelt fühlt – unabhängig davon, ob ein Betriebsrat existiert.",
  },
  {
    eyebrow: "Konflikte binden Arbeitszeit",
    text: "Laut der KPMG-Konfliktkostenstudie verbringen Mitarbeitende 10–15 % ihrer Arbeitszeit mit Konfliktbewältigung, Führungskräfte je nach Eskalationsgrad 30–50 %. Der teuerste Posten eines Arbeitsplatzkonflikts steht damit in keiner Akte.",
  },
  {
    eyebrow: "Vertraulichkeit gilt auch hier",
    text: "§ 4 MediationsG verpflichtet Mediator:innen zur Verschwiegenheit über alles, was ihnen im Verfahren bekannt wird. Für Konflikte im Betrieb ist das entscheidend: Was in der Mediation gesagt wird, landet weder in der Personalakte noch in einer öffentlichen Verhandlung.",
  },
];

export const geschaeftFacts: DidYouKnowFact[] = [
  {
    eyebrow: "Konflikte fressen Arbeitszeit",
    text: "Laut der KPMG-Konfliktkostenstudie verbringen Mitarbeitende 10–15 % ihrer Arbeitszeit mit Konfliktbewältigung – bei Führungskräften sind es je nach Eskalationsgrad sogar 30–50 %. Ungelöste Konflikte sind damit ein messbarer Kostenfaktor.",
  },
  {
    eyebrow: "Die Wirtschaft setzt selbst auf Mediation",
    text: "Im Round Table Mediation und Konfliktmanagement der deutschen Wirtschaft haben sich seit 2008 zahlreiche Großunternehmen zusammengeschlossen, um Konflikte systematisch außergerichtlich zu klären – Mediation ist dort längst etabliertes Managementinstrument.",
  },
  {
    eyebrow: "Verschwiegenheit ist gesetzlich verankert",
    text: "§ 4 MediationsG verpflichtet Mediator:innen zur Verschwiegenheit über alles, was ihnen im Verfahren bekannt wird. Anders als ein öffentliches Gerichtsverfahren bleibt der Konflikt so vollständig unter Verschluss – ohne Image-Schaden am Markt.",
  },
  {
    eyebrow: "Auch Gerichte empfehlen Mediation",
    text: "Nach § 278a ZPO kann das Gericht den Parteien jederzeit eine Mediation vorschlagen und das Verfahren dafür ruhen lassen – der Gesetzgeber selbst sieht die außergerichtliche Klärung als gleichwertigen Weg.",
  },
  {
    eyebrow: "Schneller als der Rechtsweg",
    text: "Erstinstanzliche Zivilverfahren vor den Landgerichten dauern im Schnitt deutlich über ein Jahr, mit Berufung oft mehrere Jahre. Ein ODR-Verfahren (Online Dispute Resolution) ist dagegen häufig in wenigen Wochen abgeschlossen – und die Geschäftsbeziehung läuft währenddessen weiter.",
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
