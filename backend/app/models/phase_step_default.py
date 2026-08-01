from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String, Text, UniqueConstraint

from app.database import Base

# Pseudo-Mediationstyp für WIEDERVERWENDBARE (globale) Schritte: ein Datensatz
# mit mediation_type == "*" gilt in JEDEM Mediationstyp. Er wird im Workflow
# Manager im eigenen Tab "Alle Typen" gepflegt und in der Fall-Auflösung
# (get_phase_steps) zu den typspezifischen Schritten dazugemischt – sortiert
# nach `position`, bei Gleichstand hinter dem typspezifischen Schritt.
# Ein globaler Schritt hat NIE eine variant_key (Varianten gehören zu genau
# einem Mediationstyp).
SHARED_MEDIATION_TYPE = "*"

# Gültige Werte für PhaseStepDefault.gate_mode (Fortschritts-Sperre, siehe dort).
# "self" ist der Standard und wird als NULL gespeichert.
GATE_MODES = ("self", "all", "none")
DEFAULT_GATE_MODE = "self"


class PhaseStepDefault(Base):
    """
    Konfigurierbare Standard-Schritte pro Mediationstyp und Phase.

    Ersetzt die früher hartkodierten Step-Listen aus dem Frontend
    (app/dashboard/[id]/_shared/phaseData.ts und EinleitungClient.tsx).
    Ein Admin kann hier pro (mediation_type, phase) festlegen, welche
    Schritte standardmäßig existieren, in welcher Reihenfolge, und ob
    sie aktuell aktiv sind.

    Pro-Fall-Abweichungen laufen weiterhin über die bestehenden Tabellen:
      - MediationCustomStep: zusätzliche Schritte für einen einzelnen Fall
      - MediationStepRule: Schritt für einen einzelnen Fall überspringen
        oder benötigte Rollen abweichend setzen

    variant_key (siehe MediationVariant) ordnet einen Schritt optional einer
    Variante des Mediationstyps zu (z.B. "Trennung mit Kindern"). NULL
    bedeutet: Standard-Schritt des Basistyps, der für jeden Fall dieses Typs
    gilt. Ein gesetzter Wert bedeutet: zusätzlicher/abweichender Schritt, der
    nur greift, wenn diese Variante für einen Fall gewählt wurde.
    """

    __tablename__ = "phase_step_defaults"
    __table_args__ = (
        UniqueConstraint(
            "mediation_type", "phase", "step_key", "variant_key",
            name="uq_phase_step_default_variant",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    # Mediationstyp (trennung, erbschaft, …) ODER SHARED_MEDIATION_TYPE ("*")
    # für einen wiederverwendbaren Schritt, der in allen Typen gilt.
    mediation_type = Column(String, nullable=False, index=True)
    phase = Column(String, nullable=False, index=True)
    step_key = Column(String, nullable=False)
    # NULL = Standard-Konfiguration des Mediationstyps. Sonst: key einer
    # MediationVariant (gültig innerhalb des jeweiligen mediation_type).
    variant_key = Column(String, nullable=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False, default="")
    placeholder = Column(Text, nullable=False, default="")
    reflection_mode = Column(String, nullable=True)
    # Komma-separierte Liste der Inhaltsarten der Karte, z.B. "video,text,frage".
    # Gültige Werte siehe Frontend CONTENT_TYPES (app/workspace/types.ts):
    # text, video, frage, videokonferenz, feedback, termin, vertrag, individuell.
    # "individuell" markiert einen Schritt, dessen tatsächlicher Inhalt NICHT
    # hier global gepflegt wird, sondern pro Fall (siehe MediationStepContent) –
    # der Workflow Manager legt dann nur Struktur/Platzhalter fest.
    # NULL = noch nicht klassifiziert (Bestandsdaten). Mehrere Arten pro Schritt
    # sind der Normalfall (heutige Konstellation: Video + Texteingabe + Reflexion).
    content_types = Column(String, nullable=True)
    # ── Dynamischer Block-Aufbau der Schritt-Seite (neues Modell) ─────────────
    # Geordnete Liste von Blöcken, aus denen die Teilnehmer-Seite dieses Schritts
    # zusammengesetzt wird. Ein Block ist ein dict:
    #   {"id": "b1", "type": "texteingabe",
    #    "config": {...},           # typ-spezifische Felder (frei, siehe Frontend
    #                               #   blockTypes.ts – neue Typen = kein DB-Eingriff)
    #    "visible_if": null}        # optionale Sichtbarkeitsbedingung (Flags, Zukunft)
    # NULL/[] = noch nicht als Blöcke definiert -> Frontend fällt auf die alten
    # content_types/Einzelspalten zurück (Rückwärtskompatibilität). Sobald blocks
    # gesetzt ist, ist es die maßgebliche Quelle für den Seitenaufbau.
    # Die tatsächlichen Antworten/Inhalte pro Fall liegen NICHT hier, sondern in
    # mediation_block_responses (Nutzer-/Mediator-/KI-Eingaben je Block).
    blocks = Column(JSON, nullable=True)
    # Sichtbarkeitsbedingung gegen mediations.flags, z.B.
    #   {"all": [{"flag": "glasl_zone", "eq": "lose_lose"}]}
    # NULL = immer sichtbar. Wird in get_phase_steps ausgewertet (is_visible);
    # erlaubt Eskalations-/Varianten-Schritte, die nur bei bestimmten Fall-Flags
    # erscheinen.
    visible_if = Column(JSON, nullable=True)
    # Video-URL, die der Mediator hinterlegt (nur relevant wenn "video" in
    # content_types; Platzhalter-Feld, solange Videos extern gehostet werden).
    video_url = Column(String, nullable=True)
    # Meeting-/Call-Link (nur relevant wenn "videokonferenz" in content_types),
    # z.B. ein fester Videoraum für diesen Schritt.
    meeting_url = Column(String, nullable=True)
    # Konkreter Frage-/Quiz-Inhalt (nur relevant wenn "frage" in content_types).
    question = Column(Text, nullable=True)
    # Vorlagentext für einen Vertrags-/Dokument-Schritt (nur relevant wenn
    # "vertrag" in content_types).
    contract_template = Column(Text, nullable=True)
    # Nur relevant für Ergebnis-Anzeige-Schritte (content_type "ergebnis"):
    # Phase, deren (freigegebene) Ergebnisse dieser Schritt allen Teilnehmern
    # anzeigen soll (globale Grundregel; konkrete Freigabe erfolgt pro Fall).
    # NULL = keine feste Quelle (Mediator kuratiert frei pro Fall).
    result_source_phase = Column(String, nullable=True)
    # Nur relevant, wenn "feedback" in content_types: welcher Fragebogen-Anlass
    # angezeigt wird. Gültige Werte: "after_videocall" | "before_contract"
    # (siehe FEEDBACK_QUESTIONS im Teilnehmer-Flow). NULL = Standard
    # (after_videocall).
    feedback_occasion = Column(String, nullable=True)
    # Komma-separierte Rollenliste, z.B. "owner,other_party". NULL = Standard
    # (owner, initiator, other_party) – analog zu MediationStepRule.required_roles.
    required_roles = Column(String, nullable=True)
    # ── Fortschritts-Sperre: wann gibt dieser Schritt den nächsten frei? ──────
    # Ohne Sperre konnten Teilnehmer beliebig im Schritt-Navigator vorspringen,
    # ohne einen Schritt abzuschließen. Gültige Werte (NULL = "self"):
    #   "self" – Standard: sobald ICH abgegeben habe, darf ich weiterarbeiten,
    #            auch während die andere Seite noch tippt.
    #   "all"  – gemeinsamer Takt: erst wenn ALLE laut required_roles nötigen
    #            Parteien abgegeben haben (z.B. vor einem gemeinsamen Termin).
    #   "none" – sperrt nie; optionaler Schritt, der übersprungen werden darf.
    # Unabhängig davon geht die PHASE erst weiter, wenn jeder Schritt von allen
    # nötigen Parteien abgeschlossen ist (siehe PhaseNotesClient).
    gate_mode = Column(String, nullable=True)
    position = Column(Integer, nullable=False, default=0)
    enabled = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
