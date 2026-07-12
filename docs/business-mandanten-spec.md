# Spezifikation: Firmenkunden-Mandantenfähigkeit ("kundenfähig")

Stand: 2026-07-11 · Status: Entwurf zur Freigabe · noch KEIN Code geändert

Dieses Dokument beschreibt den Umbau der aktuellen "Mandantenfähigkeit" von einem
**Anbieter-Modell** (Organization = Kanzlei/Praxis, die Mediatoren beschäftigt) zu
einem **Firmenkunden-Modell** (Organization = Unternehmen, das interne Konflikte
mediieren lässt). Es ist als Bauplan gedacht: Datenmodell, Rollen, Backend-Scoping,
Onboarding, Workspace-UI, Abrechnung, Migration und Umsetzungsreihenfolge.

---

## 1. Ausgangslage (Ist)

Heute bedeutet `Organization` einen **Mediations-Anbieter**:

- `backend/app/models/organization.py` — Doc-String: "Mandant (Kanzlei/Praxis).
  Ein Mandant kann mehrere Mediatoren haben; das Abo hängt am Mandanten."
- `backend/app/pricing.py`, Abschnitt *Mandanten-Abos*: Monatspreis =
  `base_eur + per_mediator_eur × (Mediatoren − included)`. Pläne `starter/praxis/kanzlei`,
  `max_mediators` je Plan.
- `backend/app/routers/organizations.py` — CRUD nur für globale Admins (`role=="admin"`).
  Mitglieder = **Mediatoren**; der Plan wird gegen die Mediatoren-Anzahl validiert.
- `users.organization_id` existiert bereits (Migration `k4z5a6b7c8d9`), gedacht als
  Zuordnung **Mediator → Kanzlei**.

Kritische Lücken für ein Firmenkunden-Modell:

1. **Fälle haben keine Org-Zuordnung.** `mediations` hat kein `organization_id`.
   `GET /mediations/all` gibt **jedem** Mediator/Admin **alle** Fälle zurück
   (`routers/mediations.py`, `get_all_mediations`). Kein Tenant-Scoping.
2. **Keine firmeneigene Admin-Rolle.** Rollen heute: `admin` (global), `mediator`,
   `party`/`owner`/`other_party`, `observer`. Ein "Firmen-Admin" mit eingeschränktem,
   auf sein Unternehmen begrenztem Zugriff fehlt.
3. **Onboarding ist B2C.** `app/dashboard/mediation/new/StartFlowClient.tsx` startet
   aus Sicht **einer Partei**, die einen Fall anlegt und die Gegenseite einlädt;
   Bezahlung pro Partei (Paywall in `app/services/billing.py`).
4. **Business-Abo-Semantik fehlt.** Der Preis hängt an der Mediatoren-Zahl, nicht an
   einem Firmen-Abo, das interne Fälle freischaltet.
5. **Konflikttypen nicht getrennt.** Alle vier Typen (`trennung`, `erbschaft`,
   `nachbarschaft`, `geschaeft`) sind überall verfügbar; im Business-Tarif sollen
   die privaten Typen wegfallen.

---

## 2. Zielbild (Soll)

`Organization` = **Firmenkunde** (ein Unternehmen = ein Tenant). Ein Tenant enthält:

- genau einen (oder mehrere) **Firmen-Admin(s)** (`firm_admin`),
- die **Firmen-Mediatoren** (`mediator`, `organization_id` gesetzt),
- die **Mitarbeiter/Beteiligten** (Parteien, `organization_id` gesetzt),
- die **Fälle** dieses Unternehmens (`mediations.organization_id`).

Kernprinzipien:

- **Tenant-Isolation:** Firmen-Admins und Firmen-Mediatoren sehen ausschließlich die
  Nutzer und Fälle **ihres** Unternehmens. Nur der globale `admin` (medipact-intern)
  sieht alles.
- **Firmen-Abo, Fälle inklusive** (gewählte Abrechnung): Das Abo hängt am Unternehmen.
  Interne Fälle sind ohne Pro-Partei-Paywall freigeschaltet, solange das Abo aktiv ist.
- **Business-Track nur `geschaeft`:** Firmen legen ausschließlich Business-Mediationen an;
  private Typen sind im Firmenkontext ausgeblendet.
