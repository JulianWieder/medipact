"""Kalender: Kinder, offene Absprachen, „mein Kalender".

Der Betreuungskalender selbst liegt in routers/betreuung.py – dort stehen
Serienregeln, Termine und der Absprache-Mechanismus. Was hier dazukommt, macht
aus dem eingebetteten Logbuch-Werkzeug ein eigenständiges Feature:

  * **Kinder** als Stammdaten (Migration j5k6l7m8n9o0). Erst damit lässt sich
    sagen, WEN ein Betreuungsfenster betrifft – bei zwei Kindern mit
    unterschiedlichen Zeiten ist das der Unterschied zwischen einem Kalender
    und einer Liste.
  * **Offene Absprachen** über alle Termine hinweg. Bisher fand man eine Bitte
    der Gegenseite nur, wenn man zufällig in den richtigen Monat blätterte.
  * **„Mein Kalender"** – löst serverseitig das eine Logbuch der angemeldeten
    Person auf, damit die Dashboard-Seite ohne ID in der URL auskommt. Das ist
    der kleine Vorgriff auf die spätere Entkopplung vom Fall: die Oberfläche
    fragt schon jetzt nach „meinem Kalender", nicht nach einer Mediation.

Zugriff und Sichtbarkeit sind dieselben wie im Logbuch (private/personal/
shared). Die Rolle "kind" darf ausschließlich lesen – siehe `_require_writer`
in routers/betreuung.py.
"""
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_care_request_event import MediationCareRequestEvent
from app.models.mediation_care_time import MediationCareTime
from app.models.mediation_child import MediationChild
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.routers.betreuung import (
    KIND_LABELS_DE,
    _require_writer,
    _serialize_time,
    _visible,
)
from app.routers.logbuch import _get_mediation, _require_participant
from app.security import get_current_db_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["kalender"])

# Farben für die Kalenderdarstellung. Bewusst eine kurze, feste Liste: der
# Kalender soll lesbar bleiben, nicht bunt werden.
CHILD_COLORS = ["sky", "violet", "emerald", "amber", "rose", "teal"]


def _serialize_child(c: MediationChild) -> dict:
    return {
        "id": c.id,
        "name": c.name,
        "birthdate": c.birthdate,
        "color": c.color,
        "user_id": c.user_id,
        "access_email": c.access_email,
        # Eingeladen ist nicht dasselbe wie verbunden: solange nur die E-Mail
        # steht, ist die Einladung unterwegs.
        "hat_zugang": c.user_id is not None,
        "eingeladen": c.user_id is None and bool(c.access_email),
        "author_participant_id": c.author_participant_id,
    }


def _parse_iso_date(value: Optional[str], field: str) -> Optional[str]:
    if not value:
        return None
    from datetime import date as date_cls

    try:
        return date_cls.fromisoformat(value[:10]).isoformat()
    except ValueError:
        raise HTTPException(status_code=422, detail=f"Ungültiges Datum für {field}.")


# ── Kinder ──────────────────────────────────────────────────────────────────


class ChildCreate(BaseModel):
    name: str
    birthdate: Optional[str] = None
    color: Optional[str] = None


class ChildUpdate(BaseModel):
    name: Optional[str] = None
    birthdate: Optional[str] = None
    color: Optional[str] = None
    # Wird gesetzt, wenn für dieses Kind ein Zugang eingeladen wurde.
    access_email: Optional[str] = None


