"""Konto-Endpunkte: Löschung.

Getrennt von routers/auth.py, weil das hier kein Anmeldevorgang ist, sondern
der einzige Weg, auf dem eine Person alles wieder loswird. Die Logik steht in
services/konto.py – hier ist nur die Tür.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.security import get_current_db_user
from app.services import konto as konto_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/konto", tags=["konto"])


class LoeschAntrag(BaseModel):
    # Doppelte Absicherung gegen den versehentlichen Klick: Die Oberfläche
    # lässt das Wort tippen, bevor der Knopf scharf wird. Ein Bestätigungs-
    # Dialog allein wird weggeklickt, ohne gelesen zu werden.
    bestaetigung: str
    notiz: str | None = None


@router.get("/loeschung")
def loeschlage(
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Was passiert, wenn ich jetzt lösche?

    Muss VOR der Bestätigung angezeigt werden – Google verlangt, dass benannt
    wird, was gelöscht wird, was bleibt und warum.
    """
    return konto_service.loesch_lage(user, db)


@router.delete("")
def konto_loeschen(
    antrag: LoeschAntrag,
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Löscht das Konto – sofort, oder als Antrag bei laufendem Verfahren.

    Welcher der beiden Wege es wird, entscheidet NICHT der Aufrufer, sondern
    die Lage im Datenbestand. Sonst könnte ein Client mit dem falschen Flag
    eine Löschung erzwingen, die der Gegenseite ihre Fallakte wegnimmt.
    """
    if antrag.bestaetigung.strip().upper() != "LÖSCHEN":
        raise HTTPException(
            status_code=400,
            detail="Bitte LÖSCHEN eintippen, um die Löschung zu bestätigen.",
        )

    lage = konto_service.loesch_lage(user, db)

    if not lage["sofort_moeglich"]:
        konto_service.loeschung_beantragen(user, db, antrag.notiz)
        logger.info("Löschantrag vermerkt: user=%s", user.id)
        return {
            "status": "beantragt",
            "meldung": (
                "Deine Löschung ist vermerkt. Dein Konto bleibt bestehen, "
                "solange dein Verfahren läuft – wir melden uns innerhalb von "
                "30 Tagen mit dem weiteren Ablauf."
            ),
            "lage": lage,
        }

    user_id = user.id
    try:
        geloescht = konto_service.konto_sofort_loeschen(user, db)
    except ValueError:
        # Kann nur eintreten, wenn sich die Lage zwischen Prüfung und Löschung
        # geändert hat (z. B. gleichzeitig eine Einladung angenommen). Dann
        # gilt der vorsichtige Weg.
        db.rollback()
        konto_service.loeschung_beantragen(user, db, antrag.notiz)
        return {
            "status": "beantragt",
            "meldung": "Inzwischen läuft ein Verfahren – die Löschung wurde vermerkt.",
        }

    logger.info("Konto gelöscht: user=%s, zeilen=%s", user_id, geloescht)
    return {
        "status": "geloescht",
        "meldung": "Dein Konto und deine Daten wurden gelöscht.",
        "zeilen": geloescht,
    }


@router.post("/loeschung/zuruecknehmen")
def loeschung_zuruecknehmen(
    user: User = Depends(get_current_db_user),
    db: Session = Depends(get_db),
):
    """Meinung geändert. Gilt nur für vermerkte Anträge – Gelöschtes ist weg."""
    konto_service.loeschung_zuruecknehmen(user, db)
    return {"status": "zurueckgenommen"}
