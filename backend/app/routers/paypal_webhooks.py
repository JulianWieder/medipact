"""PayPal-Webhooks: Zahlungen auch dann mitbekommen, wenn der Browser abbricht.

WARUM DAS NÖTIG IST
───────────────────
Der normale Ablauf ist: Nutzer bestätigt bei PayPal -> unser Frontend ruft
``/pay/paypal/capture-order`` -> Backend reserviert den Betrag. Bricht der
Browser genau dazwischen ab (Tab geschlossen, Netz weg, Handy-Akku leer),
existiert die Bestätigung bei PayPal, aber bei uns steht die Partei weiter auf
"offen" - sie würde ein zweites Mal bezahlen.

Dieser Webhook schließt die Lücke: PayPal meldet den Vorgang unabhängig vom
Browser direkt an den Server.

VERARBEITETE EREIGNISSE
  • CHECKOUT.ORDER.APPROVED       - Nutzer hat bestätigt: Reservierung nachholen
  • PAYMENT.AUTHORIZATION.CREATED - Reservierung existiert: Zuordnung sichern
  • PAYMENT.AUTHORIZATION.VOIDED  - Reservierung aufgehoben: Partei zurücksetzen
  • PAYMENT.CAPTURE.DENIED        - Einzug abgelehnt: Partei zurücksetzen

SICHERHEIT: Jeder Aufruf wird über die PayPal-API signaturgeprüft
(verify_webhook_signature). Ohne gesetzte PAYPAL_WEBHOOK_ID werden ALLE
Webhooks abgelehnt - sonst könnte jeder Zahlungen frei erfinden.

EINRICHTUNG
  1. PayPal-Developer-Dashboard -> App -> Webhooks -> URL eintragen:
     https://medipact.de/api/paypal/webhook
     (Next.js-Route app/api/paypal/webhook/route.ts reicht den Roh-Body an
     dieses Backend weiter - der mailcow-nginx erreicht Port 8000 nicht)
  2. Obige vier Ereignisse abonnieren
  3. Angezeigte Webhook-ID als PAYPAL_WEBHOOK_ID in backend/.env eintragen
"""
import json
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_participant import MediationParticipant
from app.paypal import (
    AuthorizationExpiredError,
    PayPalError,
    authorize_order,
    verify_webhook_signature,
    void_authorization,
)
from app.services import billing

logger = logging.getLogger(__name__)


