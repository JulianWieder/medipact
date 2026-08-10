# Konzept: Trennung im Arbeitsverhältnis („Kündigung")

Bauplan für ein Verfahren rund um die Beendigung von Arbeitsverhältnissen.
**Noch keine Umsetzung — reine Planung.** Stand 10.08.2026.

Anlass: Der Ratgeber-Artikel `kuendigung-ohne-gericht` liegt seit 15.07.2026 in
der Kategorie „Wirtschaftsmediation", ist aber von keiner Seite verlinkt, und
`PRICE_MATRIX` kennt kein Arbeitsverhältnis. Das Thema existiert bisher als
Text, nicht als Produkt.

> **Rechtlicher Vorbehalt:** Alle Paragrafen und Fristen in diesem Dokument sind
> Arbeitsstand und müssen vor der Umsetzung anwaltlich geprüft werden. Die
> Sperrzeit-Mechanik (§ 8) ist der Punkt, an dem ein falsch gebautes Verfahren
> echten Schaden anrichtet.

## 1. Der eigentliche Wettbewerber ist nicht das Gericht

Die übliche Marketing-Erzählung („Mediation ist schneller und günstiger als ein
Prozess") trägt im Arbeitsrecht **nicht**. Das Arbeitsgericht ist bewusst als
niedrigschwelliges Verfahren gebaut:

- Der **Gütetermin** (§ 54 ArbGG) findet in Kündigungsschutzsachen vorrangig und
  kurzfristig statt (§ 61a ArbGG) — er ist strukturell selbst schon eine
  Schlichtung, mit Richter und ohne Zusatzkosten.
- In erster Instanz gibt es **keine Erstattung** der gegnerischen Anwaltskosten
  (§ 12a ArbGG). Klagen ist damit für Beschäftigte kalkulierbar billig.
- Viele Gekündigte haben Rechtsschutzversicherung oder Gewerkschaft.
- Zusätzlich existiert die **Güterichter-Mediation** (§ 54 Abs. 6 ArbGG) —
  kostenlos, gerichtsintern.

**Konsequenz für die Positionierung:** Ein 399-€-Verfahren gewinnt gegen den
Gütetermin nicht über Preis und Tempo. Es gewinnt nur dort, wo der Gütetermin
gar nicht stattfindet. Alles andere ist ein Versprechen, das ein Justiziar oder
Fachanwalt in zwei Sätzen zerlegt.

## 2. Die vier tragfähigen Zuschnitte

| # | Fenster | Warum kein Gericht | Wer zahlt |
|---|---|---|---|
| **A** | **Vor der Kündigung** — Konflikt eskaliert, ausgesprochen ist nichts | Es gibt keinen Streitgegenstand, keine Frist, keinen Anwalt | Arbeitgeber (vermeidet Abfindung + Recruiting) |
| **B** | **Aufhebungsvertrag** — beide wollen auseinander | Nichts zu klagen, nur zu verhandeln | Arbeitgeber |
| **C** | **Kleinbetrieb** (§ 23 KSchG, ≤ 10 AN) bzw. Wartezeit < 6 Monate (§ 1 KSchG) | Kündigungsschutzklage weitgehend chancenlos — Mediation ist nicht die Alternative, sondern die einzige Option | Arbeitgeber, ggf. geteilt |
| **D** | **Restrukturierung / Sozialplan** — viele gleichartige Fälle | Massenverfahren, Gericht wäre parallel × n | Firmen-Abo |

**A ist der Kern.** Es ist das einzige Fenster, in dem medipact ein Angebot
macht, das sonst niemand macht: Der Anwalt kommt erst nach der Kündigung, der
Betriebsrat ist Partei, der Coach ist einseitig. D ist der einzige Zuschnitt mit
Abo-Logik und sollte in der Business-Tarif-Erzählung landen, nicht im B2C-Funnel.

**Nicht-Ziel:** die Wirksamkeit einer Kündigung. Das ist eine Rechtsfrage,
gehört vor Gericht, und medipact darf sie weder bewerten noch verhandeln.

## 3. Verhandlungsgegenstände — die Vorlage fürs Abgleich-Modul

Der Grund, warum dieser Typ technisch besser passt als fast alles andere im
Produkt: Der Verhandlungsgegenstand ist abschließend benennbar. Acht bis zehn
Positionen, jede einzeln gewichtbar, viele davon gegeneinander tauschbar.

| Position | Block | Typischer Tauschpartner |
|---|---|---|
| Beendigungsdatum | `datum` | Abfindungshöhe, Freistellung |
| Abfindung | `betrag` | Beendigungsdatum, Zeugnisnote |
| Zeugnisnote + Schlussformel (§ 109 GewO) | `auswahl` + `texteingabe` | fast alles — kostet den AG nichts |
| Freistellung (widerruflich/unwiderruflich) | `auswahl` | Resturlaub |
| Resturlaub & Überstunden | `betrag` | Freistellung |
| Nachvertragliches Wettbewerbsverbot | `auswahl` | Abfindung (Karenzentschädigung!) |
| Rückzahlung Fortbildungskosten | `betrag` | Abfindung |
| Firmenwagen / Geräte / Zugänge | `liste` | Beendigungsdatum |
| Sprachregelung nach außen | `texteingabe` | — (beidseitiger Gewinn) |
| Outplacement / Weiterbildung | `auswahl` | Abfindung |

Das ist Logrolling im Lehrbuchsinn: Die Zeugnisnote ist für den Arbeitgeber
nahezu kostenlos und für den Gekündigten hoch bewertet, die Abfindung umgekehrt.
Die bestehende Gewichtung ±2 mit Kontingent (siehe `project_abgleich_tausch`)
bildet genau diesen Handel ab — hier ohne jede Anpassung des Mechanismus.

## 4. Verortung im Typ-System

Zwei Optionen:

1. **Variante von `odr`** über das bestehende Varianten-System. Kein
   Migrationsaufwand am Preis, aber: falsches Framing. Die Gegenseite ist eine
   Privatperson, kein Unternehmen — Abrechnung, Ton und Schutzbedarf sind anders.
2. **Eigener Typ `arbeit`** (empfohlen) mit zwei Varianten:
   - `arbeit_klaerung` — Zuschnitt A, Trennung noch offen
   - `arbeit_beendigung` — Zuschnitt B/C, Trennung steht fest

Bei Option 2 zu ergänzen: `PRICE_MATRIX["arbeit"]`, `BILLING_MODEL["arbeit"]`,
Aufnahme in `ODR_TYPES` (damit Firmenkunden den Typ im Abo anlegen dürfen),
Label in `invoice_pdf.TYPE_LABELS`, `logbuchMeta`-Bereich, Typ-Auswahl im
Onboarding, `phase_step_defaults` für alle Phasen.

## 5. Phasen-Mapping

| Inhalt | Phase | Blöcke |
|---|---|---|
| Fristen-Check, Betriebsgröße, Kündigungsdatum, Rollenklärung | **Onboarding** | `datum`, `auswahl`, `gate` (§ 6), `hinweis` |
| Rahmen, Vertraulichkeit, ausdrücklicher Hinweis „ersetzt keine Rechtsberatung" | **Einleitung** | `textausgabe`, `zustimmung` |
| Was ist passiert — beide Sichten, getrennt erfasst | **Themensammlung** | `texteingabe`, `vertrauliche_notiz`, `ki_zusammenfassung` |
| Was braucht jede Seite wirklich (Sicherheit, Anerkennung, Planbarkeit, Ruhe im Team) | **Interessen** | `frage`, `ki_interessen` |
| Positionsliste aus § 3 befüllen und gewichten | **Optionen** | `liste`, `abgleich`, `ki_optionen` |
| Paket schnüren, Logrolling, Zustimmung | **Verhandlung** | `abgleich`, `ranking`, `ki_gemeinsamkeiten` |
| Eckpunktepapier + Sperrzeit-Warnung + Verweis auf anwaltliche Prüfung | **Abschluss** | `vertrag`, `unterschrift`, `hinweis` |

**Wichtig zum Abschluss:** Ergebnis ist ein **Eckpunktepapier**, kein
unterschriftsreifer Aufhebungsvertrag. Den setzt ein Anwalt auf. Alles andere
wäre Rechtsdienstleistung und zugleich das Sperrzeit-Risiko aus § 8.

## 6. Fristen-Gate (Pflicht)

Die Klagefrist für die Kündigungsschutzklage beträgt in der Regel **drei Wochen
ab Zugang der Kündigung** (§ 4 KSchG). Ein Verfahren, das mehrere Wochen läuft,
kann sie faktisch verbrennen.

- Beim Intake **Zugangsdatum der Kündigung** abfragen (`datum`, Pflichtfeld).
- Daraus Restfrist berechnen und **dauerhaft sichtbar** im Fall anzeigen — nicht
  als Callout im Ratgeber, sondern als Statusleiste im Verfahren.
- Unter einer Schwelle (Vorschlag: < 10 Tage Restfrist) ein `gate` mit
  ausdrücklicher Bestätigung: „Mir ist bekannt, dass die Frist unabhängig von
  dieser Mediation weiterläuft."
- Die Mediation kann vor, parallel oder nach Klageerhebung laufen — das ist
  Feature, nicht Problem, muss aber benannt werden.

## 7. Machtgefälle

Anders als bei Nachbarschaft oder Trennung sind die Parteien hier strukturell
ungleich: HR-Abteilung mit Routine und Anwalt gegen eine Einzelperson in einer
existenziellen Lage. Das ist kein Marketingpunkt, sondern eine Voraussetzung.

- `/einigung/gleichbehandlung` liefert das Argument bereits — hier gehört es ins
  Verfahren, nicht nur auf die Landingpage.
- Schreibformat hilft: Wer schriftlich und phasenweise antwortet, wird im Raum
  nicht überfahren.
- `vertrauliche_notiz` konsequent auf beiden Seiten anbieten.
- Zu prüfen: Hinweis auf Beratungsangebote (Gewerkschaft, Rechtsschutz,
  Fachanwalt) als fester Bestandteil des Onboardings der beschäftigten Seite.
  Kostet Conversion, ist aber die Bedingung dafür, dass das Verfahren fair ist.

## 8. Sperrzeit und Ruhen — das größte Schadensrisiko

Ein Aufhebungsvertrag kann eine **Sperrzeit beim Arbeitslosengeld** auslösen
(§ 159 SGB III, bis zu zwölf Wochen). Wird die ordentliche Kündigungsfrist nicht
eingehalten, kann der Anspruch zusätzlich **ruhen** (§ 158 SGB III). Für den
Abwicklungsvertrag gilt nach der Praxis der Bundesagentur dasselbe: Wer nach
einer ausgesprochenen Kündigung eine gesonderte Vereinbarung schließt und darin
auf die Klage verzichtet oder eine Abfindung annimmt, wirkt an der Beendigung
mit. Beides — Sperrzeit und Ruhen — kann im selben Fall zusammentreffen.
**Vor der Umsetzung anwaltlich absichern.**

Ein Verfahren, das eine Einigung herbeiführt, die dem Gekündigten drei Monate
ALG kostet, hat ihm geschadet, nicht geholfen. Deshalb:

- Sobald im `abgleich` ein Beendigungsdatum vor Ablauf der ordentlichen
  Kündigungsfrist erscheint → automatischer `hinweis`.
- Im Eckpunktepapier ein fester Abschnitt „sozialversicherungsrechtliche
  Folgen — vor Unterschrift prüfen lassen".
- Regelabfindung als Orientierung (§ 1a KSchG: 0,5 Monatsverdienste je
  Beschäftigungsjahr) — ausdrücklich als Orientierungswert, nicht als Anspruch.

## 9. Preis & Abrechnung

- `BILLING_MODEL["arbeit"] = "once"` — eine Rechnung, nicht pro Partei. Ein
  Gekündigter zahlt nicht dafür, über seine eigene Kündigung zu verhandeln.
- Bezahlt wird über den bestehenden `kostenuebernahme`-Block: Der Arbeitgeber
  lädt ein und übernimmt. Der Mechanismus ist seit 05.08.2026 gebaut, inklusive
  der Absicherung, dass ein abgebrochener PayPal-Vorgang den Fall nicht gratis
  freischaltet.
- Preis Einzelfall: 399 € analog zur ODR-Familie. Zuschnitt D läuft über die
  Business-Tarife (Light 1.000 €/Monat bis 10 Mediationen ⇒ rechnerisch 100 €
  je Trennung).
- Offen: ob Zuschnitt C (Kleinbetrieb) einen niedrigeren Einstieg braucht — dort
  ist der Arbeitgeber oft selbst eine Person mit drei Angestellten.

## 10. Zulauf / SEO

Das Suchvolumen bei „Kündigung erhalten was tun" ist groß, die Intention aber
**„wie viel Abfindung bekomme ich"** und **„muss ich klagen"** — nicht „ich
suche Mediation". Dasselbe Muster wie bei B2C insgesamt: Das Problem ist die
Frage, Mediation ist die Antwort.

- **Abfindungsrechner** analog `/kostenrechner`: Regelabfindung, Restfrist bis
  zur Klagefrist, Sperrzeit-Warnung. Stärkster Einzelhebel, gleiches Muster wie
  der bereits laufende Kostenrechner.
- `kuendigung-ohne-gericht` endlich einhängen: `relatedCases` auf der odrPage,
  `/konflikte`, und `related` in `mediation-am-arbeitsplatz` +
  `gericht-oder-mediation`.
- Landingpage erst, wenn der Typ existiert — sonst dieselbe Kannibalisierung,
  die auf der odrPage bewusst über `deepDive` statt eigener URL gelöst wurde.

## 11. Offene Entscheidungen

1. Eigener Typ `arbeit` oder Variante von `odr`? (Empfehlung: eigener Typ.)
2. Wird Zuschnitt A (vor der Kündigung) als eigenes Produkt vermarktet oder als
   Einstieg in denselben Typ?
3. Anwaltliche Prüfung von § 6 und § 8 — **vor** jeder Zeile Code.
4. Braucht das Eckpunktepapier ein Anwalts-Netzwerk als Anschlussleistung, oder
   endet medipact bewusst davor?
5. Zuschnitt D (Sozialplan/Restrukturierung): eigener Verfahrensablauf oder n×
   derselbe Fall über das Abo?
