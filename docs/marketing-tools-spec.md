# Marketing-Ausbau: Rechner, Selbsttest, Logbuch, Local SEO, Distribution

Stand: 31.07.2026. Spec, kein Code. Teil 1–3 sind zum Bauen gedacht,
Teil 4–5 beschreiben ein Vorgehen.

**Ausgangslage.** Der bestehende Marketing-Stack ist fast vollständig ein
Kanal: 27 Ratgeber-Artikel + 16 Fallbeispiele auf der eigenen Domain, dazu
vier einmalige PR-Texte (`marketing/VEROEFFENTLICHUNGS-GUIDE.md`). Das ist
eine gute Basis, hat aber 6–12 Monate Latenz und hängt an einem einzigen
Algorithmus. Was fehlt, sind Assets, die *verlinkt* werden, und Kanäle, die
nicht Google heißen.

---

## Teil 1 — Prozesskostenrechner „Gericht oder Mediation"

### 1.1 Warum ein Rechner und kein weiterer Artikel

`mediation-kosten.ts`, `scheidung-mediator-kosten.ts` und
`scheidungskosten` decken die Suchintention schon inhaltlich ab. Was ein
Artikel nicht kann: verlinkt werden. Ein Rechner ist das einzige
Marketing-Asset in diesem Feld, das Kanzlei-Blogs, Verbraucherportale,
Foren und Journalisten von sich aus verlinken — weil er ihnen Arbeit
abnimmt. Backlinks sind der Faktor, der bei medipact aktuell am
schwächsten ist.

### 1.2 Wettbewerbslage — und wo die Lücke ist

Prozesskostenrechner gibt es viele (FORIS, smart-rechner, MEINRECHT,
rechnerplus, diverse Kanzleien), Scheidungskostenrechner ebenso
(rechnercheck, hilfe.de, scheidungskostenrechner.org, sum.money). Auf den
reinen Keywords „Prozesskostenrechner" / „Scheidungskostenrechner" ist
gegen diese Domains kurzfristig nichts zu holen.

**Die Lücke:** Kein einziger dieser Rechner stellt der Gerichtskosten-Seite
eine Alternative gegenüber. Sie enden alle in derselben CTA — Anwalt
beauftragen oder Prozessfinanzierung anfragen. Die zweite Spalte ist frei.

Daraus folgt die Positionierung: **nicht** „noch ein Prozesskostenrechner",
sondern **„Was kostet der Streit — vor Gericht und ohne?"**. Zielkeywords
sind entsprechend die Vergleichs-Longtails, nicht die Head-Terms:

- „mediation oder gericht kosten"
- „gerichtsverfahren kosten sparen"
- „was kostet ein nachbarschaftsstreit vor gericht"
- „scheidung kosten einvernehmlich vs streitig"
- „erbstreit kosten gericht"
- „prozesskostenrisiko berechnen" (Zweitziel, härter umkämpft)

### 1.3 Das Ehrlichkeitsproblem — bitte vor allem anderen lesen

Ein Rechner, der behauptet „Mediation spart dir die kompletten
Verfahrenskosten", ist in mindestens zwei der drei Hauptfälle **falsch**
und wird von der ersten Kanzlei, die ihn sieht, zerlegt. Das kostet genau
die Glaubwürdigkeit, die das Tool aufbauen soll. Drei Punkte sind
zwingend:

**1. Scheidung ersetzt Mediation nicht.** Eine Ehe wird in Deutschland nur
durch gerichtlichen Beschluss geschieden, und für den Antrag ist
mindestens ein Anwalt Pflicht (§ 114 FamFG). Mediation macht aus einer
streitigen eine einvernehmliche Scheidung — sie macht sie nicht
gerichtsfrei. Die korrekte Gegenüberstellung lautet:

> streitige Scheidung (2 Anwälte, Folgesachen)
> **vs.** Mediation + einvernehmliche Scheidung (1 Anwalt, Gerichtskosten bleiben)

**2. Mediation kann scheitern.** Dann fallen die Mediationskosten
*zusätzlich* an. Der Rechner sollte eine dritte Zeile „Mediation
gescheitert, danach Gericht" ausweisen. Das wirkt kontraintuitiv, ist aber
das stärkste Vertrauenssignal der ganzen Seite — und die Zahl ist bei den
medipact-Preisen ohnehin unkritisch (49 € bzw. 399 € gegen vierstellige
Prozesskosten).

**3. Die Gerichtsseite ist ein Risiko, kein Preis.** Wer gewinnt, bekommt
seine Kosten erstattet (§ 91 ZPO); wer verliert, zahlt beide Seiten. Der
ausgewiesene Betrag ist das **Kostenrisiko** bei vollem Unterliegen. So
muss er auch beschriftet sein.

**Rechtsdienstleistungsgesetz:** Ein Rechner, der allgemeine gesetzliche
Gebührentabellen anwendet, ist keine Rechtsdienstleistung im Sinne des
§ 2 RDG — es fehlt die rechtliche Prüfung des Einzelfalls. Damit das so
bleibt: keine Einschätzung von Erfolgsaussichten, keine Empfehlung zum
konkreten Vorgehen, kein „Sie sollten klagen/nicht klagen". Fester
Hinweistext unter dem Ergebnis:

