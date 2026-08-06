# Landing: Wiederholungen raus, Kostenargument rein

Vorschlag zur Abstimmung — **noch nichts geändert.** Quellen: `app/[locale]/page.tsx`,
`messages/de.json` → `home`, `app/components/{ErsteHilfeBox,ZweiWelten,ThemenTabs,EmpfehlungenGrid,KampagnenKarussell}.tsx`.

---

## Teil 0: Was sich wie oft wiederholt

Beim Durchscrollen einmal mitgezählt:

| Motiv | Wie oft | Wo |
|---|---|---|
| Die vier Konflikttypen aufgezählt | **8×** | `hero.badge`, `hero.intro`, KampagnenKarussell (5 Karten), ZweiWelten, ThemenTabs (5 Tabs), EmpfehlungenGrid (4 Karten), `casesTeaser`, `outcomes.intro` |
| „ohne / vor Gericht" | **8×** | Metadata, `hero.subline`, Kampagnen Trennung, ZweiWelten Business, Empfehlungen Trennung + Geschäft, `mission.statement`, QuickCheck |
| „vertraulich" | **7×** | `hero.subline`, `hero.badgeVertraulich`, `stats[3]`, `processSteps[0]`, `ctaText`, `trustText`, LogbuchSection |
| „ab 49 €" | **4×**, nie erklärt | `stats[2]`, Kampagnen Nachbarschaft, ZweiWelten Privat, ErsteHilfeBox-FAQ |
| „Harvard" | **4×** | `bekanntAusTags`, `processText`, `processSteps[1]`, Service-Schema |
| Nummerierte 3-Schritte-Liste | **2×** | ErsteHilfeBox („So starten Sie Ihre Mediation") und Process-Section („In 6 klaren Schritten") — beide 3 Kästen, beide mit Nummernkreis |
| Dieselben vier Fotos | **2×** | ThemenTabs und EmpfehlungenGrid laden `medi_trennung/nachbarn/Erbe/buiness.jpg` beide |

Drei strukturelle Befunde daraus:

1. **KampagnenKarussell → ThemenTabs → EmpfehlungenGrid** sind dreimal derselbe Inhalt in drei
   Darstellungsformen (Karussell, Tabs, Grid), zwei davon mit identischen Bildern. Zwischen
   ihnen liegen nur `ErsteHilfeBox`, das Methoden-Band und `ZweiWelten`.
2. **Wörtlich doppelt:** „…die danach noch tragen muss." steht in `zweiWelten.privat.text`
   *und* `zweiWelten.business.text`.
3. **Zahlen-Widerspruch:** Die Landing sagt „6 Schritte" (`stats`), „In 6 klaren Schritten"
   (`processTitle`) und „Sechs strukturierte Phasen" (`processSteps[1]`) — gerendert werden
   drei. Der Rest der Seite (alle Ratgeber, alle vier Konfliktseiten, `hero.intro`,
   `zweiWelten.business`) sagt konsequent **fünf Phasen**. Das gehört so oder so auf 5
   vereinheitlicht.

---

## Teil 1: Das Kostenargument

Heute steht auf der Landing viermal die Zahl 49 € und einmal „statt tausenden an
Anwaltskosten" — aber nie, **warum** es 49 € sein können. Ohne diese Begründung liest sich
die Seite wie „Mediation, aber per Zoom", und dann ist der günstige Preis eher ein
Qualitätsverdacht als ein Argument.

Das eigentliche Argument, das nirgends steht:

> Klassische Mediation kostet Stundensätze, weil jede Sitzung neu moderiert, protokolliert
> und terminiert werden muss. Wir haben nicht den Termin digitalisiert, sondern den
> Einigungsprozess standardisiert: Themensammlung, Interessen, Optionen, Vereinbarung
> laufen als geführte Schritte im System — asynchron, dokumentiert, für alle Seiten gleich.
> Was ein Mediator sonst in jeder Sitzung aufbaut, steht hier schon. Deshalb Festpreis
> statt Stundensatz.

