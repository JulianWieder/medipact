# Long-Tail-Keywordplan: Trennung, Erbe/Nachbarschaft, Arbeitsplatz/Miete

Stand: 17.08.2026. Grundlage: GSC-Export **16.05.–15.08.2026** (817 Impressionen,
7 Klicks, Ø-Position 51,4) plus SERP-Recherche.
Vorgänger: `docs/gsc-analyse-2026-08-12.md`, `docs/kaufabsicht-scheidung.md`,
`docs/ratgeber-suchsprache.md`.

---

## Vorab: die Long-Tail-These stimmt in dieser Form nicht

Die Annahme lautet: spitzere Suchanfragen sind weniger umkämpft, also klettert
die Domain dort schneller. Die eigenen Daten geben das nicht her.

| Query-Länge | Queries | Impressionen | Ø-Position (gew.) | Impr. in Top 20 |
|---|---:|---:|---:|---:|
| 1 Wort | 32 | 211 | 64,4 | 1 |
| 2 Wörter | 72 | 190 | 61,3 | 8 |
| 3–4 Wörter | 59 | 137 | 67,6 | 4 |
| 5+ Wörter | 15 | 21 | 60,2 | 0 |

Die Position ist über alle Längen hinweg praktisch flach. Das direkte Gegenbeispiel
steht im Export nebeneinander: `konfliktarten` (76 Impr., Pos 65,4) und
`welche konfliktarten gibt es` (4 Impr., Pos 69,3) — vier Wörter mehr, drei Plätze
schlechter, dieselbe Zielseite.

Der Grund ist kein Widerspruch zur Long-Tail-Logik, sondern eine Präzisierung:
**Was medipact heute an Long-Tail einsammelt, sind längere Formulierungen
desselben generischen Themas — nicht spitzere Probleme.** Eine Domain ohne
Autorität rankt für „welche konfliktarten gibt es" gegen dieselben Hochschul- und
HR-Portale wie für „konfliktarten". Länge allein entlastet nichts.

Was tatsächlich funktioniert, zeigt der einzige Ausreißer im Set:
`scheidungsmediation kosten`, **Position 5,5**. Spitz, benennbar, mit einer
Geldentscheidung dahinter — und in einer SERP, in der die großen Portale keine
eigene Seite haben.

**Auswahlkriterium für diesen Plan** ist deshalb nicht Wortzahl, sondern:

1. eine benennbare Notlage (nicht ein Oberbegriff),
2. eine Entscheidung über Geld oder ein Dokument dahinter,
3. eine SERP, die nicht flächendeckend von Kanzlei- und Vergleichsportalen besetzt ist.

Nebenbefund, der Mut macht: **619 der 817 Impressionen fallen in die letzten
30 Tage.** Die Domain ist erst seit Anfang Juli sichtbar; die Kurve dreht gerade.

---

## Vor jedem Text: die www-Dubletten sind noch live

Im neuen Export stehen weiterhin fünf `www.medipact.de`-URLs mit zusammen
46 Impressionen — darunter `ratgeber/nachbarschaftsstreit-mediation` auf
**Position 28 als www**, während dieselbe Seite als non-www auf 50,6 steht.
Der nginx-Block aus `docs/nginx-www-redirect.md` ist also noch nicht ausgerollt.

Solange das so bleibt, verteilt sich jedes neue Signal auf zwei Hostnamen. Das ist
die einzige Maßnahme in diesem Dokument, die vor der Inhaltsarbeit steht.

---

## Cluster 1 — Erbe: der dichteste Long-Tail-Nest der Domain

**24 Queries, 67 Impressionen.** Auffällig ist nicht die Menge, sondern die
Gleichförmigkeit: fast alle sind dieselbe Frage in unterschiedlichen Worten.

