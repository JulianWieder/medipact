"""Konflikt-Logbuch (kostenlos) – Einträge + Umwandlung in eine Mediation.

Ein Fall mit mode="logbuch" ist ein kostenloses Dokumentations-Logbuch: die
Nutzer:in hält Vorkommnisse, Gedanken, Gespräche, E-Mails, WhatsApp-Nachrichten
und Telefonate fest, BEVOR (oder ohne dass) eine Mediation gestartet wird.

Bewusst KEINE Paywall (billing.ensure_unlocked wird hier nicht aufgerufen) und
keine Gegenseiten-Kommunikation: Einladungen sind für Logbuch-Fälle geblockt
(siehe invites.create_invite). Die Form der Einträge kommt aus dem
WorkflowManager (phase="logbuch", step_key="logbuch_eintrag") – editierbar im
Designer, gespeichert wird {block_id: wert} in mediation_log_entries.content.
"""
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import pricing
from app.database import DB_PATH, get_db
from app.models.mediation import Mediation
from app.models.mediation_block_response import MediationBlockResponse
from app.models.mediation_log_entry import MediationLogEntry
from app.models.mediation_log_upload import MediationLogUpload
from app.models.mediation_participant import MediationParticipant
from app.models.phase_step_default import SHARED_MEDIATION_TYPE, PhaseStepDefault
from app.models.user import User
from app.paypal import PayPalError, capture_order, create_order
from app.prompts import get_prompt
from app.security import get_current_db_user
from app.services.llm import ai_complete

router = APIRouter(prefix="/mediations", tags=["logbuch"])

ENTRY_TYPES = {"vorkommnis", "gedanke", "gespraech", "email", "whatsapp", "telefonat"}

# Ein-Buch-Umbau: Der Bereich hängt am EINTRAG (mediation_log_entries.area),
# nicht mehr am Buch – pro Nutzer:in existiert genau ein Konflikt-Logbuch
# (siehe mediations.create_mediation). Werte = mediation_type-Keys.
AREAS = {
    "trennung", "erbschaft", "nachbarschaft", "verbraucher", "wg",
    "mietverhaeltnis", "arbeitsplatz",
    "odr", "schlichtung", "ecommerce", "b2b", "geschaeft",
}


def _check_area(value: Optional[str], fallback: str) -> str:
    """Bereich validieren; leer → Bereich des Buchs (Altbestand/Mobile-App)."""
    v = (value or "").strip().lower()
    if not v:
        return fallback
    if v not in AREAS:
        raise HTTPException(status_code=422, detail="Unbekannter Bereich.")
    return v

# Journal-Ausbau: Sichtbarkeit je Eintrag.
#   private  – Journal: sieht NUR die Autor:in (nie Mediator/Gegenseite).
#   personal – Dokumentation (Default): nur die Autor:in.
#   shared   – in die Mediation gepusht: alle Teilnehmer des Falls.
VISIBILITIES = {"private", "personal", "shared"}


def _visible_to(entry: MediationLogEntry, participant: MediationParticipant) -> bool:
    """Darf dieser Teilnehmer den Eintrag sehen?

    Autor:in sieht immer alles Eigene; Einträge ohne Autor (Altbestand) gelten
    als Einträge der Eigentümer:in und bleiben nicht-Autoren verborgen, außer
    sie sind explizit geteilt."""
    if (entry.visibility or "personal") == "shared":
        return True
    return entry.author_participant_id == participant.id


def _require_participant(mediation_id: int, user: User, db: Session) -> MediationParticipant:
    p = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )
    if not p:
        raise HTTPException(status_code=403, detail="Not allowed")
    return p


# Rollen, die im Logbuch NICHTS zu suchen haben. Der Kind-Zugang (Migration
# j5k6l7m8n9o0) darf den Betreuungsplan sehen – aber niemals die Einträge:
# das Logbuch ist das Gedächtnisprotokoll eines Elternteils über den Konflikt,
# oft über die andere Person. Ein Kind, das darin liest, ist der schlimmste
# denkbare Ausgang dieses Features.
LOGBUCH_EXCLUDED_ROLES = {"kind"}


def _require_logbuch_access(
    mediation_id: int, user: User, db: Session
) -> MediationParticipant:
    """Teilnahme UND Berechtigung für die Logbuch-Inhalte.

    Absichtlich getrennt von `_require_participant`: routers/betreuung.py
    braucht die reine Teilnahme-Prüfung weiterhin, weil der Kalender auch für
    den Kind-Zugang offensteht.
    """
    p = _require_participant(mediation_id, user, db)
    if (p.role or "") in LOGBUCH_EXCLUDED_ROLES:
        raise HTTPException(
            status_code=403,
            detail="Dieser Zugang sieht ausschließlich den Betreuungskalender.",
        )
    return p


def _get_mediation(mediation_id: int, db: Session) -> Mediation:
    m = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mediation not found")
    return m


def _parse_occurred_at(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=422, detail="Ungültiges Datum für occurred_at.")


def _serialize(e: MediationLogEntry, fallback_area: str = "") -> dict:
    return {
        "id": e.id,
        "entry_type": e.entry_type,
        "area": e.area or fallback_area or None,
        "occurred_at": e.occurred_at.isoformat() if e.occurred_at else None,
        "title": e.title,
        "content": e.content or {},
        "author_participant_id": e.author_participant_id,
        "visibility": e.visibility or "personal",
        "linked_mediation_id": e.linked_mediation_id,
        "ai_analysis": e.ai_analysis,
        "ai_analysis_at": e.ai_analysis_at.isoformat() if e.ai_analysis_at else None,
        "created_at": e.created_at.isoformat() if e.created_at else None,
        "updated_at": e.updated_at.isoformat() if e.updated_at else None,
    }


