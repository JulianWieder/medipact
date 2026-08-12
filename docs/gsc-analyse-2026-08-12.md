# GSC-Analyse, Stand 12.08.2026

Datenbasis: Search-Console-Export vom 12.08.2026, Zeitraum 3 Monate (12.05.–11.08.).
159 Suchanfragen mit 481 Impressionen ausgewiesen, 685 Impressionen gesamt
(Differenz = anonymisierte Queries). 6 Klicks, Ø-Position 51,1.

Die 47 Zeilen aus der Bildschirmansicht waren die 7-Tage-Sicht; der Export über
3 Monate enthält 159 Queries. Diese Analyse arbeitet mit dem Export.

---

## Vorbemerkung zur Belastbarkeit

685 Impressionen in drei Monaten sind wenig, und die Impressionen setzen laut
Diagramm erst ab dem 03.07. ein — die Seite ist rund sechs Wochen im Index.

Konkret heißt das: Jede Position, die auf 1–3 Impressionen beruht, ist keine
Messung, sondern ein Zufallstreffer. Von den 159 Queries haben **87 genau eine
Impression**. Wer darauf optimiert, optimiert auf Rauschen.

Belastbar sind in diesem Export nur die Cluster-Summen und die etwa 15 Queries
mit ≥ 5 Impressionen.

---

## 1. Die Seite existiert zweimal (verifiziert, höchste Priorität)

Im Seiten-Export stehen **sieben URLs unter `www.medipact.de`** mit zusammen
51 Impressionen. Bei vier davon existiert dieselbe Seite parallel unter
`medipact.de`:

| Seite | non-www | www |
|---|---|---|
| /ratgeber/nachbarschaftsstreit-mediation | 28 Impr, Pos 52,1 | 17 Impr, **Pos 28,0** |
| /ratgeber/scheidung-mediator-kosten | 11 Impr, **Pos 17,9** | 7 Impr, Pos 40,3 |
| /ratgeber/was-steht-mir-bei-der-scheidung-zu | 2 Impr, Pos 42,0 | 3 Impr, **Pos 29,7** |
| /ratgeber/sorgerecht-umgang-mediation | 4 Impr, Pos 41,3 | 2 Impr, **Pos 25,0** |

Drei weitere ranken **ausschließlich** unter www, unter non-www taucht die
Seite gar nicht auf: `/ratgeber/was-ist-mediation` (17 Impr, Pos 90,2),
`/ratgeber/sorgerecht-und-umgangsrecht` (3 Impr, Pos 76,7) und
`/cases/peter-sarah` (2 Impr, Pos 2,5).

Nachgeprüft: `https://www.medipact.de/ratgeber/nachbarschaftsstreit-was-tun`
liefert **200 OK, keine Weiterleitung**. Das Canonical auf der Seite zeigt
korrekt auf die non-www-Variante — aber ein Canonical ist ein Hinweis, keine
Anweisung, und die Zahlen oben zeigen, dass Google ihn hier nicht durchgängig
befolgt.

Verschärfend: Auf der www-Auslieferung zeigen **sämtliche internen Links
ebenfalls auf www**. Ein Crawler, der einmal über www hereinkommt, verlässt
diese Variante nie wieder. Es ist also keine Handvoll Streu-URLs, sondern eine
vollständige Parallel-Site, die sich dieselben Rankings mit dem Original teilt.

Beleg dafür, dass es Ranking kostet: Bei `nachbarschaftsstreit-mediation` steht
die www-Variante auf Position 28, die non-www auf 52 — für dieselbe Seite.
Zusammengeführt läge die Seite besser als beide Einzelwerte.

**Zu tun:** 301 von `www.medipact.de` auf `medipact.de` im nginx-Server-Block.
Robots, Sitemap, Canonical und `SITE_URL` in `lib/seo.ts` zeigen bereits alle
auf non-www — die Richtung ist damit vorgegeben, es fehlt nur die
serverseitige Umsetzung.

Danach in der Search Console prüfen, ob eine **Domain-Property** existiert
(`medipact.de` ohne Präfix). Eine URL-Präfix-Property auf `https://medipact.de/`
sieht die www-Daten gar nicht — dass sie hier im Export stehen, spricht dafür,
dass bereits eine Domain-Property vorliegt. Falls nicht: anlegen, sonst bleibt
ein Teil der Daten unsichtbar.

---

## 2. Was ankommt, sind Nachschlage-Suchen, keine Kaufabsichten

Cluster nach Impressionen (Queries können in mehrere Cluster fallen):

| Cluster | Queries | Impressionen | Ø-Position |
|---|---:|---:|---:|
| Was ist Mediation / Definitionen | 59 | 154 | 64,8 |
| Wirtschaft & B2B | 39 | 120 | 56,0 |
| Konfliktarten | 25 | 112 | 63,7 |
| Nachbarschaft | 12 | 70 | 58,3 |
| Erbe | 23 | 53 | 70,6 |
| Trennung & Scheidung | 17 | 39 | 75,0 |
| Kosten | 15 | 29 | 60,9 |

