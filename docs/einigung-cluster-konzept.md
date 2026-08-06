# Konzept: das `/einigung`-Cluster

Vier neue Seiten plus Entschlackung von `/methode`. Landing behält den Palantir-Ton;
das Intelligenz- und Standardisierungsargument bekommt eigenen Platz, statt die
Startseite zu überladen.

**Grundregel für alle vier Seiten:** Es wird beschrieben, *was das System tut* —
versachlichen, sortieren, gewichten, gegenrechnen, festhalten. Das Wort „KI" fällt
nur, wo es sachlich nötig ist (Transparenz, Datenschutz, Grenzen). Kein „wegweisende
Intelligenz" als Adjektiv. Die Intelligenz muss aus dem Mechanismus hervorgehen,
nicht aus der Selbstbeschreibung — sonst ist es genau die Behauptung, die der
Palantir-Umbau am 25.07. bewusst rausgeworfen hat.

**Leitsatz des Clusters:**

> Einigung ist kein Zufall. Sie ist konstruierbar.

---

## Warum überhaupt neue Seiten

`/methode` hat 876 Zeilen und macht fünf Jobs gleichzeitig: Ablauf, Phasen, Harvard,
KI-Rollen, Methodenvarianten, Rollen des Mediators. Das stärkste Material des Produkts —
der gewichtete Abgleich — steht dort in einem Nebensatz, und die ehrliche Frage
„wie weit komme ich ohne Mediator?" wird nirgends direkt beantwortet, obwohl sie
die meistgestellte ist.

Vier Seiten mit je einem Job schlagen eine Seite mit fünfen: für Leser, für Google
und für die interne Verlinkung.

---

## Seitenarchitektur

```
/einigung                      Parent — der Prozess als System
├── /einigung/ohne-mediator    Wie weit die Struktur allein trägt (+ wo nicht)
├── /einigung/abgleich         Der gewichtete Abgleich — der Alleinstellungspunkt
└── /einigung/gleichbehandlung Warum „ohne Mediator" trotzdem fair ist
```

Alle vier auf `MarketingPageTemplate` (`breadcrumbs`, `deepDive`, `faqs`,
`kostenrechnerArt`, `relatedCases` sind schon da). Kein neues Layout nötig.

---

## 1 — `/einigung` (Parent)

**Job:** Den Einigungsprozess als Produkt behaupten, nicht als Terminfolge. Hier
sitzt das Preisargument.

| Feld | Text |
|---|---|
| eyebrow | Der Einigungsprozess |
| title | Einigung ist kein Zufall. |
| titleHighlight | Sie ist konstruierbar. |
| intro | Eine Mediation kostet Stundensätze, weil jede Sitzung neu aufgebaut wird: Themen sortieren, Positionen von Interessen trennen, Optionen entwickeln, Ergebnisse festhalten. Bei medipact ist das kein Handwerk pro Termin, sondern ein Prozess, der für jeden Fall gleich läuft. Deshalb steht der Preis fest, bevor der erste Schritt getan ist. |

**Abschnitte**

1. **Was der Prozess übernimmt** (`features`, 5 Karten = die fünf Phasen, aber als
   Fähigkeiten formuliert, nicht als Termine):
   - *Themen ordnen* — Aus zwei Schilderungen wird eine gemeinsame Themenliste. Beide
     Seiten sehen dieselbe Liste, keine Seite bestimmt die Reihenfolge.
   - *Vorwürfe in Anliegen übersetzen* — Formulierungen werden versachlicht, bevor sie
     die Gegenseite erreichen. Der Inhalt bleibt, der Angriff nicht.
   - *Positionen von Interessen trennen* — Gezielte Fragen führen vom „Was fordere ich?"
     zum „Worum geht es mir dabei?". Das ist der Schritt, an dem Verhandlungen sonst
     scheitern.
   - *Optionen gegenrechnen* — Beide gewichten, was ihnen wichtig ist. Daraus entsteht ein
     Vorschlag, nicht aus dem Bauchgefühl eines Dritten. → `/einigung/abgleich`
   - *Vereinbarung mitschreiben* — Wer macht was bis wann steht am Ende da, weil es
     unterwegs entstanden ist — nicht, weil es jemand nachträglich aufsetzt.

2. **Der Preisabsatz** (`deepDive`) — Titel: *Warum das den Preis verändert.*
   Kernsatz: „Die meisten Anbieter verlegen die Sitzung ins Video und rechnen weiter
   nach Stunden ab. Wir haben den Prozess dahinter standardisiert. Was ein Mediator
   sonst in jeder Sitzung neu aufbaut, steht hier schon." Verlinkt `/kostenrechner`
   und `/preise`. `kostenrechnerArt` setzen.