class LogEntryCreate(BaseModel):
    entry_type: str = "vorkommnis"
    area: Optional[str] = None  # Bereich des Eintrags (mediation_type-Key)
    occurred_at: Optional[str] = None  # ISO-Datum/Zeit des Ereignisses
    title: Optional[str] = None
    content: Optional[dict[str, Any]] = None  # {block_id: wert} gemäß WFM-Vorlage
    visibility: str = "personal"  # private | personal | shared


class LogEntryUpdate(BaseModel):
    entry_type: Optional[str] = None
    area: Optional[str] = None
    occurred_at: Optional[str] = None
    title: Optional[str] = None
    content: Optional[dict[str, Any]] = None
    visibility: Optional[str] = None


def _check_visibility(value: str) -> str:
    v = (value or "personal").strip().lower()
    if v not in VISIBILITIES:
        raise HTTPException(status_code=422, detail="Unbekannte Sichtbarkeit.")
    return v


@router.get("/{mediation_id}/logbuch/entries")
def list_entries(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Alle Logbuch-Einträge des Falls, neueste Ereignisse zuerst.

    Kein Paywall-Check: das Logbuch ist ein kostenloses Angebot. Zugriff nur
    für Teilnehmer. Sichtbarkeitsfilter (Journal-Ausbau): Nicht-Autoren –
    also Mediator/Gegenseite nach Umwandlung oder im verknüpften Fall – sehen
    ausschließlich Einträge mit visibility="shared"."""
    participant = _require_logbuch_access(mediation_id, current_user, db)
    m = _get_mediation(mediation_id, db)
    rows = (
        db.query(MediationLogEntry)
        .filter(MediationLogEntry.mediation_id == mediation_id)
        .all()
    )
    rows = [e for e in rows if _visible_to(e, participant)]
    # is_own steuert im Frontend Bearbeiten/Löschen/Teilen (Backend erzwingt
    # das zusätzlich in _get_own_entry).
    # Sortierung: Ereignisdatum absteigend, Einträge ohne Datum nach created_at.
    rows.sort(
        key=lambda e: (e.occurred_at or e.created_at or datetime.min),
        reverse=True,
    )
    return [
        {
            **_serialize(e, m.mediation_type),
            "is_own": e.author_participant_id == participant.id,
        }
        for e in rows
    ]


@router.post("/{mediation_id}/logbuch/entries")
def create_entry(
    mediation_id: int,
    payload: LogEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    participant = _require_logbuch_access(mediation_id, current_user, db)
    m = _get_mediation(mediation_id, db)

    entry_type = (payload.entry_type or "vorkommnis").strip().lower()
    if entry_type not in ENTRY_TYPES:
        raise HTTPException(status_code=422, detail="Unbekannte Eintragsart.")

    visibility = _check_visibility(payload.visibility)
    entry = MediationLogEntry(
        mediation_id=mediation_id,
        author_participant_id=participant.id,
        entry_type=entry_type,
        area=_check_area(payload.area, m.mediation_type),
        occurred_at=_parse_occurred_at(payload.occurred_at),
        title=(payload.title or "").strip() or None,
        content=payload.content or {},
        visibility=visibility,
        # Buch-Verknüpfung als Standard: neue Einträge landen automatisch im
        # verknüpften Fall – außer sie sind sensibel (private).
        linked_mediation_id=(
            m.linked_mediation_id if visibility != "private" else None
        ),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return _serialize(entry, m.mediation_type)


def _get_own_entry(
    mediation_id: int, entry_id: int, db: Session, user: User
) -> MediationLogEntry:
    participant = _require_logbuch_access(mediation_id, user, db)
    entry = (
        db.query(MediationLogEntry)
        .filter(
            MediationLogEntry.id == entry_id,
            MediationLogEntry.mediation_id == mediation_id,
        )
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    # Journal-Schutz: bearbeiten/löschen/analysieren darf nur die Autor:in;
    # fremde Einträge sind selbst dann tabu, wenn sie geteilt (shared) sind.
    if entry.author_participant_id != participant.id:
        raise HTTPException(status_code=403, detail="Nur eigene Einträge.")
    return entry


@router.patch("/{mediation_id}/logbuch/entries/{entry_id}")
def update_entry(
    mediation_id: int,
    entry_id: int,
    payload: LogEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    entry = _get_own_entry(mediation_id, entry_id, db, current_user)
    if payload.entry_type is not None:
        et = payload.entry_type.strip().lower()
        if et not in ENTRY_TYPES:
            raise HTTPException(status_code=422, detail="Unbekannte Eintragsart.")
        entry.entry_type = et
    if payload.area is not None:
        entry.area = _check_area(
            payload.area, _get_mediation(mediation_id, db).mediation_type
        )
    if payload.occurred_at is not None:
        entry.occurred_at = _parse_occurred_at(payload.occurred_at)
    if payload.title is not None:
        entry.title = payload.title.strip() or None
    if payload.content is not None:
        entry.content = payload.content
    if payload.visibility is not None:
        entry.visibility = _check_visibility(payload.visibility)
        # Wird ein Eintrag nachträglich als sensibel markiert, fliegt er aus
        # dem verknüpften Fall – „private" heißt private, ausnahmslos.
        if entry.visibility == "private":
            entry.linked_mediation_id = None
    db.commit()
    db.refresh(entry)
    return _serialize(entry, _get_mediation(mediation_id, db).mediation_type)


@router.delete("/{mediation_id}/logbuch/entries/{entry_id}")
def delete_entry(
    mediation_id: int,
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    entry = _get_own_entry(mediation_id, entry_id, db, current_user)
    db.delete(entry)
    db.commit()
    return {"ok": True}


# ═══════════════════════════════════════════════════════════════════════════
# Verknüpfung Logbuch ↔ Fall (Migration a7b8c9d0e1f2)
#
# Ein Logbuch ist KEIN Fall: es wird nirgends in einer Fall-Liste geführt
# (siehe mediations.get_all_mediations / FaelleListe). Stattdessen hängt die
# Nutzer:in Einträge an einen Fall – entweder das ganze Buch (Standard für
# neue Einträge, einmalig auch rückwirkend) oder einzelne Einträge. Im Fall
# erscheinen sie im Reiter „Logbuch" (list_linked_entries).
#
# Sichtbarkeit im Fall:
#   private  – wird gar nicht erst verknüpft und ist dort nie sichtbar.
#   personal – Autor:in + Mediator:in/Kanzlei-Sicht des Falls („verknüpft =
#              für den Mediator sichtbar"), NICHT die Gegenseite.
#   shared   – alle Beteiligten des Falls.
# ═══════════════════════════════════════════════════════════════════════════

class LinkRequest(BaseModel):
    # Ziel-Fall; None = Verknüpfung aufheben.
    mediation_id: Optional[int] = None
    # Nur bei der Buch-Verknüpfung: vorhandene Einträge mitnehmen.
    apply_to_existing: bool = True


def _linkable_case(
    case_id: Optional[int], user: User, db: Session
) -> Optional[Mediation]:
    """Ziel-Fall prüfen: existiert, ist eine Mediation, Nutzer:in ist beteiligt."""
    if case_id is None:
        return None
    case = db.query(Mediation).filter(Mediation.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Fall nicht gefunden")
    if (case.mode or "mediation").lower() == "logbuch":
        raise HTTPException(
            status_code=422, detail="Ein Logbuch kann nicht mit einem Logbuch verknüpft werden."
        )
    linked_as_participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == case.id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )
    if not linked_as_participant:
        raise HTTPException(status_code=403, detail="Sie sind an diesem Fall nicht beteiligt.")
    return case


@router.get("/{mediation_id}/logbuch/link-targets")
def link_targets(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Fälle, mit denen dieses Buch/seine Einträge verknüpft werden können.

    Das sind alle Mediationen, an denen die Nutzer:in beteiligt ist – Logbücher
    selbst sind ausgeschlossen."""
    _require_logbuch_access(mediation_id, current_user, db)
    book = _get_mediation(mediation_id, db)
    rows = (
        db.query(Mediation)
        .join(MediationParticipant, MediationParticipant.mediation_id == Mediation.id)
        .filter(
            MediationParticipant.user_id == current_user.id,
            # NULL-tolerant (Altbestand ohne mode): "!=" liefert sonst NULL.
            (Mediation.mode.is_(None)) | (Mediation.mode != "logbuch"),
        )
        .order_by(Mediation.id.desc())
        .all()
    )
    return {
        "book_linked_mediation_id": book.linked_mediation_id,
        "cases": [
            {
                "mediation_id": m.id,
                "title": m.title or "Mediation",
                "mediation_type": m.mediation_type,
                "status": m.status,
            }
            for m in rows
        ],
    }


@router.post("/{mediation_id}/logbuch/link")
def link_book(
    mediation_id: int,
    payload: LinkRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Das GANZE Logbuch mit einem Fall verknüpfen (oder die Verknüpfung lösen).

    Setzt den Standard-Fall des Buchs (neue Einträge erben ihn) und trägt ihn
    mit ``apply_to_existing`` einmalig auf die vorhandenen eigenen Einträge
    nach. Sensible Einträge (visibility="private") bleiben ausgenommen."""
    participant = _require_logbuch_access(mediation_id, current_user, db)
    book = _get_mediation(mediation_id, db)
    if (participant.role or "").lower() not in ("owner", "admin"):
        raise HTTPException(
            status_code=403, detail="Nur die Eigentümer:in kann das Logbuch verknüpfen."
        )
    case = _linkable_case(payload.mediation_id, current_user, db)
    previous = book.linked_mediation_id
    book.linked_mediation_id = case.id if case else None

    changed = 0
    if payload.apply_to_existing:
        own = (
            db.query(MediationLogEntry)
            .filter(
                MediationLogEntry.mediation_id == mediation_id,
                MediationLogEntry.author_participant_id == participant.id,
            )
            .all()
        )
        for e in own:
            if (e.visibility or "personal") == "private":
                continue
            if case is None:
                # Aufheben wirkt nur auf Einträge, die am bisherigen Standard-
                # Fall hingen – einzeln verknüpfte Einträge bleiben, wo sie sind.
                if e.linked_mediation_id is not None and e.linked_mediation_id == previous:
                    e.linked_mediation_id = None
                    changed += 1
            elif e.linked_mediation_id != case.id:
                e.linked_mediation_id = case.id
                changed += 1
    db.commit()
    return {
        "ok": True,
        "linked_mediation_id": book.linked_mediation_id,
        "entries_changed": changed,
    }


@router.put("/{mediation_id}/logbuch/entries/{entry_id}/link")
def link_entry(
    mediation_id: int,
    entry_id: int,
    payload: LinkRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Einen einzelnen Eintrag mit einem Fall verknüpfen / die Verknüpfung lösen.

    Bewusst ein eigener Endpunkt statt eines Felds in PATCH: die Mobile-App
    schickt beim Bearbeiten das ganze Objekt und würde eine Verknüpfung sonst
    stillschweigend zurücksetzen (dieselbe Falle wie bei ``visibility``)."""
    entry = _get_own_entry(mediation_id, entry_id, db, current_user)
    case = _linkable_case(payload.mediation_id, current_user, db)
    if case is not None and (entry.visibility or "personal") == "private":
        raise HTTPException(
            status_code=422,
            detail=(
                "Sensible Einträge bleiben privat und können nicht mit einem Fall "
                "verknüpft werden. Ändern Sie zuerst die Sichtbarkeit."
            ),
        )
    entry.linked_mediation_id = case.id if case else None
    db.commit()
    db.refresh(entry)
    return _serialize(entry, _get_mediation(mediation_id, db).mediation_type)


def _entry_fields(content: dict, labels: dict[str, str], file_url: Any) -> list[dict]:
    """Eintragsfelder als [{label, value|file}] – Labels aus der WFM-Vorlage.

    ``file_url`` schreibt die Datei-URL auf die fall-seitige Route um: der
    Mediator ist NICHT Teilnehmer des Logbuchs und käme über die Buch-Route
    nicht an den Anhang."""
    out: list[dict] = []
    for block_id, v in (content or {}).items():
        if v is None or v == "":
            continue
        label = labels.get(block_id, "")
        if isinstance(v, dict) and v.get("url"):
            out.append({
                "label": label,
                "file": {"name": v.get("name") or "Datei", "url": file_url(str(v.get("url")))},
            })
        elif isinstance(v, list):
            out.append({"label": label, "value": ", ".join(str(x) for x in v)})
        else:
            out.append({"label": label, "value": str(v)})
    return out


def _token_from_url(url: str) -> Optional[str]:
    marker = "token="
    idx = url.find(marker)
    return url[idx + len(marker):].split("&")[0] if idx >= 0 else None


@router.get("/{mediation_id}/logbuch/linked")
def list_linked_entries(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Reiter „Logbuch" IM FALL: alle mit diesem Fall verknüpften Einträge.

    Enthält zwei Quellen: ausdrücklich verknüpfte Einträge fremder Bücher und
    – für Bestandsfälle aus der Zeit vor der Verknüpfung – Einträge, die direkt
    an diesem Fall hängen (umgewandeltes Logbuch)."""
    case = _get_mediation(mediation_id, db)
    me = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    from app.services import tenancy

    is_staff = tenancy.can_view_mediation(current_user, case)
    if not me and not is_staff:
        raise HTTPException(status_code=403, detail="Not allowed")
    # „Verknüpft = für den Mediator sichtbar": Mediator:in des Falls und
    # Kanzlei-/Admin-Sicht sehen auch nicht ausdrücklich geteilte Einträge.
    sees_personal = is_staff or (me is not None and (me.role or "").lower() in ("mediator", "admin"))

    rows = (
        db.query(MediationLogEntry)
        .filter(
            (MediationLogEntry.linked_mediation_id == mediation_id)
            | (MediationLogEntry.mediation_id == mediation_id)
        )
        .all()
    )
    if not rows:
        return []

    # author_participant_id -> (user_id, Name) für „ist von mir" + Anzeige.
    author_ids = {e.author_participant_id for e in rows if e.author_participant_id}
    authors: dict[int, dict] = {}
    if author_ids:
        for p, u in (
            db.query(MediationParticipant, User)
            .outerjoin(User, User.id == MediationParticipant.user_id)
            .filter(MediationParticipant.id.in_(author_ids))
            .all()
        ):
            authors[p.id] = {
                "user_id": p.user_id,
                "name": (u.name if u else None) or (u.email if u else None) or "Beteiligte:r",
            }

    def _is_mine(e: MediationLogEntry) -> bool:
        a = authors.get(e.author_participant_id or -1)
        return bool(a and a["user_id"] == current_user.id)

    def _may_see(e: MediationLogEntry) -> bool:
        vis = e.visibility or "personal"
        if vis == "private":
            # Journal: niemals im Fall – auch nicht für die Autor:in selbst,
            # damit hier nichts steht, was aussieht, als wäre es im Fall.
            return False
        if vis == "shared":
            return True
        if _is_mine(e):
            return True
        # "personal" sieht der Mediator nur, wenn der Eintrag AUSDRÜCKLICH mit
        # diesem Fall verknüpft wurde. Einträge, die (aus der Zeit vor der
        # Verknüpfung) direkt am Fall hängen, bleiben privat wie zugesagt –
        # dort ist "In Mediation teilen" der bewusste Schritt.
        return sees_personal and e.linked_mediation_id == mediation_id

    visible = [e for e in rows if _may_see(e)]
    visible.sort(key=lambda e: (e.occurred_at or e.created_at or datetime.min), reverse=True)

    labels = _block_labels(db, case.mediation_type, "logbuch_eintrag")

    def _file_url(url: str) -> str:
        token = _token_from_url(url)
        return (
            f"/api/mediations/{mediation_id}/logbuch/linked-file?token={token}"
            if token else url
        )

    return [
        {
            **_serialize(e, case.mediation_type),
            # Die KI-Analyse ist persönliches Coaching der Autor:in und gehört
            # nicht in die Fall-Ansicht anderer.
            "ai_analysis": e.ai_analysis if _is_mine(e) else None,
            # Gerendert wird ausschließlich "fields" (mit Labels und
            # fall-seitigen Datei-URLs); das Rohformat mit den Buch-URLs wäre
            # hier nur eine zweite, nicht abrufbare Quelle.
            "content": {},
            "is_own": _is_mine(e),
            "author_name": (authors.get(e.author_participant_id or -1) or {}).get("name"),
            "source": "linked" if e.mediation_id != mediation_id else "case",
            "fields": _entry_fields(e.content or {}, labels, _file_url),
        }
        for e in visible
    ]


@router.get("/{mediation_id}/logbuch/linked-file")
def linked_file(
    mediation_id: int,
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Anhang eines verknüpften Logbuch-Eintrags – fall-seitig ausgeliefert.

    Der Mediator ist nicht Teilnehmer des Logbuchs; deshalb prüft diese Route
    den Zugriff über den FALL und lässt nur Tokens durch, die in einem hier
    sichtbaren Eintrag vorkommen."""
    if "/" in token or "\\" in token or ".." in token or not token.startswith("lb"):
        raise HTTPException(status_code=400, detail="Ungültiger Token")
    entries = list_linked_entries(mediation_id, db, current_user)
    allowed = any(
        f.get("file") and _token_from_url(str(f["file"].get("url"))) == token
        for e in entries
        for f in e.get("fields", [])
    )
    if not allowed:
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    path = _UPLOAD_DIR / token
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    return FileResponse(path)


class ConvertRequest(BaseModel):
    # Ein-Buch-Umbau: Bei einem Buch mit Einträgen aus MEHREREN Bereichen wird
    # nur der gewählte Bereich in eine (neue) Mediation überführt – das Buch
    # bleibt als Logbuch bestehen. Ohne area: bisheriges Verhalten (das ganze
    # Buch wird zur Mediation).
    area: Optional[str] = None


def _entry_area(e: MediationLogEntry, fallback: str) -> str:
    return (e.area or fallback or "").lower()


@router.post("/{mediation_id}/logbuch/convert")
def convert_to_mediation(
    mediation_id: int,
    payload: Optional[ConvertRequest] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Wandelt ein Logbuch (bzw. einen Bereich daraus) in eine Mediation um.

    Ohne ``area`` (oder wenn alle Einträge zum selben Bereich gehören): das
    Buch selbst wird zur Mediation (mode="mediation") und durchläuft den
    normalen Start-Flow (start_intake, Paketwahl, Einladung, Paywall).

    Mit ``area`` bei gemischtem Buch: es entsteht eine NEUE Mediation dieses
    Bereichs; die Einträge des Bereichs ziehen dorthin um (Chronologie der
    Fallaufnahme), das Konflikt-Logbuch bleibt mit den übrigen Einträgen
    bestehen (Ein-Buch-Prinzip)."""
    participant = _require_logbuch_access(mediation_id, current_user, db)
    if (participant.role or "").lower() not in ("owner", "admin"):
        raise HTTPException(status_code=403, detail="Nur die Eigentümer:in kann umwandeln.")
    mediation = _get_mediation(mediation_id, db)
    if mediation.mode != "logbuch":
        raise HTTPException(status_code=409, detail="Dieser Fall ist bereits eine Mediation.")

    from app.routers.mediations import _ensure_default_mediator

    entries = (
        db.query(MediationLogEntry)
        .filter(MediationLogEntry.mediation_id == mediation_id)
        .all()
    )
    fallback = mediation.mediation_type
    areas_present = {_entry_area(e, fallback) for e in entries}
    area = (payload.area if payload else None) or None
    if area is not None:
        area = _check_area(area, fallback)

    # Gemischtes Buch + gewählter Bereich → Bereich in NEUE Mediation abspalten.
    if area is not None and len(areas_present) > 1:
        new_m = Mediation(
            title=mediation.title or "Mediation",
            mediation_type=area,
            mode="mediation",
            description=mediation.description,
            status="draft",
            package=pricing.normalize_package(None),
            organization_id=None,
            is_paid=False,
        )
        db.add(new_m)
        db.commit()
        db.refresh(new_m)

        # Autoren der umziehenden Einträge als Teilnehmer der neuen Mediation
        # anlegen (gleiche Rolle) und author_participant_id ummappen – seit der
        # gelockerten Logbuch-Einladungssperre (Betreuungskalender) kann ein
        # Buch mehr als eine Teilnehmer:in haben.
        moving = [e for e in entries if _entry_area(e, fallback) == area]
        part_map: dict[int, int] = {}

        def _mapped_participant(old_id: Optional[int]) -> Optional[int]:
            if old_id is None:
                return None
            if old_id in part_map:
                return part_map[old_id]
            old_p = (
                db.query(MediationParticipant)
                .filter(MediationParticipant.id == old_id)
                .first()
            )
            new_p = MediationParticipant(
                mediation_id=new_m.id,
                user_id=old_p.user_id if old_p else current_user.id,
                role=(old_p.role if old_p else None) or "owner",
            )
            db.add(new_p)
            db.commit()
            db.refresh(new_p)
            part_map[old_id] = new_p.id
            return new_p.id

        # Eigentümer:in ist immer Teilnehmer der neuen Mediation.
        _mapped_participant(participant.id)
        for e in moving:
            e.mediation_id = new_m.id
            e.author_participant_id = _mapped_participant(e.author_participant_id)
        db.commit()

        _ensure_default_mediator(db, new_m)
        return {
            "mediation_id": new_m.id,
            "mode": new_m.mode,
            "status": new_m.status,
            "mediation_type": new_m.mediation_type,
            "split": True,
            "moved_entries": len(moving),
        }

    # Einheitliches Buch (oder keine Bereichswahl): Buch selbst umwandeln.
    if area is not None and mediation.mediation_type != area:
        mediation.mediation_type = area
    mediation.mode = "mediation"
    mediation.status = "draft"
    db.commit()

    # Jetzt (erst bei Umwandlung) den Standard-Mediator zuordnen – Logbücher
    # sind privat und haben bewusst keinen Mediator.
    _ensure_default_mediator(db, mediation)

    return {
        "mediation_id": mediation.id,
        "mode": mediation.mode,
        "status": mediation.status,
        "mediation_type": mediation.mediation_type,
        "split": False,
    }


# ═══════════════════════════════════════════════════════════════════════════
# Logbuch-Ausbau: KI-Analyse (nächste Schritte + psychologischer Tipp),
# Datei-Uploads und Premium-Stufe (einmalig 14,95 € – pricing.py).
#
# Kontingente (pricing.LOGBUCH_LIMITS):
#   free:    1 KI-Interpretation/Woche, 1 Datei-Upload/Woche
#   premium: 1 KI-Tipp/Tag, Uploads unbegrenzt
# ═══════════════════════════════════════════════════════════════════════════

# Uploads liegen im selben Verzeichnis wie Block-Uploads, aber mit eigenem
# "lb"-Token-Präfix und eigener (paywall-freier) Auslieferungsroute.
_MAX_UPLOAD_BYTES = 25 * 1024 * 1024
_UPLOAD_DIR = DB_PATH.parent / "block_uploads"

# Mindest-Substanz eines Eintrags, bevor überhaupt die KI gefragt wird –
# spart Kosten und verhindert banale Empfehlungen bei Einwort-Einträgen.
_MIN_ENTRY_CHARS = 80


def _plan(m: Mediation) -> str:
    return (m.logbuch_plan or "free").lower()


def _period_start(period: str, now: datetime) -> datetime:
    """Beginn des Kontingent-Zeitraums (UTC): Kalendertag oder -woche (ab Montag)."""
    day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    if period == "day":
        return day
    return day - timedelta(days=day.weekday())  # week


def _period_end(period: str, now: datetime) -> datetime:
    start = _period_start(period, now)
    return start + (timedelta(days=1) if period == "day" else timedelta(days=7))


def _analyses_used(db: Session, mediation_id: int, since: datetime) -> int:
    return (
        db.query(MediationLogEntry)
        .filter(
            MediationLogEntry.mediation_id == mediation_id,
            MediationLogEntry.ai_analysis_at.isnot(None),
            MediationLogEntry.ai_analysis_at >= since,
        )
        .count()
    )


def _uploads_used(db: Session, mediation_id: int, since: datetime) -> int:
    return (
        db.query(MediationLogUpload)
        .filter(
            MediationLogUpload.mediation_id == mediation_id,
            MediationLogUpload.created_at >= since,
        )
        .count()
    )


def _quota(db: Session, m: Mediation, kind: str) -> dict:
    """Kontingent-Status für "analyses" oder "uploads" (used/limit/Restlaufzeit)."""
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    cfg = pricing.logbuch_limits(_plan(m))[kind]
    limit, period = cfg["limit"], cfg["period"]
    if limit is None:
        return {"limit": None, "period": period, "used": 0, "remaining": None,
                "next_available_at": None}
    since = _period_start(period, now)
    used = (
        _analyses_used(db, m.id, since) if kind == "analyses"
        else _uploads_used(db, m.id, since)
    )
    remaining = max(limit - used, 0)
    return {
        "limit": limit,
        "period": period,
        "used": used,
        "remaining": remaining,
        "next_available_at": (
            None if remaining > 0 else _period_end(period, now).isoformat() + "Z"
        ),
    }


@router.get("/{mediation_id}/logbuch/status")
def logbuch_status(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Stufe + Kontingente – Grundlage für Quota-Anzeige und Premium-CTA."""
    _require_logbuch_access(mediation_id, current_user, db)
    m = _get_mediation(mediation_id, db)
    return {
        "plan": _plan(m),
        "premium_price_eur": pricing.LOGBUCH_PREMIUM_PRICE_EUR,
        "analyses": _quota(db, m, "analyses"),
        "uploads": _quota(db, m, "uploads"),
    }


# ── KI-Analyse eines Eintrags ───────────────────────────────────────────────

def _block_labels(db: Session, mediation_type: str, step_key: str) -> dict[str, str]:
    """block_id -> Label (prompt/label) aus der WFM-Vorlage – für lesbare Prompts."""
    row = (
        db.query(PhaseStepDefault)
        .filter(
            # inkl. globaler Schritte ("Alle Typen"): step_key ist phasenweit
            # eindeutig, deshalb reicht der IN-Filter ohne Vorrangregel.
            PhaseStepDefault.mediation_type.in_([mediation_type, SHARED_MEDIATION_TYPE]),
            PhaseStepDefault.phase == "logbuch",
            PhaseStepDefault.step_key == step_key,
            PhaseStepDefault.variant_key.is_(None),
        )
        .first()
    )
    labels: dict[str, str] = {}
    for b in (row.blocks or []) if row else []:
        if isinstance(b, dict) and b.get("id"):
            cfg = b.get("config") or {}
            labels[b["id"]] = str(cfg.get("prompt") or cfg.get("label") or b["id"])
    return labels


def _content_as_text(content: dict, labels: dict[str, str]) -> str:
    """Eintrags-/Intake-Werte als lesbaren Text ("Label: Wert" je Zeile)."""
    lines: list[str] = []
    for block_id, v in (content or {}).items():
        if v is None or v == "":
            continue
        label = labels.get(block_id, block_id)
        if isinstance(v, dict):  # datei_upload: {url, name}
            name = v.get("name") or "Datei"
            lines.append(f"{label}: [angehängte Datei: {name}]")
        elif isinstance(v, list):
            lines.append(f"{label}: {', '.join(str(x) for x in v)}")
        else:
            lines.append(f"{label}: {v}")
    return "\n".join(lines) or "(keine Angaben)"


def _entry_substance(entry: MediationLogEntry) -> int:
    """Zeichenzahl der Freitext-Substanz eines Eintrags (Qualitäts-Vorprüfung)."""
    total = len((entry.title or "").strip())
    for v in (entry.content or {}).values():
        if isinstance(v, str):
            total += len(v.strip())
    return total


def _parse_ai_json(raw: str) -> Optional[dict]:
    """JSON aus der KI-Antwort ziehen – tolerant gegenüber Code-Fences/Umtext."""
    text = (raw or "").strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        return None
    try:
        data = json.loads(text[start : end + 1])
    except ValueError:
        return None
    return data if isinstance(data, dict) else None


@router.post("/{mediation_id}/logbuch/entries/{entry_id}/analyze")
def analyze_entry(
    mediation_id: int,
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Analysiert einen Eintrag: 1–3 konkrete nächste Schritte + psychologischer Tipp.

    Verbraucht NUR dann Kontingent, wenn die KI tatsächlich eine Empfehlung
    liefert (Qualitäts-Gate: dünne Einträge → "skipped", kostenlos). Bereits
    analysierte Einträge geben ihr gespeichertes Ergebnis zurück."""
    participant = _require_logbuch_access(mediation_id, current_user, db)
    m = _get_mediation(mediation_id, db)
    entry = _get_own_entry(mediation_id, entry_id, db, current_user)

    if entry.ai_analysis:
        return {"status": "done", "analysis": entry.ai_analysis,
                "analyses": _quota(db, m, "analyses")}

    quota = _quota(db, m, "analyses")
    if quota["remaining"] == 0:
        return {
            "status": "quota_exhausted",
            "analyses": quota,
            "plan": _plan(m),
            "premium_price_eur": pricing.LOGBUCH_PREMIUM_PRICE_EUR,
        }

    # Qualitäts-Vorprüfung ohne KI-Kosten.
    if _entry_substance(entry) < _MIN_ENTRY_CHARS:
        return {
            "status": "skipped",
            "reason": (
                "Für eine wirklich hilfreiche Empfehlung ist der Eintrag noch zu "
                "knapp. Beschreiben Sie das Ereignis etwas ausführlicher – Ihr "
                "Kontingent wird dadurch nicht verbraucht."
            ),
            "analyses": quota,
        }

    # Kontext: Intake + bisherige Chronologie (kompakt).
    intake_labels = _block_labels(db, m.mediation_type, "logbuch_intake")
    entry_labels = _block_labels(db, m.mediation_type, "logbuch_eintrag")

    intake_rows = (
        db.query(MediationBlockResponse)
        .filter(
            MediationBlockResponse.mediation_id == mediation_id,
            MediationBlockResponse.phase == "logbuch",
            MediationBlockResponse.step_key == "logbuch_intake",
        )
        .all()
    )
    intake_text = _content_as_text(
        {r.block_id: r.value for r in intake_rows}, intake_labels
    )

    others = (
        db.query(MediationLogEntry)
        .filter(
            MediationLogEntry.mediation_id == mediation_id,
            MediationLogEntry.id != entry.id,
        )
        .all()
    )
    # Kontext nur aus Einträgen, die diese Teilnehmer:in sehen darf (Journal!).
    others = [e for e in others if _visible_to(e, participant)]
    others.sort(key=lambda e: (e.occurred_at or e.created_at or datetime.min))
    history_parts = []
    for e in others[-10:]:
        when = (e.occurred_at or e.created_at)
        datum = when.strftime("%d.%m.%Y") if when else "ohne Datum"
        text = _content_as_text(e.content or {}, entry_labels)
        if len(text) > 400:
            text = text[:400] + " …"
        steps = ""
        if e.ai_analysis and isinstance(e.ai_analysis, dict):
            titles = [
                s.get("titel", "") for s in e.ai_analysis.get("naechste_schritte", [])
                if isinstance(s, dict)
            ]
            if titles:
                steps = f"\n(Bereits empfohlen: {', '.join(t for t in titles if t)})"
        history_parts.append(f"– {datum} [{e.entry_type}]:\n{text}{steps}")
    history_text = "\n\n".join(history_parts) or "(noch keine früheren Einträge)"

    from app.routers.mediations import TYPE_LABELS_ANALYSE  # zirkelfrei zur Laufzeit

    now = datetime.now(timezone.utc)
    prompt = get_prompt(
        "logbuch_analyse",
        type_label=TYPE_LABELS_ANALYSE.get(m.mediation_type, m.mediation_type),
        heute=now.strftime("%d.%m.%Y"),
        intake_text=intake_text,
        history_text=history_text,
        entry_type=entry.entry_type,
        entry_text=_content_as_text(entry.content or {}, entry_labels),
    )
    raw = ai_complete(prompt, max_tokens=700)
    data = _parse_ai_json(raw)

    if not data or data.get("skip") is True or not data.get("naechste_schritte"):
        return {
            "status": "skipped",
            "reason": (
                "Die KI hat diesmal bewusst keine Empfehlung gegeben – der Eintrag "
                "bietet dafür (noch) zu wenig Anhaltspunkte. Ihr Kontingent wurde "
                "nicht verbraucht."
            ),
            "analyses": _quota(db, m, "analyses"),
        }

    analysis = {
        "einschaetzung": str(data.get("einschaetzung") or ""),
        "naechste_schritte": [
            {"titel": str(s.get("titel") or ""), "warum": str(s.get("warum") or "")}
            for s in data.get("naechste_schritte", [])
            if isinstance(s, dict) and s.get("titel")
        ][:3],
        "tipp": str(data.get("tipp") or ""),
    }
    entry.ai_analysis = analysis
    entry.ai_analysis_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.commit()
    db.refresh(entry)
    return {"status": "done", "analysis": analysis, "analyses": _quota(db, m, "analyses")}


# ── Datei-Upload (Foto vom halb leeren Schrank, Screenshots, Belege …) ──────

@router.post("/{mediation_id}/logbuch/upload")
async def logbuch_upload(
    mediation_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Datei-Upload fürs Logbuch – OHNE Paywall, aber mit Stufen-Quote
    (free: 1/Woche; premium: unbegrenzt)."""
    _require_logbuch_access(mediation_id, current_user, db)
    m = _get_mediation(mediation_id, db)

    quota = _quota(db, m, "uploads")
    if quota["remaining"] == 0:
        raise HTTPException(
            status_code=402,
            detail=(
                "Ihr kostenloses Kontingent (1 Datei pro Woche) ist aufgebraucht. "
                "Mit Logbuch-Premium (einmalig "
                f"{pricing.LOGBUCH_PREMIUM_PRICE_EUR:.2f} €) laden Sie beliebig "
                "viele Dateien hoch."
            ),
        )

    contents = await file.read()
    if len(contents) > _MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="Datei zu groß (max. 25 MB)")
    ext = os.path.splitext(file.filename or "")[1].lower()
    if not ext or len(ext) > 12 or "/" in ext or "\\" in ext:
        ext = ""
    token = f"lb{mediation_id}_{secrets.token_hex(16)}{ext}"
    _UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    with open(_UPLOAD_DIR / token, "wb") as out:
        out.write(contents)

    db.add(
        MediationLogUpload(
            mediation_id=mediation_id,
            token=token,
            name=file.filename or token,
            size_bytes=len(contents),
        )
    )
    db.commit()
    return {
        "url": f"/api/mediations/{mediation_id}/logbuch/file?token={token}",
        "name": file.filename or token,
        "uploads": _quota(db, m, "uploads"),
    }


@router.get("/{mediation_id}/logbuch/file")
def logbuch_file(
    mediation_id: int,
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_logbuch_access(mediation_id, current_user, db)
    if not token.startswith(f"lb{mediation_id}_") or "/" in token or "\\" in token or ".." in token:
        raise HTTPException(status_code=400, detail="Ungültiger Token")
    path = _UPLOAD_DIR / token
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    return FileResponse(path)


# ── Premium-Upgrade (einmalig 14,95 € pro Logbuch, via PayPal) ──────────────

class PayPalCaptureRequest(BaseModel):
    order_id: str


@router.post("/{mediation_id}/logbuch/upgrade/paypal/create-order")
async def logbuch_upgrade_create_order(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_logbuch_access(mediation_id, current_user, db)
    m = _get_mediation(mediation_id, db)
    if m.mode != "logbuch":
        raise HTTPException(status_code=409, detail="Dieser Fall ist kein Logbuch.")
    if _plan(m) == "premium":
        raise HTTPException(status_code=400, detail="Dieses Logbuch ist bereits Premium.")
    try:
        order = await create_order(pricing.LOGBUCH_PREMIUM_PRICE_EUR, mediation_id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))
    return {"order_id": order["id"], "amount_eur": pricing.LOGBUCH_PREMIUM_PRICE_EUR}


@router.post("/{mediation_id}/logbuch/upgrade/paypal/capture-order")
async def logbuch_upgrade_capture_order(
    mediation_id: int,
    payload: PayPalCaptureRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_logbuch_access(mediation_id, current_user, db)
    m = _get_mediation(mediation_id, db)
    if _plan(m) == "premium":
        return {"ok": True, "plan": "premium"}
    try:
        result = await capture_order(payload.order_id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))
    if result.get("status") != "COMPLETED":
        raise HTTPException(
            status_code=402,
            detail="Die Zahlung wurde von PayPal nicht als abgeschlossen gemeldet.",
        )
    m.logbuch_plan = "premium"
    db.commit()
    return {"ok": True, "plan": "premium"}