Zwei Drittel der Sichtbarkeit entfallen auf Definitionsfragen und
Konfliktarten-Systematik: `konfliktarten` (55), `beziehungskonflikt beispiel`
(17), `mediator übersetzung`, `mediator auf deutsch`, `mediatoren definition`,
`was macht ein mediator`, `mediationsphasen`. Das sind Studierende, Azubis,
HR-Fortbildung — Menschen, die einen Begriff nachschlagen, nicht Menschen mit
einem laufenden Streit.

Das Geräte-Bild stützt das: **Computer 518 Impressionen, Mobil 159.**
Für ein Angebot, das Menschen in Trennungs- und Nachbarschaftskonflikten
adressiert, ist dieses Verhältnis auffällig — private Notlagen werden
überwiegend mobil gesucht.

Gegenprobe beim Kernprodukt: `/konflikte/trennung` hat in drei Monaten
**6 Impressionen**. `/konflikte/nachbarschaft` hat 42, `/konflikte/erbschaft` 41,
`/konflikte/geschaeft` 27.

Google hat medipact zurzeit als Nachschlagewerk eingeordnet, nicht als Anbieter.

---

## 3. /konflikte braucht keinen Inhalt, sondern Links

`/konflikte` ist mit 115 Impressionen die stärkste Einzelseite — Position 64,5,
null Klicks.

Die naheliegende Vermutung wäre eine Intent-Verfehlung: kommerzielle
Angebotsseite trifft auf informationelle Suche. Das trifft hier **nicht** zu.
Die Seite ist bereits vollständig auf „Konfliktarten" gebaut: Title und H1
tragen den Begriff wörtlich, sechs Konfliktarten mit Kernfrage, Beispiel und
Lösungsweg, dazu die neun Eskalationsstufen nach Glasl und ein FAQ-Schema mit
fünf Fragen.

Der Inhalt ist also nicht das Defizit. Position 64 bei sauberer On-Page-Arbeit
heißt: Es fehlt Domain-Autorität, und der Wettbewerb um `konfliktarten` besteht
aus Hochschul-, Lehr- und HR-Portalen mit jahrelanger Linkhistorie.

**Zur Entscheidung, nicht als Empfehlung:** Diese Query ist gleichzeitig die
schwerste im gesamten Set und die mit der geringsten Kaufabsicht. Weitere
Arbeit an `/konflikte` lohnt sich, wenn die Seite als Autoritäts-Hub dienen
soll, der intern auf die Angebotsseiten vererbt. Als Traffic-Quelle für
zahlende Nutzer wird sie auch auf Position 5 wenig liefern.

Randnotiz: Es kommen Suchen nach `7 konfliktarten` und `4 konfliktarten` an,
die Seite sagt 6. Das ist normal und kein Fehler — die Konfliktforschung ist
sich da nicht einig.

---

## 4. Wo tatsächlich Kaufabsicht sichtbar ist

Queries mit erkennbarem Anliegen und Position < 40 — die einzige Gruppe, bei
der überschaubarer Aufwand in absehbarer Zeit Klicks erzeugen kann:

| Query | Impr | Position |
|---|---:|---:|
| scheidungsmediation kosten | 2 | **5,5** |
| schwelender konflikt | 2 | **6,0** |
| mediation arbeitsplatz | 3 | 18,7 |
| mediation bei gesellschafterkonflikten | 1 | 20,0 |
| wirtschaftsmediation bei unternehmenskonflikten | 2 | 20,0 |
| wirtschafts mediation | 1 | 20,0 |
| mediation bei geschäftspartnern | 5 | 26,2 |
| erbschaftskonflikte lösen | 4 | 31,3 |
| wirtschaftsmediation unternehmen | 6 | 31,7 |
| nachbarschaftskonflikte | 5 | 33,8 |
| private konflikte | 2 | 34,0 |
| mediation bei konflikten | 4 | 35,3 |

Der B2B-Block sticht heraus: 120 Impressionen im Cluster, überwiegend getragen
von einer einzigen Seite (`/ratgeber/wirtschaftsmediation`, 79 Impr, Pos 42),
und mit `mediation bei geschäftspartnern` (26,2) und `mediation bei
gesellschafterkonflikten` (20,0) sind zwei Queries dabei, hinter denen ein
zahlender Auftraggeber steht — bei ODR-Preisen von 1.200–1.900 € pro Fall.

Das ist der Cluster mit dem besten Verhältnis aus vorhandener Sichtbarkeit,
Nähe zu Seite 1 und Fallwert.

Zur Einordnung: `/konflikte/odr` hat 2 Impressionen. Die B2B-Nachfrage landet
komplett auf dem Ratgeber-Artikel, nicht auf der Angebotsseite. Die interne
Verlinkung vom Artikel auf `/konflikte/odr` ist der kürzere Hebel als neuer
Text.

---

## 5. Suchsprachen-Lücke: Haus verkaufen