def _parse_paypal_time(value: str | None) -> datetime | None:
    """PayPal-Zeitstempel -> naive UTC-datetime (wie in der DB üblich)."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc).replace(tzinfo=None)
    except ValueError:
        return None

router = APIRouter(prefix="/paypal", tags=["paypal"])


def _participant_by_order(db: Session, order_id: str) -> MediationParticipant | None:
    if not order_id:
        return None
    return (
        db.query(MediationParticipant)
        .filter(MediationParticipant.paypal_order_id == order_id)
        .first()
    )


def _participant_by_authorization(
    db: Session, authorization_id: str
) -> MediationParticipant | None:
    if not authorization_id:
        return None
    return (
        db.query(MediationParticipant)
        .filter(MediationParticipant.paypal_authorization_id == authorization_id)
        .first()
    )


def _order_id_from_resource(resource: dict) -> str:
    """Findet die Order-ID in einem Authorization-Resource-Objekt.

    PayPal liefert sie je nach Ereignis entweder direkt als ``supplementary_data
    .related_ids.order_id`` oder gar nicht.
    """
    supplementary = resource.get("supplementary_data") or {}
    related = supplementary.get("related_ids") or {}
    return related.get("order_id") or ""


async def _recover_authorization(db: Session, participant: MediationParticipant) -> None:
    """Holt eine verpasste Reservierung nach (Browser brach nach der Bestätigung ab)."""
    if participant.paid or participant.authorized:
        return  # bereits verarbeitet - Webhooks können mehrfach kommen
    mediation = (
        db.query(Mediation).filter(Mediation.id == participant.mediation_id).first()
    )
    if not mediation:
        return

    try:
        auth = await authorize_order(participant.paypal_order_id)
    except AuthorizationExpiredError:
        logger.warning(
            "Webhook: Order %s von Teilnehmer %s bereits abgelaufen",
            participant.paypal_order_id, participant.id,
        )
        return
    except PayPalError:
        logger.exception(
            "Webhook: Nachträgliche Reservierung für Teilnehmer %s fehlgeschlagen",
            participant.id,
        )
        return

    # Trägt die Zeile eine freiwillige Kostenübernahme, lautete die Order auf
    # den Grundanteil dieser Partei – nicht auf ihren eigenen Betrag (der
    # Rabatte und Add-ons enthielte, die der Übernehmende nie gewählt hat).
    if participant.covered_by_participant_id and participant.coverage_mode == "separate":
        amount = billing.coverage_amount(db, mediation, participant)
    else:
        amount = billing.participant_final_due(db, mediation, participant)

    # Gleiche Prüfung wie in capture-order: passt die Reservierung nicht zum
    # fälligen Betrag, wird sie freigegeben statt gespeichert.
    reserved = auth.get("amount_eur")
    if reserved is not None and abs(float(reserved) - float(amount)) > 0.005:
        logger.warning(
            "Webhook: Reservierung %s (%.2f €) passt nicht zum fälligen Betrag %.2f € "
            "von Teilnehmer %s – wird freigegeben",
            auth["authorization_id"], reserved, amount, participant.id,
        )
        try:
            await void_authorization(auth["authorization_id"])
        except PayPalError:
            logger.exception("Webhook: Storno von %s fehlgeschlagen", auth["authorization_id"])
        return

    billing.mark_participant_authorized(
        db,
        participant,
        amount=amount,
        order_id=participant.paypal_order_id,
        authorization_id=auth["authorization_id"],
        expires_at=_parse_paypal_time(auth.get("expires_at")),
    )
    logger.info(
        "Webhook: Reservierung für Teilnehmer %s nachgeholt", participant.id
    )
    await billing.settle_and_unlock(db, mediation)


@router.post("/webhook")
async def paypal_webhook(request: Request, db: Session = Depends(get_db)):
    """Nimmt PayPal-Ereignisse entgegen.

    Antwortet bewusst IMMER mit 200 (sofern die Signatur stimmt): ein Fehler
    unsererseits würde PayPal sonst zu endlosen Wiederholungen veranlassen.
    Nicht behandelte Ereignisse werden schlicht ignoriert.
    """
    raw = (await request.body()).decode("utf-8")

    # Roh-Body verwenden - neu serialisiertes JSON bricht die Signaturprüfung.
    verified = await verify_webhook_signature(dict(request.headers), raw)
    if not verified:
        logger.warning("PayPal-Webhook mit ungültiger Signatur abgelehnt")
        # 400 statt 200: PayPal soll den Fehlversuch als solchen sehen.
        return JSONResponse(status_code=400, content={"ok": False, "detail": "invalid signature"})

    try:
        event = json.loads(raw)
    except ValueError:
        return JSONResponse(status_code=400, content={"ok": False, "detail": "invalid json"})

    event_type = event.get("event_type") or ""
    resource = event.get("resource") or {}
    logger.info("PayPal-Webhook empfangen: %s", event_type)

    if event_type == "CHECKOUT.ORDER.APPROVED":
        # Nutzer hat bestätigt. Falls unser Frontend nicht mehr dazu kam, die
        # Reservierung anzulegen, holen wir das hier nach.
        participant = _participant_by_order(db, resource.get("id") or "")
        if participant:
            await _recover_authorization(db, participant)

    elif event_type == "PAYMENT.AUTHORIZATION.CREATED":
        # Reservierung existiert bei PayPal. Zuordnung sichern, falls unser
        # eigener Aufruf die ID nicht mehr speichern konnte.
        auth_id = resource.get("id") or ""
        participant = _participant_by_authorization(db, auth_id)
        if not participant:
            participant = _participant_by_order(db, _order_id_from_resource(resource))
            if participant and not participant.paid and not participant.authorized:
                await _recover_authorization(db, participant)

    elif event_type in ("PAYMENT.AUTHORIZATION.VOIDED", "PAYMENT.CAPTURE.DENIED"):
        # Reservierung ist weg bzw. Einzug abgelehnt -> Partei wieder auf
        # "offen" setzen, damit sie erneut bezahlen kann.
        participant = _participant_by_authorization(db, resource.get("id") or "")
        if participant and not participant.paid:
            billing.clear_participant_authorization(db, participant)
            logger.info(
                "Webhook: Reservierung von Teilnehmer %s zurückgesetzt (%s)",
                participant.id, event_type,
            )

    return {"ok": True}
