import type { Metadata } from "next";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import preisPhoto from "../../fotos/medi_preis.jpg";
import { pageMetadata } from "@/lib/seo";
import Icon from "@/app/components/ui/Icon";

export const metadata: Metadata = pageMetadata({
  title: "Preise: Mediation ab 49 €, Business ab 1.000 € | medipact",
  description:
    "Einstieg ab 49 € pro Partei, Trennung 399 €, Wirtschaftsmediation ab 1.200 € oder Business-Tarife ab 1.000 €/Monat. Transparent, ohne versteckte Kosten.",
  path: "/preise",
});

export default function Preise() {
  return (
    <>
      <main className="app-shell pt-[73px]">
        {/* HERO */}
        <ImagePinHero
          image={preisPhoto}
          imageAlt="Faire, transparente Preise bei medipact"
        >
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-black tracking-tight text-white lg:text-6xl">
                Transparente Preise.
                <span className="block bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent pb-2">
                  Fair aufgeteilt.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-200">
                Sie wissen vorher genau, was auf Sie zukommt. Alle Parteien
                zahlen anteilig – keine versteckten Kosten, keine Überraschungen
                am Ende.
              </p>
            </div>
          </div>
        </ImagePinHero>

        {/* STUFE 0: KOSTENLOSES KONFLIKT-LOGBUCH */}
        <section className="section-base pt-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col items-start gap-5 rounded-2xl border-2 border-dashed border-accent-300 bg-accent-50/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <span className="hidden text-3xl font-black text-accent-600 sm:block">
                  €0
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-medium text-neutral-900">
                      Konflikt-Logbuch
                    </h2>
                    <span className="rounded-full bg-accent-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      dauerhaft kostenlos
                    </span>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-600">
                    Noch nicht bereit für eine Mediation? Dokumentieren Sie
                    Ihren Streit erst einmal: Vorkommnisse, Gespräche, E-Mails,
                    WhatsApp, Telefonate – vertraulich und jederzeit in eine
                    Mediation umwandelbar.
                  </p>
                </div>
              </div>
              <a
                href="/konflikt-logbuch"
                className="shrink-0 rounded-xl border-2 border-accent-600 px-6 py-2.5 text-sm font-bold text-accent-700 transition hover:bg-accent-600 hover:text-white"
              >
                Kostenlos starten →
              </a>
            </div>
          </div>
        </section>

        {/* VERGLEICH ZUM GERICHTSWEG */}
        <section className="section-base pt-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-sm text-neutral-600">
              Zum Vergleich: Was dieselbe Sache vor Gericht kosten würde,
              rechnet Ihnen der{" "}
              <a
                href="/kostenrechner"
                className="font-semibold text-accent-700 underline"
              >
                Prozesskosten-Rechner
              </a>{" "}
              nach den gesetzlichen Gebührentabellen aus – inklusive der Frage,
              was passiert, wenn Ihr Anwalt nach Stunden abrechnet.
            </p>
            {/* Der Einwand "warum ist das so günstig?" entsteht genau hier,
                auf der Preisseite – und wurde bis dahin nirgends beantwortet. */}
            <p className="mt-3 text-sm text-neutral-600">
              Warum bei uns überhaupt ein Festpreis und kein Stundensatz steht,
              erklärt der{" "}
              <a
                href="/einigung"
                className="font-semibold text-accent-700 underline"
              >
                standardisierte Einigungsprozess
              </a>
              .
            </p>
          </div>
        </section>

        {/* DREI MODELLE */}
        <section className="section section-base pt-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* ONLINE-PROZESS */}
              <div className="rounded-2xl border-2 border-accent-200 bg-white p-8 hover:shadow-xl transition">
                <div className="inline-flex items-center gap-2 rounded border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-semibold text-accent-700 uppercase mb-6">
                  <Icon name="compass" color="currentColor" /> Online-Prozess
                </div>
                <h2 className="text-3xl font-black text-neutral-900 mb-2">
                  Schnell &
                  <span className="block text-accent-600">Günstig</span>
                </h2>
                <p className="text-neutral-600 mb-4">
                  Ein klar geführter Prozess bringt Sie Schritt für Schritt zu
                  einer Lösung – ganz in Ihrem Tempo, ohne Warteliste und ohne
                  Termindruck.
                </p>
                <p className="text-xs text-neutral-500 mb-8 italic">
                  Muss nicht einvernehmlich sein – aber für sehr komplexe
                  Scheidungen oder Trennungen (z.B. mit großem Vermögen, Firma
                  oder starkem Eskalationsgrad) empfehlen wir Hybrid oder
                  Vollservice.
                </p>

                {/* Preise nach Konflikt-Typ */}
                <div className="space-y-4 mb-8 pb-8 border-b border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-neutral-900">
                      Nachbarschafts-Streit
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €49
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Pro Partei – Einstiegstarif
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Verbraucher- & Handwerker-Streit
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €49
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Pro Partei – Einstiegstarif
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Streit im Mietverhältnis
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €49
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Pro Partei – Einstiegstarif
                  </p>

                  <p className="text-xs text-neutral-500 mt-1">
                    Optional zubuchbar: Live-Videositzung mit Mediator:in
                    (+€79), geprüfte Abschlussvereinbarung (+€49),
                    Express-Bearbeitung (+€29).
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Trennung & Unterhalt
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €399
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Pro Partei (z.B. 2 Personen = je €399)
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Konflikt am Arbeitsplatz
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €399
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Einmalig pro Fall – in der Regel vom Arbeitgeber getragen
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Erbschafts-Konflikt
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €399
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Einmalig für den Fall
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Gesellschafter, Nachfolge & Team
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €1.900
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Einmalig für den Fall
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      B2B-Vertragsstreit
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €1.200
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Einmalig für den Fall
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Schlichtung & E-Commerce
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €399
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Einmalig für den Fall
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Geführter Prozess</strong> – Schritt für Schritt
                      zur Lösung
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Schnell</strong> – 1–2 Wochen
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Verfügbar</strong> – Rund um die Uhr, von zu Hause
                      aus
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Fair</strong> – Alle zahlen anteilig
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Harvard-Prinzip</strong> – Bewährte Methode statt
                      Bauchgefühl
                    </span>
                  </div>
                </div>

                <a
                  href="#cta"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-accent-600 px-6 py-3 text-sm font-bold text-white hover:bg-accent-700 transition"
                >
                  Online-Prozess starten
                </a>
              </div>

              {/* HYBRID */}
              <div className="rounded-2xl border-2 border-accent-600 bg-gradient-to-br from-accent-50 to-white p-8 hover:shadow-xl transition relative">
                <div className="absolute top-0 right-0 bg-accent-600 text-white px-4 py-1.5 rounded-bl-xl text-xs font-bold uppercase">
                  Beliebt
                </div>
                <div className="inline-flex items-center gap-2 rounded border border-accent-300 bg-accent-100 px-3 py-1.5 text-xs font-semibold text-accent-700 uppercase mb-6">
                  <Icon name="users" color="currentColor" /> Hybrid
                </div>
                <h2 className="text-3xl font-black text-neutral-900 mb-2">
                  Persönlich &
                  <span className="block text-accent-600">Unterstützt</span>
                </h2>
                <p className="text-neutral-600 mb-8">
                  Der geführte Prozess bereitet alles vor – ein echter Mediator
                  begleitet Sie persönlich durch die entscheidenden Gespräche.
                </p>

                {/* Preise */}
                <div className="space-y-4 mb-8 pb-8 border-b border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-neutral-900">
                      Scheidung & Trennung
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €499 / Partei
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> In der Regel €499 × 2 (beide Parteien) – 2 Std.
                    persönliche Mediation bereits enthalten
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Weitere Mediator-Stunden
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €150 / Std.
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Nur falls benötigt, aufgeteilt auf alle Parteien
                  </p>

                  <div className="bg-neutral-50 rounded-lg p-4 mt-4 border border-neutral-200">
                    <p className="text-sm font-semibold text-neutral-900 mb-2">
                      Zusätzliche Spezialisten (optional)
                    </p>
                    <p className="text-xs text-neutral-700">
                      Wird es rechtlich oder emotional komplex, buchen Sie bei
                      Bedarf gezielt dazu: Rechtsanwalt ab{" "}
                      <strong>€190 / Std.</strong>, Psychologe oder Gutachter ab{" "}
                      <strong>€170 / Std.</strong> – nur wenn Sie es wirklich
                      brauchen, transparent abgerechnet.
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Hybrid-Modell</strong> – Prozess + persönliche
                      Begleitung
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Profi-Mediator</strong> – Erfahren & zertifiziert
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>2 Std. inklusive</strong> – bei Scheidung von
                      Anfang an dabei
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Spezialisten zubuchbar</strong> – Rechtsanwalt
                      oder Gutachter bei Bedarf, gegen Aufpreis
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Persönlicher Support</strong> – Jemand ist für Sie
                      da
                    </span>
                  </div>
                </div>

                <a
                  href="#cta"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-accent-600 px-6 py-3 text-sm font-bold text-white hover:bg-accent-700 transition"
                >
                  Hybrid starten
                </a>
              </div>

              {/* VOLLSERVICE */}
              <div className="rounded-2xl border-2 border-neutral-300 bg-white p-8 hover:shadow-xl transition">
                <div className="inline-flex items-center gap-2 rounded border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 uppercase mb-6">
                  <Icon name="shield" color="currentColor" /> Vollservice
                </div>
                <h2 className="text-3xl font-black text-neutral-900 mb-2">
                  Komplett &
                  <span className="block text-accent-600">Begleitet</span>
                </h2>
                <p className="text-neutral-600 mb-8">
                  Für sehr komplexe Scheidungen und Trennungen – mit Vermögen,
                  Firma, Kindern oder hohem Konfliktniveau. Eine feste
                  Ansprechperson begleitet Sie durchgehend, von Anfang bis Ende.
                </p>

                {/* Preise */}
                <div className="space-y-4 mb-8 pb-8 border-b border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-neutral-900">
                      Scheidung & Trennung
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €899 / Partei
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> In der Regel €899 × 2 – 5 Std. Mediator + anwaltliche
                    Ersteinschätzung bereits enthalten
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-neutral-900">
                      Weitere Mediator-Stunden
                    </span>
                    <span className="text-lg font-bold text-accent-600">
                      €150 / Std.
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 -mt-3">
                    <Icon name="arrow-right" size={12} color="currentColor" /> Aufgeteilt auf alle Parteien
                  </p>

                  <div className="bg-neutral-50 rounded-lg p-4 mt-4 border border-neutral-200">
                    <p className="text-sm font-semibold text-neutral-900 mb-2">
                      Weitere Spezialisten (optional)
                    </p>
                    <p className="text-xs text-neutral-700">
                      Über die inkludierte Ersteinschätzung hinaus: Rechtsanwalt
                      ab <strong>€190 / Std.</strong>, Psychologe oder Gutachter
                      ab <strong>€170 / Std.</strong> – nach Bedarf, transparent
                      abgerechnet.
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Feste Ansprechperson</strong> – durchgehend
                      dieselbe Begleitung
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>5 Std. Mediator inklusive</strong> – mehr Raum für
                      komplexe Themen
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Anwaltliche Ersteinschätzung</strong> – bereits
                      enthalten
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Bevorzugte Terminvergabe</strong> – kurze
                      Wartezeiten
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent-600 font-bold">✓</span>
                    <span className="text-sm text-neutral-700">
                      <strong>Höchste Erfolgsquote</strong> – auch bei hohem
                      Eskalationsgrad
                    </span>
                  </div>
                </div>

                <a
                  href="#cta"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-800 px-6 py-3 text-sm font-bold text-white hover:bg-neutral-900 transition"
                >
                  Vollservice starten
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS-TARIFE */}
        <section className="section section-strong">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300 mb-6">
                Für Unternehmen
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.1]">
                Business-Tarife.
                <span className="block bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent pb-2">
                  Ein Preis, alle Business-Konflikte.
                </span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-300">
                Für HR-Abteilungen, große Organisationen und Verbände mit
                laufendem Klärungsbedarf: eine feste Monatspauschale statt
                Einzelabrechnung – intern (Team, Führung, Gesellschafter,
                Nachfolge) und extern mit Geschäftspartnern (B2B).
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Team- & Abteilungsmediation",
                  "Führung & Betriebsrat",
                  "Gesellschafter & Nachfolge",
                  "Verträge & Lieferanten (B2B)",
                  "IT- & Großprojekte (B2B)",
                  "M&A & Post-Merger (B2B)",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-neutral-200"
                  >
                    <span className="mt-0.5 font-bold text-accent-400">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {/* BUSINESS LIGHT */}
              <div className="flex flex-col rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
                  Business Light
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight text-white">
                    €1.000
                  </span>
                  <span className="text-base font-semibold text-neutral-400">
                    / Monat
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  Bis zu{" "}
                  <strong className="text-white">
                    10 Mediationen pro Monat
                  </strong>{" "}
                  – rechnerisch €100 pro Fall statt €1.900 einzeln.
                </p>
                <div className="mt-6 flex-1 space-y-3 border-t border-white/10 pt-6 text-sm text-neutral-300">
                  <p>
                    <span className="font-bold text-accent-400">✓</span> Alle
                    Business-Konfliktarten, intern & B2B
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span> Strikt
                    vertraulich – kein Image-Schaden am Markt
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span>{" "}
                    Geführter Online-Prozess für jeden Fall, Start jederzeit
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span> Ideal
                    für Mittelstand & einzelne HR-Teams
                  </p>
                </div>
                <a
                  href="mailto:hallo@medipact.de?subject=Business%20Light%20anfragen"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-accent-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-accent-500"
                >
                  Business Light anfragen
                </a>
                <a
                  href="tel:+4915209942351"
                  className="mt-3 inline-flex w-full items-center justify-center text-sm font-semibold text-accent-300 transition hover:text-accent-200"
                >
                  <Icon name="phone" color="currentColor" /> Oder direkt anrufen: +49 1520 9942351
                </a>
              </div>

              {/* BUSINESS */}
              <div className="relative flex flex-col rounded-[2rem] border-2 border-accent-500/60 bg-white/10 p-8 backdrop-blur">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Beliebt
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
                  Business
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight text-white">
                    €5.000
                  </span>
                  <span className="text-base font-semibold text-neutral-400">
                    / Monat
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  Bis zu{" "}
                  <strong className="text-white">
                    50 Mediationen pro Monat
                  </strong>{" "}
                  – rechnerisch €100 pro Fall, mit vollem Funktionsumfang.
                </p>
                <div className="mt-6 flex-1 space-y-3 border-t border-white/10 pt-6 text-sm text-neutral-300">
                  <p>
                    <span className="font-bold text-accent-400">✓</span> Alles
                    aus Business Light
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span>{" "}
                    Methodenwahl nach Diagnose: facilitativ, evaluativ,
                    transformativ, Shuttle
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span>{" "}
                    Digitalisierte Massen-ODR (z.B. E-Commerce,
                    Kundenbeschwerden)
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span>{" "}
                    Priorisierter Support für Ihr Unternehmen
                  </p>
                </div>
                <a
                  href="mailto:hallo@medipact.de?subject=Business-Tarif%20anfragen"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-accent-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-accent-500"
                >
                  Business anfragen
                </a>
                <a
                  href="tel:+4915209942351"
                  className="mt-3 inline-flex w-full items-center justify-center text-sm font-semibold text-accent-300 transition hover:text-accent-200"
                >
                  <Icon name="phone" color="currentColor" /> Oder direkt anrufen: +49 1520 9942351
                </a>
              </div>

              {/* BUSINESS PREMIUM */}
              <div className="flex flex-col rounded-[2rem] border border-accent-300/40 bg-gradient-to-br from-accent-500/15 to-white/5 p-8 backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
                  Business Premium
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight text-white">
                    Full Service
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  Individuelles Fallkontingent und persönliche Rundum-Betreuung
                  – <strong className="text-white">Preis auf Anfrage</strong>.
                </p>
                <div className="mt-6 flex-1 space-y-3 border-t border-white/10 pt-6 text-sm text-neutral-300">
                  <p>
                    <span className="font-bold text-accent-400">✓</span> Alles
                    aus Business
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span>{" "}
                    Persönliche Mediator:innen inklusive – auch vor Ort
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span> Feste
                    Ansprechperson & garantierte Reaktionszeiten
                  </p>
                  <p>
                    <span className="font-bold text-accent-400">✓</span>{" "}
                    Konflikt-Prävention: Workshops & Schulungen für Teams
                  </p>
                </div>
                <a
                  href="tel:+4915209942351"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-accent-700 transition hover:bg-accent-50"
                >
                  <Icon name="phone" color="currentColor" /> Bitte direkt anrufen: +49 1520 9942351
                </a>
                <a
                  href="mailto:hallo@medipact.de?subject=Business%20Premium%20%E2%80%93%20R%C3%BCckruf%20erbeten"
                  className="mt-3 inline-flex w-full items-center justify-center text-sm font-semibold text-accent-300 transition hover:text-accent-200"
                >
                  Oder Rückruf per E-Mail vereinbaren
                </a>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="/konflikte/odr"
                className="inline-flex items-center justify-center text-sm font-semibold text-accent-300 transition hover:text-accent-200"
              >
                Mehr zur Online Dispute Resolution (ODR) →
              </a>
            </div>
          </div>
        </section>

        {/* VERGLEICH TABELLE */}
        <section className="section section-muted">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black text-neutral-900 mb-12 text-center">
              Direkt vergleichen
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="text-left py-4 px-4 font-bold text-neutral-900">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-accent-600">
                      Online-Prozess
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-accent-600">
                      Hybrid
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-700">
                      Vollservice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Geführter Prozess",
                      pure: "✓",
                      hybrid: "✓",
                      voll: "✓",
                    },
                    {
                      feature: "Geeignet für sehr komplexe Fälle",
                      pure: "—",
                      hybrid: "Teilweise",
                      voll: "✓",
                    },
                    {
                      feature: "Mensch-Mediator",
                      pure: "—",
                      hybrid: "✓ (2 Std. inklusive)",
                      voll: "✓ (5 Std. inklusive)",
                    },
                    {
                      feature: "Feste Ansprechperson",
                      pure: "—",
                      hybrid: "—",
                      voll: "✓",
                    },
                    {
                      feature: "Rechtsanwalt / Gutachter",
                      pure: "—",
                      hybrid: "Optional, gegen Aufpreis",
                      voll: "Ersteinschätzung inklusive",
                    },
                    {
                      feature: "Verfügbarkeit",
                      pure: "24/7",
                      hybrid: "Mo–Fr",
                      voll: "Mo–Fr, priorisiert",
                    },
                    {
                      feature: "Dauer",
                      pure: "1–2 Wochen",
                      hybrid: "2–8 Wochen",
                      voll: "4–12 Wochen",
                    },
                    {
                      feature: "Erfolgsquote",
                      pure: "85%",
                      hybrid: "95%+",
                      voll: "97%+",
                    },
                  ].map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-neutral-100 hover:bg-neutral-50"
                    >
                      <td className="py-3 px-4 font-medium text-neutral-900">
                        {row.feature}
                      </td>
                      <td className="text-center py-3 px-4 text-accent-600">
                        {row.pure}
                      </td>
                      <td className="text-center py-3 px-4 text-accent-600">
                        {row.hybrid}
                      </td>
                      <td className="text-center py-3 px-4 text-neutral-700">
                        {row.voll}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section-base">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-3xl font-black text-neutral-900 mb-12 text-center">
              Häufig gestellte Fragen
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Wie wird die Aufteilung der Kosten berechnet?",
                  a: "Jede Partei zahlt ihren eigenen Anteil. Beim Einstiegstarif (Nachbarschaft, Verbraucher/Handwerker, Mietverhältnis) sind das nur 49 € pro Partei – optionale Zusatzleistungen wie eine Live-Videositzung oder eine geprüfte Abschlussvereinbarung können einzeln dazugebucht werden. Vollständige Transparenz!",
                },
                {
                  q: "Welches Modell passt zu meinem Fall?",
                  a: "Der Online-Prozess eignet sich für unkomplizierte bis mittelschwere Fälle – er muss nicht einvernehmlich sein. Bei sehr komplexen Scheidungen oder Trennungen, etwa mit größerem Vermögen, einer Firma oder starker Eskalation, empfehlen wir Hybrid oder Vollservice mit persönlicher Begleitung.",
                },
                {
                  q: "Wie genau ist die Hybrid-Preisstruktur bei Scheidung?",
                  a: "Bei Scheidung zahlt jede Partei in der Regel €499 – also insgesamt rund €499 × 2. Darin sind die Vorbereitung und bereits 2 Stunden persönliche Mediation enthalten. Weitere Mediator-Stunden kosten €150/Std. und werden auf alle Parteien aufgeteilt.",
                },
                {
                  q: "Was kostet es, einen Rechtsanwalt oder Gutachter hinzuzuziehen?",
                  a: "Bei Bedarf buchen Sie gezielt einen Rechtsanwalt (ab €190/Std.) oder einen Psychologen bzw. Gutachter (ab €170/Std.) dazu. Im Vollservice ist eine anwaltliche Ersteinschätzung bereits enthalten. Sie zahlen nur, wenn Sie es tatsächlich nutzen – klar abgerechnet pro Stunde.",
                },
                {
                  q: "Was kosten die Business-Tarife für Unternehmen?",
                  a: "Es gibt drei Business-Tarife: Business Light für €1.000 pro Monat mit bis zu 10 Mediationen, Business für €5.000 pro Monat mit bis zu 50 Mediationen, und Business Premium als Full-Service-Paket mit persönlicher Betreuung und individuellem Kontingent – dafür rufen Sie uns am besten direkt an (+49 1520 9942351). Abgedeckt sind interne Fälle (Team, Führung, Gesellschafter, Nachfolge) ebenso wie B2B-Konflikte (Lieferanten, IT-Projekte, M&A). Ohne Tarif kostet der Einzelfall €1.900 (Gesellschafter, Nachfolge, Team), €1.200 (B2B-Vertragsstreit) oder €399 (Online-Schlichtung, E-Commerce).",
                },
                {
                  q: "Gibt es ein kostenloses Angebot?",
                  a: "Ja: das Konflikt-Logbuch. Sie dokumentieren Ihren Streit kostenlos – Vorkommnisse, Gespräche, E-Mails, WhatsApp, Telefonate – und wandeln das Logbuch erst dann in eine Mediation um, wenn Sie so weit sind. Erst ab diesem Schritt fallen die regulären Preise an.",
                },
                {
                  q: "Gibt es versteckte Kosten?",
                  a: "Nein. Die Preise sind transparent. Was Sie sehen, ist was Sie zahlen. Zusatzleistungen wie Anwalt oder Gutachter sind klar ausgewiesen und werden nur auf Wunsch gebucht.",
                },
                {
                  q: "Kann ich die Mediation jederzeit abbrechen?",
                  a: "Ja. Sie können jederzeit kündigen. Bei Hybrid und Vollservice zahlen Sie nur die tatsächlich genutzten Stunden des Mediators und etwaiger Spezialisten.",
                },
              ].map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-md transition"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-neutral-900">
                    {item.q}
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-4 text-neutral-700">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="section section-strong">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
              Bereit, wieder klar nach vorne zu schauen?
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-accent-100">
              Wählen Sie Ihren Weg und starten Sie noch heute – ruhig,
              vertraulich und fair für alle Seiten.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hallo@medipact.de?subject=Online-Prozess%20starten"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-accent-600 hover:bg-accent-50 transition"
              >
                Online-Prozess starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Hybrid%20starten"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Hybrid starten
              </a>
              <a
                href="mailto:hallo@medipact.de?subject=Vollservice%20starten"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 bg-transparent px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Vollservice starten
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