| Query | Impr | Position |
|---|---:|---:|
| trennung haus verkaufen | 10 | 97,2 |
| haus verkaufen trennung | 7 | 97,9 |
| hausverkauf scheidung | 2 | 98,5 |

Zugehörige Seite: `/ratgeber/haus-bei-scheidung` — 19 Impressionen, Position 97,6.

Position 97 bei perfekter thematischer Übereinstimmung bedeutet, dass Google
die Seite kaum mit diesen Begriffen verknüpft. Das Muster ist dasselbe wie beim
Suchsprachen-Umbau vom 31.07.: Die Betroffenen suchen nach **verkaufen**, der
Artikel heißt **haus bei scheidung**.

Anders als damals reicht hier vermutlich Title, H1 und ein Abschnitt zum
Verkaufsvorgang — ein weiterer Slug-Umzug so kurz nach dem letzten wäre teurer
als der erwartbare Ertrag.

---

## 6. Geprüft und unauffällig

**Alte Slugs.** Im Export tauchen `nachbarschaftsstreit-mediation`,
`pflichtteil-mediation` und `sorgerecht-umgang-mediation` auf, obwohl die
Dateien im Repo längst anders heißen. Die 301er stehen alle in `next.config.ts`
und sind vollständig. Der Zeitraum von drei Monaten reicht schlicht hinter den
Umzug vom 31.07. zurück.

Eine Beobachtung dazu: Der alte Slug `nachbarschaftsstreit-mediation` sammelt
45 Impressionen (28 + 17 www), der neue `nachbarschaftsstreit-was-tun` nur 5.
Nach knapp zwei Wochen ist das erwartbar, sollte sich aber im September-Export
gedreht haben. Falls nicht, lohnt ein zweiter Blick auf die Weiterleitung.

Dasselbe gilt für die Case-URLs: `cases/maria-thomas` und `cases/peter-sarah`
stehen noch im Export, die 301er greifen.

**Rauschen.** Rund 25 Impressionen sind für die Auswertung wertlos:
`medipact.co.kr` (7 — ein koreanisches Unternehmen gleichen Namens),
`mediator übersetzung`, `mediator auf deutsch`, `mediator deutsch`,
`mediierende`, `scheindebatte`, `alltagssorge`, `jobs für mediatoren`,
`unternehmensnachfolge münchen bayern after:2026-07-11`.

---

## 7. Die sechs Klicks

Damit sie nicht untergehen — sie verteilen sich auf sechs verschiedene Seiten:

| Seite | Impr | Position | CTR |
|---|---:|---:|---:|
| /about | 3 | 2,3 | 33 % |
| /konflikt-logbuch | 10 | 5,4 | 10 % |
| /ratgeber/scheidung-mediator-kosten | 11 | 17,9 | 9 % |
| / | 20 | 12,4 | 5 % |
| /ratgeber/5-phasen-der-mediation | 29 | 25,7 | 3,4 % |
| /ratgeber/mediation-kosten | 33 | 41,3 | 3,0 % |

Sobald eine Seite in die Top 20 kommt, wird geklickt — teils deutlich über dem
Erwartungswert für die Position. Die Gesamt-CTR von 0,9 % ist also kein
Snippet-Problem, sondern eine Folge von Ø-Position 51. Titles und Descriptions
zu überarbeiten wäre zum jetzigen Zeitpunkt vergeudete Zeit.

`/konflikt-logbuch` auf Position 5,4 mit 10 % CTR ist die effizienteste Seite
der Site — bei einem kostenlosen Produkt allerdings auch die mit dem
niedrigsten Deckungsbeitrag.

---

## Reihenfolge

1. **www-Redirect im nginx setzen.** Einziger verifizierte technische Defekt,
   Aufwand überschaubar, betrifft die gesamte Domain.
2. **B2B-Cluster stärken.** Interne Verlinkung von `/ratgeber/wirtschaftsmediation`
   auf `/konflikte/odr`, dort die Begriffe „Gesellschafterkonflikt" und
   „Streit zwischen Geschäftspartnern" tragen. Beste Kombination aus
   vorhandener Sichtbarkeit, Nähe zu Seite 1 und Fallwert.
3. **`haus-bei-scheidung` auf Suchsprache ziehen** (Title, H1, ein Abschnitt).
4. **Entscheiden, was `/konflikte` sein soll** — Autoritäts-Hub oder
   Traffic-Quelle. Für Zweiteres ist die Query zu umkämpft und zu kaufabsichtsarm.
5. **Nichts an Titles und Descriptions.** Kommt zurück, wenn Seiten in den
   Top 20 stehen.

Realistische Einordnung zum Schluss: Der begrenzende Faktor ist zurzeit weder
Technik noch Text, sondern das Alter der Domain und die fehlende Verlinkung von
außen. Die nächste Auswertung wird erst mit dem September-Export aussagekräftig,
wenn die www-Zusammenführung eine Weile gewirkt hat.
