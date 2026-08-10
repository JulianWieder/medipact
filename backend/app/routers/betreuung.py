"""Betreuungskalender im Konflikt-Logbuch (Trennung): geplante vs. tatsächliche
Betreuungszeiten der Kinder.

Aufbau (Migration d2e3f4a5b6c7):

  • Serienregeln (mediation_care_rules) – Wochenmuster wie "jedes 2. Wochenende
    Fr 17:00 – So 18:00 bei Papa". Sie werden hier beim Lesen in konkrete
    Termine expandiert, nichts wird materialisiert.
  • Termine (mediation_care_times) – Einzeltermine (rule_id NULL) oder
    Overrides eines Serien-Vorkommens (rule_id + date). Dort werden die
    TATSÄCHLICHEN Zeiten (actual_start/actual_end), Status und Notiz erfasst.

  • Absprachen (Migration i4j5k6l7m8n9) – request_* auf den Terminen plus
    MediationCareRequestEvent als Verlauf. Vier Arten: tausch, zusatztag,
    absage, verschiebung. Alle laufen über dieselben drei Endpunkte
    (anfrage / anfrage/antwort / anfrage zurückziehen), weil sie dieselbe
    Frage stellen: die eine Seite schlägt vor, die andere entscheidet.

Kostenlos wie das übrige Logbuch (keine Paywall), Sichtbarkeit je Zeile wie
bei Logbuch-Einträgen (private/personal/shared – Filter aus routers/logbuch).
"""
import logging
from datetime import date as date_cls
from datetime import datetime, time, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.email import send_care_request_email
from app.models.mediation_care_request_event import MediationCareRequestEvent
from app.models.mediation_care_rule import MediationCareRule
from app.models.mediation_care_time import MediationCareTime
from app.models.mediation_child import MediationChild
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.routers.logbuch import VISIBILITIES, _get_mediation, _require_participant
from app.security import get_current_db_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mediations", tags=["betreuung"])

STATUSES = {"geplant", "stattgefunden", "ausgefallen"}
CATEGORIES = {"betreuung", "ferien", "feiertag"}
# Arten der Absprache. Der Unterschied liegt in der Bedeutung, nicht in der
# Mechanik: alle vier sind "eine Seite schlägt vor, die andere entscheidet".
# Nur beim Annehmen wird unterschieden (siehe _apply_accepted_request).
REQUEST_KINDS = {"tausch", "zusatztag", "absage", "verschiebung"}
# Arten, die konkrete Zeiten brauchen – eine Absage schlägt nichts vor.
KINDS_NEEDING_TIMES = {"tausch", "zusatztag", "verschiebung"}
REQUEST_ACTIONS = {"akzeptieren", "ablehnen", "gegenvorschlag"}

# Klartext je Art – für Benachrichtigungen und für die Absprachen-Übersicht
# (routers/kalender.py). Die Oberfläche soll dieselben Wörter benutzen wie die
# E-Mail, sonst liest man zweimal dasselbe und glaubt, es sei zweierlei.
KIND_LABELS_DE = {
    "tausch": "Tausch",
    "zusatztag": "Zusätzlicher Tag",
    "absage": "Absage",
    "verschiebung": "Verschiebung",
}

# Die Rolle des Kind-Zugangs. Ein Kind darf seinen Betreuungsplan sehen – aber
# nichts daran ändern und an keiner Absprache teilnehmen. Die Aushandlung ist
# Sache der Eltern; ein Kind, das zustimmen oder ablehnen kann, wird zur Partei
# im Streit seiner Eltern. Deshalb hängt die Sperre am Schreiben, nicht am
# Lesen (Migration j5k6l7m8n9o0).
READ_ONLY_ROLES = {"kind"}


def _require_writer(
    mediation_id: int, user: User, db: Session
) -> MediationParticipant:
    """Teilnehmer:in mit Schreibrecht – wie _require_participant, aber ohne
    die reinen Lese-Rollen."""
    p = _require_participant(mediation_id, user, db)
    if (p.role or "") in READ_ONLY_ROLES:
        raise HTTPException(
            status_code=403,
            detail="Dieser Zugang darf den Betreuungsplan nur ansehen.",
        )
    return p


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


