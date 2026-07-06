# Konzept: Mediationstyp „Team-/Organisationskonflikt"

Bauplan, wie das Führungs-/Organisationskonflikt-Curriculum (Analyse & Dynamiken,
Rolle der Führungskraft, Intervention & Gesprächsführung) in die block-basierten
Kernphasen eingearbeitet wird. **Noch keine Umsetzung — reine Planung.**

## 1. Verortung als eigener Typ

Das Curriculum ist inhaltlich eine andere Welt als Trennung/Erbschaft/Nachbarschaft
(privat). Es gehört in einen **eigenen Mediationstyp** — entweder das in
`pricing.py` bereits angelegte `geschaeft` oder ein neuer Key `organisation`.

Zwei sinnvolle **Varianten** (über das bestehende Varianten-System):
- **„Führungskraft moderiert selbst"** — mediativ orientierte Führung, inkl.
  Grenzen-Blöcken (nicht allparteilich, Machtwort-Schwelle).
- **„Externe Mediation"** — neutrale dritte Person, volle Allparteilichkeit.

## 2. Phasen-Mapping (Inhalt → Phase → Blöcke)

| Curriculum-Inhalt | Phase | Blöcke |
|---|---|---|
| Rolle & Grenzen der Führungskraft (Allparteilichkeit vs. Vorgesetzter, Machtwort, Compliance-Grenze) | **Onboarding** | `akkordeon`/`hinweis` (Wissen), `auswahl` Selbst-Check „Welche Rolle nehme ich ein?", `vertrauliche_notiz` |
| Rahmen & Allparteilichkeit signalisieren, Gesprächsregeln; Veränderungsschmerz / Kübler-Ross (Psychoedukation) | **Einleitung** | `textausgabe`, `zustimmung` (Regeln), `akkordeon` (Change-Curve) |
| **Diagnose**: Konfliktart, Glasl-Eskalationsstufe, systemische Analyse (SKAT) | **Themensammlung** | siehe §3 (Kern-Neuerung) |
| Interessen hinter Positionen (Erhellung der Hintergründe) | **Interessen** | `frage`, `texteingabe`, `ki_interessen` |
| Lösungsoptionen sammeln (Brainstorming der Beteiligten) | **Optionen** | `liste`, `ki_optionen` |
| Bewertung + Deeskalation | **Verhandlung** | `ranking`/`auswahl`, `ki_gemeinsamkeiten`, `ki_reframing`, `hinweis` (Timeout/Tempo) |
| Verbindliche Vereinbarung (wer macht was bis wann) | **Abschluss** | `vertrag`, `unterschrift`, `termin` (Follow-up) |

Deeskalation (Reframing, Timeout, Tempo, Meta→Sachebene) ist **querschnittlich**:
`ki_reframing` + `hinweis`-Blöcke dort, wo es heiß wird (v.a. Verhandlung).

## 3. Diagnose-Blöcke im Detail (die eigentliche Neuerung)

