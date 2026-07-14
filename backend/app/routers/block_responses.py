"""
Antworten/Inhalte je Block eines Schritts (mediation_block_responses).

Hier landet der tatsächliche, pro Fall entstehende Inhalt der dynamischen
Blöcke: Texteingaben der Parteien, Antworten auf Fragen, Aufnahmen/Transkripte,
Mediator-Notizen und KI-Ausgaben. Getrennt nach Autor (jede Partei, Mediator,
KI), damit die Beiträge am Ende nebeneinander auswertbar sind – dort werden die
Reibungspunkte und Einigungschancen sichtbar.
"""
import os
import secrets
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import DB_PATH, get_db
from app.models.mediation import Mediation
from app.models.mediation_block_purchase import MediationBlockPurchase
from app.models.mediation_block_response import MediationBlockResponse
from app.models.mediation_note import MediationNote
from app.models.mediation_participant import MediationParticipant
from app.models.phase_step_default import PhaseStepDefault
from app.models.user import User
from app.paypal import PayPalError, capture_order, create_order
from app.security import get_current_db_user
from app.services import billing
from app.services.llm import ai_complete

router = APIRouter(prefix="/mediations", tags=["block_responses"])

# Max. Upload-Größe für Datei-Blöcke.
_MAX_UPLOAD_BYTES = 25 * 1024 * 1024
_UPLOAD_DIR = DB_PATH.parent / "block_uploads"


def _get_mediation(mediation_id: int, db: Session) -> Mediation:
    m = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mediation not found")
    return m


def _find_block(db: Session, mediation: Mediation, block_id: str):
    """Sucht einen Block anhand seiner id in den (für diesen Fall geltenden)
    phase_step_defaults. Gibt (step, block_dict) oder (None, None) zurück."""
    variant_filter = PhaseStepDefault.variant_key.is_(None)
    if mediation.variant_key:
        variant_filter = or_(variant_filter, PhaseStepDefault.variant_key == mediation.variant_key)
    steps = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == mediation.mediation_type,
            PhaseStepDefault.enabled.is_(True),
            variant_filter,
        )
        .all()
    )
    for s in steps:
        for b in s.blocks or []:
            if isinstance(b, dict) and b.get("id") == block_id:
                return s, b
    return None, None


def _apply_sets_flag(db: Session, mediation: Mediation, block: Optional[dict], value) -> None:
    """Setzt automatisch ein Fall-Flag, wenn der Block config.sets_flag hat.

    Zwei Modi:

    a) Numerisch (Skala) – nur eskalierend:
       config.sets_flag = {"flag": "glasl_zone",
                           "thresholds": [[3, "win_win"], [6, "win_lose"], [9, "lose_lose"]]}
       Der Zahlenwert (z.B. Glasl-Skala 1–9) wird der ersten Schwelle zugeordnet,
       deren Grenze er nicht überschreitet. Es wird nur ESKALIERT, nie deeskaliert
       (die Reihenfolge in thresholds = Eskalationsgrad; höhere Zone bleibt bestehen).

    b) Kategorial (Auswahl) – direkt gesetzt/überschreibbar:
       config.sets_flag = {"flag": "business_scope",
                           "map": {"Team & Abteilung": "intern",
                                   "Verträge & Lieferanten (B2B)": "b2b", …}}
       Die (String-)Antwort wird über map auf den Flag-Wert abgebildet. Kein
       Eskalations-Ranking – eine neue Auswahl überschreibt den alten Wert
       (die Teilnehmer sollen ihre Einordnung korrigieren können).
    """
    cfg = (block.get("config") or {}) if block else {}
    sf = cfg.get("sets_flag")
    if not isinstance(sf, dict):
        return
    flag = sf.get("flag")
    if not flag:
        return

    # ── Modus b: kategoriales Mapping (z.B. auswahl-Block) ──────────────────
    mapping = sf.get("map")
    if isinstance(mapping, dict):
        zone = mapping.get(str(value))
        if zone is None:
            return
        if (mediation.flags or {}).get(flag) == zone:
            return
        flags = dict(mediation.flags or {})
        flags[flag] = zone
        mediation.flags = flags
        from sqlalchemy.orm.attributes import flag_modified

        flag_modified(mediation, "flags")
        db.commit()
        return

    # ── Modus a: numerische Schwellen (z.B. skala-Block) ────────────────────
    thresholds = sf.get("thresholds")
    if not isinstance(thresholds, list) or not thresholds:
        return
    try:
        num = float(value)
    except (TypeError, ValueError):
        return

    zone = None
    zone_index = None
    for idx, item in enumerate(thresholds):
        if not isinstance(item, (list, tuple)) or len(item) < 2:
            continue
        try:
            if num <= float(item[0]):
                zone, zone_index = item[1], idx
                break
        except (TypeError, ValueError):
            continue
    if zone is None:  # über allen Schwellen -> höchste (letzte) Zone
        last = thresholds[-1]
        if isinstance(last, (list, tuple)) and len(last) >= 2:
            zone, zone_index = last[1], len(thresholds) - 1
    if zone is None:
        return

    # Nur eskalieren: aktuelle Zone-Position bestimmen.
    current = (mediation.flags or {}).get(flag)
    current_index = None
    for idx, item in enumerate(thresholds):
        if isinstance(item, (list, tuple)) and len(item) >= 2 and item[1] == current:
            current_index = idx
            break
    if current_index is not None and current_index >= zone_index:
        return

    flags = dict(mediation.flags or {})
    flags[flag] = zone
    mediation.flags = flags
    from sqlalchemy.orm.attributes import flag_modified

    flag_modified(mediation, "flags")
    db.commit()