| Query | Impr. | Pos. |
|---|---:|---:|
| erbschaftsmediation | 14 | 59,1 |
| erbschaftsstreit | 12 | 53,7 |
| mediator erbengemeinschaft | 7 | 81,1 |
| erbschaftskonflikte lösen | 4 | **31,2** |
| mediation erbengemeinschaft | 3 | 77,7 |
| erbstreit geschwister haus | 3 | 83,7 |
| erbengemeinschaft streit schlichten ohne gericht | 3 | 85,3 |
| erbstreitigkeiten / erbstreit unter geschwistern | 4 | 63–75 |
| + 9 weitere Varianten von „erbengemeinschaft … lösen/schlichten" | 9 | 72–94 |

Das Suchmuster ist eindeutig: **Erbengemeinschaft/Erbstreit + schlichten oder
lösen + ohne Gericht.** Das ist wörtlich das Versprechen des Produkts.

**Der Bestand hat das Thema — unter dem falschen Namen.**
`erbengemeinschaft-blockade` taucht im Export mit **null Impressionen** auf.
„Blockade" tippt niemand ein; „einer blockiert" ist die Beschreibung des Problems,
nicht die Suchsprache. `erbstreit-loesen-ohne-gericht` steht auf Position 3,3 —
aber auf nur 3 Impressionen, also auf einer Query ohne Volumen.

### Vorschläge

| # | Ziel-Query | Was fehlt | Ziel-URL |
|---|---|---|---|
| E1 | `teilungsversteigerung vermeiden` / `verhindern` | neuer Artikel | `/ratgeber/teilungsversteigerung-vermeiden` |
| E2 | `erbstreit geschwister haus`, `haus in erbengemeinschaft auszahlen` | neuer Artikel | `/ratgeber/haus-in-der-erbengemeinschaft` |
| E3 | `erbengemeinschaft auflösen`, `erbauseinandersetzungsvertrag kosten` | neuer Artikel | `/ratgeber/erbengemeinschaft-aufloesen` |
| E4 | `erbengemeinschaft streit schlichten`, `konflikte in der erbengemeinschaft lösen` | Titel/H1 von `erbengemeinschaft-blockade` auf Suchsprache | Bestand |

**Warum E1 zuerst:** Die Teilungsversteigerung ist im Erbrecht der Moment, in dem
Uneinigkeit einen bezifferbaren Preis bekommt — Verkehrswertgutachten,
Gerichtskosten, und typischerweise ein Erlös unter Marktwert. Das ist dasselbe
Argument wie bei der Scheidungsfolgenvereinbarung, nur härter: Der Vollstrecker
verwertet ein Ergebnis, er verhandelt es nicht. Wer „vermeiden" oder „verhindern"
sucht, hat den Streit bereits als Kostenfaktor erkannt.

Die SERP ist von Erbrechtskanzleien und Immobilienportalen besetzt (advocado,
rosepartner, Deutsches Erbenzentrum, Homeday) — aber keiner von ihnen verkauft
die Einigung selbst. Das ist die Lücke.

**E3 ist die Erb-Entsprechung zur Scheidungsfolgenvereinbarung**: Der
Auseinandersetzungsvertrag ist das Dokument, das der medipact-Prozess inhaltlich
produziert. Die Logik aus `docs/kaufabsicht-scheidung.md` trägt hier eins zu eins,
inklusive der Beurkundungspflicht bei Immobilien.

---

## Cluster 2 — Nachbarschaft: der stärkste Cluster ohne Kaufmoment

**12 Queries, 81 Impressionen** — der größte Themenblock nach den Konfliktarten.
Und der einzige Cluster, in dem die Suchenden das Wort „Mediation" von sich aus
eintippen: `mediation bei nachbarschaftsstreitigkeiten` (24), `mediation
nachbarschaftsstreit` (15), `nachbarschaftsstreit mediation` (6, Pos 38,7).