- **B2C bleibt parallel:** Privatpersonen legen weiterhin ohne Unternehmen Fälle an
  (`organization_id = NULL`) mit bestehender Pro-Partei-Paywall. Der bestehende
  StartFlowClient-Flow bleibt für diesen Track unverändert.

### 2.1 Rollen-Änderung im Überblick

| Rolle | heute | künftig |
|---|---|---|
| `admin` | globaler medipact-Admin | unverändert (sieht alles, tenant-übergreifend) |
| `firm_admin` | — (neu) | Firmen-Admin: eingeschränkter Workspace, nur eigenes Unternehmen; darf Firmen-Mediatoren + Mitarbeiter anlegen, Konflikte beschreiben, Routinen anlegen |
| `mediator` | Kanzlei-Mediator | Firmen-Mediator (org-gebunden) **oder** medipact-Pool-Mediator (org = NULL) |
| `party`/`owner`/`other_party`/`observer` | B2C-Parteien | zusätzlich: Firmen-Mitarbeiter als Beteiligte (org gesetzt) |

---

## 3. Rollen- & Rechtematrix

`firm_admin` ist eine **tenant-begrenzte** Admin-Rolle. Maßgeblich ist immer
`user.organization_id` des Handelnden vs. des Ziel-Objekts.

| Fähigkeit | global `admin` | `firm_admin` (eigene Org) | Firmen-`mediator` | Partei |
|---|---|---|---|---|
| Alle Fälle aller Firmen sehen | ✅ | ❌ | ❌ | ❌ |
| Fälle der eigenen Firma sehen | ✅ | ✅ | ✅ | nur eigene Teilnahme |
| Fall anlegen (Firma) | ✅ | ✅ | ✅ | ❌ (B2C: ✅) |
| Konflikt beschreiben / Routine (Variante) zuordnen | ✅ | ✅ | ✅ | ❌ |
| Benutzermanager sehen | ✅ (alle) | ✅ (nur eigene Org) | ❌ | ❌ |
| Firmen-Mediator anlegen/zuordnen | ✅ | ✅ (in eigener Org) | ❌ | ❌ |
| Mitarbeiter/Beteiligte konfigurieren | ✅ | ✅ (eigene Org) | ✅ (im Fall) | ❌ |
| Globale Rollen (`admin`) vergeben | ✅ | ❌ | ❌ | ❌ |
| Workflow-Designer global bearbeiten | ✅ | ❌ (nur lesen/Routine wählen) | ❌ | ❌ |
| Abo/Plan der Firma ändern | ✅ | (offene Frage, s. §10) | ❌ | ❌ |

Wichtige Invariante: Ein `firm_admin` darf **niemals** ein Objekt (User/Fall) berühren,
dessen `organization_id` ≠ seiner eigenen ist — serverseitig erzwungen, nie nur im UI.

---

## 4. Datenmodell-Änderungen

### 4.1 `organizations` (Bedeutung ändern + Felder ergänzen)

Semantik wird von "Kanzlei" zu "Firmenkunde". Vorschlag Felder:

- `id`, `name` (unverändert)
- `plan` (bleibt, aber **Business-Pläne**, siehe §7) — Default künftig ein Business-Plan
- `is_active` (neu, Bool) — ob das Firmen-Abo aktiv ist (schaltet Fälle frei)
- `billing_email` / Rechnungsadresse (neu, optional) — Abrechnung am Unternehmen
- `created_at` (unverändert)

Doc-String von `Organization` anpassen (nicht mehr "Kanzlei/Praxis").

### 4.2 `users`

- `organization_id` bleibt (existiert), Bedeutung erweitert: gilt jetzt für
  `firm_admin`, Firmen-`mediator` **und** Firmen-Parteien.
- Neue Rolle `firm_admin` als zulässiger Wert (nur String, keine Schemaänderung nötig).

### 4.3 `mediations` — **neu: `organization_id`**

- Spalte `organization_id` (FK → `organizations.id`, **nullable**, indexiert).
- `NULL` = privater B2C-Fall (bestehendes Verhalten).
- gesetzt = Firmenfall; unterliegt Tenant-Scoping und Abo-Freischaltung.

