# Fälle & Phasen-Inhalte (Workflow Manager)

Stand: 2026-07-07 (nach Migration `j3y4z5a6b7c8`). Dieses Dokument beschreibt,
welche Standard-Inhalte die vier Fall-Typen in allen Phasen haben, wo sie
gepflegt werden und wie die Seed-Migrationen zusammenhängen.

## Datenmodell in Kürze

Die Teilnehmer-Seiten eines Falls werden aus `phase_step_defaults` gerendert
(Backend: `backend/app/models/phase_step_default.py`). Ein Eintrag =
ein Schritt pro `(mediation_type, phase, step_key, variant_key)`. Der Inhalt
eines Schritts steht in `blocks` (geordnete JSON-Liste; Typen siehe Frontend-
Registry `app/workspace/blockTypes.ts` — neue Blocktypen brauchen keinen
DB-Eingriff). Antworten der Teilnehmer landen in `mediation_block_responses`.

- `variant_key = NULL` → Standard-Schritt des Typs; gesetzter Wert → Schritt
  gilt nur bei gewählter Variante (`mediation_variants`).
- `visible_if` prüft gegen `mediations.flags` (z. B. `glasl_zone`, gesetzt
  durch einen `skala`-Block mit `sets_flag`).
- Pro-Fall-Abweichungen: `MediationCustomStep`, `MediationStepRule`,
  `MediationStepContent` (Inhaltsart „individuell“).
- Bearbeitung im UI: Workspace → Workflow Manager
  (`app/workspace/components/WorkflowManager.tsx`, Seiten-Designer mit
  Live-Vorschau).

## Die vier Fall-Typen

| id | Label | Charakter |
|---|---|---|
| `trennung` | Trennung & Scheidung | Kinder/Betreuung, Wohnung, Finanzen; Kindeswohl im Zentrum |
| `erbschaft` | Erbschaft | Nachlass-Aufteilung; ideeller vs. materieller Wert, Familienfrieden |
| `nachbarschaft` | Nachbarschaft | Lärm/Grenzen/Pflanzen; Dauerbeziehung, praktische Absprachen |
| `geschaeft` | Geschäft & Organisation | Diagnose-getrieben (Konfliktart, Glasl-Eskalation), Eskalations-Weichen, Varianten |

## Phasen (0–6)

`einladung` (Onboarding, Vor-Phase) → `einleitung` → `themensammlung` →
`interessen` → `optionen` → `verhandlung` → `abschluss`
(Definition: `PHASES` in `app/workspace/types.ts`).

## Inhalte je Phase — private Typen (trennung, erbschaft, nachbarschaft)

Die drei privaten Typen teilen sich ein methodengetriebenes Gerüst; die
Typ-Spezifik kommt über angehängte Blöcke (h1, i2).

**Phase 0 – Onboarding** (`basis_einladung`): Willkommen + Vertraulichkeit;
Ablauf-Überblick über die 6 Phasen (Akkordeon, typspezifisch fokussiert) und
typspezifische Vorbereitungs-Hinweise (Trennung: Einkommen/Wohnung/
Betreuungszeiten; Erbschaft: Testament/Nachlassverzeichnis/Grundbuch;
Nachbarschaft: Vorfalls-Notizen/Fotos/Lageplan).

**Phase 1 – Einleitung** (6 Schritte, aus dem früheren EinleitungClient):
`einl_intro` (Willkommen + typspezifisches Kontext-Akkordeon: was diese
Mediationsart leisten kann), `einl_videocall` (Erstgespräch),
`einl_regeln` (Gesprächsregeln), `einl_rollen`, `einl_vertrauen`,
`einl_ziel` (Ziel positiv formulieren).