Das ist eine echte Ausnahme von der Suchsprache-Regel aus dem 31.07.-Dokument und
sollte dort ergänzt werden: Bei Nachbarschaft ist der Fachbegriff bereits im
Sprachgebrauch angekommen, weil Schiedsämter und Ratgeberportale ihn seit Jahren
so benennen.

Was dem Cluster fehlt, ist nicht Reichweite, sondern **ein Moment, in dem jemand
zahlt**. Zwei Long-Tails liefern genau den:

| # | Ziel-Query | Beleg im Export | Ziel-URL |
|---|---|---|---|
| N1 | `rechtsschutzversicherung nachbarschaftsstreit` (+2 Varianten) | 6 Impr., Pos 52–65, keine Seite | `/ratgeber/rechtsschutzversicherung-streit` |
| N2 | `schlichtungsverfahren nachbarschaftsstreit`, `schiedsamt kosten`, `obligatorische streitschlichtung` | noch keine Impr. | `/ratgeber/schlichtung-vor-der-klage` |

**N1 ist der beste unbesetzte Long-Tail im ganzen Export.** Drei Queries, klare
Geldfrage, und eine ehrliche Antwort, die für das Angebot spricht: Nachbarrecht
ist in vielen Policen nur mit Zusatzbaustein gedeckt, Erbrecht meist nur als
Beratungsleistung — und wo gedeckt wird, steht eine Selbstbeteiligung im Weg, die
in der Größenordnung des medipact-Einstiegspreises liegt. Zusätzlich fragt der
Export bereits `was ist mediation rechtsschutz`. Der Artikel sollte alle drei
Konfliktarten abdecken (Nachbarschaft, Erbe, Miete) und aus jeder
Konflikt-Landingpage heraus verlinkt sein.

**N2 zielt auf eine Zwangslage, nicht auf Interesse:** In mehreren Bundesländern
(u. a. NRW, Bayern, Hessen, Sachsen) ist bei Nachbarrechtsstreitigkeiten unterhalb
bestimmter Streitwerte ein außergerichtlicher Einigungsversuch
Zulässigkeitsvoraussetzung für die Klage (§ 15a EGZPO). Wer davon erfährt, *muss*
sich mit außergerichtlicher Einigung befassen — der einzige erzwungene Kaufmoment
im Set. Die Abgrenzung zum Schiedsamt muss dabei sauber sein: Das Schiedsamt ist
die amtliche Form, medipact die vorbereitende. Kein Konkurrenz-Framing.

---

## Cluster 3 — Trennung/Scheidung: eine Baustelle, die sich nicht bewegt hat

`/ratgeber/haus-bei-scheidung` steht bei **19 Impressionen auf Position 97,6** —
unverändert gegenüber dem 12.08.-Export.

| Query | Impr. | Pos. |
|---|---:|---:|
| trennung haus verkaufen | 10 | 97,2 |
| haus verkaufen trennung | 7 | 97,9 |
| hausverkauf scheidung | 2 | 98,5 |

Die Titelkorrektur vom 12.08. hat nicht gereicht, und der Grund ist inhaltlich,
nicht meta: Der Artikel behandelt „das Haus bei der Scheidung" — gesucht wird der
**Verkauf während der Trennung**, also vor der Scheidung, und typischerweise, weil
sich die beiden darüber nicht einig sind.

**T1: eigener Artikel `haus-verkaufen-bei-trennung`.** Aufhänger ist nicht die
Immobilie, sondern der Konflikt: *Einer will verkaufen, der andere nicht.* Das ist
die reale Konstellation, sie hat keine rechtliche Lösung außer der
Teilungsversteigerung — und damit denselben Argumentationskern wie E1. Der
bestehende `haus-bei-scheidung` bleibt und deckt die Zeit nach der Scheidung ab.

Zwei kleinere Lücken im selben Cluster:

