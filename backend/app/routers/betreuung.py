"""Betreuungskalender im Konflikt-Logbuch (Trennung): geplante vs. tatsächliche
Betreuungszeiten der Kinder.

Aufbau (Migration d2e3f4a5b6c7):

  • Serienregeln (mediation_care_rules) – Wochenmuster wie "jedes 2. Wochenende
    Fr 17:00 – So 18:00 bei Papa". Sie werden hier beim Lesen in konkrete
    Termine expandiert, nichts wird materialisiert.
  • Termine (mediation_care_times) – Einzeltermine (rule_id NULL) oder
    Overrides eines Serien-Vorkommens (rule_id + date). Dort werden die
    TATSÄCHLICHEN Zeiten (actual_start/actual_end), Status und Notiz erfasst.

Kostenlos wie das übrige Logbuch (keine Paywall), Sichtbarkeit je Zeile wie
bei Logbuch-Einträgen (private/personal/shared – Filter aus routers/logbuch).
"""
from datetime import date as date_cls
from datetime import datetime, time, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation_care_rule import MediationCareRule
from app.models.mediation_care_time import MediationCareTime
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.routers.logbuch import VISIBILITIES, _get_mediation, _require_participant
from app.security import get_current_db_user

router = APIRouter(prefix="/mediations", tags=["betreuung"])

STATUSES = {"geplant", "stattgefunden", "ausgefallen"}


# ── Helfer ──────────────────────────────────────────────────────────────────


def _visible(row, participant: MediationParticipant) -> bool:
    """Gleiche Regel wie logbuch._visible_to, aber für Regeln UND Termine."""
    if (row.visibility or "personal") == "shared":
        return True
    return row.author_participant_id == participant.id


def _parse_date(value: Optional[str], field: str) -> Optional[date_cls]:
    if not value:
        return None
    try:
        return date_cls.fromisoformat(value[:10])
    except ValueError:
        raise HTTPException(status_code=422, detail=f"Ungültiges Datum für {field}.")


def _parse_dt(value: Optional[str], field: str) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)
    except ValueError:
        raise HTTPException(status_code=422, detail=f"Ungültige Zeit für {field}.")


def _parse_hhmm(value: str, field: str) -> time:
    try:
        h, m = value.split(":")
        return time(int(h), int(m))
    except (ValueError, AttributeError):
        raise HTTPException(status_code=422, detail=f"Ungültige Uhrzeit für {field} (HH:MM).")


def _check_weekday(value: int, field: str) -> int:
    if not isinstance(value, int) or not 0 <= value <= 6:
        raise HTTPException(status_code=422, detail=f"{field} muss 0 (Mo) bis 6 (So) sein.")
    return value


def _check_visibility(value: str) -> str:
    if value not in VISIBILITIES:
        raise HTTPException(status_code=422, detail="Ungültige Sichtbarkeit.")
    return value


def _serialize_rule(r: MediationCareRule) -> dict:
    return {
        "id": r.id,
        "label": r.label,
        "caregiver": r.caregiver,
        "start_weekday": r.start_weekday,
        "start_time": r.start_time,
        "end_weekday": r.end_weekday,
        "end_time": r.end_time,
        "interval_weeks": r.interval_weeks or 1,
        "anchor_date": r.anchor_date,
        "valid_from": r.valid_from,
        "valid_until": r.valid_until,
        "visibility": r.visibility or "personal",
        "author_participant_id": r.author_participant_id,
    }


def _serialize_time(t: MediationCareTime) -> dict:
    return {
        "id": t.id,
        "rule_id": t.rule_id,
        "date": t.date,
        "planned_start": t.planned_start.isoformat() if t.planned_start else None,
        "planned_end": t.planned_end.isoformat() if t.planned_end else None,
        "actual_start": t.actual_start.isoformat() if t.actual_start else None,
        "actual_end": t.actual_end.isoformat() if t.actual_end else None,
        "status": t.status or "geplant",
        "caregiver": t.caregiver,
        "note": t.note,
        "visibility": t.visibility or "personal",
        "author_participant_id": t.author_participant_id,
        "swap_status": t.swap_status,
        "swap_requested_by": t.swap_requested_by,
        "swap_proposed_start": t.swap_proposed_start.isoformat() if t.swap_proposed_start else None,
        "swap_proposed_end": t.swap_proposed_end.isoformat() if t.swap_proposed_end else None,
        "swap_message": t.swap_message,
    }


