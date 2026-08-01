import type { Metadata } from "next";
import Link from "next/link";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import { JsonLd } from "@/app/components/JsonLd";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { Card } from "@/app/components/ui/Card";
import logbuchPhoto from "../../fotos/medi_einordnen.jpg";
import Icon from "@/app/components/ui/Icon";
import { pageMetadata } from "@/lib/seo";

// ── SEO-Landingpage: Kostenloses Konflikt-Logbuch ───────────────────────────
//
// Einstieg in den Trichter (0 € dokumentieren → 49 €/399 € Mediation).
// Keywords: Konflikt dokumentieren, Streit-Tagebuch, Konflikttagebuch,
// Lärmprotokoll, Gedächtnisprotokoll, Vorfälle festhalten.

export const metadata: Metadata = pageMetadata({
  title: "Konflikt-Logbuch: Streit kostenlos dokumentieren | medipact",
  description:
    "Streit kostenlos dokumentieren: Vorkommnisse, Gespräche & Nachrichten im Konflikt-Logbuch festhalten – Basis fürs klärende Gespräch, für Mediation oder Gericht.",
  path: "/konflikt-logbuch",
});

const ENTRY_TYPES = [
  {
    icon: "📌",
    title: "Vorkommnisse",
    text: "Was ist wann passiert? Ort, Anlass, Verlauf – zeitnah festgehalten, solange die Erinnerung frisch ist.",
  },
  {
    icon: "🗣️",
    title: "Gespräche",
    text: "Wer hat was gesagt – möglichst im Wortlaut? Auch wer dabei war und wie das Gespräch endete.",
  },
  {
    icon: "✉️",
    title: "E-Mails",
    text: "Wichtige Mails einfach in den Eintrag kopieren – so bleibt der Schriftverkehr chronologisch sortiert.",
  },
  {
    icon: "💬",
    title: "WhatsApp & Nachrichten",
    text: "Nachrichtenverläufe sichern, bevor sie in endlosen Chats untergehen oder gelöscht werden.",
  },
  {
    icon: "📞",
    title: "Telefonate",
    text: "Ein Gedächtnisprotokoll direkt nach dem Anruf: Wer hat angerufen, was wurde besprochen, was vereinbart?",
  },
  {
    icon: "💭",
    title: "Gedanken & Journal",
    text: "Wie geht es Ihnen damit? Tiefe, persönliche Gedanken markieren Sie als Journal-Eintrag – die sieht niemals jemand außer Ihnen, auch nicht in einer späteren Mediation.",
  },
];