**T2: Notarkosten.** `scheidungsvertrag notar` (3, Pos 93,7),
`notarkosten für scheidungsfolgenvereinbarung` (1), `scheidungsfolgenvereinbarung
notar` (1), `scheidungsfolgenvereinbarung kosten` (1). Der Artikel
`scheidungsfolgenvereinbarung` steht auf Position 86,7 — die Notarkostenfrage ist
darin ein Abschnitt, aber keine eigene Antwort. Eine eigene FAQ-Sektion mit der
Gebührentabelle nach Geschäftswert und der klaren Aussage, was der Notar *nicht*
leistet, ist billiger als ein neuer Artikel.

**T3: `beziehungskonflikt beispiel` (17 Impr., Pos 60,8)** ist nach den
Haus-Queries die stärkste Einzelquery im Trennungsumfeld — und es gibt keine
Seite dafür. Siehe Querschnittsbefund unten.

---

## Cluster 4 — Arbeitsplatz und Mietverhältnis

### Arbeitsplatz: 14 Queries, 35 Impressionen

Auch hier ist der Fachbegriff die Suchsprache. Bemerkenswert:
`mediation arbeitsplatz` steht auf **Position 18,7** — die beste
Nicht-Kosten-Position der gesamten Domain. `mediation im arbeitsrecht` bringt
9 Impressionen, steht aber auf 92: Dort wird gegen Kanzleien gerankt, das ist
verlorene Mühe.

Der eine spitze Treffer im Set ist ein Vertikal:
**`fallbeispiel konflikt im pflegeteam` — 2 Impressionen auf Position 38, ohne
dass eine passende Seite existiert.**

**A1: `/ratgeber/konflikte-im-pflegeteam`** (oder als Case). Pflege- und
Klinikteams sind ein Konfliktfeld mit hoher Fluktuation, Schichtdienst und
personeller Enge — dort wird nach Fallbeispielen gesucht, weil Leitungskräfte
Argumentationshilfe für den Träger brauchen. Die SERP dazu ist dünn: Fachverlage
und Weiterbildungsanbieter, kein Anbieter des Verfahrens selbst.

Wie in `project_konflikttypen_arbeit_miete` festgehalten: Der Arbeitsplatz-Cluster
argumentiert **nicht** über Preis und Tempo. Das gilt hier weiter — der Aufhänger
ist Vertraulichkeit und der Erhalt der Zusammenarbeit, nicht die Ersparnis.

### Mietverhältnis: null Impressionen

Das ist kein Keyword-Problem, sondern ein Altersproblem — die Seite ist wenige
Tage alt. Es gibt im Export keine einzige Miet-Query, also auch keine Datenbasis
für eine Priorisierung.

**Empfehlung: bis zum Oktober-Export keine Miet-Artikel.** Wenn doch gebaut wird,
dann nicht gegen Mieterbund, mietrecht.org und die Vergleichsportale auf
Head-Terms wie „Mieterhöhung" oder „Nebenkostenabrechnung" — dort ist nichts zu
holen. Der tragfähige Winkel ist derselbe wie beim Arbeitsplatz: das
Dauerschuldverhältnis. Long-Tails, bei denen beide Seiten *weiter miteinander
auskommen müssen*:

- `streit mit vermieter aber wohnen bleiben`
- `mieter und vermieter einigen ohne anwalt`
- `streit unter mietern im haus`

Alles andere im Mietrecht ist Einmalkonflikt und gehört den Kanzleien.

---

## Querschnitt: „Fallbeispiel" ist die Suchsprache für `/cases`

**15 Queries, 39 Impressionen** enthalten „Beispiel" oder „Fallbeispiel" — und
mehrere davon stehen bereits in Reichweite:

| Query | Impr. | Pos. |
|---|---:|---:|
| beziehungskonflikt beispiel | 17 | 60,8 |
| konfliktarten beispiele | 3 | 47,3 |
| wirtschaftsmediation fallbeispiele | 2 | **33,0** |
| fallbeispiel konflikt im pflegeteam | 2 | **38,0** |
| mediation fallbeispiel | 1 | **35,0** |
| konfliktsituationen fallbeispiele | 1 | **36,0** |
| beziehungskonflikte beispiele | 1 | **33,0** |

