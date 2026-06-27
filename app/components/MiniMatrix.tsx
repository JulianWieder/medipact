import Link from "next/link";

type CaseLink = {
  href: string;
  title: string;
  text: string;
};

type MatrixRow = {
  rowTitle: string;
  rowText: string;
  cells: CaseLink[];
};

const columns = ["Trennung & Unterhalt", "Erbschaft", "Nachbarschaft"];

const rows: MatrixRow[] = [
  {
    rowTitle: "Es ist noch offen",
    rowText:
      "Es gibt Unklarheiten oder erste Spannungen, aber ein Gespräch scheint noch möglich.",
    cells: [
      {
        href: "/cases/maria-thomas",
        title: "Wer bleibt in der Wohnung?",
        text: "Die Trennung ist ausgesprochen, aber Alltag, Geld und Betreuung sind offen.",
      },
      {
        href: "/cases/anna-klaus",
        title: "Unklare Erwartungen im Testament",
        text: "Alle spüren, dass der Nachlass schwierig werden könnte — aber noch spricht niemand klar darüber.",
      },
      {
        href: "/cases/rolf-helga",
        title: "Kleine Spannungen werden größer",
        text: "Lärm, Garten oder Grenzen werden zunehmend zum Reizthema.",
      },
    ],
  },
  {
    rowTitle: "Gespräche werden schwer",
    rowText:
      "Man redet zwar noch, aber oft aneinander vorbei. Positionen werden fester.",
    cells: [
      {
        href: "/cases/peter-sarah",
        title: "Streit um Unterhalt",
        text: "Finanzielle Fragen blockieren eine faire Lösung nach der Trennung.",
      },
      {
        href: "/cases/familie-weber",
        title: "Geschwister sprechen kaum noch",
        text: "Alte Verletzungen überlagern die sachliche Verteilung.",
      },
      {
        href: "/cases/jens-katarina",
        title: "Beschwerden häufen sich",
        text: "Aus Ärger wird Dauerstress zwischen Tür, Garten und Grundstück.",
      },
    ],
  },
  {
    rowTitle: "Es geht kaum noch direkt",
    rowText:
      "Gespräche werden vermieden oder laufen nur noch über Dritte.",
    cells: [
      {
        href: "/cases/alexa-david",
        title: "Kommunikation nur noch über Anwälte",
        text: "Die Trennung ist festgefahren. Direkte Gespräche finden kaum noch statt.",
      },
      {
        href: "/cases/marie-sophie",
        title: "Der Erbstreit steht vor Gericht",
        text: "Die Familie findet keinen gemeinsamen Weg mehr und bereitet rechtliche Schritte vor.",
      },
      {
        href: "/cases/carla-marco",
        title: "Offener Streit im Hausflur",
        text: "Der Konflikt ist sichtbar eskaliert und belastet den Alltag aller Beteiligten.",
      },
    ],
  },
];

export default function MiniMatrix() {
  return (
    <div id="matrix" className="section section-muted scroll-mt-24">
      <div className="container">
        {/* MOBILE / TABLET — stacked cards grouped by row, no horizontal scroll */}
        <div className="flex flex-col gap-8 md:hidden">
          {rows.map((row) => (
            <div key={row.rowTitle}>
              <p className="font-semibold text-neutral-900">{row.rowTitle}</p>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                {row.rowText}
              </p>

              <div className="mt-4 flex flex-col gap-3">
                {row.cells.map((cell, i) => (
                  <Link
                    key={cell.href}
                    href={cell.href}
                    className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:bg-accent-50"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                      {columns[i]}
                    </p>
                    <p className="mt-1 font-medium text-neutral-900 group-hover:text-accent-700">
                      {cell.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {cell.text}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP — full matrix table */}
        <div className="hidden overflow-x-auto rounded-2xl border border-neutral-200 bg-neutral-200 shadow-sm md:block">
          <div className="grid min-w-[900px] grid-cols-4 gap-px">
            <div className="bg-white p-5" />

            {columns.map((title) => (
              <MatrixHeader key={title} title={title} />
            ))}

            {rows.map((row) => (
              <RowFragment key={row.rowTitle} row={row} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RowFragment({ row }: { row: MatrixRow }) {
  return (
    <>
      <MatrixRowHeader title={row.rowTitle} text={row.rowText} />
      {row.cells.map((cell) => (
        <MatrixLink key={cell.href} {...cell} />
      ))}
    </>
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
      <p className="font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
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
      className="group bg-white p-5 transition hover:bg-accent-50"
    >
      <p className="font-medium text-neutral-900 group-hover:text-accent-700">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
    </Link>
  );
}
