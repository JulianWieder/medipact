# GSC-Auswertung 14.10.2026

Export 12.07.–11.10.2026, Suchtyp Web, **nicht auf Deutschland gefiltert** (Filter.csv: nur Suchtyp + Datum).
Gesamt: **2.396 Impressionen, 24 Klicks** (Deutschland: 1.853 / 23 / Pos 47,1).
Vorläufer: `gsc-analyse-2026-09-11.md` (1.709 / 16 / 56,6).

## 1. Trend: 30 gegen 30 Tage

| Fenster | Impr | Klicks | Ø-Pos (gewichtet) |
|---|---|---|---|
| 12.08.–10.09. | 1.021 | 10 | 60,4 |
| 11.09.–11.10. | 772 | 11 | **37,5** |

Weniger Reichweite, gleiche Klicks, deutlich bessere Position. Die Klick-Flaute vom 01.–12.09. ist vorbei: seit 13.09. 11 Klicks.
Vorsicht: Länderfilter fehlt, ein Teil des Positionssprungs kann weggefallene Auslands-Impressionen sein.

Muster wiederholt sich: 21.–30.09. Tagesposition 17–32, 4 Klicks am 28./29.09.; ab 01.10. steigen die Impressionen (bis 51/Tag), die Position faellt zurueck auf 37–50. Google testet breiter aus, sobald es eine Seite hochstuft. Kein Trend, bis das zweimal haelt.

## 2. Die Mittelklasse entsteht

Seiten mit Pos <= 20 UND >= 20 Impr: am 11.09. **drei**, jetzt **sechs**:

| Seite | Impr | Klicks | CTR | Pos |
|---|---|---|---|---|
| /ratgeber/schwelender-konflikt | 160 | 2 | 1,25 % | 7,7 |
| /ratgeber/sorgerecht-verloren-was-tun | 53 | 1 | 1,9 % | 6,1 |
| /ratgeber/5-phasen-der-mediation | 53 | 1 | 1,9 % | 7,4 |
| /ratgeber/scheidung-mediator-kosten | 51 | 1 | 2,0 % | 9,7 |
| /konflikt-logbuch | 50 | 3 | 6,0 % | 6,3 |
| / (Startseite, v. a. Marke) | 30 | 5 | 16,7 % | 13,2 |

Ohne Startseite: 367 Impr / 8 Klicks = 2,2 % auf Pos 6–10. Normal waeren 3–5 %.

## 3. Snippet-Fall schwelender-konflikt ist der groesste Einzelhebel

Impressionen 39 -> 160, Query `schwelender konflikt` 32 Impr / Pos 5,4 / **0 Klicks**, `schwelender konflikt bedeutung` 9 / Pos 2,6 / 0.
Title/Description wurden am 07.09. umgestellt ("Warnsignale erkennen" + Logbuch). Hat nicht gezogen.
Die Suchenden wollen eine **Definition** ("bedeutung"), der Snippet verspricht ein Werkzeug. Vorschlag: Title mit der Antwort beginnen ("Schwelender Konflikt: Bedeutung, Anzeichen, was tun"), Description beginnt mit einer Ein-Satz-Definition.

## 4. Kostenrechner: kein Snippet-, sondern ein Rangproblem mehr

11.09.: 30 Impr / Pos 19,1. Jetzt: **92 Impr / Pos 46,8 / 0 Klicks** — wieder breiter ausgespielt, Rang verloren.
Zusaetzlich `/kostenrechner?art=verbraucher` 15 Impr / Pos 73 als eigene URL in GSC, obwohl Canonical auf /kostenrechner zeigt. Beobachten, nicht handeln.
Kosten-Queries weiter ohne passende Seite: `was kostet eine mediation` 7 / Pos 75, `mediation kosten` 10 / 83, `mediator kosten` 5 / 63, `prozesskosten` 13 / 83.

## 5. Unveraendert offen (seit 11.09. nichts davon angefasst)

- **Nachbarschafts-Kannibalisierung verschaerft:** /konflikte/nachbarschaft 161 -> **232 Impr, Pos 77,7**; Ratgeber 44 / 44,0; www-Fassung 17 / 28,0. `nachbarschaftsstreit` 134 Impr / Pos 86,6.
- **konfliktarten:** /konflikte 342 Impr / Pos 58,8; Query `konfliktarten` 154 / 63,3 (+ ~50 Impr auf Varianten). Der groesste Einzel-Query-Block der Site.
- **Erbschaft:** /konflikte/erbschaft 125 -> 205 Impr, Pos 65. Dazu ein Dutzend Erbengemeinschafts-Queries auf Pos 63–98. Bestes Erb-Asset ist `/ratgeber/erbstreit-loesen-ohne-gericht` (22 / 21,1) und `/cases/erbstreit-haus-geschwister` (16 / 10,3).
- **"einer will verkaufen":** `haus-bei-scheidung` Pos 97,4, `trennung haus verkaufen` 10 / 97, `erbengemeinschaft grundstueck einer will nicht verkaufen` 10 / 86. Fuenfter Export in Folge.
- **Scheidungsvertrag:** `scheidungsvertrag` 13 / 76, `scheidungsvertrag notar` 9 / 94; Seite scheidungsfolgenvereinbarung 101 / 83,3.
- **/konflikte/odr ist jetzt indexiert** (24 / 85,8) — Punkt 5 vom 11.09. erledigt sich, Rang aber schwach. /konflikte/geschaeft (308) liefert noch 25 Impr.
- **www:** 6 URLs / 49 Impr — Fenster beginnt 12.07., enthaelt also noch 5 Wochen vor dem 301. Weiter nicht entscheidbar.

## 6. Klicks

24 Klicks, davon 5 ueber `medipact` (Marke). Query-Tabelle deckt nur 6 Klicks ab, 18 sind anonymisierter Longtail. Nicht-Marken-Klicks ~19 in 3 Monaten.
`medipact.co.kr` 17 Impr — Verwechslung mit koreanischer Marke, ignorieren.

## Prioritaet

1. schwelender-konflikt: Title/Description auf Definitions-Intent (10 Minuten, groesster Hebel).
2. Nachbarschafts-Cluster entwirren — /konflikte/nachbarschaft auf "Nachbarschaftsmediation" schaerfen, Ratgeber als Antwort auf "nachbarschaftsstreit was tun".
3. Kostenantwort-Seite "Was kostet eine Mediation" (Ratgeber mediation-kosten steht auf 30,3 / 41 Impr — dort ausbauen statt neu bauen).
4. Artikel "einer will verkaufen, der andere nicht".
5. konfliktarten auslagern.

Naechster Messpunkt: Export um den 11.11., **in GSC auf Land = Deutschland filtern**.