const FAQ = [
  {
    q: "Was ist ein Konflikt-Logbuch?",
    a: "Ein Konflikt-Logbuch ist ein digitales Streit-Tagebuch: Sie dokumentieren fortlaufend Vorkommnisse, Gespräche, E-Mails, WhatsApp-Nachrichten, Telefonate und Gedanken zu einem Konflikt. So entsteht eine saubere Chronologie – bei medipact kostenlos und vertraulich.",
  },
  {
    q: "Was kostet das Konflikt-Logbuch?",
    a: "Nichts. Das Konflikt-Logbuch ist dauerhaft kostenlos – Sie brauchen nur ein medipact-Konto. Kosten entstehen erst, wenn Sie sich später entscheiden, aus dem Logbuch eine Mediation zu starten (ab 49 € pro Partei).",
  },
  {
    q: "Warum sollte ich einen Streit dokumentieren?",
    a: "Erinnerungen verblassen und werden im Streit unbewusst verzerrt. Eine zeitnahe Dokumentation (Gedächtnisprotokoll) schafft Klarheit über Muster und Häufigkeit, entlastet emotional – und ist eine wertvolle Grundlage, falls es später zu Mediation, Schlichtung oder einem Rechtsstreit kommt.",
  },
  {
    q: "Kann ich einen Konflikt mit dem Logbuch auch ohne Mediation lösen?",
    a: "Ja, häufig sogar. Sobald Sie Ihre eigene Chronologie überblicken, können Sie das Thema ruhig, konkret und ohne Vorwürfe ansprechen. Viele Konflikte entschärfen sich von selbst, sobald aus diffusem Ärger belegbare Punkte werden. Das Logbuch verpflichtet zu nichts – eine Mediation starten Sie nur, wenn das Gespräch allein nicht reicht.",
  },
  {
    q: "Hilft mir das Logbuch bei einem Rechtsstreit vor Gericht?",
    a: "Ja. Vor Gericht zählt nicht, was passiert ist, sondern was Sie belegen können. Ein zeitnah geführtes Logbuch mit Datum, Uhrzeit, Wortlaut und angehängten Belegen (E-Mails, Fotos, Nachrichten) ist eine belastbare Grundlage – für das Gespräch mit Ihrem Anwalt und als Beweis-Dokumentation im Verfahren. Für manche Auseinandersetzungen, etwa ein Lärmprotokoll, ist eine solche Dokumentation praktisch unverzichtbar.",
  },
  {
    q: "Ist das Logbuch auch als Lärmprotokoll geeignet?",
    a: "Ja. Gerade bei Nachbarschaftsstreit um Lärm empfiehlt sich ein fortlaufendes Protokoll mit Datum, Uhrzeit, Dauer und Art der Störung. Genau das bildet das Konflikt-Logbuch ab – jedes Vorkommnis als eigener Eintrag mit Datum.",
  },
  {
    q: "Sieht die Gegenseite, was ich schreibe?",
    a: "Nein. Das Konflikt-Logbuch ist privat: Es gibt keine Gegenseite, keine Einladungen und keine Freigaben. Auch nach einer Umwandlung in eine Mediation sehen Mediator und Gegenseite nur Einträge, die Sie ausdrücklich in die Mediation teilen – alles andere bleibt Ihres.",
  },
  {
    q: "Kann ich auch geheime Gedanken festhalten (Journal)?",
    a: "Ja. Jeder Eintrag lässt sich als „Journal (privat)“ markieren. Solche Einträge sind streng vertraulich und werden niemals geteilt – weder mit einem Mediator noch mit der Gegenseite, auch nicht nach einer Umwandlung in eine Mediation. So können Sie Gefühle, Zweifel und Ihre ungefilterte Sicht sicher festhalten.",
  },
  {
    q: "Kann ich das Logbuch neben einer laufenden Mediation weiterführen?",
    a: "Ja. Das Logbuch läuft als „Logbuch & Journal“ neben Ihrem Fall weiter. Einzelne Einträge können Sie gezielt in die Mediation teilen, damit Mediator und Gegenseite sie sehen – und jederzeit wieder zurückziehen. Journal-Einträge bleiben immer privat.",
  },
  {
    q: "Kann ich aus dem Logbuch später eine Mediation starten?",
    a: "Ja, mit einem Klick: „In Mediation umwandeln“ überführt Ihren dokumentierten Streit in ein Mediationsverfahren. Ihre Chronologie bleibt erhalten und gibt der Fallaufnahme einen sauberen Startpunkt.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Konflikt-Logbuch",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Konflikt-Dokumentation (Streit-Tagebuch)",
  description:
    "Kostenloses digitales Konflikt-Logbuch: Vorkommnisse, Gespräche, E-Mails, WhatsApp-Nachrichten und Telefonate zu einem Streit dokumentieren – jederzeit in eine Mediation umwandelbar.",
  areaServed: { "@type": "Country", name: "Germany" },
  availableLanguage: "German",
  url: "https://medipact.de/konflikt-logbuch",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "0",
    description: "Konflikt-Logbuch dauerhaft kostenlos",
  },
};