3. **Wo der Mensch bleibt** — kurzer Absatz mit Link auf `/einigung/ohne-mediator`.
   Bewusst *auf* der Parent-Seite, damit niemand die Seite verlässt mit dem Eindruck,
   hier werde ein Automat verkauft.

4. **FAQ** — „Ersetzt das einen Mediator?", „Was passiert, wenn wir uns nicht einigen?",
   „Ist das Ergebnis bindend?" (letzteres darf die Antwort aus `ErsteHilfeBox`
   wiederverwenden — es ist die einzige Wiederholung, die ich behalten würde).

---

## 2 — `/einigung/ohne-mediator`

**Job:** Die Grenze ziehen. Genau dadurch wird der Anspruch glaubwürdig.
**Nebeneffekt:** stärkstes Longtail-Potenzial des Clusters — „Streit klären ohne Anwalt",
„Mediation ohne Mediator", „Konflikt online lösen selbst".

| Feld | Text |
|---|---|
| eyebrow | Grenzen und Reichweite |
| title | Wie weit kommt man ohne Mediator? |
| intro | Weiter, als die meisten denken — und nicht so weit, wie manche versprechen. Beides gehört auf dieselbe Seite. |

**Zwei Spalten (`comparisonPlans` oder eine Vergleichstabelle):**

*Das trägt die Struktur allein*
- Den Konflikt schildern, ohne dass jemand danebensitzt
- Die Gegenseite neutral einladen — ohne dass Sie die Nachricht formulieren müssen
- Themen sammeln und sortieren
- Versachlichung von Formulierungen in beide Richtungen
- Interessen aus Forderungen herausarbeiten
- Optionen gewichten und gegenrechnen
- Die Vereinbarung erzeugen und beidseitig bestätigen lassen

*Hier muss ein Mensch übernehmen*
- **Machtungleichgewicht** — wenn eine Seite dauerhaft nachgibt, statt zu verhandeln
- **Angst, Drohung, Gewalt** — Mediation ersetzt keinen Schutz *(deckt sich mit der
  bestehenden QuickCheck-Warnung — die kann hierher verlinken)*
- **Rechtliche Komplexität** — Verfahrenswert, Pflichtteil, Gesellschaftsverträge
- **Eskalation im Prozess** — wenn der Ton kippt oder eine Seite abbricht
- **Alles, was beurkundet werden muss** — Notar und Anwalt bleiben Notar und Anwalt

**Abschluss:** „Deshalb ist der Mediator kein Zusatzprodukt, sondern eine Stufe:
Online-Prozess, Hybrid, Vollservice." Link auf `/preise` und `/methode`.
*Achtung: Hybrid/Vollservice gibt es laut `pricing.py` nur bei Trennung — das muss
hier korrekt stehen, auf `/methode` stand es schon mal falsch.*

---

## 3 — `/einigung/abgleich`

**Job:** Der eine Mechanismus, den sonst niemand hat. Wird aktuell nirgends beworben.

| Feld | Text |
|---|---|
| eyebrow | Abgleich & Tausch |
| title | Wo sonst verhandelt wird, wird hier gerechnet. |
| intro | Am Ende jeder Mediation stehen ein paar Punkte, bei denen beide Seiten etwas anderes wollen. Üblicherweise entscheidet dort, wer besser verhandelt, länger durchhält oder den besseren Anwalt hat. Bei uns entscheidet, wem was wirklich wichtig ist. |

**Der Mechanismus in vier Schritten** (`process`) — alles aus `AbgleichBlock.tsx`,
nichts erfunden:

1. **Strittige Punkte stehen fest.** Was beide schon geklärt haben, kommt gar nicht erst
   in den Abgleich.
2. **Jede Seite gewichtet für sich — mit begrenztem Kontingent.** Sie können nicht alles
   für unverzichtbar erklären. Das ist Absicht: wäre alles unverzichtbar, gäbe es nichts
   zu tauschen und der Abgleich liefe leer.
3. **Die Gewichtung der Gegenseite bleibt verborgen, bis beide fertig sind.** Sonst würde
   sich die zweite Seite an der ersten orientieren, und die Zahlen wären wertlos.
4. **Aus beiden Gewichtungen entsteht ein Vorschlag.** Klare Gewichtungen entscheiden.
   Wo beide gleich stark ziehen, wird getauscht: Sie bekommen den Punkt, der Ihnen
   wichtiger ist, die andere Seite den, der ihr wichtiger ist.