def _rule_occurrences(
    rule: MediationCareRule, start: date_cls, end: date_cls
) -> list[tuple[date_cls, datetime, datetime]]:
    """Alle Vorkommen der Regel in [start, end] als (Datum, Plan-Beginn, Plan-Ende).

    Verankerung: anchor_date > valid_from > created_at bestimmt bei
    interval_weeks > 1, welche Wochen zur Serie gehören (Vergleich der
    Wochen-Montage, damit die Verankerung nicht am Wochentag hängt).
    """
    interval = max(1, rule.interval_weeks or 1)
    start_t = _parse_hhmm(rule.start_time, "start_time")
    end_t = _parse_hhmm(rule.end_time, "end_time")
    span_days = (rule.end_weekday - rule.start_weekday) % 7
    valid_from = _parse_date(rule.valid_from, "valid_from")
    valid_until = _parse_date(rule.valid_until, "valid_until")

    anchor = (
        _parse_date(rule.anchor_date, "anchor_date")
        or valid_from
        or (rule.created_at.date() if rule.created_at else start)
    )
    anchor_monday = anchor - timedelta(days=anchor.weekday())

    out: list[tuple[date_cls, datetime, datetime]] = []
    d = start
    while d <= end:
        if d.weekday() == rule.start_weekday:
            monday = d - timedelta(days=d.weekday())
            weeks = (monday - anchor_monday).days // 7
            in_series = weeks % interval == 0
            if (
                in_series
                and (valid_from is None or d >= valid_from)
                and (valid_until is None or d <= valid_until)
            ):
                out.append(
                    (
                        d,
                        datetime.combine(d, start_t),
                        datetime.combine(d + timedelta(days=span_days), end_t),
                    )
                )
            # Nach einem Treffer eine Woche weiterspringen wäre falsch, wenn
            # start==Treffer+1 – simpel Tag für Tag reicht (Bereiche sind kurz).
        d += timedelta(days=1)
    return out


# ── Serienregeln ────────────────────────────────────────────────────────────


class CareRuleCreate(BaseModel):
    label: Optional[str] = None
    caregiver: Optional[str] = None
    start_weekday: int
    start_time: str  # "HH:MM"
    end_weekday: int
    end_time: str
    interval_weeks: int = 1
    anchor_date: Optional[str] = None  # ISO-Datum
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    visibility: str = "personal"


class CareRuleUpdate(BaseModel):
    label: Optional[str] = None
    caregiver: Optional[str] = None
    start_weekday: Optional[int] = None
    start_time: Optional[str] = None
    end_weekday: Optional[int] = None
    end_time: Optional[str] = None
    interval_weeks: Optional[int] = None
    anchor_date: Optional[str] = None
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    visibility: Optional[str] = None