Sitzt in der Themensammlung (bzw. einer eigenen frühen „Diagnose"-Sektion):

- **Konfliktart** → `auswahl` { Sach- · Beziehungs- · Rollen- · Strukturkonflikt }
  + `akkordeon` mit je einer Kurz-Erklärung + `ki_gemeinsamkeiten`, das aus den
  Schilderungen einen Vorschlag macht. Leitsatz als `hinweis`: „Strukturkonflikt
  nicht auf der Beziehungsebene lösen."
- **Glasl-Eskalationsstufe** → `skala` 1–9 (minLabel „Verhärtung", maxLabel
  „Gemeinsam in den Abgrund") + `hinweis` je Zone (1–3 Win-Win, 4–6 Win-Lose,
  7–9 Lose-Lose) + KI-Einschätzung aus den Freitexten. **Steuert die Eskalation
  (siehe §4).**
- **Veränderungsdynamik (Kübler-Ross)** → `textausgabe`/`akkordeon`
  (Verlustängste, Trauerphasen); optional `skala` „Wo steht das Team gefühlt?".
- **Systemische Analyse (SKAT)** → `frage`-Blöcke: „Welche Funktion hat der
  Konflikt im System?", „Welche verdeckten Gewinne haben die Parteien daran?",
  „Welche Muster/Glaubenssätze wiederholen sich?", „Historischer Kontext?"
  + `vertrauliche_notiz` (nur Führungskraft/Mediator).

## 4. Eskalationsregel (Glasl-Stufe als Schalter)

Genau der früher gewünschte Eskalationsmechanismus. Die in der Diagnose ermittelte
Glasl-Zone setzt ein **Flag** am Fall (`glasl_zone` = `win_win` | `win_lose` |
`lose_lose`), und Schritte/Blöcke werden über `visible_if` ein-/ausgeblendet:

- **Stufe 1–3 (Win-Win):** normaler mediativer Flow (Moderation, alle Optionen).
- **Stufe 4–6 (Win-Lose):** Zusatz-Schritt „Externe Mediation empfohlen" +
  Warn-`hinweis`; optional ein **Bonus-Block** „Externe:n Mediator:in hinzubuchen"
  (nutzt die vorhandene Bezahl-Bonus-Logik).
- **Stufe 7–9 (Lose-Lose):** Schritt „Grenzen der Mediation": `hinweis` auf
  Machtwort / Trennung / arbeitsrechtliche Schritte + `vertrauliche_notiz`; das
  Selbst-Moderations-Angebot wird ausgeblendet.

Die Zone kann automatisch aus der KI-Einschätzung/Skala gesetzt oder vom Mediator
bestätigt werden (Entscheidung offen, siehe §6).

## 5. Was technisch nötig wäre (bei Umsetzung)

1. **Neuer Typ**: Key + Label in `MEDIATION_TYPES` (types.ts) und `pricing.py`
   (Preis/Abrechnungsmodell), ggf. zwei Varianten.
2. **Seed-Migration**: Phasen-Schritte mit den obigen Blöcken (analog zu den
   bestehenden Seed-Migrationen).
3. **Flag-/Sichtbarkeits-System** (für die Eskalation — war schon skizziert):
   Spalten `mediations.flags` + `phase_step_defaults.visible_if`, ein kleiner
   `is_visible(cond, flags)`-Filter in `get_phase_steps`, und das Setzen des
   Flags aus der Glasl-Skala/KI.
4. **Optionale KI-Diagnose-Prompts** (Konfliktart/Glasl-Stufe aus Freitext) —
   läuft über die vorhandene Block-KI (`block-ai/run`) bzw. `ki_*`-Blöcke.

## 6. Entscheidungen (getroffen 2026-07-06)

- **Typ-Key**: `geschaeft` weiternutzen und zum vollen Typ „Geschäft &
  Organisation" ausbauen (aktuell nur Preis-Platzhalter in pricing.py:
  399 €, Einmalzahlung/„once"). ✔
- **Varianten**: BEIDE — „Führungskraft moderiert selbst" und „Externe
  Mediation". ✔
- **Eskalation**: automatisch aus Glasl-Skala/KI (setzt Flag, blendet
  Eskalations-Schritte ein). ✔
- **Alte Typen** (Trennung/Erbschaft/Nachbarschaft): voll ausbauen —
  Inhalte verfeinern UND Frameworks/Diagnostik ergänzen, typenspezifisch. ✔
- **Benennung „SKAT"**: offen — Quelle prüfen, sonst neutral „systemische
  Konfliktanalyse".

## 7. Umsetzung in 3 Stufen

- **Stufe 1 (Fundament):** Flag-/Sichtbarkeitssystem — `mediations.flags`,
  `phase_step_defaults.visible_if`, `is_visible()`-Filter in `get_phase_steps`,
  Flags-Endpunkt, `visible_if`-Editor im Designer. (Prerequisite der Eskalation.)
- **Stufe 2 (Neuer Typ):** `geschaeft` als voller Typ + zwei Varianten +
  Seed-Phasen (Diagnose: Konfliktart/Glasl/SKAT; Intervention nach 5-Phasen) +
  automatische Eskalation über die Glasl-Zone.
- **Stufe 3 (Alt-Ausbau):** Trennung/Erbschaft/Nachbarschaft fachlich vertiefen
  (typenspezifische Inhalte + Frameworks wie Harvard/BATNA + leichte Diagnostik).

## 7. Fachliche Anmerkungen (aus dem Review)

- Solide & korrekt: Glasl 9-Stufen + Zonen, Konfliktarten, Führungskraft ≠
  Mediator (Allparteilichkeit), 5-Phasen-Klärungsgespräch (= das Phasenmodell),
  Deeskalationstechniken.
- Kübler-Ross auf Wandel ist die „Change-Curve"-Adaption — guter Deutungsrahmen,
  aber die feste Stufenabfolge ist empirisch umstritten; nicht als Gesetz führen.
- „SKAT/SKATing": Methode inhaltlich sauber, Label als Standard-Tool aber wenig
  etabliert — Quelle/Benennung prüfen.
