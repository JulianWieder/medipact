/**
 * Standard pattern: ein einzelnes leicht gekipptes Wort in der H1.
 *
 * Die zurueckhaltendste Anleihe bei Ribbit: statt einer ganzen Wand
 * verdrehter Buchstaben kippt genau ein Wort — das letzte der Akzent-Zeile
 * — um -3,5 Grad. Faellt erst beim zweiten Hinsehen auf, kostet kein JS
 * und keine Barrierefreiheit (der Text bleibt normaler, markierbarer
 * Flow-Text; nur die Darstellung ist gedreht).
 *
 * ACHTUNG Gradient-Ueberschriften: bei Zeilen mit
 * `bg-clip-text text-transparent` darf der gekippte Teil NICHT einfach
 * innerhalb der Gradient-Span stehen — das transform erzeugt einen eigenen
 * Stacking-Context, der Hintergrund der Eltern-Span wird dort nicht mehr
 * durchgeclippt und das Wort verschwindet. Deshalb bekommt die gekippte
 * Span ihren eigenen Gradienten mit: dieselben Klassen per `className`
 * durchreichen (siehe /preise, /karriere, /kontakt, /konflikt-logbuch).
 */

const DEFAULT_DEG = -3.5;

export function Tilt({
  children,
  deg = DEFAULT_DEG,
  className = "",
}: {
  children: React.ReactNode;
  deg?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{ transform: `rotate(${deg}deg)`, transformOrigin: "50% 60%" }}
    >
      {children}
    </span>
  );
}

/**
 * Kippt das letzte Wort des uebergebenen Strings. Alles davor bleibt
 * normaler Text, damit Zeilenumbrueche sich weiterhin natuerlich
 * verhalten.
 */
export function TiltLastWord({
  children,
  deg = DEFAULT_DEG,
  className = "",
}: {
  children: string;
  deg?: number;
  className?: string;
}) {
  const words = children.trim().split(/\s+/);
  const last = words.pop() ?? "";
  const head = words.join(" ");

  return (
    <>
      {head ? `${head} ` : null}
      <Tilt deg={deg} className={className}>
        {last}
      </Tilt>
    </>
  );
}