def _maybe_set_flag_from_response(db: Session, mediation_id: int, payload) -> None:
    """Bei numerischen (Skala) und String-Antworten (Auswahl): Block nachschlagen
    und ggf. Flag setzen – siehe _apply_sets_flag (thresholds- vs. map-Modus)."""
    if isinstance(payload.value, bool) or not isinstance(payload.value, (int, float, str)):
        return
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        return
    _step, block = _find_block(db, mediation, payload.block_id)
    _apply_sets_flag(db, mediation, block, payload.value)


# Rollen, die im Namen des Falls (Mediator-Sicht) schreiben/alle Antworten lesen.
_MEDIATOR_ROLES = {"mediator", "owner", "admin"}


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


def _require_paid_participant(mediation_id: int, user: User, db: Session) -> MediationParticipant:
    """Wie `_require_participant`, erzwingt aber zusätzlich die Paywall: bei noch
    nicht bezahltem Fall wird für zahlungspflichtige Parteien mit 402 abgewiesen
    (Mediator/Admin ausgenommen, siehe billing.ensure_unlocked)."""
    participant = _require_participant(mediation_id, user, db)
    mediation = _get_mediation(mediation_id, db)
    billing.ensure_unlocked(mediation, participant, user, db)
    return participant


def _serialize(r: MediationBlockResponse) -> dict:
    return {
        "id": r.id,
        "phase": r.phase,
        "step_key": r.step_key,
        "block_id": r.block_id,
        "block_type": r.block_type,
        "author_key": r.author_key,
        "author_source": r.author_source,
        "author_participant_id": r.author_participant_id,
        "value": r.value,
        "submitted": r.submitted,
        "updated_at": r.updated_at.isoformat() if r.updated_at else None,
    }


class BlockResponseUpsert(BaseModel):
    phase: str
    step_key: str
    block_id: str
    block_type: Optional[str] = None
    value: Any = None
    submitted: bool = False
    # Nur für Mediator/Owner/Admin relevant: als KI-Beitrag ablegen (author_key="ai").
    as_ai: bool = False