export default function KonfliktLogbuchPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />
      <main className="app-shell pt-[73px]">
        {/* HERO */}
        <ImagePinHero
          image={logbuchPhoto}
          imageAlt="Konflikt dokumentieren mit dem kostenlosen Konflikt-Logbuch"
        >
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <Breadcrumbs items={[{ label: "Konflikt-Logbuch" }]} variant="dark" />
              <div className="mt-6 inline-flex items-center rounded-full border border-accent-400/40 bg-accent-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-300">
                Dauerhaft kostenlos
              </div>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-white lg:text-6xl">
                Ihr Streit-Tagebuch.
                <span className="block bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent pb-2">
                  Das Konflikt-Logbuch.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-200">
                Noch keine Mediation – aber ein Konflikt, der Sie beschäftigt?
                Dokumentieren Sie kostenlos, was passiert: Vorkommnisse,
                Gespräche, E-Mails, WhatsApp, Telefonate. Vertraulich, sortiert –
                und die Basis, um Ihren Konflikt so effizient und
                aggressionsarm wie möglich zu lösen: im klärenden Gespräch, per
                Mediation oder notfalls vor Gericht.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-xl bg-accent-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-accent-500"
                >
                  Kostenlos starten →
                </a>
                <Link
                  href="/preise"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-white/50 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Preise ansehen
                </Link>
              </div>
            </div>
          </div>
        </ImagePinHero>

        {/* WARUM DOKUMENTIEREN */}
        <section className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow mb-4 justify-center">Warum dokumentieren?</div>
              <h2 className="heading-2">
                Wer aufschreibt, behält den Überblick.
              </h2>
              <p className="mt-5 text-lg leading-8 text-neutral-700">
                In einem schwelenden Konflikt verschwimmen Daten, Aussagen und
                Vorfälle. Ein fortlaufendes Konflikttagebuch schafft drei Dinge,
                die Ihnen später niemand mehr geben kann.
              </p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-8">
                <Icon name="brain" size={26} />
                <h3 className="heading-3 mt-4 mb-2">Frische Erinnerung</h3>
                <p className="text-sm leading-6 text-neutral-600">
                  Ein Gedächtnisprotokoll direkt nach dem Vorfall ist präzise –
                  Wochen später ist es Interpretation. Zeitnahe Einträge machen
                  Ihre Chronologie belastbar.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-8">
                <Icon name="trend-up" size={26} />
                <h3 className="heading-3 mt-4 mb-2">Muster sichtbar machen</h3>
                <p className="text-sm leading-6 text-neutral-600">
                  Wie oft kommt es wirklich vor? Ob Lärmprotokoll in der
                  Nachbarschaft oder wiederkehrende Streitpunkte in der Familie:
                  Erst die Chronologie zeigt Häufigkeit und Eskalation.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-8">
                <Icon name="compass" size={26} />
                <h3 className="heading-3 mt-4 mb-2">Startpunkt für die Lösung</h3>
                <p className="text-sm leading-6 text-neutral-600">
                  Ob Mediation, Schlichtung oder anwaltliche Beratung: Eine
                  saubere Dokumentation verkürzt jeden Weg – und bei medipact
                  wird sie mit einem Klick zur Grundlage Ihrer Mediation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WAS KANN DOKUMENTIERT WERDEN */}
        <section className="section section-muted border-y border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow mb-4 justify-center">Sechs Eintragsarten</div>
              <h2 className="heading-2">Alles, was zum Streit gehört.</h2>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ENTRY_TYPES.map((e) => (
                <div key={e.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <span><Icon name={e.icon} size={26} /></span>
                  <h3 className="mt-3 mb-1.5 font-display text-lg font-medium text-neutral-900">
                    {e.title}
                  </h3>
                  <p className="text-sm leading-6 text-neutral-600">{e.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SO FUNKTIONIERT'S */}
        <section className="section section-base">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow mb-4 justify-center">So funktioniert&apos;s</div>
              <h2 className="heading-2">In drei Schritten zum Logbuch.</h2>
            </div>
            <ol className="mt-12 space-y-6">
              {[
                {
                  n: "1",
                  title: "Kostenloses Konto erstellen",
                  text: "Registrieren, Konfliktart wählen (Nachbarschaft, Verbraucher, Trennung, Erbschaft oder Geschäft) und den Streit mit wenigen geführten Fragen anlegen.",
                },
                {
                  n: "2",
                  title: "Dokumentieren – und Journal führen",
                  text: "Jedes Vorkommnis als eigener Eintrag: Datum, was passiert ist, Wortlaut aus E-Mail oder WhatsApp, Beteiligte. Tiefe persönliche Gedanken markieren Sie als Journal (privat) – die liest garantiert niemand außer Ihnen. Ideal auch langfristig, wenn Sie unsicher sind, ob der Konflikt eskaliert.",
                },
                {
                  n: "3",
                  title: "Bei Bedarf: Mediation starten",
                  text: "Wenn Sie den Konflikt lösen möchten, wandeln Sie das Logbuch mit einem Klick in eine Mediation um – die Dokumentation bleibt erhalten und läuft als Logbuch & Journal neben dem Fall weiter. Geteilt wird nur, was Sie ausdrücklich freigeben. Erst ab hier fallen Kosten an.",
                },
              ].map((s) => (
                <li key={s.n} className="flex gap-5 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-600 font-display text-lg font-bold text-white">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-medium text-neutral-900">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-neutral-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-center text-sm text-neutral-500">
              Vertraulich: Die Gegenseite sieht Ihr Logbuch nicht. Und
              Journal-Einträge bleiben immer privat – selbst in einer
              späteren Mediation teilen Sie nur, was Sie ausdrücklich
              freigeben.
            </p>
          </div>
        </section>

        {/* WOHIN FÜHRT DAS LOGBUCH — Philosophie + drei Wege */}
        <section className="section section-strong">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow mb-4 justify-center text-accent-300">
                Wohin es führt
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                So effizient und aggressionsarm wie möglich.
              </h2>
              <p className="mt-5 text-lg leading-8 text-neutral-300">
                Dafür steht medipact: einen Konflikt mit so wenig Reibung und
                Eskalation wie möglich beenden. Das Logbuch ist der erste Schritt –
                und hält Ihnen danach jeden Weg offen. Vom ruhigen Gespräch bis
                zum Gericht wird jeder davon einfacher, wenn Sie dokumentiert
                haben.
              </p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: "🕊️",
                  title: "Ganz ohne Verfahren",
                  text: "Oft reicht schon Klarheit. Wer seine Chronologie kennt, spricht das Problem ruhig und konkret an – statt vager Vorwürfe. Viele Konflikte lösen sich so, bevor sie eskalieren. Der aggressionsärmste Weg – und mit Logbuch der wahrscheinlichste.",
                },
                {
                  icon: "🤝",
                  title: "Mit Mediation",
                  text: "Reicht das Gespräch nicht, wandeln Sie das Logbuch mit einem Klick in eine Mediation um. Strukturiert, fair und ohne Gericht – Ihre Dokumentation ist der saubere Startpunkt der Fallaufnahme.",
                },
                {
                  icon: "⚖️",
                  title: "Wenn es doch vor Gericht geht",
                  text: "Kommt es zum Rechtsstreit, zählt nicht, was passiert ist, sondern was Sie belegen können. Ein lückenloses Logbuch mit Datum, Wortlaut und Beleg-Uploads ist dann Ihre Beweis-Dokumentation – und oft unverzichtbar.",
                },
              ].map((o) => (
                <div
                  key={o.title}
                  className="rounded-[2rem] border border-neutral-700 bg-neutral-800/50 p-8"
                >
                  <span><Icon name={o.icon} size={26} color="#C9B27A" /></span>
                  <h3 className="mt-4 mb-2 text-xl font-bold text-white">
                    {o.title}
                  </h3>
                  <p className="text-sm leading-6 text-neutral-300">{o.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section-muted border-t border-neutral-200">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="heading-2 mb-12 text-center">Häufige Fragen</h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <Card key={item.q}>
                  <h3 className="heading-3">{item.q}</h3>
                  <p className="mt-4 leading-7 text-neutral-700">{item.a}</p>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/ratgeber/konflikt-dokumentieren" className="font-semibold text-accent-600 hover:text-accent-700">
                Ratgeber: Konflikt richtig dokumentieren →
              </Link>
              <Link href="/ratgeber/konflikt-journal" className="font-semibold text-accent-600 hover:text-accent-700">
                Ratgeber: Konflikt-Journal führen →
              </Link>
              <Link href="/ratgeber/schwelender-konflikt" className="font-semibold text-accent-600 hover:text-accent-700">
                Ratgeber: Schwelenden Konflikt beobachten →
              </Link>
              <Link href="/konflikte" className="font-semibold text-accent-600 hover:text-accent-700">
                Alle Konfliktarten →
              </Link>
              <Link href="/preise" className="font-semibold text-accent-600 hover:text-accent-700">
                Preise der Mediation →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section section-strong text-center">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Fangen Sie heute an zu dokumentieren.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Jeder Tag ohne Logbuch ist ein Tag, an dem Erinnerungen verblassen.
              Ihr Konflikt-Logbuch ist in zwei Minuten angelegt – und bleibt
              kostenlos.
            </p>
            <a
              href="/auth/register"
              className="mt-10 inline-flex items-center justify-center rounded-xl bg-accent-600 px-10 py-4 text-base font-bold text-white transition hover:bg-accent-500"
            >
              Kostenlos starten →
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