def _check_children(
    mediation_id: int, ids: Optional[list[int]], db: Session
) -> Optional[list[int]]:
    """Prüft eine Kind-Zuordnung und normalisiert sie.

    Leer wird zu None – „keine Kinder genannt" heißt im ganzen Kalender „gilt
    für alle" (so bleiben auch alle vor Migration j5k6l7m8n9o0 angelegten
    Zeilen gültig, ohne dass sie angefasst werden müssten).
    """
    if not ids:
        return None
    eindeutig = sorted({int(i) for i in ids})
    vorhanden = {
        c.id
        for c in db.query(MediationChild.id)
        .filter(
            MediationChild.mediation_id == mediation_id,
            MediationChild.id.in_(eindeutig),
        )
        .all()
    }
    fehlend = [i for i in eindeutig if i not in vorhanden]
    if fehlend:
        raise HTTPException(status_code=422, detail="Unbekanntes Kind in der Zuordnung.")
    return eindeutig


def _check_category(value: str) -> str:
    if value not in CATEGORIES:
        raise HTTPException(status_code=422, detail="Ungültige Art des Eintrags.")
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
        # Leere Liste statt None nach außen: der Client muss nicht zwischen
        # „keine Angabe" und „alle" unterscheiden – beides heißt alle.
        "child_ids": r.child_ids or [],
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
        "title": t.title,
        "category": t.category or "betreuung",
        "visibility": t.visibility or "personal",
        "author_participant_id": t.author_participant_id,
        "child_ids": t.child_ids or [],
        "verbindlich": _is_binding(t),
        **_serialize_request(t),
    }


def _serialize_request(t: MediationCareTime) -> dict:
    return {
        "request_kind": t.request_kind,
        "request_status": t.request_status,
        "request_by": t.request_by,
        "request_start": t.request_start.isoformat() if t.request_start else None,
        "request_end": t.request_end.isoformat() if t.request_end else None,
        "request_message": t.request_message,
        "request_answered_at": (
            t.request_answered_at.isoformat() if t.request_answered_at else None
        ),
    }


def _no_request() -> dict:
    """Leere Anfrage-Felder für Serien-Vorkommen ohne Override."""
    return {
        "request_kind": None,
        "request_status": None,
        "request_by": None,
        "request_start": None,
        "request_end": None,
        "request_message": None,
        "request_answered_at": None,
    }


def _is_binding(t: Optional[MediationCareTime]) -> bool:
    """Zählt dieser Termin als geplante Betreuung?

    Ein erbetener Zusatztag entsteht sofort als Zeile, damit die Gegenseite ihn
    im Kalender sehen und beantworten kann – verbindlich wird er aber erst mit
    der Zustimmung. Alles andere (Tausch, Absage, Verschiebung) verändert einen
    Termin, der ohnehin schon geplant war, und bleibt währenddessen gültig.
    """
    if t is None:
        return True
    if (t.request_kind or "") != "zusatztag":
        return True
    return (t.request_status or "") == "akzeptiert"


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
    # IDs aus mediation_children. Leer = gilt für alle Kinder.
    child_ids: Optional[list[int]] = None


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
    child_ids: Optional[list[int]] = None


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
    participant = _require_writer(mediation_id, user, db)
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
        child_ids=_check_children(mediation_id, payload.child_ids, db),
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
    participant = _require_writer(mediation_id, user, db)
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
    if "child_ids" in data:
        data["child_ids"] = _check_children(mediation_id, data["child_ids"], db)

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
    participant = _require_writer(mediation_id, user, db)
    rule = _get_own_rule(mediation_id, rule_id, participant, db)
    # Overrides der Serie mitlöschen – ohne Regel sind sie bedeutungslos.
    override_ids = [
        row.id
        for row in db.query(MediationCareTime.id)
        .filter(
            MediationCareTime.mediation_id == mediation_id,
            MediationCareTime.rule_id == rule.id,
        )
        .all()
    ]
    if override_ids:
        db.query(MediationCareRequestEvent).filter(
            MediationCareRequestEvent.care_time_id.in_(override_ids)
        ).delete(synchronize_session=False)
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
    # Name des Blocks, z. B. "Sommerferien, erste Hälfte".
    title: Optional[str] = None
    # betreuung | ferien | feiertag
    category: str = "betreuung"
    visibility: str = "personal"
    child_ids: Optional[list[int]] = None


