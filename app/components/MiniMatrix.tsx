import Link from "next/link";

export default function MiniMatrix() {
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
        <div className="grid min-w-[900px] grid-cols-4 gap-px">
          <div className="bg-white p-5" />

          <MatrixHeader title="Trennung & Unterhalt" />
          <MatrixHeader title="Erbschaft" />
          <MatrixHeader title="Nachbarschaft" />

          <MatrixRowHeader
            title="Es ist noch offen"
            text="Es gibt Unklarheiten oder erste Spannungen, aber ein Gespräch scheint noch möglich."
          />

          <MatrixLink
            href="/cases/maria-thomas"
            title="Wer bleibt in der Wohnung?"
            text="Die Trennung ist ausgesprochen, aber Alltag, Geld und Betreuung sind offen."
          />

          <MatrixLink
            href="/cases/anna-klaus"
            title="Unklare Erwartungen im Testament"
            text="Alle spüren, dass der Nachlass schwierig werden könnte — aber noch spricht niemand klar darüber."
          />

          <MatrixLink
            href="/cases/rolf-helga"
            title="Kleine Spannungen werden größer"
            text="Lärm, Garten oder Grenzen werden zunehmend zum Reizthema."
          />

          <MatrixRowHeader
            title="Gespräche werden schwer"
            text="Man redet zwar noch, aber oft aneinander vorbei. Positionen werden fester."
          />

          <MatrixLink
            href="/cases/peter-sarah"
            title="Streit um Unterhalt"
            text="Finanzielle Fragen blockieren eine faire Lösung nach der Trennung."
          />

          <MatrixLink
            href="/cases/familie-weber"
            title="Geschwister sprechen kaum noch"
            text="Alte Verletzungen überlagern die sachliche Verteilung."
          />

          <MatrixLink
            href="/cases/jens-katarina"
            title="Beschwerden häufen sich"
            text="Aus Ärger wird Dauerstress zwischen Tür, Garten und Grundstück."
          />

          <MatrixRowHeader
            title="Es geht kaum noch direkt"
            text="Gespräche werden vermieden oder laufen nur noch über Dritte."
          />

          <MatrixLink
            href="/cases/alexa-david"
            title="Kommunikation nur noch über Anwälte"
            text="Die Trennung ist festgefahren. Direkte Gespräche finden kaum noch statt."
          />

          <MatrixLink
            href="/cases/marie-sophie"
            title="Der Erbstreit steht vor Gericht"
            text="Die Familie findet keinen gemeinsamen Weg mehr und bereitet rechtliche Schritte vor."
          />

          <MatrixLink
            href="/cases/carla-marco"
            title="Offener Streit im Hausflur"
            text="Der Konflikt ist sichtbar eskaliert und belastet den Alltag aller Beteiligten."
          />
        </div>
      </div>
    </div>
  );
}

function MatrixHeader({ title }: { title: string }) {
  return (
    <div className="bg-white p-5">
      <h3 className="heading-3">{title}</h3>
    </div>
  );
}

function MatrixRowHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white p-5">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function MatrixLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white p-5 transition hover:bg-emerald-50"
    >
      <p className="font-medium text-slate-900 group-hover:text-emerald-700">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </Link>
  );
}