@router.get("/{mediation_id}/block-responses")
def list_block_responses(
    mediation_id: int,
    phase: Optional[str] = None,
    step_key: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """
    Antworten eines Falls. Mediator/Owner/Admin sehen ALLE Beiträge (Grundlage
    der Auswertung); eine Konfliktpartei sieht ihre eigenen sowie KI- und
    freigegebene/geteilte Beiträge nicht automatisch – der Einfachheit halber
    liefert dieser Endpunkt für Parteien nur die EIGENEN Antworten zurück.
    """
    # Onboarding-Phase ("einladung") ist vor der Zahlung nutzbar (Start-Flow);
    # alle anderen Phasen bleiben paywall-geschützt.
    if phase == "einladung":
        own = _require_participant(mediation_id, current_user, db)
    else:
        own = _require_paid_participant(mediation_id, current_user, db)
    query = db.query(MediationBlockResponse).filter(
        MediationBlockResponse.mediation_id == mediation_id
    )
    if phase:
        query = query.filter(MediationBlockResponse.phase == phase)
    if step_key:
        query = query.filter(MediationBlockResponse.step_key == step_key)
    if own.role not in _MEDIATOR_ROLES:
        query = query.filter(MediationBlockResponse.author_key == str(own.id))
    rows = query.order_by(MediationBlockResponse.step_key, MediationBlockResponse.block_id).all()
    return [_serialize(r) for r in rows]


@router.put("/{mediation_id}/block-responses")
def upsert_block_response(
    mediation_id: int,
    payload: BlockResponseUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Legt den Beitrag des aktuellen Autors zu einem Block an oder aktualisiert ihn."""
    # Antworten der Onboarding-Phase (Start-Intake) sind vor der Zahlung erlaubt.
    if payload.phase == "einladung":
        own = _require_participant(mediation_id, current_user, db)
    else:
        own = _require_paid_participant(mediation_id, current_user, db)
    is_mediator = own.role in _MEDIATOR_ROLES

    if payload.as_ai:
        if not is_mediator:
            raise HTTPException(status_code=403, detail="Nur Mediator/Owner dürfen KI-Beiträge ablegen")
        author_key = "ai"
        author_source = "ai"
        author_participant_id = None
    else:
        author_key = str(own.id)
        author_source = "mediator" if is_mediator else "user"
        author_participant_id = own.id

    existing = (
        db.query(MediationBlockResponse)
        .filter(
            MediationBlockResponse.mediation_id == mediation_id,
            MediationBlockResponse.step_key == payload.step_key,
            MediationBlockResponse.block_id == payload.block_id,
            MediationBlockResponse.author_key == author_key,
        )
        .first()
    )
    if existing:
        existing.value = payload.value
        existing.submitted = payload.submitted
        existing.phase = payload.phase
        if payload.block_type:
            existing.block_type = payload.block_type
        db.commit()
        db.refresh(existing)
        _maybe_set_flag_from_response(db, mediation_id, payload)
        return _serialize(existing)

    row = MediationBlockResponse(
        mediation_id=mediation_id,
        phase=payload.phase,
        step_key=payload.step_key,
        block_id=payload.block_id,
        block_type=payload.block_type,
        author_key=author_key,
        author_source=author_source,
        author_participant_id=author_participant_id,
        value=payload.value,
        submitted=payload.submitted,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    _maybe_set_flag_from_response(db, mediation_id, payload)
    return _serialize(row)


# ── Bonus-Leistungen (kostenpflichtige "bezahlung"-Blöcke) ──────────────────

class BonusOrderRequest(BaseModel):
    block_id: str


class BonusCaptureRequest(BaseModel):
    block_id: str
    order_id: str


def _block_price(block: dict) -> tuple[float, str, str]:
    cfg = block.get("config") or {}
    try:
        price = float(cfg.get("price") or 0)
    except (TypeError, ValueError):
        price = 0.0
    currency = str(cfg.get("currency") or "EUR")
    title = str(cfg.get("title") or "Bonus-Leistung")
    return price, currency, title


@router.get("/{mediation_id}/bonus-purchases")
def list_bonus_purchases(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Käufe der aktuellen Partei (für die Freischaltung im Frontend)."""
    own = _require_participant(mediation_id, current_user, db)
    rows = (
        db.query(MediationBlockPurchase)
        .filter(
            MediationBlockPurchase.mediation_id == mediation_id,
            MediationBlockPurchase.participant_id == own.id,
        )
        .all()
    )
    return [
        {
            "block_id": r.block_id,
            "step_key": r.step_key,
            "title": r.title,
            "amount": r.amount,
            "currency": r.currency,
            "paid": r.paid,
        }
        for r in rows
    ]


@router.post("/{mediation_id}/bonus/create-order")
async def create_bonus_order(
    mediation_id: int,
    payload: BonusOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_participant(mediation_id, current_user, db)
    mediation = _get_mediation(mediation_id, db)
    _step, block = _find_block(db, mediation, payload.block_id)
    if not block or block.get("type") != "bezahlung":
        raise HTTPException(status_code=404, detail="Bonus-Block nicht gefunden")
    price, _currency, _title = _block_price(block)
    if price <= 0:
        raise HTTPException(status_code=400, detail="Diese Leistung ist kostenlos")
    try:
        order = await create_order(price, mediation_id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))
    return {"order_id": order["id"], "amount": price}


@router.post("/{mediation_id}/bonus/capture-order")
async def capture_bonus_order(
    mediation_id: int,
    payload: BonusCaptureRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    own = _require_participant(mediation_id, current_user, db)
    mediation = _get_mediation(mediation_id, db)
    step, block = _find_block(db, mediation, payload.block_id)
    if not block or block.get("type") != "bezahlung":
        raise HTTPException(status_code=404, detail="Bonus-Block nicht gefunden")
    price, currency, title = _block_price(block)
    try:
        result = await capture_order(payload.order_id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))
    if result.get("status") != "COMPLETED":
        raise HTTPException(status_code=400, detail="Zahlung nicht abgeschlossen")

    existing = (
        db.query(MediationBlockPurchase)
        .filter(
            MediationBlockPurchase.mediation_id == mediation_id,
            MediationBlockPurchase.participant_id == own.id,
            MediationBlockPurchase.block_id == payload.block_id,
        )
        .first()
    )
    if existing:
        existing.paid = True
        existing.amount = price
        existing.currency = currency
        existing.title = title
        existing.step_key = step.step_key if step else existing.step_key
        existing.paypal_order_id = payload.order_id
        existing.paid_at = datetime.now(timezone.utc)
    else:
        db.add(
            MediationBlockPurchase(
                mediation_id=mediation_id,
                participant_id=own.id,
                step_key=step.step_key if step else "",
                block_id=payload.block_id,
                title=title,
                amount=price,
                currency=currency,
                paid=True,
                paypal_order_id=payload.order_id,
                paid_at=datetime.now(timezone.utc),
            )
        )
    db.commit()
    return {"paid": True}


# ── KI-Block serverseitig ausführen ─────────────────────────────────────────

class BlockAiRequest(BaseModel):
    phase: str
    step_key: str
    block_id: str


@router.post("/{mediation_id}/block-ai/run")
def run_block_ai(
    mediation_id: int,
    payload: BlockAiRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Führt den Prompt eines KI-Blocks über die Eingaben des Falls aus und
    speichert die Ausgabe als KI-Beitrag (author_key='ai'). Nur Mediator/Owner."""
    own = _require_paid_participant(mediation_id, current_user, db)
    if own.role not in _MEDIATOR_ROLES:
        raise HTTPException(status_code=403, detail="Nur Mediator/Owner dürfen KI-Blöcke ausführen")
    mediation = _get_mediation(mediation_id, db)
    _step, block = _find_block(db, mediation, payload.block_id)
    if not block:
        raise HTTPException(status_code=404, detail="Block nicht gefunden")
    prompt = str((block.get("config") or {}).get("prompt") or "").strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Kein Prompt im Block hinterlegt")

    # Kontext sammeln: eingereichte Notizen + Text-Block-Antworten der Parteien.
    parts: list[str] = []
    notes = (
        db.query(MediationNote)
        .filter(MediationNote.mediation_id == mediation_id, MediationNote.submitted.is_(True))
        .all()
    )
    for n in notes:
        if n.content:
            parts.append(f"[{n.phase}] {n.content}")
    responses = (
        db.query(MediationBlockResponse)
        .filter(
            MediationBlockResponse.mediation_id == mediation_id,
            MediationBlockResponse.author_source != "ai",
        )
        .all()
    )
    for r in responses:
        v = r.value
        if isinstance(v, (str, int, float)):
            text = str(v)
        elif isinstance(v, list):
            text = ", ".join(str(x) for x in v)
        elif isinstance(v, dict):
            text = "; ".join(f"{k}: {val}" for k, val in v.items())
        else:
            text = ""
        if text.strip():
            parts.append(f"[{r.phase}/{r.block_type}] {text}")

    inputs_text = "\n".join(parts) if parts else "(noch keine Eingaben)"
    full_prompt = f"{prompt}\n\nEingaben der Parteien:\n{inputs_text}"
    output = ai_complete(full_prompt, max_tokens=800)

    # Als KI-Beitrag speichern (author_key='ai').
    existing = (
        db.query(MediationBlockResponse)
        .filter(
            MediationBlockResponse.mediation_id == mediation_id,
            MediationBlockResponse.step_key == payload.step_key,
            MediationBlockResponse.block_id == payload.block_id,
            MediationBlockResponse.author_key == "ai",
        )
        .first()
    )
    if existing:
        existing.value = output
        existing.submitted = True
        existing.phase = payload.phase
        existing.block_type = block.get("type")
    else:
        db.add(
            MediationBlockResponse(
                mediation_id=mediation_id,
                phase=payload.phase,
                step_key=payload.step_key,
                block_id=payload.block_id,
                block_type=block.get("type"),
                author_key="ai",
                author_source="ai",
                author_participant_id=None,
                value=output,
                submitted=True,
            )
        )
    db.commit()
    return {"value": output}


# ── Datei-Upload für Datei-Blöcke ───────────────────────────────────────────

@router.post("/{mediation_id}/block-upload")
async def block_upload(
    mediation_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_paid_participant(mediation_id, current_user, db)
    contents = await file.read()
    if len(contents) > _MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="Datei zu groß (max. 25 MB)")
    ext = os.path.splitext(file.filename or "")[1].lower()
    # nur harmlose Extension übernehmen (keine Pfadtrenner o.ä.)
    if not ext or len(ext) > 12 or "/" in ext or "\\" in ext:
        ext = ""
    token = f"{mediation_id}_{secrets.token_hex(16)}{ext}"
    _UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    with open(_UPLOAD_DIR / token, "wb") as out:
        out.write(contents)
    return {
        "url": f"/api/mediations/{mediation_id}/block-file?token={token}",
        "name": file.filename or token,
    }


@router.get("/{mediation_id}/block-file")
def block_file(
    mediation_id: int,
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_paid_participant(mediation_id, current_user, db)
    if not token.startswith(f"{mediation_id}_") or "/" in token or "\\" in token or ".." in token:
        raise HTTPException(status_code=400, detail="Ungültiger Token")
    path = _UPLOAD_DIR / token
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    return FileResponse(path)