> Unverbindliche Berechnung nach den gesetzlichen Gebührentabellen
> (GKG/FamGKG/RVG, Stand 01.06.2025). Keine Rechtsberatung. Der
> tatsächliche Streitwert wird vom Gericht festgesetzt und kann abweichen.

### 1.4 Datengrundlage

Alle Werte gelten seit **01.06.2025** (Kosten- und
Betreuervergütungsrechtsänderungsgesetz 2025, BGBl. I Nr. 109 vom
07.04.2025). Verfahren, die vorher anhängig wurden, laufen nach altem
Recht — für einen Rechner irrelevant, weil er künftige Verfahren
kalkuliert.

**Wichtiger Vereinfacher:** Die Wertgebührentabelle nach § 34 GKG und die
nach § 28 FamGKG sind **wertgleich**. Es wird also nur *eine*
Gerichtsgebührentabelle gebraucht; Zivil- und Familiensachen
unterscheiden sich nur im Gebührensatz.

Zu hinterlegen sind drei Datenstrukturen:

| Datei | Inhalt | Quelle |
|---|---|---|
| `GERICHTSGEBUEHR` | 42 Stützstellen 500 → 500.000 €, 1,0-Gebühr | Anlage 2 GKG (= Anlage 2 FamGKG) |
| `ANWALTSGEBUEHR` | 42 Stützstellen 500 → 500.000 €, 1,0-Gebühr | Anlage 2 RVG |
| Fortschreibungsregeln | für Werte > 500.000 € | § 34 Abs. 1 GKG, § 13 Abs. 1 RVG |

Gerichtsgebühr (1,0), Auszug — Anlage 2 GKG:

```
500 → 40,00      5.000 → 170,50    25.000 → 435,50    100.000* → 1.198,00
1.000 → 61,00   10.000 → 283,00    50.000 → 638,00    500.000 → 4.138,00
```
\* Stufe „bis 110.000"

Anwaltsgebühr (1,0), Auszug — Anlage 2 RVG:

```
500 → 51,50      5.000 → 354,50    25.000 → 927,00    110.000 → 1.755,00
1.000 → 93,00   10.000 → 652,00    50.000 → 1.357,00  500.000 → 3.752,00
```

Fortschreibung über 500.000 € (§ 34 GKG / § 13 RVG): je angefangene
50.000 € weitere +210,00 € (Gericht) bzw. +175,00 € (Anwalt).

**Gebührensätze:**

| Position | Satz | Fundstelle |
|---|---|---|
| Gericht, Zivilprozess 1. Instanz | 3,0 | KV 1210 GKG |
| Gericht, Zivilprozess Berufung | 4,0 | KV 1220 GKG |
| Gericht, Ehesache 1. Instanz | 2,0 | KV 1110 FamGKG |
| Anwalt, Verfahrensgebühr | 1,3 | Nr. 3100 VV RVG |
| Anwalt, Terminsgebühr | 1,2 | Nr. 3104 VV RVG |
| Anwalt, Einigungsgebühr (gerichtl. anhängig) | 1,0 | Nr. 1003 VV RVG |
| Auslagenpauschale | 20 % der Gebühren, **max. 20 €** | Nr. 7002 VV RVG |
| Umsatzsteuer | 19 % | Nr. 7008 VV RVG |

Die Auslagenpauschale wurde vom KostBRÄG 2025 **nicht** angehoben — sie
liegt weiterhin bei 20 €. Häufiger Fehler in fremden Rechnern.

**Familienrecht, Verfahrenswert:**

- Ehesache: 3 × gemeinsames monatliches Nettoeinkommen beider Ehegatten
  (§ 43 FamGKG), Mindestwert 3.000 €. Vermögen erhöht den Wert;
  Praxisregel 5 % über einem Freibetrag, je nach OLG unterschiedlich —
  im Rechner als optionales Feld mit sichtbarem Hinweis „regional
  unterschiedlich".
- Versorgungsausgleich: **10 % des dreifachen Nettoeinkommens je
  Anrecht** (§ 50 Abs. 1 FamGKG), Mindestwert 1.000 €.
- Regelwerte anderer Folgesachen (seit 01.06.2025 angehoben): isolierte
  Kindschaftssache 5.000 €, Ehewohnung Trennungszeit 4.000 €, Haushalt
  Trennungszeit 2.000 €, Gewaltschutz § 1 GewSchG 4.000 €.

### 1.5 Rechenlogik

```
gerichtskosten      = satz_gericht × tabelle_gkg(wert)
anwalt_je_partei    = ((1,3 + 1,2) × tabelle_rvg(wert)
                       + min(20, 0,2 × gebuehren)) × 1,19
kostenrisiko_gesamt = gerichtskosten + anzahl_anwaelte × anwalt_je_partei
```

Tabellen-Lookup ist eine Ober-Stufen-Suche: die erste Stufe, deren
Grenzwert ≥ Streitwert ist. Nicht interpolieren.

### 1.6 Referenzrechnungen (nachgerechnet, als Testfälle verwenden)