Belegbar aus dem Produkt (nichts davon muss erfunden werden): Workflow Manager mit
konfigurierbaren Schritten und Blöcken, Schritt-Sperren, Abgleich mit Gewichtung/Logrolling,
automatisch erzeugte Vereinbarung, Kostenrechner mit §-Bezug. **Ein Marktpreis-Vergleichswert
(z. B. „150–250 €/Std.") fehlt mir — den bräuchte ich mit Quelle, bevor er auf die Seite geht.**
Unten ist er als `[[Beleg]]` markiert.

---

## Teil 2: Vorher / Nachher je Stelle

### 1. Hero — `messages/de.json` → `home.hero`

**Vorher**

> **badge:** Digitale Mediation für Trennung, Nachbarschaft, Wohnen und Wirtschaft
> **subline:** Online-Mediation – fair, vertraulich, ohne Gericht.
> **intro:** Wenn Worte nicht mehr weiterhelfen, hilft Struktur: ein klarer Weg in fünf Phasen, erfahrene Mediatorinnen und Mediatoren an Ihrer Seite – bei Trennung, Nachbarschaft, Erbe und Wirtschaftskonflikten.

*Badge und Intro zählen dieselben vier Typen auf; das Karussell direkt darunter tut es zum
dritten Mal. „fair, vertraulich, ohne Gericht" kommt weiter unten noch fünfmal.*

**Nachher**

> **badge:** Festpreis statt Stundensatz · ab 49 € pro Partei
> **subline:** Wir haben den Einigungsprozess standardisiert — nicht nur den Termin ins Netz verlegt.
> **intro:** Wenn Worte nicht mehr weiterhelfen, hilft Struktur. Die fünf Phasen einer Mediation laufen bei uns als geführter Prozess: Sie arbeiten sie in Ihrem Tempo durch, ein Mediator greift dort ein, wo es ihn wirklich braucht. Deshalb steht am Anfang ein Preis — und keine Zeiterfassung.

*Die Typen-Aufzählung entfällt hier komplett; sie kommt zwei Bildschirmseiten weiter im
Karussell ohnehin mit Bild und Link.*

---

### 2. Kennzahlen-Leiste — `home.stats`

**Vorher**

| | |
|---|---|
| 6 Schritte | strukturierter Prozess |
| < 4 Monate | typische Dauer |
| ab €49 | statt tausenden an Anwaltskosten |
| 100 % | vertraulich & DSGVO-konform |

*„6 Schritte" widerspricht dem Rest der Seite. Kachel 4 wiederholt exakt das Band, das 40 px
tiefer „DSGVO-konform" und „SSL-verschlüsselt" nochmal zeigt.*

**Nachher**

| | |
|---|---|
| Festpreis | kein Stundensatz, keine Nachberechnung |
| 5 Phasen | standardisiert, nicht pro Fall improvisiert |
| ab 49 € | pro Partei — Vereinbarung inklusive |
| < 4 Monate | statt 1–3 Jahren Verfahrensdauer `[[Beleg]]` |

---

### 3. Drei Blöcke → zwei — `app/[locale]/page.tsx`

**Vorher:** `KampagnenKarussell` → `ErsteHilfeBox` → Methoden-Band → `ZweiWelten` →
`ThemenTabs` → `EmpfehlungenGrid` → `QuickCheck`

**Nachher:** `EmpfehlungenGrid` von der Landing nehmen (bleibt auf `/konflikte`, wo es
hingehört). ThemenTabs ist die reichere Variante — gleiche Fotos, gleiche Content-Quellen,
plus Feature-Karten. Spart rund einen Bildschirm reiner Wiederholung und vier doppelt
geladene Bilder.

*Alternative, falls das Grid bleiben soll: dann Karussell streichen — aber nicht beide behalten.*

---

### 4. Zwei Welten — `home.zweiWelten`

**Vorher**

> **privat:** …und zermürbt die Beziehung, **die danach noch tragen muss**. Struktur statt Eskalation – ab 49 € pro Partei.
> **business:** …und beschädigt die Geschäftsbeziehung, **die danach noch tragen muss**. Ein Gerichtsverfahren dauert Jahre – unser Weg fünf Phasen.

**Nachher**

> **privat:** Trennung, Erbe, Nachbarschaft: Der Streit sitzt jeden Abend mit am Tisch und zermürbt die Beziehung, die danach noch tragen muss. Sie zahlen 49 € pro Partei — einmal, nicht pro Stunde.
> **business:** Gesellschafterstreit, Teamkonflikte, B2B: Der Streit blockiert Entscheidungen und bindet Führungszeit. Derselbe standardisierte Prozess, nur mit Vertraulichkeitsstufen, Mandantentrennung und Firmen-Abo.

*Die wiederholte Halbzeile bleibt einmal stehen (privat), wo sie stärker wirkt.*

---

### 5. Process-Section — `home.process*` (die neue Kostenstelle)

**Vorher**

> **eyebrow:** So funktioniert es
> **title:** In 6 klaren Schritten zur möglichen Einigung.
> **text:** Geführt statt allein gelassen, nach dem Harvard-Prinzip – fair für alle Seiten.

*Dritte „So funktioniert es"-Überschrift der Seite (nach ErsteHilfeBox „In 3 Schritten
starten" und `hero.ctaSecondary`). „Harvard" zum dritten Mal.*

**Nachher**

> **eyebrow:** Warum es so wenig kostet
> **title:** Wir haben nicht den Termin digitalisiert, sondern die Einigung.
> **text:** Die meisten Anbieter verlegen die Sitzung ins Video und rechnen weiter nach Stunden ab. Bei uns läuft der Prozess dahinter im System: Themensammlung, Interessen, Optionen und Vereinbarung sind feste, geführte Schritte — asynchron, dokumentiert, für beide Seiten identisch. Was ein Mediator sonst in jeder Sitzung neu aufbaut, steht hier schon. Menschliche Begleitung kommt dazu, wo sie den Unterschied macht — nicht für Terminfindung und Protokoll.

**processSteps — vorher**

1. **Konflikt schildern** — Sie beschreiben die Situation aus Ihrer Sicht – vertraulich und in Ihrem Tempo. Die Gegenseite wird fair eingeladen.
2. **Geführter Prozess** — Sechs strukturierte Phasen nach dem Harvard-Prinzip: von der Themensammlung über Interessen bis zu fairen Optionen.
3. **Verbindliche Vereinbarung** — Am Ende steht eine konkrete Vereinbarung: wer macht was bis wann – festgehalten und von beiden Seiten bestätigt.

*Schritt 1 wiederholt fast wörtlich die ErsteHilfeBox-Timeline weiter oben.*

**processSteps — nachher** (auf den Kostenhebel gedreht statt auf den Ablauf, den die
ErsteHilfeBox schon erklärt hat)

1. **Standardisiert, nicht improvisiert** — Jeder Fall durchläuft dieselben fünf Phasen mit denselben Schritten. Kein Vorgespräch, in dem erst der Ablauf verhandelt wird.
2. **Asynchron statt im Stundentakt** — Beide Seiten arbeiten, wenn es passt. Kein gemeinsamer Terminkalender, keine bezahlte Wartezeit, keine Reisekosten.
3. **Das Ergebnis entsteht mit** — Antworten, Optionen und Zusagen stehen am Ende als Vereinbarung da — statt nachträglich für Geld ausformuliert zu werden.

---

### 6. Kleinigkeiten mit Wiederholungs-Effekt

| Stelle | Vorher | Nachher |
|---|---|---|
| `home.mission.text` | „…klare Phasen, faire Regeln, menschliche Begleitung" | „…dieselbe Struktur für jeden Fall, egal wie ungleich die Seiten sind" *(„Phasen/Struktur" steht sonst 6× auf der Seite)* |
| `home.ctaDisclaimer` | „Keine Kreditkarte erforderlich · Kostenloser Einstieg · Jederzeit kündbar" | „Fall anlegen ist kostenlos · Preis steht vor dem ersten Schritt fest · Keine Stundenabrechnung" |
| ErsteHilfeBox-Eyebrow | „In 3 Schritten starten" + h2 „So starten Sie Ihre Mediation" | Eyebrow raus — der h2 sagt dasselbe zweimal |
| `bekanntAusTags` | Harvard-Methode · DSGVO-konform · Made in Germany · SSL-verschlüsselt | unverändert lassen, dafür „Harvard" aus `processText` und `processSteps[1]` streichen |

---

## Nachtrag: „wegweisende Intelligenz"

Achtung, das kollidiert mit einer bewussten Entscheidung: beim Palantir-Umbau am 25.07. ist
der KI-Fokus **absichtlich** aus dem Hero geflogen („Jeder Konflikt hat einen Ausgang",
Haltung statt Feature). Wer im Streit steckt, will nicht von einem Algorithmus beurteilt
werden — „Intelligenz" als Versprechen kann auf der Landing kippen.

Was aber gut zusammenpasst: Intelligenz nicht als *Feature*, sondern als **Begründung für
den Preis**. Nicht „unsere KI löst Ihren Konflikt", sondern „die Arbeit, die den Stundensatz
teuer macht, macht das System".

**Variante A — Intelligenz als Kostenargument** (mein Vorschlag, ersetzt Abschnitt 5 oben)

> **eyebrow:** Warum es so wenig kostet
> **title:** Die Struktur denkt mit. Der Mediator entscheidet.
> **text:** Themen sortieren, Positionen von Interessen trennen, Optionen gegeneinander abwägen, den Abgleich beider Seiten sichtbar machen — das ist die Arbeit, die eine Mediation teuer macht. Bei uns leistet sie der Prozess: geführte Schritte, gewichteter Abgleich, automatische Vereinbarung. Menschliche Mediation bleibt da, wo Urteilsvermögen zählt — nicht bei der Protokollführung.

**Variante B — als Hero-Badge, deutlich zurückhaltender**

> **badge:** Wegweisende Struktur statt Stundensatz · ab 49 € pro Partei

**Was ich nicht schreiben würde:** „wegweisende Intelligenz" als Hero-Headline. Das ist eine
Selbstbeschreibung ohne Beleg und nimmt dem konkreten „ab 49 €, Festpreis" den Platz.

---

## Offene Punkte für dich

1. **`[[Beleg]]`-Stellen:** Marktpreis pro Stunde und typische Verfahrensdauer — mit Quelle,
   sonst rausschneiden. Ich habe bewusst nichts geschätzt.
2. **Karussell oder Grid?** Einer der beiden fliegt. Meine Empfehlung: Grid, weil ThemenTabs
   dieselben Bilder und mehr Inhalt hat.
3. **5 oder 6 Phasen?** Der ganze Rest des Sites sagt 5. Ich würde die Landing angleichen —
   oder, falls das Produkt inzwischen wirklich 6 Schritte hat, muss der Rest nach.
