import Link from "next/link";

const conflictTypes = [
  {
    title: "Scheidung & Trennung",
    text: "Wenn Beziehung endet und Fragen zu Unterhalt, Betreuung, Verantwortung und Kommunikation offen bleiben.",
    href: "/konflikte/trennung",
  },
  {
    title: "Nachbarschaft",
    text: "Wenn Lärm, Grenzen, Nutzung von Flächen oder alte Spannungen den Alltag belasten.",
    href: "/konflikte/nachbarschaft",
  },
  {
    title: "Erbe & Familie",
    text: "Wenn Nachlass, Verantwortung, Erwartungen oder alte Familienkonflikte zu Streit führen.",
    href: "/konflikte/erbschaft",
  },
];

export default function KonfliktePage() {
  return (
    <>
      <section className="section section-base">
        <div className="container max-w-4xl">
          <p className="eyebrow mb-4">Konflikte</p>

          <h1 className="heading-1 text-slate-900">
            Konflikte haben viele Formen.{" "}
            <span className="text-emerald-700">
              Mediation schafft Klarheit.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Ob Trennung, Erbschaft oder Nachbarschaft: Viele Konflikte
            eskalieren nicht wegen des eigentlichen Themas, sondern weil
            Kommunikation, Erwartungen und Emotionen durcheinandergeraten.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/kontakt" className="btn btn-primary">
              Konflikt einschätzen
            </Link>

            <Link href="/beispiele" className="btn btn-secondary">
              Fallbeispiele ansehen
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Orientierung</p>

            <h2 className="heading-2 text-slate-900">
              Welche Konfliktart passt zu Ihrer Situation?
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Wählen Sie den Bereich, der Ihrer Lage am nächsten kommt. Auf den
              Detailseiten finden Sie typische Dynamiken, Beispiele und mögliche
              nächste Schritte.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {conflictTypes.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card group transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="heading-3 group-hover:text-emerald-700">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">{item.text}</p>

                <p className="mt-6 font-medium text-emerald-700">
                  Konfliktart ansehen →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-base">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow mb-4">Warum Mediation?</p>

            <h2 className="heading-2 text-slate-900">
              Nicht jeder Streit braucht sofort Gericht, Anwalt oder Abbruch.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Mediation hilft, wenn Gespräche festgefahren sind, aber eine
              tragfähige Lösung noch möglich ist. Ziel ist nicht Harmonie um
              jeden Preis, sondern eine klare, realistische Vereinbarung.
            </p>
          </div>

          <div className="card-accent">
            <h3 className="heading-3">Typische Anzeichen</h3>

            <ul className="mt-5 space-y-3 text-slate-700">
              <li>• Gespräche drehen sich im Kreis.</li>
              <li>• Sachfragen werden persönlich.</li>
              <li>• Entscheidungen werden immer wieder vertagt.</li>
              <li>• Beide Seiten fühlen sich missverstanden.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-strong">
        <div className="container max-w-3xl text-center">
          <h2 className="heading-2">
            Bereit, den Konflikt klarer einzuordnen?
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Der erste Schritt ist keine fertige Lösung, sondern eine nüchterne
            Einschätzung der Situation.
          </p>

          <Link href="/kontakt" className="btn btn-primary mt-8">
            Konflikt einschätzen
          </Link>
        </div>
      </section>
    </>
  );
}