Gleichzeitig steht `/cases` auf Position 31,7 mit 3 Impressionen, und die
Einzelfälle ranken zwar gut (`b2b-projektstreit` Pos 6, `trennung-nach-langer-ehe`
Pos 8), aber auf je einer Impression.

Die Seiten existieren also, sie heißen nur nicht so, wie gesucht wird. Das ist
exakt das Muster vom 31.07. — diesmal ohne Slug-Umzug lösbar: **Titel, H1 und
Description der Case-Seiten und der Übersicht auf „Fallbeispiel" umstellen**,
plus ein Einleitungsabsatz auf `/cases`, der das Wort trägt.

Das ist die billigste Maßnahme im ganzen Dokument: keine neuen Texte, nur
Benennung.

---

## Priorisierung

| # | Maßnahme | Cluster | Aufwand | Belegt durch |
|---|---|---|---|---|
| 1 | nginx-www-Redirect ausrollen | alle | klein | 5 www-URLs, 46 Impr. |
| 2 | `/cases` auf „Fallbeispiel" umbenennen (Titel/H1/Description) | Querschnitt | klein | 39 Impr., Pos 33–47 |
| 3 | `erbengemeinschaft-blockade` auf Suchsprache umtiteln | Erbe | klein | 0 Impr. trotz Bestand |
| 4 | Artikel `rechtsschutzversicherung-streit` | Nachbar/alle | mittel | 6 Impr., Pos 52–65, keine Seite |
| 5 | Artikel `teilungsversteigerung-vermeiden` | Erbe | mittel | 67-Impr.-Cluster ohne Kaufmoment |
| 6 | Artikel `haus-verkaufen-bei-trennung` | Trennung | mittel | 19 Impr., Pos 97,6, unbewegt |
| 7 | Notarkosten-FAQ in `scheidungsfolgenvereinbarung` | Trennung | klein | 6 Impr. auf Notar-Queries |
| 8 | Artikel `erbengemeinschaft-aufloesen` | Erbe | mittel | Produktäquivalent zur SFV |
| 9 | Artikel `schlichtung-vor-der-klage` (§ 15a EGZPO) | Nachbar | mittel | erzwungener Kaufmoment |
| 10 | Artikel/Case `konflikte-im-pflegeteam` | Arbeitsplatz | mittel | Pos 38 ohne passende Seite |
| — | Miet-Artikel | Miete | — | vertagt auf Oktober-Export |

Die Punkte 1–3 sind an einem Abend erledigt und betreffen Seiten, die es schon
gibt. Erst danach lohnt neuer Text.

---

## Was ich nicht empfehle

**Keinen weiteren Ausbau des Konfliktarten-Clusters.** 211 Impressionen auf
Ein-Wort-Queries, Ø-Position 64,4, null Klicks. Der Befund vom 12.08. gilt
unverändert: Das ist Reichweite ohne Kaufabsicht, und die Konkurrenz sind
Hochschul- und HR-Portale.

**Keine lokalen Seiten.** `erbschaft streit chemnitz` und `erbstreit lösen
chemnitz` stehen zusammen bei 3 Impressionen auf Position 94. Zu wenig, um daraus
eine Stadtseiten-Strategie abzuleiten — und medipact hat kein lokales
Alleinstellungsmerkmal, das eine solche Seite tragen würde.

**Keine Title-/Description-Runde auf den Seiten jenseits von Position 40.** Das
war schon am 12.08. die Empfehlung und ist es weiter: Ein besserer Titel wirkt
erst, wenn die Seite gesehen wird.

**Keine neuen Mediations-Definitionsartikel.** Der Bestand deckt das ab.

---

## Messpunkt: Export um den 15.09.