@router.get("/mediations/{mediation_id}/logbuch/kinder")
def list_children(
    mediation_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Kinder sind für alle Beteiligten sichtbar – anders als Einträge.

    Ein Kind ist kein Inhalt, den man vor der anderen Seite verbergen könnte:
    beide Eltern kennen es. Es hier zu verstecken würde nur dazu führen, dass
    jede Seite ihr eigenes Kind anlegt und der Kalender doppelt zählt.
    """
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)
    kinder = (
        db.query(MediationChild)
        .filter(MediationChild.mediation_id == mediation_id)
        .order_by(MediationChild.birthdate.is_(None), MediationChild.birthdate, MediationChild.id)
        .all()
    )
    daten = [_serialize_child(c) for c in kinder]

    # Der Kind-Zugang braucht die Namen (sonst weiß er nicht, welche Zeiten
    # seine sind), aber nicht die E-Mail-Adressen seiner Geschwister.
    if (participant.role or "") == "kind":
        for eintrag in daten:
            eintrag["access_email"] = None
    return daten


@router.post("/mediations/{mediation_id}/logbuch/kinder")
def create_child(
    mediation_id: int,
    payload: ChildCreate,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    _get_mediation(mediation_id, db)
    participant = _require_writer(mediation_id, user, db)
    name = (payload.name or "").strip()
    if not name:
        raise HTTPException(status_code=422, detail="Bitte einen Namen angeben.")

    vorhanden = (
        db.query(MediationChild)
        .filter(MediationChild.mediation_id == mediation_id)
        .count()
    )
    if vorhanden >= 12:
        raise HTTPException(status_code=422, detail="Mehr als 12 Kinder sind nicht vorgesehen.")
    # Doppelte Namen sind fast immer ein Versehen (beide Eltern legen dasselbe
    # Kind an) und würden den Kalender unlesbar machen.
    if (
        db.query(MediationChild)
        .filter(
            MediationChild.mediation_id == mediation_id,
            MediationChild.name == name,
        )
        .first()
    ):
        raise HTTPException(status_code=409, detail=f"„{name}“ ist bereits angelegt.")

    child = MediationChild(
        mediation_id=mediation_id,
        author_participant_id=participant.id,
        name=name,
        birthdate=_parse_iso_date(payload.birthdate, "birthdate"),
        color=payload.color or CHILD_COLORS[vorhanden % len(CHILD_COLORS)],
    )
    db.add(child)
    db.commit()
    db.refresh(child)
    return _serialize_child(child)


def _get_child(mediation_id: int, child_id: int, db: Session) -> MediationChild:
    child = (
        db.query(MediationChild)
        .filter(
            MediationChild.id == child_id,
            MediationChild.mediation_id == mediation_id,
        )
        .first()
    )
    if not child:
        raise HTTPException(status_code=404, detail="Kind nicht gefunden.")
    return child


@router.patch("/mediations/{mediation_id}/logbuch/kinder/{child_id}")
def update_child(
    mediation_id: int,
    child_id: int,
    payload: ChildUpdate,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Ändern darf jede beteiligte Person – ein Stammdatum gehört beiden.

    Das ist die bewusste Ausnahme zur Regel „nur eigene Zeilen": ein Tippfehler
    im Namen des gemeinsamen Kindes muss auch die andere Seite geradeziehen
    können, ohne ein zweites Kind anzulegen.
    """
    _get_mediation(mediation_id, db)
    _require_writer(mediation_id, user, db)
    child = _get_child(mediation_id, child_id, db)

    data = payload.model_dump(exclude_unset=True)
    if "name" in data:
        name = (data["name"] or "").strip()
        if not name:
            raise HTTPException(status_code=422, detail="Bitte einen Namen angeben.")
        data["name"] = name
    if "birthdate" in data:
        data["birthdate"] = _parse_iso_date(data["birthdate"], "birthdate")
    if "access_email" in data:
        wert = (data["access_email"] or "").strip().lower()
        data["access_email"] = wert or None

    for key, value in data.items():
        setattr(child, key, value)
    db.commit()
    db.refresh(child)
    return _serialize_child(child)


@router.delete("/mediations/{mediation_id}/logbuch/kinder/{child_id}")
def delete_child(
    mediation_id: int,
    child_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Löscht das Kind und löst es aus allen Zuordnungen.

    Die Betreuungszeiten selbst bleiben stehen – sie sind Dokumentation. Eine
    Zeile, die danach keine Kinder mehr nennt, gilt wieder für „alle".
    """
    _get_mediation(mediation_id, db)
    _require_writer(mediation_id, user, db)
    child = _get_child(mediation_id, child_id, db)

    from app.models.mediation_care_rule import MediationCareRule

    for model in (MediationCareRule, MediationCareTime):
        for row in db.query(model).filter(model.mediation_id == mediation_id).all():
            ids = row.child_ids or []
            if child.id in ids:
                row.child_ids = [i for i in ids if i != child.id] or None

    db.delete(child)
    db.commit()
    return {"ok": True}


# ── Offene Absprachen ───────────────────────────────────────────────────────


@router.get("/mediations/{mediation_id}/logbuch/betreuung/anfragen")
def list_open_requests(
    mediation_id: int,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Alle offenen Anfragen dieses Kalenders – unabhängig vom Monat.

    Der Grund für diesen Endpunkt: eine Bitte der anderen Seite fand man bisher
    nur, wenn man zufällig in den richtigen Monat blätterte. Eine Absprache,
    die man übersieht, ist keine Absprache.

    Sortiert nach dem Termin, nicht nach dem Anfragedatum: was zuerst ansteht,
    braucht zuerst eine Antwort.
    """
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)

    rows = (
        db.query(MediationCareTime)
        .filter(
            MediationCareTime.mediation_id == mediation_id,
            MediationCareTime.request_status == "offen",
        )
        .all()
    )
    offen = [t for t in rows if _visible(t, participant)]
    offen.sort(key=lambda t: (t.date or "", t.planned_start or datetime.min))

    kinder = {
        c.id: c.name
        for c in db.query(MediationChild)
        .filter(MediationChild.mediation_id == mediation_id)
        .all()
    }

    return {
        "me": participant.id,
        "items": [
            {
                **_serialize_time(t),
                # Wer ist am Zug? Die Oberfläche zeigt „wartet auf dich" nur
                # dann, wenn die Anfrage NICHT von einem selbst stammt.
                "wartet_auf_mich": t.request_by != participant.id,
                "kind_namen": [kinder[i] for i in (t.child_ids or []) if i in kinder],
                "art_label": KIND_LABELS_DE.get(t.request_kind or "", "Änderung"),
            }
            for t in offen
        ],
    }


# ── Mein Kalender ───────────────────────────────────────────────────────────


@router.get("/kalender/mein")
def my_calendar(
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Löst den Kalender der angemeldeten Person auf.

    Der Kalender hängt technisch noch an einer Mediation (dem einen Logbuch je
    Nutzer:in, siehe Ein-Buch-Umbau). Die Oberfläche soll davon nichts wissen
    müssen – sie fragt nach „meinem Kalender" und bekommt die ID zurück. Wenn
    die Daten später vom Fall entkoppelt werden, ändert sich hier eine Zeile
    und sonst nichts.

    Ist noch kein Logbuch da, wird KEINES angelegt: das Anlegen gehört in den
    ausdrücklichen Klick der Nutzer:in, nicht in einen GET.
    """
    teilnahmen = (
        db.query(MediationParticipant, Mediation)
        .join(Mediation, MediationParticipant.mediation_id == Mediation.id)
        .filter(MediationParticipant.user_id == user.id)
        .all()
    )
    buecher = [(p, m) for p, m in teilnahmen if (m.mode or "mediation") == "logbuch"]
    if not buecher:
        # Kein Buch – aber vielleicht ein Verfahren. Das ist der Regelfall NACH
        # der Umwandlung (logbuch/convert setzt mode auf "mediation"), und der
        # Unterschied ist für die Oberfläche entscheidend:
        #
        #   noch nie ein Buch  -> „Leg eines an" (Einstieg ins kostenlose Angebot)
        #   umgewandelt        -> „Läuft jetzt im Verfahren weiter" (kein Rückweg)
        #
        # Vorher lieferten beide Fälle dasselbe leere Ergebnis. Wer gerade eine
        # Mediation gestartet hatte, bekam „Noch kein Kalender" angeboten und
        # hätte sich ein zweites Buch neben sein eigenes Verfahren gelegt.
        verfahren = [(p, m) for p, m in teilnahmen if (m.mode or "mediation") != "logbuch"]
        if verfahren:
            _p, m = max(verfahren, key=lambda paar: paar[1].id)
            return {
                "mediation_id": None,
                "rolle": None,
                "titel": None,
                "offene_anfragen": 0,
                "gesperrt": True,
                "grund": "in_mediation",
                "fall_id": m.id,
                "fall_titel": m.title,
            }
        return {
            "mediation_id": None,
            "rolle": None,
            "titel": None,
            "offene_anfragen": 0,
            "gesperrt": False,
        }

    # Bei Altbestand mit mehreren Büchern gewinnt das mit den meisten
    # Betreuungszeiten – das ist der Kalender, den die Person tatsächlich nutzt.
    def gewicht(paar) -> tuple[int, int]:
        _p, m = paar
        anzahl = (
            db.query(MediationCareTime)
            .filter(MediationCareTime.mediation_id == m.id)
            .count()
        )
        return (anzahl, m.id)

    participant, mediation = max(buecher, key=gewicht)

    offene = [
        t
        for t in db.query(MediationCareTime)
        .filter(
            MediationCareTime.mediation_id == mediation.id,
            MediationCareTime.request_status == "offen",
        )
        .all()
        if _visible(t, participant)
    ]

    return {
        "mediation_id": mediation.id,
        "rolle": participant.role,
        "titel": mediation.title,
        "mediation_type": mediation.mediation_type,
        "offene_anfragen": len(offene),
        # Wie viele davon warten auf eine Antwort VON MIR – nur die gehören auf
        # eine Dashboard-Karte, der Rest ist Warten auf die Gegenseite.
        "wartet_auf_mich": len([t for t in offene if t.request_by != participant.id]),
    }


# ── Verlauf über alle Termine (für die spätere Chronik) ─────────────────────


@router.get("/mediations/{mediation_id}/logbuch/betreuung/verlauf")
def list_all_events(
    mediation_id: int,
    limit: int = 50,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Die letzten Absprache-Ereignisse des ganzen Kalenders.

    Für die Frage „was war hier eigentlich los?" – im Streitfall oft die
    eigentliche Leistung des Logbuchs. Es werden nur Ereignisse zu Terminen
    gezeigt, die man auch sehen darf.
    """
    _get_mediation(mediation_id, db)
    participant = _require_participant(mediation_id, user, db)

    sichtbare_ids = {
        t.id
        for t in db.query(MediationCareTime)
        .filter(MediationCareTime.mediation_id == mediation_id)
        .all()
        if _visible(t, participant)
    }
    if not sichtbare_ids:
        return {"me": participant.id, "events": []}

    events = (
        db.query(MediationCareRequestEvent)
        .filter(
            MediationCareRequestEvent.mediation_id == mediation_id,
            MediationCareRequestEvent.care_time_id.in_(sichtbare_ids),
        )
        .order_by(
            MediationCareRequestEvent.created_at.desc(),
            MediationCareRequestEvent.id.desc(),
        )
        .limit(max(1, min(limit, 200)))
        .all()
    )
    return {
        "me": participant.id,
        "events": [
            {
                "id": e.id,
                "care_time_id": e.care_time_id,
                "participant_id": e.participant_id,
                "action": e.action,
                "kind": e.kind,
                "art_label": KIND_LABELS_DE.get(e.kind or "", "Änderung"),
                "proposed_start": e.proposed_start.isoformat() if e.proposed_start else None,
                "proposed_end": e.proposed_end.isoformat() if e.proposed_end else None,
                "message": e.message,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in events
        ],
    }