### 4.4 Neue Alembic-Migration

- Aktueller Head: **`l5b6c7d8e9f0`** (verifiziert). Neue Migration setzt `down_revision`
  hierauf.
- Inhalt: `mediations.organization_id` hinzufügen (+ Index/FK), `organizations`
  um `is_active`/Billing-Felder erweitern.
- **Achtung Deployment-Schuld:** Laut Projektnotizen sind **alle Migrationen ab `a4…`
  noch NICHT auf dem Server ausgeführt** (inkl. `k4z5a6b7c8d9` Organizations). Die neue
  Migration reiht sich in diese noch nicht deployte Kette ein — Deployment muss die
  gesamte Kette in Reihenfolge fahren. HEAD.lock-/`commit-tree`-Workaround (siehe
  `env_medipact_mount_gotchas`) für Commits im Mount beachten.

---

## 5. Backend-Scoping (Endpunkte)

Zentraler Helper vorschlagen, z.B. `app/services/tenancy.py`:

```
def visible_org_ids(user) -> "all" | set[int] | None
def assert_same_org(user, obj_org_id)   # 403 wenn firm_admin/mediator fremde Org
def is_firm_admin(user) -> bool
```

Konkrete Änderungen:

1. **`GET /mediations/all`** (`get_all_mediations`): statt aller Fälle
   - `admin` → alle,
   - `firm_admin`/Firmen-`mediator` → nur `Mediation.organization_id == user.organization_id`,
   - Pool-`mediator` (org NULL) → wie heute die ihm zugeordneten/alle B2C-Fälle
     (Verhalten hier bewusst als offene Detailfrage markiert, §10).
2. **`POST /mediations`** (`create_mediation`): wenn der Ersteller eine
   `organization_id` hat und der Typ Business ist → `db_mediation.organization_id`
   stempeln. B2C bleibt NULL.
3. **`GET /mediations/{id}`, `/participants`, Content-Endpunkte:** zusätzlich zur
   Teilnehmer-Prüfung ein Tenant-Check für `firm_admin` (er ist nicht Teilnehmer, darf
   aber Fälle seiner Org sehen → neue Zugriffsregel „gleiche Org" statt nur „Teilnehmer").
4. **Benutzermanager** (`GET /auth/users/all`, `PATCH /auth/users/{id}/role`,
   `DELETE /auth/users/{id}`): für `firm_admin` auf die eigene Org filtern; Rollenwahl auf
   `{mediator, party}` begrenzen (kein `admin`, kein Anheben aus fremder Org). Neu
   angelegte/zugeordnete Nutzer erhalten automatisch die `organization_id` des Handelnden.
5. **`organizations.py`:** `_require_admin` aufweichen zu „global admin ODER firm_admin
   der betroffenen Org"; Mitglieder-Endpunkte org-scopen; Mediatoren-Zähl-/Plan-Logik
   an Business-Abo anpassen (§7).
6. **Mediator-Zuordnung** (`assign_mediator`, `_ensure_default_mediator`,
   `list_available_mediators`): für Firmenfälle nur Mediatoren **derselben Org**
   auswählbar; `_ensure_default_mediator` bei Firmenfällen ggf. auf einen Firmen-Default
   statt `settings.DEFAULT_MEDIATOR_EMAIL` (offene Frage §10).

### 5.1 Konflikttyp-Beschränkung

- In `pricing.py`/`types.ts` Business-Kontext = nur `geschaeft`. Fall-Erstellung im
  Firmen-Flow bietet nur `geschaeft` an; Backend weist bei gesetzter `organization_id`
  einen privaten Typ mit 422 ab. B2C weiter alle vier.

---

## 6. Abrechnung: Firmen-Abo, Fälle inklusive

Gewählte Variante: Das Unternehmen zahlt ein Abo; interne Fälle sind ohne Pro-Partei-
Paywall freigeschaltet.

- **`app/services/billing.py` → `ensure_unlocked`:** Ausnahme ergänzen — wenn
  `mediation.organization_id` gesetzt ist UND die zugehörige Organization `is_active`,
  dann `return` (freigeschaltet), analog zur bestehenden Admin-/Mediator-Ausnahme.