Vier Prüfungen, die den Plan bestätigen oder widerlegen:

1. **Verschwinden die www-URLs?** Wenn nein, ist der nginx-Block nicht live.
2. **Zieht `/cases` an?** Die Umbenennung ist die einzige Maßnahme, die schnell
   wirken kann, weil die Seiten bereits indexiert sind. Erwartung: `/cases` unter
   Position 25 und erste Impressionen auf „fallbeispiel"-Queries.
3. **Bewegt sich `haus-bei-scheidung` von Position 97 weg?** Wenn nicht, ist der
   eigene Artikel (T1) belegt — dann liegt es nicht am Titel.
4. **Kommen neue Long-Tails im Erb-Cluster dazu?** Der Cluster wächst derzeit von
   selbst. Wenn neue Varianten auftauchen, ohne dass Positionen steigen, fehlt
   Autorität und nicht Text — dann ist interne Verlinkung der Hebel, nicht Cluster 1.

---

## Quellen zur SERP-Recherche

- [Erbstreit: Was tun bei Konflikten unter Miterben? – afilio.de](https://www.afilio.de/ratgeber/nachlass-erbe/erbstreit-was-tun-bei-konflikten-unter-miterben)
- [Erbengemeinschaft: Rechte, Pflichten, Konflikte & Probleme lösen – biallo.de](https://www.biallo.de/recht-steuern/ratgeber/erbengemeinschaft/)
- [Teilungsversteigerung Erbengemeinschaft: Antrag & Ablauf – advocado.de](https://www.advocado.de/ratgeber/erbrecht/erbengemeinschaft/teilungsversteigerung-erbengemeinschaft.html)
- [Teilungsversteigerung verhindern – Deutsches Erbenzentrum](https://deutsches-erbenzentrum.de/themen/teilungsversteigerung-zwangsversteigerung/teilungsversteigerung-verhindern)
- [Obligatorische Streitschlichtung – juraforum.de](https://www.juraforum.de/lexikon/obligatorische-streitschlichtung)
- [Schlichtungsverfahren bei Nachbarstreitigkeiten – haufe.de](https://www.haufe.de/id/beitrag/schlichtungsverfahren-bei-nachbarstreitigkeiten-HI6480990.html)
- [Nachbarschaftsstreit: außergerichtliche Streitschlichtung notwendig – ra-kotz.de](https://www.ra-kotz.de/nachbarschaftsstreit-durchfuehrung-einer-aussergerichtlichen-streitschlichtung-notwendig.htm)
- [Zahlt die Rechtsschutzversicherung Mediation? – mainz-kwasniok.de](https://www.mainz-kwasniok.de/mediation/zahlt-die-rechtsschutzversicherung/)
- [Bekomme ich im Nachbarschaftsrechtsstreit Deckung von meiner Rechtsschutzversicherung? – rechtsanwalt-krau.de](https://rechtsanwalt-krau.de/bekomme-ich-im-nachbarschaftsrechtsstreit-deckung-von-meiner-rechtsschutzversicherung/)
- [Notarkosten Scheidungsfolgenvereinbarung – notar-drkotz.de](https://www.notar-drkotz.de/notarkosten-scheidungsfolgenvereinbarung-mitwirkung-an-wertermittlung/)
- [Scheidungsfolgenvereinbarung: Inhalt, Kosten & mehr – familienrechtsinfo.de](https://www.familienrechtsinfo.de/scheidung/scheidungsfolgenvereinbarung/)
- [Mediation, Schiedsamt, Schlichtungsstelle – biallo.de](https://www.biallo.de/recht-steuern/ratgeber/mediation/)
- [Gütetermin am Arbeitsgericht: Ablauf, Taktik, Vergleich & Kosten – haidari.legal](https://haidari.legal/arbeitsrecht/guetetermin-arbeitsgericht-ablauf-kosten-abfindung/)