**A — Nachbarschaftsstreit, Streitwert 5.000 €, AG 1. Instanz, streitiges
Urteil, beide Seiten anwaltlich vertreten**

| Position | Betrag |
|---|---|
| Gerichtskosten 3,0 × 170,50 | 511,50 € |
| Anwalt je Partei (1,3 + 1,2 aus 354,50 + 20 € + 19 %) | 1.078,44 € |
| **Kostenrisiko gesamt** | **2.668,38 €** |
| medipact Nachbarschaft, 49 € × 2 Parteien | 98,00 € |

**B — Scheidung, gemeinsames Nettoeinkommen 4.500 €/Monat, kein
nennenswertes Vermögen, Versorgungsausgleich mit 2 Anrechten**

Verfahrenswert: 3 × 4.500 = 13.500 € (Ehesache) + 2 × 10 % × 13.500 =
2.700 € (VA) = **16.200 €**

| Position | Betrag |
|---|---|
| Gerichtskosten 2,0 (Stufe bis 19.000: 374,50) | 749,00 € |
| Anwalt je Partei (aus RVG 817,00) | 2.454,38 € |
| **streitig, 2 Anwälte** | **5.657,76 €** |
| **einvernehmlich, 1 Anwalt** | **3.203,38 €** |
| medipact Trennung, 399 € × 2 | 798,00 € |

Die ehrliche Aussage lautet hier: Mediation (798 €) + einvernehmliche
Scheidung (3.203 €) = 4.001 € gegen 5.658 € streitig. Ersparnis ca.
1.650 €, plus die Folgesachen, die im streitigen Fall zusätzlich
Verfahrenswert erzeugen und in dieser Rechnung noch gar nicht drin sind.
Kleiner als die Zahl, die man gern hätte — aber verteidigbar, und genau
das ist der Punkt.

**C — Erbstreit, Nachlasswert im Streit 60.000 €, LG 1. Instanz, beide
anwaltlich vertreten**

| Position | Betrag |
|---|---|
| Gerichtskosten 3,0 (Stufe bis 65.000: 778,00) | 2.334,00 € |
| Anwalt je Partei (aus RVG 1.456,50) | 4.356,89 € |
| **Kostenrisiko gesamt** | **11.047,78 €** |
| medipact Erbschaft (once) | 399,00 € |

### 1.7 Seitenaufbau

Route: `/kostenrechner` (kurz, merkbar, nicht in `/ratgeber` vergraben —
ein Tool ist kein Artikel).

1. **H1** „Was kostet der Streit? Gericht und Mediation im Vergleich"
2. **Eingabe**, progressiv: Konfliktart (Vorauswahl setzt Gebührensätze
   und Streitwert-Hilfe) → Streitwert bzw. bei Trennung Nettoeinkommen +
   Anrechte → Checkbox „Gegenseite hat eigenen Anwalt".
3. **Ergebnis, drei Karten nebeneinander:** Gerichtsweg (Risiko bei
   vollem Unterliegen) · Mediation über medipact · Mediation gescheitert,
   danach Gericht.
4. **Aufklappbare Einzelposten** je Karte — jede Zeile mit Fundstelle
   (§ 34 GKG, Nr. 3100 VV RVG …). Das ist der eigentliche Linkbait: die
   nachvollziehbare Herleitung, nicht die Summe.
5. **Disclaimer** aus 1.3.
6. **Kontext-Absätze** unter dem Rechner (300–500 Wörter) für die
   Suchintention, mit Links auf `mediation-kosten`,
   `gericht-oder-mediation`, `/preise`.
7. **CTA**, konfliktartabhängig auf die passende `/konflikte/*`-Seite.

Kein E-Mail-Gate vor dem Ergebnis. Ein gegatetes Tool wird nicht
verlinkt, und Verlinkung ist der ganze Zweck. Optionales
„Berechnung als PDF" *nach* dem Ergebnis ist in Ordnung.

### 1.8 Technik

- Reine Client-Berechnung, keine API. Tabellen als TypeScript-Konstanten
  in `lib/kostenrecht.ts`, dort auch der `stand`-String
  (`"01.06.2025"`), der sichtbar auf der Seite ausgegeben wird.
- Preisseite nicht doppelt pflegen: die medipact-Spalte liest aus
  derselben Quelle wie `backend/app/pricing.py`. Da der Rechner
  clientseitig läuft, entweder eine schmale TS-Spiegelung mit Kommentar
  „muss zu pricing.py passen" oder ein `GET /pricing/matrix`-Endpunkt.
  Zweiteres ist sauberer — die Matrix hat sich seit April dreimal
  geändert (20 € → 49 €, WG raus, ODR-Familie rein).
- Metadata über `pageMetadata()` aus `lib/seo.ts`.
- Schema.org: `WebApplication` (`applicationCategory: "FinanceApplication"`,
  `offers.price: "0"`) plus `FAQPage` für die Kontext-Fragen.
- Eintrag in `app/sitemap.ts`, Priorität 0.9. `lastModified` dort
  hochsetzen.