**Phase 2 – Themensammlung** (Bestandsaufnahme): `themen_ankommen`
(Rahmen, „erst sammeln, nicht lösen“-Zustimmung), `themen_statement`
(ununterbrochenes Eingangsstatement, Text + optionale Videobotschaft;
+ typspezifische Bereichs-Auswahl und Belastungs-Skala), `themen_zu_themen`
(Vorwurf → sachliches Thema, KI-Reframing), `themen_agenda` (Ranking,
KI-Zusammenfassung zur gemeinsamen Agenda, vertrauliche Notiz, Gate).

**Phase 3 – Interessen**: `int_eisberg` (Eisberg-Modell; + Hinweis auf
typische Interessen unter der Wasserlinie je Typ), `int_wfragen` (W-Fragen
nach dem Kern, Einigungs-Skala; + typspezifische Frage: Kindeswohl /
Wert-Erinnerung-Fairness / Dauerbeziehung), `int_reframing` (Vorwurf →
Bedürfnis, KI-Interessen), `int_perspektive` (zirkuläre Fragen,
KI-Gemeinsamkeiten).

**Phase 4 – Optionen**: `opt_sammeln_regel` (Brainstorming-Regel),
`opt_ideen` (Liste + Idee für beide Seiten; + typspezifische Denkanstöße:
Betreuungs-/Wohnmodelle, Aufteilungs-Verfahren wie Losverfahren/
Ausgleichszahlung, praktische Nachbarschafts-Regelungen), `opt_winwin`
(KI-Optionen auf Interessen-Basis).

**Phase 5 – Verhandlung**: `ver_bewerten` (Ranking + Zufriedenheits-Skala),
`ver_bedingungen` (Realitäts-Check; + typspezifische BATNA-Frage: Gericht /
Teilungsversteigerung / Ordnungsamt-Klage), `ver_vereinbarung` (wer/was/bis
wann + Zustimmung; + Rechts-Hinweis Notar/Anwalt bzw. Folgetermin).

**Phase 6 – Abschluss** (`basis_abschluss`, typspezifisch aus f9):
Vertragsvorlage (Scheidungsfolgen- / Erbauseinandersetzungs- /
Nachbarschafts-Vereinbarung), Rechts-Hinweis, Unterschrift, Feedback
(before_contract); + Wirkungs-Frage („Woran merkt ihr, dass es trägt?“) und
Folgetermin (trennung, erbschaft; nachbarschaft hat bereits einen).

## Inhalte je Phase — geschaeft

Ein Schritt pro Phase, Diagnose-getrieben:

- **Onboarding** `g_onboarding`: Einordnung (Verlustängste, Rollen,
  Struktur) + Prozess-Überblick (Diagnose zuerst) + Vorbereitung
  (konkrete Situationen notieren, Beobachtung statt Bewertung) +
  **Einsatzfeld-Auswahl** (Team & Abteilung / Führung & Betriebsrat /
  Gesellschafter & Nachfolge / Verträge & Lieferanten / IT- & Großprojekt /
  M&A) mit `sets_flag`-**map** → Flag `business_scope` = `intern` | `b2b`
  (kategorialer sets_flag-Modus, siehe block_responses.py).
- **Einleitung** `g_einleitung`: Regeln, Allparteilichkeit,
  „Veränderungsschmerz verstehen“ (Akkordeon), Videokonferenz.
- **Themensammlung** `g_diagnose` (+ `g_b2b_fakten` nur bei
  `business_scope=b2b`: strittige Punkte/SLA-Liste, Vertragslage-Text,
  Datei-Upload für Vertrag/Schriftverkehr): Konfliktart (Sach-/Beziehungs-/Rollen-/
  Strukturkonflikt), Glasl-Skala 1–9 mit `sets_flag: glasl_zone`
  (win_win ≤3, win_lose ≤6, lose_lose ≤9), systemische Fragen
  (Funktion des Konflikts, verdeckte Gewinne), vertrauliche Notiz.
- **Interessen** `g_interessen`: Harvard-Grundtext, Kern-Frage,
  KI-Interessen; + Einigungs-Skala, Perspektivwechsel-Frage,
  KI-Gemeinsamkeiten, transformativer Hinweis (Beziehung & Kommunikation).