@router.get("/{mediation_id}/logbuch/betreuung/rules")
def list_rules(
    mediation_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    rules = (
        db.query(MediationCareRule)
        .filter(MediationCareRule.mediation_id == mediation_id)
        .order_by(MediationCareRule.start_weekday, MediationCareRule.start_time)
        .all()
    )
    return [_serialize_rule(r) for r in rules if _visible(r, participant)]


@router.post("/{mediation_id}/logbuch/betreuung/rules")
def create_rule(
    mediation_id: int,
    payload: CareRuleCreate,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    _check_weekday(payload.start_weekday, "start_weekday")
    _check_weekday(payload.end_weekday, "end_weekday")
    _parse_hhmm(payload.start_time, "start_time")
    _parse_hhmm(payload.end_time, "end_time")
    _check_visibility(payload.visibility)
    for f in ("anchor_date", "valid_from", "valid_until"):
        _parse_date(getattr(payload, f), f)
    if payload.interval_weeks < 1:
        raise HTTPException(status_code=422, detail="interval_weeks muss ≥ 1 sein.")

    rule = MediationCareRule(
        mediation_id=mediation_id,
        author_participant_id=participant.id,
        label=payload.label,
        caregiver=payload.caregiver,
        start_weekday=payload.start_weekday,
        start_time=payload.start_time,
        end_weekday=payload.end_weekday,
        end_time=payload.end_time,
        interval_weeks=payload.interval_weeks,
        anchor_date=payload.anchor_date,
        valid_from=payload.valid_from,
        valid_until=payload.valid_until,
        visibility=payload.visibility,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return _serialize_rule(rule)


def _get_own_rule(
    mediation_id: int, rule_id: int, participant: MediationParticipant, db: Session
) -> MediationCareRule:
    rule = (
        db.query(MediationCareRule)
        .filter(
            MediationCareRule.id == rule_id,
            MediationCareRule.mediation_id == mediation_id,
        )
        .first()
    )
    if not rule or not _visible(rule, participant):
        raise HTTPException(status_code=404, detail="Regel nicht gefunden.")
    if rule.author_participant_id != participant.id:
        raise HTTPException(status_code=403, detail="Nur eigene Regeln änderbar.")
    return rule


@router.patch("/{mediation_id}/logbuch/betreuung/rules/{rule_id}")
def update_rule(
    mediation_id: int,
    rule_id: int,
    payload: CareRuleUpdate,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    rule = _get_own_rule(mediation_id, rule_id, participant, db)

    data = payload.model_dump(exclude_unset=True)
    if "start_weekday" in data:
        _check_weekday(data["start_weekday"], "start_weekday")
    if "end_weekday" in data:
        _check_weekday(data["end_weekday"], "end_weekday")
    for f in ("start_time", "end_time"):
        if data.get(f):
            _parse_hhmm(data[f], f)
    for f in ("anchor_date", "valid_from", "valid_until"):
        if f in data:
            _parse_date(data[f], f)
    if "visibility" in data:
        _check_visibility(data["visibility"])
    if "interval_weeks" in data and (data["interval_weeks"] or 0) < 1:
        raise HTTPException(status_code=422, detail="interval_weeks muss ≥ 1 sein.")

    for key, value in data.items():
        setattr(rule, key, value)
    db.commit()
    db.refresh(rule)
    return _serialize_rule(rule)


@router.delete("/{mediation_id}/logbuch/betreuung/rules/{rule_id}")
def delete_rule(
    mediation_id: int,
    rule_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    rule = _get_own_rule(mediation_id, rule_id, participant, db)
    # Overrides der Serie mitlöschen – ohne Regel sind sie bedeutungslos.
    db.query(MediationCareTime).filter(
        MediationCareTime.mediation_id == mediation_id,
        MediationCareTime.rule_id == rule.id,
    ).delete()
    db.delete(rule)
    db.commit()
    return {"ok": True}


# ── Termine (Plan + Ist) ────────────────────────────────────────────────────


class CareTimeCreate(BaseModel):
    rule_id: Optional[int] = None  # gesetzt = Override eines Serien-Vorkommens
    date: str  # ISO-Datum des geplanten Beginns
    planned_start: Optional[str] = None  # ISO-Zeitstempel
    planned_end: Optional[str] = None
    actual_start: Optional[str] = None
    actual_end: Optional[str] = None
    status: str = "geplant"
    caregiver: Optional[str] = None
    note: Optional[str] = None
    visibility: str = "personal"


class CareTimeUpdate(BaseModel):
    date: Optional[str] = None
    planned_start: Optional[str] = None
    planned_end: Optional[str] = None
    actual_start: Optional[str] = None
    actual_end: Optional[str] = None
    status: Optional[str] = None
    caregiver: Optional[str] = None
    note: Optional[str] = None
    visibility: Optional[str] = None


@router.get("/{mediation_id}/logbuch/betreuung/termine")
def list_termine(
    mediation_id: int,
    from_: str = Query(alias="from"),
    to: str = Query(),
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Kalenderansicht: Serien-Vorkommen expandiert + Einzeltermine, je mit
    Plan- und Ist-Zeiten. Overrides (rule_id + date) werden in ihr Vorkommen
    hineingemischt."""
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    start = _parse_date(from_, "from")
    end = _parse_date(to, "to")
    if not start or not end or end < start or (end - start).days > 400:
        raise HTTPException(status_code=422, detail="Ungültiger Zeitraum.")

    rules = [
        r
        for r in db.query(MediationCareRule)
        .filter(MediationCareRule.mediation_id == mediation_id)
        .all()
        if _visible(r, participant)
    ]
    times = [
        t
        for t in db.query(MediationCareTime)
        .filter(
            MediationCareTime.mediation_id == mediation_id,
            MediationCareTime.date >= start.isoformat(),
            MediationCareTime.date <= end.isoformat(),
        )
        .all()
        if _visible(t, participant)
    ]
    overrides = {(t.rule_id, t.date): t for t in times if t.rule_id}

    items: list[dict] = []
    for rule in rules:
        for day, p_start, p_end in _rule_occurrences(rule, start, end):
            ov = overrides.pop((rule.id, day.isoformat()), None)
            item = {
                "key": f"r{rule.id}-{day.isoformat()}",
                "source": "regel",
                "rule_id": rule.id,
                "entry_id": ov.id if ov else None,
                "date": day.isoformat(),
                "label": rule.label,
                "caregiver": (ov.caregiver if ov and ov.caregiver else rule.caregiver),
                "planned_start": (
                    ov.planned_start.isoformat()
                    if ov and ov.planned_start
                    else p_start.isoformat()
                ),
                "planned_end": (
                    ov.planned_end.isoformat()
                    if ov and ov.planned_end
                    else p_end.isoformat()
                ),
                "actual_start": ov.actual_start.isoformat() if ov and ov.actual_start else None,
                "actual_end": ov.actual_end.isoformat() if ov and ov.actual_end else None,
                "status": (ov.status if ov else "geplant") or "geplant",
                "note": ov.note if ov else None,
                "visibility": (ov.visibility if ov else rule.visibility) or "personal",
                "author_participant_id": rule.author_participant_id,
                "swap_status": ov.swap_status if ov else None,
                "swap_requested_by": ov.swap_requested_by if ov else None,
                "swap_proposed_start": (
                    ov.swap_proposed_start.isoformat() if ov and ov.swap_proposed_start else None
                ),
                "swap_proposed_end": (
                    ov.swap_proposed_end.isoformat() if ov and ov.swap_proposed_end else None
                ),
                "swap_message": ov.swap_message if ov else None,
            }
            items.append(item)

    # Einzeltermine + verwaiste Overrides. Verbrauchte Overrides wurden oben
    # aus `overrides` gepoppt – was übrig ist, hat kein Serien-Vorkommen mehr
    # (Regel geändert) und wird als eigenständiger Termin gezeigt.
    for t in times:
        if t.rule_id and (t.rule_id, t.date) not in overrides:
            continue  # bereits in ein Serien-Vorkommen eingemischt
        items.append(
            {
                "key": f"t{t.id}",
                "source": "einzeltermin",
                **_serialize_time(t),
                "entry_id": t.id,
                "label": None,
            }
        )

    items.sort(key=lambda x: (x["date"], x.get("planned_start") or ""))
    # "me": eigene Teilnehmer-ID, damit der Client weiß, ob eine Tausch-Anfrage
    # von einem selbst stammt (Antwort-Buttons nur der Gegenseite zeigen).
    return {
        "items": items,
        "rules": [_serialize_rule(r) for r in rules],
        "me": participant.id,
    }


@router.post("/{mediation_id}/logbuch/betreuung/termine")
def create_termin(
    mediation_id: int,
    payload: CareTimeCreate,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    day = _parse_date(payload.date, "date")
    if not day:
        raise HTTPException(status_code=422, detail="date ist erforderlich.")
    if payload.status not in STATUSES:
        raise HTTPException(status_code=422, detail="Ungültiger Status.")
    _check_visibility(payload.visibility)
    if payload.rule_id is not None:
        # Override: Regel muss existieren; je Vorkommen nur EIN Override.
        rule = (
            db.query(MediationCareRule)
            .filter(
                MediationCareRule.id == payload.rule_id,
                MediationCareRule.mediation_id == mediation_id,
            )
            .first()
        )
        if not rule or not _visible(rule, participant):
            raise HTTPException(status_code=404, detail="Regel nicht gefunden.")
        existing = (
            db.query(MediationCareTime)
            .filter(
                MediationCareTime.mediation_id == mediation_id,
                MediationCareTime.rule_id == payload.rule_id,
                MediationCareTime.date == day.isoformat(),
            )
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Für diesen Termin gibt es bereits eine Erfassung – bitte bearbeiten.",
            )

    t = MediationCareTime(
        mediation_id=mediation_id,
        author_participant_id=participant.id,
        rule_id=payload.rule_id,
        date=day.isoformat(),
        planned_start=_parse_dt(payload.planned_start, "planned_start"),
        planned_end=_parse_dt(payload.planned_end, "planned_end"),
        actual_start=_parse_dt(payload.actual_start, "actual_start"),
        actual_end=_parse_dt(payload.actual_end, "actual_end"),
        status=payload.status,
        caregiver=payload.caregiver,
        note=payload.note,
        visibility=payload.visibility,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return _serialize_time(t)


@router.patch("/{mediation_id}/logbuch/betreuung/termine/{termin_id}")
def update_termin(
    mediation_id: int,
    termin_id: int,
    payload: CareTimeUpdate,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    t = (
        db.query(MediationCareTime)
        .filter(
            MediationCareTime.id == termin_id,
            MediationCareTime.mediation_id == mediation_id,
        )
        .first()
    )
    if not t or not _visible(t, participant):
        raise HTTPException(status_code=404, detail="Termin nicht gefunden.")
    if t.author_participant_id != participant.id:
        raise HTTPException(status_code=403, detail="Nur eigene Termine änderbar.")

    data = payload.model_dump(exclude_unset=True)
    if "status" in data and data["status"] not in STATUSES:
        raise HTTPException(status_code=422, detail="Ungültiger Status.")
    if "visibility" in data:
        _check_visibility(data["visibility"])
    if "date" in data:
        day = _parse_date(data["date"], "date")
        if not day:
            raise HTTPException(status_code=422, detail="date darf nicht leer sein.")
        data["date"] = day.isoformat()
    for f in ("planned_start", "planned_end", "actual_start", "actual_end"):
        if f in data:
            data[f] = _parse_dt(data[f], f)

    for key, value in data.items():
        setattr(t, key, value)
    db.commit()
    db.refresh(t)
    return _serialize_time(t)


# ── Betreuungszeiten-Tausch ─────────────────────────────────────────────────
# Nur bei GETEILTEN Terminen (visibility="shared"): ein Elternteil schlägt
# neue Zeiten vor, die Gegenseite nimmt an (Plan wird überschrieben) oder
# lehnt ab. Für Serien-Vorkommen legt der Client zuerst per POST …/termine
# einen Override an und ruft dann diesen Endpunkt auf.


class SwapRequest(BaseModel):
    proposed_start: str
    proposed_end: str
    message: Optional[str] = None


class SwapAnswer(BaseModel):
    akzeptieren: bool


def _get_shared_termin(
    mediation_id: int, termin_id: int, participant: MediationParticipant, db: Session
) -> MediationCareTime:
    t = (
        db.query(MediationCareTime)
        .filter(
            MediationCareTime.id == termin_id,
            MediationCareTime.mediation_id == mediation_id,
        )
        .first()
    )
    if not t or not _visible(t, participant):
        raise HTTPException(status_code=404, detail="Termin nicht gefunden.")
    if (t.visibility or "personal") != "shared":
        raise HTTPException(
            status_code=409,
            detail="Tausch geht nur bei geteilten Terminen – Sichtbarkeit erst auf „Geteilt“ stellen.",
        )
    return t


@router.post("/{mediation_id}/logbuch/betreuung/termine/{termin_id}/tausch")
def request_swap(
    mediation_id: int,
    termin_id: int,
    payload: SwapRequest,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    t = _get_shared_termin(mediation_id, termin_id, participant, db)
    if t.swap_status == "angefragt":
        raise HTTPException(status_code=409, detail="Es liegt bereits eine offene Tausch-Anfrage vor.")

    t.swap_status = "angefragt"
    t.swap_requested_by = participant.id
    t.swap_proposed_start = _parse_dt(payload.proposed_start, "proposed_start")
    t.swap_proposed_end = _parse_dt(payload.proposed_end, "proposed_end")
    t.swap_message = payload.message
    db.commit()
    db.refresh(t)
    return _serialize_time(t)


@router.post("/{mediation_id}/logbuch/betreuung/termine/{termin_id}/tausch/antwort")
def answer_swap(
    mediation_id: int,
    termin_id: int,
    payload: SwapAnswer,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    t = _get_shared_termin(mediation_id, termin_id, participant, db)
    if t.swap_status != "angefragt":
        raise HTTPException(status_code=409, detail="Keine offene Tausch-Anfrage.")
    if t.swap_requested_by == participant.id:
        raise HTTPException(
            status_code=403, detail="Die eigene Tausch-Anfrage kann nicht selbst beantwortet werden."
        )

    if payload.akzeptieren:
        t.planned_start = t.swap_proposed_start
        t.planned_end = t.swap_proposed_end
        # Nur bei Einzelterminen wandert das Kalenderdatum mit – bei Serien-
        # Overrides bleibt `date` der Vorkommens-Schlüssel (sonst löst sich der
        # Override von seinem Serien-Vorkommen und der Termin erscheint doppelt).
        if t.rule_id is None and t.planned_start:
            t.date = t.planned_start.date().isoformat()
        t.swap_status = "akzeptiert"
    else:
        t.swap_status = "abgelehnt"
    db.commit()
    db.refresh(t)
    return _serialize_time(t)


@router.delete("/{mediation_id}/logbuch/betreuung/termine/{termin_id}")
def delete_termin(
    mediation_id: int,
    termin_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    t = (
        db.query(MediationCareTime)
        .filter(
            MediationCareTime.id == termin_id,
            MediationCareTime.mediation_id == mediation_id,
        )
        .first()
    )
    if not t or not _visible(t, participant):
        raise HTTPException(status_code=404, detail="Termin nicht gefunden.")
    if t.author_participant_id != participant.id:
        raise HTTPException(status_code=403, detail="Nur eigene Termine löschbar.")
    db.delete(t)
    db.commit()
    return {"ok": True}