- Interne Verlinkung nachziehen: `mediation-kosten.ts`,
  `scheidung-mediator-kosten.ts`, `gericht-oder-mediation.ts`,
  `erbstreit-loesen-ohne-gericht.ts`, `/preise` — jeweils ein `cta`-Block
  auf den Rechner.

### 1.9 Pflege

Die Tabellen ändern sich alle 4–6 Jahre (2013, 2021, 2025). Ein
`STAND`-Konstante plus sichtbarer Hinweis reicht; kein Cronjob nötig.
Sinnvoll ist ein Kommentar in `lib/kostenrecht.ts` mit den drei
Quell-URLs, damit die nächste Aktualisierung eine 20-Minuten-Aufgabe ist.

---

## Teil 2 — Öffentlicher Konflikttyp-Selbsttest

### 2.1 Was schon da ist

Migration `c1d2e3f4a5b6` (aktueller Head) legt den globalen WFM-Schritt
`konfliktprofil_selbsttest` in der Phase `themensammlung` an — 10
Skala-Items (1–6, bewusst ohne Mitte), eine Auswahlfrage zur
Deeskalation, ein Freitextfeld. Angelehnt an das Modell der fünf
Konfliktstile (durchsetzen, nachgeben, vermeiden, Kompromiss,
kooperieren).

Der Itembank-Teil ist damit erledigt. Was fehlt, ist die öffentliche,
kontenlose Variante.

**Nicht Glasl.** Ich hatte in der Konversation von einem
Eskalationsstufen-Test gesprochen — der existierende Schritt ist ein
Konfliktstil-Test. Für einen öffentlichen Test ist das die bessere Basis:
„Welcher Konflikttyp bist du?" wird geteilt, „Auf welcher Eskalationsstufe
steckst du?" macht Angst.

### 2.2 Rechtlicher Hinweis

Das Thomas-Kilmann Conflict Mode Instrument (TKI) ist ein geschütztes,
lizenzpflichtiges Verfahren von Kilmann Diagnostics. Die medipact-Items
sind eigenformuliert — das ist zulässig, solange die Seite das auch so
darstellt. Konkret:

- **nicht** schreiben: „TKI-Test", „Thomas-Kilmann-Test", „nach Thomas
  und Kilmann"
- **stattdessen**: „angelehnt an das Modell der fünf Konfliktstile"
- keine TKI-Auswertungslogik, keine TKI-Normwerte, keine
  TKI-Ergebnisgrafik nachbauen

Dasselbe gilt für die Ergebnisbezeichnungen: eigene, deutsche Namen
verwenden, nicht die TKI-Labels.

### 2.3 Auswertung

Rein regelbasiert, kein KI-Call. Fünf Skalen aus je 2 Items:

| Skala | Items |
|---|---|
| Durchsetzen | `kp_durchsetzen`, invertiert `kp_nachgeben` |
| Nachgeben | `kp_nachgeben`, invertiert `kp_durchsetzen` |
| Vermeiden | `kp_vermeiden`, `kp_stress_rueckzug` |
| Kompromiss | `kp_kompromiss`, `kp_tempo` |
| Kooperieren | `kp_kooperation`, `kp_vertrauen` |

Höchste Skala = Haupttyp, zweithöchste = Nebentyp. Bei Gleichstand den
kooperativeren Typ ausgeben (freundlicheres Ergebnis, kein
diagnostischer Anspruch).

Wichtig für den Ton: **kein Ergebnis darf abwertend sein.** „Vermeidend"
wird zu „Du gehst Konflikten aus dem Weg, bis sie sich nicht mehr
vermeiden lassen — das kauft Ruhe, aber es kauft sie auf Kredit." Jeder
Typ bekommt Stärke, Kosten und einen konkreten nächsten Schritt.

Explizit dazuschreiben, dass das ein Selbstreflexions-Werkzeug ist und
keine psychologische Diagnostik.

### 2.4 E-Mail-Gate

Das Ergebnis selbst wird **ungegatet** angezeigt — Haupttyp, kurze
Einordnung, Stärke/Kosten. Gegatet wird die Vertiefung:

- 2-seitiges PDF „Dein Konfliktprofil" mit allen fünf Skalen,
  Balkengrafik, typspezifischen Gesprächstipps
- Angebot: „Schick den Test der anderen Seite" — zwei Profile
  nebeneinander, das ist der eigentliche Haken und führt direkt in die
  Zweiseitigkeit, die Mediation braucht

Anbindung an den bestehenden `POST /newsletter/subscribe`
(`backend/app/routers/newsletter.py`, public, rate-limited, idempotent).
Ein zusätzliches Feld `source` in `newsletter_subscribers` wäre nützlich,
um Test-Leads von Footer-Anmeldungen zu trennen — kleine Migration.