- **Optionen** `g_optionen`: Liste + KI-Optionen; + Brainstorming-Regel
  (inkl. struktureller Lösungen) und Win-Win-Frage.
- **Verhandlung** `g_verhandlung`: bevorzugte Lösung, BATNA,
  KI-Gemeinsamkeiten; + Ranking, Tragfähigkeits-Skala,
  Umsetzungs-Zustimmung. Dazu zwei Eskalations-Schritte mit `visible_if`:
  `g_esk_extern` (glasl_zone=win_lose → externe Mediation empfohlen,
  Bezahl-Block 149 €, + Shuttle-Mediation-Hinweis) und `g_esk_grenzen`
  (lose_lose → Grenzen der Mediation: Machtwort/Trennung/arbeitsrechtlich).
  Zusätzlich `g_b2b_evaluativ` nur bei `business_scope=b2b`: evaluatives
  Element (Erklärung, Frage zur vertretbaren Lösung, Bezahl-Block
  „Rechtliche Ersteinschätzung" 190 €).
- **Abschluss** `g_abschluss`: Vertrag (Maßnahmen/wer-was-bis-wann/
  Follow-up), Unterschrift, Termin, Feedback; + Wirkungs-Frage fürs Team.

**Varianten** (`mediation_variants`): `fuehrungskraft` (Führungskraft
moderiert selbst — Rollen-Reflexion + Grenzen mediativer Führung im
Onboarding) und `extern` (externe, allparteiliche Mediation — einordnender
Onboarding-Schritt).

## Seed-/Anreicherungs-Migrationskette

| Revision | Inhalt |
|---|---|
| `c6r7s8t9u0v1` | Basis-Schritt je Phase für trennung/erbschaft/nachbarschaft |
| `d7s8t9u0v1w2` | Einleitung → 6 Content-Schritte (ersetzt `basis_einleitung`) |
| `e8t9u0v1w2x3` | Phasen 2–5 → methodengetriebene Schritte (ersetzt `basis_<phase>`) |
| `e9flags1visif` | `mediations.flags` + `visible_if`/`sets_flag`-Infrastruktur |
| `f9u0v1w2x3y4` | Typspezifische Vertiefung; aktualisiert nur noch `basis_abschluss` (Rest von e8 ersetzt) |
| `g0v1w2x3y4z5` | Typ `geschaeft` komplett (inkl. Diagnose, Eskalation, 2 Varianten) |
| `h1w2x3y4z5a6` | Typspezifische Blöcke in die Methoden-Schritte gemergt (Bereiche, BATNA, Rechts-Hinweise) |
| `i2x3y4z5a6b7` | Kontext-Vertiefung aller 4 Typen in allen Phasen (Onboarding-Ablauf/Vorbereitung, Einleitungs-Kontext, Eisberg-Hinweise, Options-Denkanstöße, geschaeft-Parität, Abschluss-Wirkungsfrage/Folgetermin) |
| `j3y4z5a6b7c8` | Business-Fokus geschaeft: Einsatzfeld-Auswahl → Flag `business_scope` (intern/b2b), B2B-Schritte `g_b2b_fakten`/`g_b2b_evaluativ` (visible_if), Shuttle- & Transformativ-Hinweise. Dazu Backend: sets_flag-**map**-Modus für auswahl-Blöcke |

Alle Anreicherungs-Migrationen sind idempotent (Insert/Append nur, wenn
step_key bzw. Block-id fehlt) und ändern manuell bearbeitete Schritte nicht
strukturell — der Workflow Manager bleibt die maßgebliche Pflege-Oberfläche.

⚠️ Deploy-Hinweis: Migrationen ab `a4p5q6r7s8t9` sind noch nicht auf dem
Server ausgeführt (Alembic auf dem Server: `~/.local/bin/alembic`).
