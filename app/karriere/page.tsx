import type { Metadata } from "next";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import karrierePhoto from "@/fotos/medi_karriere.jpg";

export const metadata: Metadata = {
  title: "Karriere bei medipact – Mitgestalten statt verwalten",
  description:
    "Werde Teil von medipact. Wir suchen zertifizierte Mediatoren, die Menschen in schwierigen Lebenssituationen strukturiert begleiten wollen.",
  alternates: { canonical: "https://medipact.de/karriere" },
};

const values = [
  {
    title: "Wirkung statt Aktenberge",
    text: "Bei medipact siehst du direkt, ob deine Arbeit etwas bewegt. Wir messen Erfolg an gelösten Konflikten, nicht an Stundenzetteln.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Remote-first, menschlich geblieben",
    text: "Du arbeitest von wo du willst. Regelmäßige Team-Calls und klare Absprachen sorgen dafür, dass niemand verloren geht.",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    title: "KI als Werkzeug, du als Kern",
    text: "Unsere Plattform automatisiert Struktur und Ablauf. Du bringst das ein, was Technologie nicht kann: Einfühlungsvermögen, Urteilsvermögen, Vertrauen.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
];

const responsibilities = [
  "Begleitung von Mediationsverfahren auf der Plattform – du übernimmst Fälle, die menschliche Begleitung erfordern oder bei denen Parteien das wünschen",
  "Qualitätssicherung KI-geführter Verfahren: du prüfst kritische Phasen, gibst Feedback und erkennst, wann ein Fall eskalationsgefährdet ist",
  "Entwicklung und Pflege von Gesprächsleitfäden und Modulen, die in die Plattform einfließen",
  "Enge Zusammenarbeit mit dem Produktteam, um die KI-gestützten Prozesse fachlich fundiert weiterzuentwickeln",
  "Bei Bedarf: telefonische oder videobasierte Kurzberatung für Nutzer in schwierigen Phasen",
];

const requirements = [
  { must: true, text: "Abgeschlossene Mediationsausbildung mit anerkanntem Zertifikat (z. B. BMWA, BM, BAFM oder vergleichbar)" },
  { must: true, text: "Praktische Erfahrung in mindestens einem der Bereiche: Familienmediation, Nachbarschaftsmediation oder Erbschaftskonflikte" },
  { must: true, text: "Sehr gute schriftliche Ausdrucksweise auf Deutsch – ein Großteil der Kommunikation läuft asynchron und textbasiert" },
  { must: false, text: "Erfahrung mit digitalen Tools und grundlegende Offenheit gegenüber KI-gestützten Workflows" },
  { must: false, text: "Interesse daran, Mediationsprozesse zu dokumentieren und strukturiert weiterzugeben" },
  { must: false, text: "Erfahrungen in der juristischen Beratung oder im Coaching sind ein Plus, aber kein Muss" },
];

const weOffer = [
  { title: "Flexibler Einsatz", text: "Freiberuflich oder in Festanstellung, Teilzeit oder Vollzeit – wir passen das Modell an deine Lebensrealität an." },
  { title: "Sinnvolle Arbeit", text: "Du begleitest Menschen in echten Konflikten. Kein Aktensortieren, keine Kaltakquise – nur Fälle, bei denen deine Expertise gefragt ist." },
  { title: "Faire Vergütung", text: "Leistungsgerechte Bezahlung, transparent kommuniziert. Kein Rätselraten über Gehälter." },
  { title: "Mitgestalten", text: "Du bist kein Dienstleister für fertige Prozesse. Dein fachliches Feedback formt direkt, wie die Plattform weiterentwickelt wird." },
  { title: "Weiterbildung", text: "Budget für Fortbildungen, Supervisionen und Fachveranstaltungen – wir investieren in deine Entwicklung." },
  { title: "Remote & flexibel", text: "Vollständig remote möglich. Erreichbarkeit in deutschem Kernarbeitszeit-Fenster genügt." },
];

export default function KarrierePage() {
  return (
    <main className="app-shell pt-[73px]">

      {/* ── HERO ── */}
      <ImagePinHero image={karrierePhoto} imageAlt="Karriere bei medipact – Mediator im Gespräch">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="eyebrow text-accent-300">Karriere bei medipact</div>

            <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Konflikte lösen –
              <span className="mt-2 block bg-gradient-to-r from-accent-300 via-accent-200 to-white bg-clip-text text-transparent pb-2 leading-[1.15]">
                mit Methode und Haltung.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
              Medipact verbindet strukturierte Mediation mit KI-gestützten
              Prozessen. Wir suchen Menschen, die beides schätzen: gute
              Technologie und den menschlichen Kern, der dahinter bleiben muss.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 text-sm text-neutral-200">
              {[
                { label: "Remote möglich", color: "bg-accent-400" },
                { label: "Teilzeit & Vollzeit", color: "bg-accent-300" },
                { label: "Freiberuflich willkommen", color: "bg-accent-200" },
              ].map(({ label, color }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                >
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ImagePinHero>

      {/* ── WERTE ── */}
      <section className="section section-muted border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <div className="eyebrow mb-4">Wie wir arbeiten</div>
            <h2 className="heading-2">Was uns wichtig ist</h2>
            <p className="mt-4 text-lg text-neutral-600">
              Bevor du dir die Stelle anschaust: hier ist, wofür wir stehen.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="app-surface p-8">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-700/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent-700)"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d={v.icon} />
                  </svg>
                </div>
                <h3 className="heading-3">{v.title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFENE STELLE ── */}
      <section className="section section-base">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <div className="eyebrow mb-4">Offene Stellen</div>
            <h2 className="heading-2">Wir suchen dich</h2>
          </div>

          {/* Job-Karte */}
          <div className="overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white shadow-xl shadow-accent-900/5 ring-1 ring-neutral-900/5">

            {/* Karten-Header */}
            <div className="border-b border-neutral-100 bg-gradient-to-r from-accent-50 to-neutral-50 px-10 py-8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="mb-2 inline-block rounded-full bg-accent-700/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-700">
                    Jetzt offen
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                    Zertifizierter Mediator (m/w/d)
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {[
                      { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label: "Remote / deutschlandweit" },
                      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Teilzeit oder Vollzeit" },
                      { icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Freiberuflich oder Festanstellung" },
                    ].map((tag) => (
                      <span
                        key={tag.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-accent-600">
                          <path d={tag.icon} />
                        </svg>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href="mailto:jobs@medipact.de?subject=Bewerbung: Zertifizierter Mediator"
                  className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-accent-700 px-7 py-3.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-accent-800"
                >
                  Jetzt bewerben
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Karten-Body */}
            <div className="grid gap-0 divide-y divide-neutral-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">

              {/* Linke Spalte */}
              <div className="space-y-10 px-10 py-10">

                {/* Intro */}
                <div>
                  <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent-600">
                    Über die Rolle
                  </h4>
                  <p className="text-sm leading-7 text-neutral-600">
                    Als Mediator bei medipact begleitest du Verfahren, bei denen
                    menschliche Kompetenz den Unterschied macht. Du arbeitest
                    eng mit unserem Produktteam zusammen, gibst der KI fachliches
                    Fundament und übernimmst eigenständig Fälle – auf Wunsch
                    vollständig remote.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-neutral-600">
                    Die Stelle ist ideal für erfahrene Mediatoren, die nicht nur
                    Einzelfälle bearbeiten, sondern aktiv mitgestalten wollen,
                    wie Mediation in der digitalen Welt funktioniert.
                  </p>
                </div>

                {/* Aufgaben */}
                <div>
                  <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent-600">
                    Deine Aufgaben
                  </h4>
                  <ul className="space-y-4">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-700 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="leading-6">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rechte Spalte */}
              <div className="space-y-10 px-10 py-10">

                {/* Anforderungen */}
                <div>
                  <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent-600">
                    Anforderungen
                  </h4>
                  <ul className="space-y-3">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            req.must
                              ? "bg-accent-700 text-white"
                              : "border border-neutral-300 bg-neutral-50 text-neutral-400"
                          }`}
                        >
                          ✓
                        </span>
                        <span className={req.must ? "text-neutral-700" : "text-neutral-500"}>
                          {req.text}
                          {!req.must && (
                            <span className="ml-1.5 text-[11px] text-neutral-400">(von Vorteil)</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Was wir bieten */}
                <div>
                  <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent-600">
                    Was wir bieten
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {weOffer.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4"
                      >
                        <div className="text-xs font-bold text-neutral-800">{item.title}</div>
                        <div className="mt-1 text-xs leading-5 text-neutral-500">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bewerbung */}
                <div className="rounded-2xl border border-accent-100 bg-accent-50/60 p-6">
                  <h4 className="mb-2 text-sm font-bold text-neutral-900">
                    So bewirbst du dich
                  </h4>
                  <p className="text-sm leading-6 text-neutral-600">
                    Schick uns eine formlose E-Mail an{" "}
                    <a
                      href="mailto:jobs@medipact.de"
                      className="font-medium text-accent-700 underline underline-offset-2"
                    >
                      jobs@medipact.de
                    </a>
                    {" "}mit einem kurzen Text darüber, wer du bist und was dich
                    antreibt. Ein Lebenslauf ist willkommen, aber kein Pflichtfeld.
                    Kein Anschreiben im klassischen Sinne erforderlich.
                  </p>
                  <a
                    href="mailto:jobs@medipact.de?subject=Bewerbung: Zertifizierter Mediator"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-800"
                  >
                    E-Mail schreiben
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEIN PASSENDER JOB? ── */}
      <section className="section section-strong">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300 mb-8">
            Spontanbewerbung
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
            Kein passender Job –
            <span className="block text-accent-300">aber du bist überzeugt?</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-300 leading-8">
            Wir freuen uns über Initiativbewerbungen. Wenn du glaubst, dass deine
            Fähigkeiten zu dem passen, was wir aufbauen, schreib uns einfach.
          </p>
          <a
            href="mailto:jobs@medipact.de?subject=Initiativbewerbung"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-accent-900/40 transition hover:scale-[1.02] hover:bg-accent-500"
          >
            Initiativbewerbung senden
          </a>
        </div>
      </section>

    </main>
  );
}
