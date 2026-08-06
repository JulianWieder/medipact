// app/components/AbgleichDiagramm.tsx
//
// Statisches Schaubild für /einigung/abgleich (heroAside im
// MarketingPageTemplate). Zeigt an einem erfundenen, aber typischen
// Nachbarschaftsfall, wie aus zwei getrennt gesetzten Gewichtungen ein
// Vorschlag entsteht — inklusive des Falls, in dem beide gleich stark ziehen.
//
// Bewusst ohne "use client": keine Interaktion, keine Hooks, kein State. Das
// Bild soll den Mechanismus erklären, nicht ihn simulieren. Wer ihn
// ausprobieren will, legt einen Fall an.
//
// Die drei Zeilen decken absichtlich alle drei möglichen Ausgänge ab:
// A entscheidet, B entscheidet, Gleichstand. Wenn das Schaubild irgendwann
// durch einen echten Produkt-Screenshot ersetzt wird, müssen diese drei
// Fälle darauf ebenfalls sichtbar sein — sonst wirkt der Mechanismus wie
// eine Mehrheitsentscheidung, und genau das ist er nicht.

type Punkt = {
  label: string;
  /** Gewichtung Partei A, 1–3. */
  a: number;
  /** Gewichtung Partei B, 1–3. */
  b: number;
  ergebnis: string;
  /** true = echter Gleichstand, wird nicht entschieden, sondern getauscht. */
  gleichstand?: boolean;
};

const punkte: Punkt[] = [
  {
    label: "Höhe der Hecke",
    a: 3,
    b: 1,
    ergebnis: "Partei A – deutlich höher gewichtet",
  },
  {
    label: "Parken vor der Einfahrt",
    a: 1,
    b: 3,
    ergebnis: "Partei B – deutlich höher gewichtet",
  },
  {
    label: "Ruhezeiten am Sonntag",
    a: 2,
    b: 2,
    ergebnis: "Gleichstand – wird gegen die anderen Punkte getauscht",
    gleichstand: true,
  },
];

function Balken({ wert, seite }: { wert: number; seite: "a" | "b" }) {
  // Drei feste Stufen statt einer berechneten Breite: das Kontingent im
  // Produkt ist ebenfalls gestuft, keine Prozentskala.
  const farbe =
    seite === "a"
      ? "bg-accent-600"
      : "bg-neutral-800";

  return (
    <div
      className={seite === "a" ? "flex justify-end gap-1" : "flex gap-1"}
      aria-hidden="true"
    >
      {[1, 2, 3].map((stufe) => (
        <span
          key={stufe}
          className={`h-2.5 w-5 rounded-full ${
            stufe <= wert ? farbe : "bg-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function AbgleichDiagramm() {
  return (
    <figure className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-900/5 sm:p-7">
      <figcaption className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">
        Beispiel: drei strittige Punkte
      </figcaption>

      <p className="mt-3 text-sm leading-6 text-neutral-600">
        Beide Seiten gewichten getrennt voneinander. Erst wenn beide fertig
        sind, werden die Gewichtungen gegenübergestellt.
      </p>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 text-[11px] font-bold uppercase tracking-wide">
        <span className="text-right text-accent-700">Partei A</span>
        <span className="text-neutral-400">·</span>
        <span className="text-neutral-700">Partei B</span>
      </div>

      <ul className="mt-4 space-y-5">
        {punkte.map((p) => (
          <li key={p.label}>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-3">
              <Balken wert={p.a} seite="a" />
              <span className="text-center text-xs font-semibold text-neutral-800">
                {p.label}
              </span>
              <Balken wert={p.b} seite="b" />
            </div>
            <p
              className={`mt-2 text-center text-[11px] leading-4 ${
                p.gleichstand ? "text-neutral-500" : "text-accent-700"
              }`}
            >
              {p.ergebnis}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-neutral-100 pt-4 text-xs leading-5 text-neutral-500">
        Das Kontingent ist begrenzt: Niemand kann alle drei Punkte voll
        gewichten. Deshalb entsteht ein Tausch statt eines Patts – und deshalb
        lohnt es sich, ehrlich zu gewichten.
      </p>
    </figure>
  );
}