- **Keine Pro-Partei-Rechnungen** für Firmenfälle: `_ensure_start_invoices` /
  `owing_participants` überspringen zahlungspflichtige Parteien bei Firmenfällen
  (stattdessen ggf. eine Abo-Rechnung am Unternehmen — separat, außerhalb dieses Passes).
- **B2C unverändert:** Fälle mit `organization_id = NULL` behalten Pro-Partei-Paywall,
  Preis-Matrix und Rechnungen exakt wie heute.
- `mediation.status → active` (Start) darf für Firmenfälle nicht an fehlenden
  Parteizahlungen/Adressen scheitern — die Start-Guards in `update_mediation` müssen den
  Firmenfall vom B2C-Pfad unterscheiden.

---

## 7. Pricing (`pricing.py`)

- Abschnitt *Mandanten-Abos* zu **Business-Abos** umbenennen/umdeuten: Preis hängt am
  Unternehmen (Fälle inklusive), nicht mehr an der Mediatoren-Zahl. Sinnvolle Achsen:
  Anzahl Mitarbeiter/Sitze oder Anzahl paralleler Fälle statt „per_mediator". Konkrete
  Werte weiterhin als **Platzhalter (TODO Julian)**.
- Preis-Validierung `abo_plan_allows(plan, mediator_count)` entkoppeln von Mediatoren
  (nicht mehr die relevante Größe).
- `PRICE_MATRIX`/`BILLING_MODEL` für `geschaeft` bleiben für den B2C-Rand relevant,
  im Firmen-Track jedoch durch das Abo ersetzt.

---

## 8. Onboarding-Flow (Firmen-Admin)

Neuer, vom B2C-StartFlow getrennter Pfad. Reihenfolge laut Anforderung:

1. **Firmen-Admin registriert sich** → legt das Unternehmen an (Name, Kontakt, Plan).
   Der registrierende Nutzer wird `firm_admin` mit `organization_id` = neue Org.
   (Umsetzung: entweder Self-Service-Registrierung mit „Als Unternehmen starten" oder
   Einladung durch globalen Admin — Entscheidung §10.)
2. **Konflikte beschreiben:** Der Firmen-Admin beschreibt die Konflikte/Fälle
   (Titel, Beschreibung, Beteiligte). Legt damit Firmen-Fälle an (`organization_id`
   gestempelt, Typ `geschaeft`).
3. **Mediations-Routinen anlegen:** Zuordnung/Konfiguration von Mediations-Varianten
   (bestehendes `mediation_variants`/Workflow-Designer, aber lesend/wählend statt global
   editierend) — „Routine" = gewählte Variante/Flow je Fall bzw. Firmenvorlage.
4. **Firmen-Mediatoren anlegen** (Benutzermanager, org-scoped): Nutzer mit Rolle
   `mediator` in der eigenen Org erstellen/einladen.
5. **Mitarbeiter/Beteiligte konfigurieren:** Beteiligte je Fall aus dem eigenen
   Mitarbeiterkreis zuordnen (bestehende Invite-/Participant-Mechanik, org-scoped).

Der bestehende `StartFlowClient` bleibt für den privaten Track unverändert.

---

## 9. Workspace-UI

- **Rollenbasierte Sidebar** (`app/workspace/components/WorkspaceSidebar.tsx`,
  `types.ts WORKSPACE_NAV`): heute nur `isSuperAdmin` steuert den Admin-Eintrag.
  Neu: `role`-abhängige Navigation.
  - `firm_admin`: Übersicht (nur eigene Org), Meine Fälle (Org), **Benutzer** (Org-scoped
    Benutzermanager), Onboarding/Routinen; **kein** globaler Workflow-Designer, **keine**
    fremden Fälle, **keine** Mandanten-übergreifende Verwaltung.
  - `mediator` (Firma): wie heute, aber auf Org gefiltert.
  - `admin`: unverändert (alles).
- **`me/role`-Endpoint** (`auth.py`) um `organization_id` und `is_firm_admin` erweitern,
  damit das Frontend die Navigation korrekt gattern kann.