**Double-Opt-In beachten.** Der bestehende Endpunkt speichert direkt. Für
eine Adresse, die anschließend Mailings bekommen soll, ist in Deutschland
DOI der Standard (§ 7 UWG, BGH „Double-opt-in"). Wenn eine Nurture-Serie
geplant ist — und ohne die ist das Gate sinnlos — muss das vorher rein.

### 2.5 Technik

- Route `/konflikttyp-test`, Client-Komponente, State im `useState`,
  **kein localStorage** (Artefakt-Regel gilt hier nicht, aber es gibt
  auch keinen Grund).
- Items nicht duplizieren: entweder aus einem gemeinsamen
  `lib/konfliktprofil.ts` beziehen, das auch die Migration befüllt hat,
  oder — pragmatischer — im Frontend spiegeln mit Kommentar-Verweis auf
  `c1d2e3f4a5b6`.
- Ergebnis-Seite pro Typ als eigene URL (`/konflikttyp-test/kooperativ`
  etc.), damit Ergebnisse teilbar und indexierbar sind. Fünf zusätzliche
  Landingpages praktisch gratis.
- Schema.org `Quiz` ist unnötig; `WebApplication` reicht.
- Sitemap + interne Links aus `was-ist-mediation`,
  `akuter-konflikt-was-tun`, `schwelender-konflikt`.

### 2.6 Erwartung

Ein Selbsttest rankt selten gut (dünner Text, viele Konkurrenten aus dem
Coaching-Umfeld). Sein Wert liegt woanders: Verweildauer, Teilbarkeit,
E-Mail-Adressen und ein niedrigschwelliger Einstieg für Leute, die noch
nicht bei „Mediation" sind. Als SEO-Maßnahme unterdurchschnittlich, als
Funnel-Einstieg gut — deshalb Priorität *nach* dem Rechner.

---

## Teil 3 — Das Logbuch als eigenes Produkt

### 3.1 Was schon da ist

Mehr als ich in der Konversation angenommen hatte:

- `/konflikt-logbuch` existiert als vollständige Landingpage (399 Zeilen),
  Keywords bereits gesetzt: Konflikt dokumentieren, Streit-Tagebuch,
  Konflikttagebuch, Lärmprotokoll, Gedächtnisprotokoll
- Ratgeber-Artikel `konflikt-dokumentieren.ts` und `konflikt-journal.ts`
- Produkt: `mediations.mode = "logbuch"`, Sichtbarkeiten
  private/personal/shared, KI-Analyse mit Quota, Datei-Uploads,
  Convert-Endpunkt in den bezahlten Fall
- Expo-App unter `mobile/` (SDK 56)

Die Positionierung als eigenständiges Produkt fehlt trotzdem — das
Logbuch ist derzeit ein *Modus von medipact*, kein Ding mit eigenem
Namen, eigener Distribution und eigenem Versprechen.

### 3.2 Der eigentliche Hebel: der Manipulationseinwand

Die Recherche zum Suchfeld „Mobbingtagebuch / Vorfälle dokumentieren"
liefert eine Konstante, die in praktisch jedem Ratgeber steht — auch bei
Arbeiterkammer, Karrierebibel, betriebsrat.de:

> „Nutzen Sie ein gebundenes Tagebuch, keine lose Blattsammlung oder
> digitale Datei, um den Verdacht nachträglicher Manipulationen zu
> vermeiden."

Das ist der zentrale Einwand gegen jede digitale Lösung in diesem Markt —
und gleichzeitig die Lücke, in die ein digitales Produkt stoßen kann,
weil ein Papierbuch das Problem gar nicht löst (man kann jederzeit
Seiten herausreißen oder rückdatiert weiterschreiben).

**Produktseitig** heißt das: Einträge unveränderlich mit
Erstellungszeitstempel führen. Nicht Blockchain, nichts Exotisches —
`created_at` serverseitig, Bearbeitungen als sichtbare Revision statt als
Überschreibung, Export als PDF mit Erstellungs- und Änderungshistorie.
Sehr wahrscheinlich ist der größte Teil davon in
`mediation_log_entries` schon vorhanden und muss nur *ausgewiesen*
werden.

**Marketingseitig** ist das die Botschaft, die das Produkt von einer
Word-Vorlage unterscheidet: „Ein Papiertagebuch kannst du umschreiben.
Dieses hier nicht." Das gehört in H1-Nähe der Landingpage, in die
App-Store-Beschreibung und in jeden Artikel des Clusters.

Ehrlich bleiben: Ein solcher Export ist ein Privatdokument, kein
qualifizierter Zeitstempel nach eIDAS. Er erhöht die Plausibilität, er
erzeugt keine Beweiskraft. Genau so formulieren — „nachvollziehbar
geführt", nicht „gerichtsfest".

### 3.3 Fehlender Keyword-Cluster

`/konflikt-logbuch` deckt den Nachbarschafts-/Streit-Wortschatz ab. Nicht
abgedeckt ist der **arbeitsrechtliche** Wortschatz, der das mit Abstand
größte Volumen in diesem Feld hat:

| Keyword | Status |
|---|---|
| Mobbingtagebuch | fehlt vollständig |
| Mobbing dokumentieren Arbeitsplatz | nur gestreift in `mediation-am-arbeitsplatz` |
| Mobbingtagebuch Vorlage / Muster | fehlt |
| Vorfälle dokumentieren Arbeitgeber | fehlt |
| Gedächtnisprotokoll Vorlage | in der Landingpage erwähnt, keine eigene Seite |

Das SERP-Bild ist dominiert von PDF-Vorlagen (Arbeiterkammer,
Gewerkschaften, Karrierebibel). Dagegen gewinnt man mit **derselben Ware
plus Produkt**: eine gute, herunterladbare Vorlage anbieten *und* daneben
die App. Wer die Vorlage sucht, hat exakt das Problem, das das Logbuch
löst.

Konkret: ein Pillar-Artikel `mobbingtagebuch.ts` (Kategorie Arbeit) mit
Download-Vorlage (PDF + DOCX), plus Unterseite
`/konflikt-logbuch/mobbing` mit dem Use-Case-Framing. Analog später
`/konflikt-logbuch/nachbarschaft` (Lärmprotokoll — auch stark) und
`/konflikt-logbuch/trennung`.

**Vorsicht bei der Vorlage:** Wenn Word-Dateien angeboten werden, nicht
in dieselbe Falle tappen wie die Wettbewerber. Der Text sollte den
Manipulationseinwand selbst aufgreifen und erklären, warum ein
zeitgestempeltes System besser ist als beides — Papier und Word.

### 3.4 App-Distribution

Die Expo-App ist gebaut, aber offene Punkte laut Projektnotizen: npm
install, nginx-Deploy der `/backend/`-Location, Expo-Go-Test. Solange die
App nicht im Store ist, ist sie kein Kanal.

Was ein Store-Eintrag bringt, das Web nicht bringt:
- Suche im Store selbst („Mobbing", „Tagebuch", „Konflikt") — eigener,
  wenig umkämpfter Suchindex
- Bewertungen als Vertrauensbeleg, den die Website nicht hat
- Push-Reminder („Heute etwas festzuhalten?") — genau die
  Retention-Mechanik, die ein Tagebuch braucht und die per Web fehlt

Referenz aus dem Feld: die vom WEISSER RING unterstützte App **NO STALK**
besetzt dasselbe Muster für Stalking. Zeigt, dass die Kategorie
funktioniert und dass eine Kooperation mit einer Opferschutz- oder
Beratungsorganisation ein realistischer Distributionsweg ist.

### 3.5 Trichter sichtbar machen

Der Weg Logbuch (0 €) → Mediation (49/399 €) existiert technisch
(Convert-Endpunkt), ist aber nirgends als Angebot inszeniert. Zwei
konkrete Auslöser:

- Nach dem 5. Eintrag im selben Konflikt: „Fünf Einträge in drei Wochen.
  Willst du das klären, statt es weiter zu sammeln?" → Convert-Flow
- Bei der KI-Analyse: Ergebnis endet mit einem konkreten nächsten
  Schritt, nicht mit einer Zusammenfassung

Das ist kein Marketing, sondern Produkt — aber es ist der Punkt, an dem
sich entscheidet, ob die ganze Logbuch-Strategie Umsatz erzeugt oder nur
Traffic.

---

## Teil 4 — Local SEO: wie angehen

### 4.1 Die Ausgangsfrage

„Online-Mediation" hat wenig Suchvolumen, „Mediator <Stadt>" hat viel.
Der Nachteil: medipact ist ortsunabhängig, hat also genau das nicht, was
lokale Suche belohnt.

### 4.2 Schritt 1 — Google Unternehmensprofil (kostenlos, ~2 Stunden)

Steht im `VEROEFFENTLICHUNGS-GUIDE.md` unter „später". Es gehört an den
Anfang, weil es der einzige Local-SEO-Baustein ist, der ohne Content
funktioniert.

Voraussetzung ist eine verifizierbare Geschäftsadresse. Der
Impressums-Sitz reicht; als Dienstleister ohne Laufkundschaft wird das
Profil als **Service Area Business** angelegt (Adresse verborgen,
Einzugsgebiet definiert). Nötig:

- Kategorie „Mediationsdienst" (primär), „Rechtsberatung" **nicht**
  wählen — falsche Kategorie, falsche Erwartung, potenziell RDG-heikel
- Einzugsgebiet: bundesweit
- Leistungen einzeln anlegen (Trennungsmediation, Erbmediation,
  Nachbarschaft, Wirtschaftsmediation) — jede erzeugt Text im Profil
- Fotos: die Bestände in `fotos/` reichen
- Beiträge: die vorhandenen Ratgeber-Artikel als Profil-Posts
  zweitverwerten

**Bewertungen** sind der eigentliche Rankingfaktor. Nach jedem
abgeschlossenen Fall aktiv fragen — automatisiert an das Fallende
gehängt. Heikel bei Mediation, weil Vertraulichkeit zentral ist; die
Anfrage muss ausdrücklich anbieten, anonym zu bewerten.

Parallel und mit demselben Aufwand: **ProvenExpert** (in Deutschland bei
Dienstleistern verbreiteter als Trustpilot und mit Rich-Snippet-Wirkung).

### 4.3 Schritt 2 — Standortseiten, aber nur wenn sie etwas können

Der naive Ansatz — 50 Städte, dieselbe Seite mit ausgetauschtem
Ortsnamen — ist eine Doorway-Page-Struktur und ein Verstoß gegen Googles
Spam-Richtlinien. Bei einer Domain mit 27 guten Artikeln wäre das ein
schlechter Tausch.

Eine Standortseite trägt nur, wenn sie Information enthält, die es
woanders nicht gibt. Für Mediation gibt es die tatsächlich:

- **Verfahrensdauern der Justiz je Bundesland** — das Statistische
  Bundesamt veröffentlicht Fachserie 10 Reihe 2.1 (Zivilgerichte) mit der
  durchschnittlichen Verfahrensdauer je Land. Die Spanne zwischen
  Bundesländern ist erheblich und für Betroffene relevant.
- **Zuständiges Amts-/Familiengericht** je Stadt, mit Adresse
- **Obligatorische Streitschlichtung nach § 15a EGZPO** — der stärkste
  Punkt, und differenzierter als gedacht: Von der Öffnungsklausel haben
  **alle Bundesländer außer Berlin, Bremen und Thüringen** Gebrauch
  gemacht, aber in sehr unterschiedlichem Umfang. In Nachbarrechtssachen
  ist vor Klageerhebung häufig ein Schlichtungsversuch Pflicht; die
  Ausnahmen weichen ab (in NRW, Hessen und dem Saarland etwa sind auf
  Zahlung gerichtete Ansprüche ausgenommen — BGH V ZR 69/08 für Hessen).
  Genau diese Unterschiede sind der Inhalt, den es sonst nirgends
  gebündelt gibt, und sie zahlen direkt auf die Nachbarschafts-Konfliktart
  ein. **Vor Veröffentlichung je Land am geltenden
  Landesausführungsgesetz prüfen** — mehrere Länder haben ihre Regelungen
  seit Einführung geändert.

Daraus folgt: **Bundesland-Seiten statt Stadt-Seiten.** 16 statt 50, jede
mit belastbarem eigenem Inhalt, jede pflegbar. `/mediation/nordrhein-westfalen`
o. ä. Erst wenn die tragen, über die fünf größten Städte nachdenken.

Datenquellen vorab prüfen — Destatis-Fachserien sind teils
kostenpflichtig oder nur als PDF verfügbar; das kann die Idee kippen,
bevor Code geschrieben wird. **Das ist der erste Arbeitsschritt, nicht
der zweite.**

### 4.4 Was ich nicht empfehle

Branchenverzeichnis-Massenanmeldungen. Der Backlink-Wert ist seit Jahren
nahe null, der Aufwand hoch, und die Adressdaten kursieren anschließend.
Ein bis zwei fachliche Verzeichnisse (Bundesverband Mediation,
Mediator-Suchportale) sind sinnvoll — das war es.

---

## Teil 5 — Distribution der Bestandsinhalte: wie angehen

27 Artikel und 16 Fallbeispiele liegen ausschließlich auf medipact.de und
warten darauf, gefunden zu werden. Distribution heißt: dorthin gehen, wo
die Fragen ohnehin gestellt werden.

### 5.1 Foren und Q&A — der ehrliche Weg

gutefrage.net, Reddit (r/de, r/Ratschlag, r/Finanzen bei Erbfragen),
Trennungs- und Elternforen: dort werden täglich genau die Fragen
gestellt, die die Artikel beantworten.

**Was funktioniert:** die Frage tatsächlich beantworten, vollständig, im
Beitrag selbst. Kein Link, oder ein Link ganz am Ende als Vertiefung.
**Was nicht funktioniert und aktiv schadet:** Linkdrops. Reddit entfernt
sie, gutefrage-Nutzer melden sie, und im schlimmsten Fall entsteht ein
Markenschaden.

Realistischer Aufwand: 2–3 Antworten pro Woche, 20 Minuten je Antwort.
Der Ertrag ist kein SEO-Wert (die Links sind nofollow), sondern direkter
Traffic von Menschen mit akutem Problem — die höchste Kaufabsicht, die es
in diesem Markt gibt.

Wichtig: mit Klarnamen und Rolle auftreten („Ich betreibe eine
Mediationsplattform, deshalb ist das nicht neutral"). Offenlegung kostet
weniger, als sie einbringt.

### 5.2 Video — das Skript liegt schon da

`synthesia_skript_phase1.md` existiert. Fünf Kurzvideos à 60–90 Sekunden
decken die häufigsten Ängste ab:

1. Was passiert im ersten Termin?
2. Muss ich der anderen Person begegnen?
3. Was, wenn wir uns nicht einigen?
4. Ist das Ergebnis bindend?
5. Was kostet es wirklich?

Zweitverwertung: YouTube (Shorts), Einbettung in die passenden
Ratgeber-Artikel (erhöht Verweildauer messbar), Google-Unternehmensprofil,
LinkedIn.

YouTube ist dabei nicht als Kanal mit Abonnenten zu denken, sondern als
zweite Suchmaschine — die Titel sollten Suchanfragen sein („Was passiert
beim ersten Mediationstermin?"), nicht Claims.

### 5.3 Fachöffentlichkeit

Im Guide bereits notiert, weiter unpriorisiert: „Die Mediation" und
„Spektrum der Mediation" (BMEV). Der Nutzen ist nicht Traffic, sondern
E-E-A-T — Google bewertet Autorenreputation, und für die
`FounderSection.tsx`, deren `credentials`-Feld seit Juli offen ist, wären
Fachpublikationen der passende Inhalt.

### 5.4 Der Kanal, der in der ursprünglichen Liste fehlte

Nicht Distribution im engeren Sinn, aber billiger als alles andere hier:
Seit dem PayPal-Umbau startet jeder Fall **unbezahlt**
(`fall_freischaltung`-Block in Phase `einladung`). Jeder Abbruch an dieser
Stelle ist ein Mensch mit akutem Konflikt, hinterlegter E-Mail-Adresse und
bereits angelegtem Fall. Zwei Erinnerungsmails (nach 24 h und nach 5
Tagen) sind ein Nachmittag Arbeit und schlagen jeden neuen Artikel.

---

## Reihenfolge

| # | Maßnahme | Aufwand | Wirkung | Latenz |
|---|---|---|---|---|
| 1 | Abbruch-Mails Fall-Freischaltung | ½ Tag | hoch | Tage |
| 2 | Google Unternehmensprofil + ProvenExpert | ½ Tag | mittel | Wochen |
| 3 | Kostenrechner `/kostenrechner` | 2–3 Tage | hoch | 2–4 Monate |
| 4 | Mobbingtagebuch-Cluster + Vorlage | 1–2 Tage | hoch | 2–4 Monate |
| 5 | Logbuch: Zeitstempel/Revisionen sichtbar machen | 1–2 Tage | mittel | sofort im Funnel |
| 6 | Foren-Präsenz (laufend) | 1 h/Woche | mittel | Wochen |
| 7 | Konflikttyp-Test öffentlich | 2 Tage | mittel | Monate |
| 8 | 5 Kurzvideos | 1–2 Tage | mittel | Monate |
| 9 | App in den Store | ? (offene Punkte) | mittel–hoch | Monate |
| 10 | Bundesland-Seiten (nach Datenprüfung) | 3–5 Tage | mittel | 3–6 Monate |

Punkt 1 und 2 brauchen keinen Deploy des Frontend-Backlogs. Punkt 3–5
schon — und dort liegen seit Wochen mehrere uncommittete Arbeitsstände
und nicht ausgeführte Migrationen (zuletzt `c1d2e3f4a5b6`). Das ist der
eigentliche Engpass: Marketing-Maßnahmen, die auf nicht deployte Seiten
verlinken, verpuffen.

---

## Quellen

Kostenrecht (Stand 01.06.2025, KostBRÄG 2025, BGBl. I Nr. 109):

- [Anlage 2 GKG](https://dejure.org/gesetze/GKG/Anlage_2.html) — Gerichtsgebührentabelle
- [§ 34 GKG](https://dejure.org/gesetze/GKG/34.html) — Wertgebühren, Fortschreibung > 500.000 €
- [Anlage 2 RVG](https://dejure.org/gesetze/RVG/Anlage_2.html) — Anwaltsgebührentabelle
- [§ 13 RVG](https://dejure.org/gesetze/RVG/13.html) — Wertgebühren, Fortschreibung > 500.000 €
- [Gerichtskostentabelle § 34 GKG / § 28 FamGKG mit Gebührensätzen](https://rvg-tabelle.de/gerichtskostentabelle-nach-%C2%A7-34-gkg-%C2%A7-28-famgkg-2025/) — Beleg für die Wertgleichheit GKG/FamGKG
- [FORIS: Gerichtskostentabelle 2026](https://www.foris.com/prozessfinanzierung/gerichtskosten/) — Gegenprobe 3,0/4,0/5,0
- [IWW: KostBRÄG 2025 — Anhebung der Regelwerte in Familiensachen](https://www.iww.de/rvgprof/gebuehren-in-nebengebieten/kostbraeg-2025-anhebung-der-regelwerte-in-familiensachen-f167646)

Markt- und Wettbewerbsumfeld:

- [FORIS Prozesskostenrechner](https://www.foris.com/prozesskostenrechner/), [smart-rechner](https://www.smart-rechner.de/prozesskosten/rechner.php) — Referenzrechner ohne Mediationsspalte
- [Karrierebibel: Mobbingtagebuch](https://karrierebibel.de/mobbingtagebuch/), [Arbeiterkammer: Mobbing-Tagebuch (PDF)](https://www.arbeiterkammer.at/beratung/arbeitundrecht/Arbeitsklima/Mobbing-Tagebuch.pdf), [betriebsrat.de](https://www.betriebsrat.de/news/beweisfuehrung-bei-mobbing-20127) — Beleg für den Manipulationseinwand
- [NO STALK (Polizeiliche Kriminalprävention)](https://www.polizei-beratung.de/medienangebot/detail/294-no-stalk-app/) — Referenzfall Dokumentations-App

Local SEO:

- [§ 15a EGZPO](https://dejure.org/gesetze/EGZPO/15a.html) und [Haufe: Schlichtungsverfahren bei Nachbarstreitigkeiten](https://www.haufe.de/id/beitrag/schlichtungsverfahren-bei-nachbarstreitigkeiten-HI6480990.html) — Umsetzung je Bundesland