class CareTimeUpdate(BaseModel):
    date: Optional[str] = None
    planned_start: Optional[str] = None
    planned_end: Optional[str] = None
    actual_start: Optional[str] = None
    actual_end: Optional[str] = None
    status: Optional[str] = None
    caregiver: Optional[str] = None
    note: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    visibility: Optional[str] = None
    child_ids: Optional[list[int]] = None


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
    # `date` ist der Beginn. Ein Ferienblock, der VOR dem Fenster anfängt und
    # hineinreicht (typisch beim Blättern in den Folgemonat), würde bei einem
    # reinen date-Bereich fehlen – deshalb zusätzlich über planned_end greifen.
    window_start = datetime.combine(start, time(0, 0))
    times = [
        t
        for t in db.query(MediationCareTime)
        .filter(
            MediationCareTime.mediation_id == mediation_id,
            MediationCareTime.date <= end.isoformat(),
            or_(
                MediationCareTime.date >= start.isoformat(),
                MediationCareTime.planned_end >= window_start,
            ),
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
                "title": ov.title if ov else None,
                "category": (ov.category if ov else None) or "betreuung",
                "visibility": (ov.visibility if ov else rule.visibility) or "personal",
                # Der Override kann von der ANDEREN Person stammen als die
                # Regel. Für "darf ich das bearbeiten?" zählt, wer die Zeile
                # angelegt hat – sonst zeigt die Oberfläche einen Knopf an,
                # der im 403 endet (update_termin prüft die Autorschaft).
                "author_participant_id": (
                    ov.author_participant_id if ov else rule.author_participant_id
                ),
                "rule_author_participant_id": rule.author_participant_id,
                # Der Override darf die Kinder des Vorkommens einschränken
                # („diesmal nur der Kleine"); ohne eigene Angabe gilt die Regel.
                "child_ids": (ov.child_ids if ov and ov.child_ids else rule.child_ids)
                or [],
                "verbindlich": _is_binding(ov),
                **(_serialize_request(ov) if ov else _no_request()),
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
                "label": t.title,
                "rule_author_participant_id": None,
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
    participant = _require_writer(mediation_id, user, db)
    day = _parse_date(payload.date, "date")
    if not day:
        raise HTTPException(status_code=422, detail="date ist erforderlich.")
    if payload.status not in STATUSES:
        raise HTTPException(status_code=422, detail="Ungültiger Status.")
    _check_category(payload.category)
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
        title=payload.title,
        category=payload.category,
        visibility=payload.visibility,
        child_ids=_check_children(mediation_id, payload.child_ids, db),
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
    participant = _require_writer(mediation_id, user, db)
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
    if data.get("category"):
        _check_category(data["category"])
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
    if "child_ids" in data:
        data["child_ids"] = _check_children(mediation_id, data["child_ids"], db)

    for key, value in data.items():
        setattr(t, key, value)
    db.commit()
    db.refresh(t)
    return _serialize_time(t)


# ── Absprachen ──────────────────────────────────────────────────────────────
# Nur bei GETEILTEN Terminen (visibility="shared"): eine Person bittet um eine
# Änderung, die andere stimmt zu, lehnt ab oder schlägt etwas anderes vor.
#
# Vier Arten, ein Mechanismus. Der Unterschied liegt allein darin, was beim
# Annehmen passiert (_apply_accepted_request) – deshalb teilen sie sich die
# Endpunkte und die Oberfläche muss nur eine Sprache sprechen.
#
# Für ein Serien-Vorkommen legt der Client zuerst per POST …/termine einen
# Override an und stellt die Anfrage dann auf dessen ID. Ein zusätzlicher Tag
# hat noch keinen Termin und bekommt seinen eigenen Endpunkt, der beides in
# einem Zug erledigt.


class RequestCreate(BaseModel):
    kind: str  # tausch | absage | verschiebung
    proposed_start: Optional[str] = None
    proposed_end: Optional[str] = None
    message: Optional[str] = None


class ExtraDayCreate(BaseModel):
    date: str
    proposed_start: str
    proposed_end: str
    caregiver: Optional[str] = None
    title: Optional[str] = None
    category: str = "betreuung"
    message: Optional[str] = None
    child_ids: Optional[list[int]] = None


class RequestAnswer(BaseModel):
    aktion: str  # akzeptieren | ablehnen | gegenvorschlag
    # Nur bei aktion="gegenvorschlag".
    proposed_start: Optional[str] = None
    proposed_end: Optional[str] = None
    message: Optional[str] = None


def _now() -> datetime:
    """Naiver UTC-Zeitstempel – wie planned_*/actual_* in diesem Modul."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _log_event(
    db: Session,
    t: MediationCareTime,
    participant_id: Optional[int],
    action: str,
    message: Optional[str] = None,
) -> None:
    """Schreibt den Verlauf mit. Wird nie geändert, nur ergänzt."""
    db.add(
        MediationCareRequestEvent(
            mediation_id=t.mediation_id,
            care_time_id=t.id,
            participant_id=participant_id,
            action=action,
            kind=t.request_kind,
            proposed_start=t.request_start,
            proposed_end=t.request_end,
            message=message,
        )
    )


def _when_text(t: MediationCareTime) -> str:
    """Kurzbeschreibung des Termins für Benachrichtigungen."""
    ref_start = t.request_start or t.planned_start
    ref_end = t.request_end or t.planned_end
    name = t.title or "Betreuungstermin"
    if not ref_start:
        return f"{name} am {t.date}"
    tag = ref_start.strftime("%d.%m.%Y")
    von = ref_start.strftime("%H:%M")
    bis = ref_end.strftime("%H:%M") if ref_end else "offen"
    return f"{name} am {tag}, {von} – {bis} Uhr"


def _notify_others(
    db: Session,
    t: MediationCareTime,
    actor: MediationParticipant,
    action: str,
) -> None:
    """Benachrichtigt die übrigen Teilnehmer des Logbuchs.

    Fehlschläge werden nur geloggt: eine nicht zustellbare E-Mail darf die
    Absprache nicht scheitern lassen – der Kalender ist die Wahrheit, die Mail
    nur der Hinweis darauf.
    """
    try:
        rows = (
            db.query(MediationParticipant, User)
            .join(User, MediationParticipant.user_id == User.id)
            .filter(
                MediationParticipant.mediation_id == t.mediation_id,
                MediationParticipant.id != actor.id,
            )
            .all()
        )
        for _participant, user in rows:
            if not user.email:
                continue
            send_care_request_email(
                user.email,
                getattr(user, "name", None) or user.email.split("@")[0],
                t.mediation_id,
                t.request_kind or "tausch",
                action,
                _when_text(t),
                message=t.request_message,
            )
    except Exception:  # pragma: no cover - Benachrichtigung ist Beiwerk
        logger.exception("Benachrichtigung zur Betreuungs-Absprache fehlgeschlagen")


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
            detail="Absprachen gehen nur bei geteilten Terminen – Sichtbarkeit erst auf „Geteilt“ stellen.",
        )
    return t


def _apply_accepted_request(t: MediationCareTime) -> None:
    """Überträgt eine angenommene Anfrage in den Plan."""
    if t.request_kind == "absage":
        # Der Termin bleibt stehen, gilt aber als nicht stattgefunden. So
        # bleibt im Kalender sichtbar, dass er einmal geplant war.
        t.status = "ausgefallen"
    elif t.request_kind == "zusatztag":
        # planned_* stehen seit dem Anlegen; die Zustimmung macht den Termin
        # verbindlich (siehe _is_binding), sonst ändert sich nichts.
        pass
    else:  # tausch | verschiebung
        t.planned_start = t.request_start
        t.planned_end = t.request_end
        # Nur bei Einzelterminen wandert das Kalenderdatum mit – bei Serien-
        # Overrides bleibt `date` der Vorkommens-Schlüssel (sonst löst sich der
        # Override von seinem Serien-Vorkommen und der Termin erscheint doppelt).
        if t.rule_id is None and t.planned_start:
            t.date = t.planned_start.date().isoformat()


@router.post("/{mediation_id}/logbuch/betreuung/termine/{termin_id}/anfrage")
def create_request(
    mediation_id: int,
    termin_id: int,
    payload: RequestCreate,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Bittet um Tausch, Absage oder Verschiebung eines geteilten Termins."""
    _get_mediation(mediation_id, db)
    participant = _require_writer(mediation_id, user, db)
    t = _get_shared_termin(mediation_id, termin_id, participant, db)

    if payload.kind not in REQUEST_KINDS:
        raise HTTPException(status_code=422, detail="Unbekannte Art der Anfrage.")
    if payload.kind == "zusatztag":
        raise HTTPException(
            status_code=422,
            detail="Ein zusätzlicher Tag wird über …/anfragen/zusatztag erbeten.",
        )
    if t.request_status == "offen":
        raise HTTPException(
            status_code=409, detail="Zu diesem Termin ist bereits eine Anfrage offen."
        )

    start = _parse_dt(payload.proposed_start, "proposed_start")
    end = _parse_dt(payload.proposed_end, "proposed_end")
    if payload.kind in KINDS_NEEDING_TIMES and not (start and end):
        raise HTTPException(
            status_code=422, detail="Für diese Anfrage werden neue Zeiten gebraucht."
        )
    if start and end and end <= start:
        raise HTTPException(status_code=422, detail="Das Ende muss nach dem Beginn liegen.")

    t.request_kind = payload.kind
    t.request_status = "offen"
    t.request_by = participant.id
    t.request_start = start
    t.request_end = end
    t.request_message = payload.message
    t.request_answered_at = None
    # Neue Anfrage = neue Frist: sonst bliebe der Merker der vorigen Anfrage
    # stehen und diese hier bekäme nie eine Erinnerung
    # (scripts/check_care_requests.py).
    t.request_reminder_sent_at = None
    _log_event(db, t, participant.id, "angefragt", payload.message)
    db.commit()
    db.refresh(t)
    _notify_others(db, t, participant, "angefragt")
    return _serialize_time(t)


@router.post("/{mediation_id}/logbuch/betreuung/anfragen/zusatztag")
def request_extra_day(
    mediation_id: int,
    payload: ExtraDayCreate,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Erbittet einen zusätzlichen Betreuungstag.

    Der Termin wird sofort angelegt – anders wäre er für die Gegenseite gar
    nicht sichtbar und nicht beantwortbar. Verbindlich ist er erst mit der
    Zustimmung (_is_binding), bis dahin zeichnet die Oberfläche ihn als
    Vorschlag. Sichtbarkeit ist zwingend „geteilt“: eine Bitte, die nur man
    selbst sieht, ergibt keinen Sinn.
    """
    _get_mediation(mediation_id, db)
    participant = _require_writer(mediation_id, user, db)
    day = _parse_date(payload.date, "date")
    if not day:
        raise HTTPException(status_code=422, detail="date ist erforderlich.")
    _check_category(payload.category)
    start = _parse_dt(payload.proposed_start, "proposed_start")
    end = _parse_dt(payload.proposed_end, "proposed_end")
    if not (start and end):
        raise HTTPException(status_code=422, detail="Beginn und Ende werden gebraucht.")
    if end <= start:
        raise HTTPException(status_code=422, detail="Das Ende muss nach dem Beginn liegen.")

    t = MediationCareTime(
        mediation_id=mediation_id,
        author_participant_id=participant.id,
        rule_id=None,
        date=day.isoformat(),
        planned_start=start,
        planned_end=end,
        status="geplant",
        caregiver=payload.caregiver,
        title=payload.title,
        category=payload.category,
        visibility="shared",
        request_kind="zusatztag",
        request_status="offen",
        request_by=participant.id,
        request_start=start,
        request_end=end,
        request_message=payload.message,
        child_ids=_check_children(mediation_id, payload.child_ids, db),
    )
    db.add(t)
    db.flush()  # ID für den Verlaufseintrag
    _log_event(db, t, participant.id, "angefragt", payload.message)
    db.commit()
    db.refresh(t)
    _notify_others(db, t, participant, "angefragt")
    return _serialize_time(t)


@router.post("/{mediation_id}/logbuch/betreuung/termine/{termin_id}/anfrage/antwort")
def answer_request(
    mediation_id: int,
    termin_id: int,
    payload: RequestAnswer,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Zustimmen, ablehnen – oder etwas anderes vorschlagen.

    Der Gegenvorschlag hält die Anfrage offen und dreht die Richtung um: ab
    jetzt ist die andere Person am Zug. Aus einer Absage kann dabei eine
    Verschiebung werden („nicht absagen, aber später“) – das ist der häufigste
    Ausgang und soll nicht zwei Anfragen kosten.
    """
    _get_mediation(mediation_id, db)
    participant = _require_writer(mediation_id, user, db)
    t = _get_shared_termin(mediation_id, termin_id, participant, db)

    if payload.aktion not in REQUEST_ACTIONS:
        raise HTTPException(status_code=422, detail="Unbekannte Antwort.")
    if t.request_status != "offen":
        raise HTTPException(status_code=409, detail="Keine offene Anfrage.")
    if t.request_by == participant.id:
        raise HTTPException(
            status_code=403,
            detail="Die eigene Anfrage kann man nicht selbst beantworten – aber zurückziehen.",
        )

    if payload.aktion == "gegenvorschlag":
        start = _parse_dt(payload.proposed_start, "proposed_start")
        end = _parse_dt(payload.proposed_end, "proposed_end")
        if not (start and end):
            raise HTTPException(
                status_code=422, detail="Für einen Gegenvorschlag werden Zeiten gebraucht."
            )
        if end <= start:
            raise HTTPException(status_code=422, detail="Das Ende muss nach dem Beginn liegen.")
        if t.request_kind == "absage":
            t.request_kind = "verschiebung"
        t.request_start = start
        t.request_end = end
        t.request_message = payload.message
        t.request_by = participant.id
        # Die Richtung dreht sich um – jetzt ist die andere Seite am Zug und
        # die Frist beginnt neu (scripts/check_care_requests.py).
        t.request_reminder_sent_at = None
        _log_event(db, t, participant.id, "gegenvorschlag", payload.message)
        action = "gegenvorschlag"
    elif payload.aktion == "akzeptieren":
        _apply_accepted_request(t)
        t.request_status = "akzeptiert"
        t.request_answered_at = _now()
        _log_event(db, t, participant.id, "akzeptiert", payload.message)
        action = "akzeptiert"
    else:
        t.request_status = "abgelehnt"
        t.request_answered_at = _now()
        _log_event(db, t, participant.id, "abgelehnt", payload.message)
        action = "abgelehnt"

    db.commit()
    db.refresh(t)
    _notify_others(db, t, participant, action)
    return _serialize_time(t)


@router.delete("/{mediation_id}/logbuch/betreuung/termine/{termin_id}/anfrage")
def withdraw_request(
    mediation_id: int,
    termin_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Zieht die eigene, noch offene Anfrage zurück.

    Ein zurückgezogener Zusatztag wird gelöscht – er war nie Teil des Plans,
    und eine Karteileiche im Kalender hilft niemandem. Bei den übrigen Arten
    bleibt der Termin bestehen, nur die Anfrage verfällt.
    """
    _get_mediation(mediation_id, db)
    participant = _require_writer(mediation_id, user, db)
    t = _get_shared_termin(mediation_id, termin_id, participant, db)

    if t.request_status != "offen":
        raise HTTPException(status_code=409, detail="Keine offene Anfrage.")
    if t.request_by != participant.id:
        raise HTTPException(status_code=403, detail="Nur die eigene Anfrage ist zurückziehbar.")

    if t.request_kind == "zusatztag":
        db.query(MediationCareRequestEvent).filter(
            MediationCareRequestEvent.care_time_id == t.id
        ).delete(synchronize_session=False)
        db.delete(t)
        db.commit()
        return {"ok": True, "geloescht": True}

    t.request_status = "zurueckgezogen"
    t.request_answered_at = _now()
    _log_event(db, t, participant.id, "zurueckgezogen")
    db.commit()
    db.refresh(t)
    return _serialize_time(t)


@router.get("/{mediation_id}/logbuch/betreuung/termine/{termin_id}/verlauf")
def list_request_events(
    mediation_id: int,
    termin_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Wer hat wann was vorgeschlagen – die Vorgeschichte einer Absprache."""
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

    events = (
        db.query(MediationCareRequestEvent)
        .filter(MediationCareRequestEvent.care_time_id == termin_id)
        .order_by(MediationCareRequestEvent.created_at, MediationCareRequestEvent.id)
        .all()
    )
    return {
        "me": participant.id,
        "events": [
            {
                "id": e.id,
                "participant_id": e.participant_id,
                "action": e.action,
                "kind": e.kind,
                "proposed_start": e.proposed_start.isoformat() if e.proposed_start else None,
                "proposed_end": e.proposed_end.isoformat() if e.proposed_end else None,
                "message": e.message,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in events
        ],
    }


# ── Altlast: die ursprünglichen Tausch-Endpunkte ────────────────────────────
# Die Mobile-App (mobile/src/screens/CareCalendarScreen.tsx) spricht in bereits
# installierten Ständen noch diese Adressen an. Sie bleiben als dünne Hülle auf
# den Absprachen stehen, damit ein alter App-Stand nicht bricht.


class SwapRequest(BaseModel):
    proposed_start: str
    proposed_end: str
    message: Optional[str] = None


class SwapAnswer(BaseModel):
    akzeptieren: bool


@router.post("/{mediation_id}/logbuch/betreuung/termine/{termin_id}/tausch")
def request_swap(
    mediation_id: int,
    termin_id: int,
    payload: SwapRequest,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    return create_request(
        mediation_id,
        termin_id,
        RequestCreate(
            kind="tausch",
            proposed_start=payload.proposed_start,
            proposed_end=payload.proposed_end,
            message=payload.message,
        ),
        user,
        db,
    )


@router.post("/{mediation_id}/logbuch/betreuung/termine/{termin_id}/tausch/antwort")
def answer_swap(
    mediation_id: int,
    termin_id: int,
    payload: SwapAnswer,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    return answer_request(
        mediation_id,
        termin_id,
        RequestAnswer(aktion="akzeptieren" if payload.akzeptieren else "ablehnen"),
        user,
        db,
    )


@router.delete("/{mediation_id}/logbuch/betreuung/termine/{termin_id}")
def delete_termin(
    mediation_id: int,
    termin_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_writer(mediation_id, user, db)
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
    # Verlauf hängt am Termin und wäre sonst verwaist.
    db.query(MediationCareRequestEvent).filter(
        MediationCareRequestEvent.care_time_id == t.id
    ).delete(synchronize_session=False)
    db.delete(t)
    db.commit()
    return {"ok": True}