- **`BenutzerManager`** (`AdminBereich.tsx`): für `firm_admin` sichtbar, aber Datenquelle
  org-gefiltert und Rollen-Dropdown auf `{party, mediator}` reduziert; Löschen nur
  innerhalb der Org.
- **`MandantenManager.tsx`** umdeuten/umbenennen: statt „Kanzleien verwalten"
  entweder (global admin) „Firmenkunden verwalten" oder für `firm_admin` „Mein Unternehmen".
- `WorkspaceClient.tsx`/`page.tsx`: Zugriff für `firm_admin` erlauben (heute implizit
  Mediator/Admin-Workspace).

---

## 10. Offene Entscheidungen / Risiken

1. **Firmen-Admin-Registrierung:** Self-Service („Unternehmen anlegen" beim Signup) vs.
   nur durch globalen medipact-Admin eingerichtet? Beeinflusst Signup-Flow + Sicherheit.
2. **Darf `firm_admin` den Abo-Plan selbst ändern/upgraden** oder nur globaler Admin?
3. **Pool-Mediatoren:** Bleiben medipact-eigene Mediatoren (org = NULL), die Firmenfälle
   betreuen können, oder mediieren ausschließlich firmeneigene Mediatoren? Betrifft
   `assign_mediator`/`_ensure_default_mediator`/Sichtbarkeit.
4. **Preisachse Business-Abo** (Sitze vs. Fälle vs. Flat) — Werte offen (TODO Julian).
5. **Abo-Rechnung am Unternehmen** (Erzeugung/Zahlungsanbindung) ist bewusst NICHT Teil
   dieses Passes; nur die Freischalt-Logik (`is_active`) wird verdrahtet.
6. **Bestehende Daten:** vorhandene Orgs/Zuordnungen sind bislang als „Kanzleien" gedacht;
   Migration muss klären, ob Alt-Orgs als Firmenkunden übernommen oder neu angelegt werden
   (aktuell vermutlich nur Testdaten, da `k4z5a6b7c8d9` nicht deployt).

---

## 11. Umsetzungsreihenfolge (Vorschlag)

**Phase A — Datenmodell & Scoping (Backend):**
1. Migration: `mediations.organization_id` + `organizations.is_active`/Billing-Felder
   (auf Head `l5b6c7d8e9f0`).
2. `tenancy.py`-Helper + Rolle `firm_admin` in Rollen-Validierungen aufnehmen.
3. `get_all_mediations`, `create_mediation`, Fall-Detail-/Content-Guards org-scopen.
4. Benutzermanager-Endpunkte org-scopen + Rollenbeschränkung.
5. `ensure_unlocked`/Start-Guards: Firmen-Abo-Freischaltung, B2C unangetastet.
6. Konflikttyp-Beschränkung (Business = nur `geschaeft`).

**Phase B — Onboarding & UI (Frontend):**
7. `me/role` erweitern; rollenbasierte Sidebar/Navigation.
8. Firmen-Onboarding-Flow (Registrierung → Konflikte → Routinen → Mediatoren → Mitarbeiter).
9. `BenutzerManager`/`MandantenManager` org-scoped/umgedeutet.

**Phase C — Pricing & Abrechnung (separat):**
10. Business-Abo-Preislogik in `pricing.py` (Platzhalterwerte), Plan-Anzeige.
11. (später) Abo-Rechnung/Zahlungsanbindung am Unternehmen.

**Querschnitt:** B2C-Regression testen (Paywall, Pro-Partei-Rechnungen, StartFlowClient
unverändert); Tenant-Isolation testen (firm_admin sieht keine fremden Fälle/Nutzer).

---

## 12. Umsetzungsstand (2026-07-11)

Phase A–C wurden umgesetzt (Deploy noch offen). Migration `m6c7d8e9f0a1`
(Head, auf `l5b6c7d8e9f0`) reiht sich in die noch nicht deployte Kette ab `a4…`
ein und muss beim Deploy mitgefahren werden.

**Backend (fertig):**
- Modelle: `mediations.organization_id` (FK, nullable), `organizations.is_active`
  + `billing_email`. `Organization`-Doc auf Firmenkunde umgestellt.
- `app/services/tenancy.py`: neuer Helper (`is_firm_admin`, `is_tenant_scoped`,
  `can_view_mediation`, `can_manage_org`, `assert_same_org`).
- Rolle `firm_admin` in allen Rollen-Checks; `me/role` liefert `is_firm_admin`
  + `organization_id`; Benutzermanager (`/auth/users/*`) org-gescoped, Firmen-
  Admin darf nur party/mediator der eigenen Org verwalten.
- Neu: `POST /auth/org-members` (Firmen-Mitglied anlegen, Passwort-setzen-Mail)
  und `POST /auth/register-company` (Self-Service: Unternehmen + Firmen-Admin).
- Fälle: `create_mediation` stempelt Org + erzwingt Typ `geschaeft` + `is_paid`;
  `get_all_mediations`/`get_mediation`/`participants`/`assign_mediator`/
  `list_available_mediators` tenant-gescoped.
- Abrechnung: `billing.ensure_unlocked` schaltet Firmenfälle über aktives Abo
  frei; Firmenfälle haben keine zahlungspflichtigen Parteien; B2C unverändert.

**Frontend (fertig):**
- `UserRoleInfo` um `is_firm_admin`/`organization_id`; rollenbasierte Sidebar
  (Firmen-Admin ohne globalen Workflow-Designer/Rechnungen); Admin-Bereich für
  Firmen-Admin = org-gescopter Benutzermanager (ohne MandantenManager).
- `BenutzerManager`: Rollen auf party/mediator begrenzt + Formular „Mitglied
  anlegen" (`createOrgMember`).
- Proxys `/api/admin/org-members`, `/api/register-company`; öffentliche Seite
  `/auth/register-company`.
- `pricing.py`: Abschnitt auf Business-Abo (Firmenkunde) umgestellt, Labels
  Starter/Team/Unternehmen; Preiswerte weiterhin Platzhalter (TODO Julian).

**Bewusst offen / Folgeschritte:**
- Geführter Onboarding-Wizard (Konflikte beschreiben → Routinen) nutzt die
  vorhandene Fall-Erstellung + Varianten; ein eigener Schritt-für-Schritt-Flow
  ist noch nicht gebaut (Bausteine sind da).
- Abo-Rechnung/Zahlungsanbindung am Unternehmen (nur Freischalt-Logik verdrahtet).
- Preisachse Business-Abo final festlegen (Sitze vs. Fälle) + Werte füllen.
- Deploy inkl. Migrationskette; anschließend Regressionstest B2C + Tenant-Isolation.

---

## 13. Onboarding-Wizard (2026-07-11, umgesetzt)

Entscheidungen: kombiniert (Vollbild-Wizard beim 1. Login + persistente
Dashboard-Checkliste), Routinen = Auswahl aus Vorlagen, schlanker Fall-Flow mit
wenig Show, Beteiligte direkt am Fall.

- `app/workspace/components/FirmOnboarding.tsx`: `FirmOnboardingWizard`
  (5 Schritte: Firmenprofil → Mediatoren anlegen → Konflikt beschreiben/Fall
  anlegen → Routine+Mediator → Beteiligte einladen+Start) und
  `FirmOnboardingChecklist` (Dashboard-Karte, Fortschritt aus Daten abgeleitet).
- Reuse bestehender Endpunkte; neu in `api.ts`: `createMediationCase`
  (mediation_type="geschaeft", role="observer" → Firmen-Admin ist Manager, keine
  Konfliktpartei), `updateOrganization` um `billing_email`/`is_active` erweitert.
- Backend: `set_mediation_variant` nun auch für `firm_admin` (eigene Org)
  freigegeben; Invite/Update laufen über Teilnehmer-Zugriff (Firmen-Admin ist
  als Beobachter Teilnehmer des selbst erstellten Falls).
- WorkspaceClient: Wizard öffnet automatisch beim 1. Login (localStorage
  `medipact_firm_onboarding_seen_<email>`), Checkliste bis alle Schritte erledigt;
  Mediator-Leitfaden für Firmen-Admins ausgeblendet.

Damit ist der in §12 offene „geführte Onboarding-Wizard" umgesetzt. Weiterhin
offen: Abo-Rechnung/Zahlung am Unternehmen, finale Preisachse, Deploy + Tests.