**Der Vertrauens-Absatz** (`deepDive`): *Zustimmung, die nicht nachträglich verrutscht.*
„Die Zustimmung zum Vorschlag hängt an den strittigen Punkten **und** an allen
Gewichtungen. Ändert jemand hinterher seine Gewichtung, passt die Zustimmung nicht mehr
und muss erneuert werden. Niemand kann einer Rechnung zustimmen und danach die Zahlen
tauschen."

**Visual:** Hier gehört eine Grafik oder ein echter Screenshot hin — zwei Gewichtungs-
spalten und der daraus entstehende Vorschlag. Das ist die Seite, auf der ein Bild
mehr überzeugt als jeder Absatz. *(Habe ich noch nicht — sag Bescheid, ob Screenshot
aus dem Produkt oder gezeichnetes Diagramm.)*

---

## 4 — `/einigung/gleichbehandlung`

**Job:** Ohne diese Seite liest sich „ohne Mediator" als „ohne Schutz". Sie macht die
anderen drei zumutbar.

| Feld | Text |
|---|---|
| eyebrow | Fairness by design |
| title | Neutralität, die nicht von Tagesform abhängt. |
| intro | Ein Mediator ist neutral, weil er sich darum bemüht. Ein Prozess ist neutral, weil er für beide Seiten derselbe ist. |

**Vier Punkte:**

- **Identische Schritte für beide Seiten.** Niemand bekommt eine andere Reihenfolge,
  andere Fragen oder mehr Zeit.
- **Vertrauliches bleibt vertraulich.** Was Sie als private Notiz eingeben, sieht die
  Gegenseite nicht — auch nicht als Zusammenfassung. *(Deckt sich mit der
  Sichtbarkeits-Logik im Produkt.)*
- **Keiner sieht die Karten des anderen zu früh.** Gewichtungen und Antworten werden
  erst freigegeben, wenn beide geliefert haben.
- **Alles nachlesbar.** Jeder Schritt, jede Zusage, jede Änderung steht dokumentiert da.
  Kein „das haben Sie damals aber anders gesagt".

**Ein Absatz zur KI — hier und nur hier explizit:** was zusammengefasst wird, was nicht
gespeichert wird, dass Vorschläge Vorschläge sind und die Entscheidung immer bei den
Parteien liegt. Verlinkt `/datenschutz`.

---

## Was mit `/methode` passiert

| Bleibt auf `/methode` | Zieht um |
|---|---|
| Ablauf in Schritten, konkret und chronologisch | KI-Rollen-Abschnitt → `/einigung` + `/einigung/gleichbehandlung` |
| Die Phasen im Detail | „Rollen von KI und Mediator" → `/einigung/ohne-mediator` |
| Harvard-Prinzip (**einzige** Stelle im Site, aktuell 4×) | — |
| Die vier Methodenvarianten | — |
| Hybrid/Vollservice (nur Trennung!) | — |

Metadata von `/methode` muss mit — der aktuelle Title verspricht „die Rollen von KI und
Mediator", die dann woanders stehen.

---

## Verlinkung, damit das Cluster nicht abseits liegt

- **Landing:** Die neue Process-Section aus dem Vorher/Nachher-Dokument verlinkt auf
  `/einigung` statt auf `/methode`.
- **Header-Dropdown:** `/einigung` neben `/methode`.
- **Alle vier `/konflikte/*`-Seiten:** ein Verweis auf `/einigung/abgleich` im
  Prozessabschnitt.
- **`/preise` und `/kostenrechner`:** „Warum das so wenig kostet" → `/einigung`.
  Das ist der Einwand, der genau dort entsteht.
- **Ratgeber:** die fünf Artikel, die schon auf `/methode` zeigen, bekommen zusätzlich
  den passenden Cluster-Link.
- **`sitemap.ts`** und Breadcrumbs für alle vier.

---

## Offene Punkte

1. **URL:** `/einigung` oder `/einigungsprozess`? Kürzer ist besser, aber
   `/einigungsprozess` trifft die Suchsprache genauer. Deine Entscheidung — beim
   Ratgeber-Umzug am 31.07. hat Suchsprache gewonnen.
2. **Visual für `/einigung/abgleich`:** Produktscreenshot oder Diagramm?
3. **Marktpreis-Beleg** (Stundensatz klassischer Mediation) — offen aus dem
   Vorher/Nachher-Dokument, wird auf `/einigung` genauso gebraucht.
4. **Reihenfolge der Umsetzung:** Ich würde mit `/einigung/abgleich` anfangen. Die Seite
   ist inhaltlich fertig im Kopf, braucht keine externen Belege und ist das stärkste
   Argument.
