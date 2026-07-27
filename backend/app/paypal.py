"""Minimaler Client für die PayPal Orders API (v2).

Nutzt den OAuth2 Client-Credentials-Flow, um ein Access-Token zu holen, und
ruft darüber die Orders-API auf. Läuft im Sandbox-Modus, solange PAYPAL_ENV=
"sandbox" gesetzt ist (Standard) - dort kann ohne echtes Geld getestet werden.
Für echte Zahlungen muss PAYPAL_ENV auf "live" gesetzt und echte
PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET aus dem PayPal-Business-Konto hinterlegt
werden.

ZAHLUNGSMODELL: Reservieren, dann einziehen (AUTHORIZE statt CAPTURE)
──────────────────────────────────────────────────────────────────────
Eine Mediation startet erst, wenn ALLE zahlungspflichtigen Parteien zugesagt
haben. Würde jede Partei sofort abgebucht (intent="CAPTURE"), läge das Geld
der ersten Partei bei uns, obwohl der Fall womöglich nie startet - genau das,
was der Hinweis im Frontend ("Betrag wird zunächst nur reserviert") verspricht.

Deshalb der zweistufige Ablauf:
  1. create_order(intent="AUTHORIZE")  -> Nutzer genehmigt in PayPal
  2. authorize_order()                 -> Betrag wird beim Nutzer RESERVIERT
  3. capture_authorization()           -> erst wenn alle Parteien reserviert
                                          haben, wird tatsächlich abgebucht
  4. void_authorization()              -> Reservierung freigeben (Storno)

FRISTEN (PayPal): Eine Autorisierung ist in der "honor period" 3 Tage sicher
einziehbar und verfällt endgültig nach 29 Tagen. Wer zuerst reserviert, dessen
Autorisierung kann also ablaufen, wenn die Gegenseite lange braucht -
capture_authorization meldet das dann als AUTHORIZATION_EXPIRED (siehe
AUTHORIZATION_EXPIRED_CODES und services/billing.py).
"""

import httpx

from app.config import settings

# Fehler-Codes/Issues, mit denen PayPal eine abgelaufene oder bereits
# aufgehobene Autorisierung meldet. Sie bedeuten: neu autorisieren lassen,
# nicht "Zahlung fehlgeschlagen".
AUTHORIZATION_EXPIRED_CODES = {
    "AUTHORIZATION_EXPIRED",
    "AUTHORIZATION_VOIDED",
    "INVALID_RESOURCE_ID",
}


class PayPalError(Exception):
    pass


class AuthorizationExpiredError(PayPalError):
    """Die Reservierung ist abgelaufen/aufgehoben - die Partei muss erneut zahlen."""


def _api_base() -> str:
    if settings.PAYPAL_ENV == "live":
        return "https://api-m.paypal.com"
    return "https://api-m.sandbox.paypal.com"


async def _get_access_token() -> str:
    if not settings.PAYPAL_CLIENT_ID or not settings.PAYPAL_CLIENT_SECRET:
        raise PayPalError(
            "PayPal ist noch nicht konfiguriert (PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET fehlen)."
        )

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"{_api_base()}/v1/oauth2/token",
            data={"grant_type": "client_credentials"},
            auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET),
        )
    if resp.status_code != 200:
        raise PayPalError(f"PayPal-Login fehlgeschlagen: {resp.text}")
    return resp.json()["access_token"]


def _json_headers(token: str) -> dict:
    # Auch Requests OHNE Body brauchen einen Content-Type - fehlt er, antwortet
    # PayPal mit UNSUPPORTED_MEDIA_TYPE.
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def _issue_codes(data: dict) -> set[str]:
    """Sammelt Fehler-Codes aus einer PayPal-Fehlerantwort (name + details[].issue)."""
    codes: set[str] = set()
    name = data.get("name")
    if isinstance(name, str):
        codes.add(name)
    for detail in data.get("details") or []:
        issue = detail.get("issue") if isinstance(detail, dict) else None
        if isinstance(issue, str):
            codes.add(issue)
    return codes


def _raise_for_error(resp: httpx.Response, context: str) -> None:
    """Wirft AuthorizationExpiredError bei abgelaufener Reservierung, sonst PayPalError."""
    if resp.status_code in (200, 201):
        return
    try:
        data = resp.json()
    except ValueError:
        data = {}
    if _issue_codes(data) & AUTHORIZATION_EXPIRED_CODES:
        raise AuthorizationExpiredError(
            "Die Zahlungsreservierung ist abgelaufen. Bitte erneut bezahlen."
        )
    raise PayPalError(f"{context}: {resp.text}")


async def create_order(
    amount_eur: float,
    mediation_id: int,
    *,
    intent: str = "CAPTURE",
    description: str = "medipact Mediationsfall - Freischaltung",
) -> dict:
    """Erstellt eine PayPal-Order über den angegebenen Betrag (EUR).

    ``intent="CAPTURE"`` (Standard) bucht beim Bestätigen sofort ab - richtig
    für Zahlungen mit nur EINEM Zahler (Logbuch-Premium, Firmen-Onboarding,
    Bonus-Blöcke), bei denen die Leistung unmittelbar freigeschaltet wird.

    ``intent="AUTHORIZE"`` reserviert den Betrag nur. Das ist der Weg für die
    Fall-Freischaltung, weil dort mehrere Parteien zahlen und das Geld erst
    fließen darf, wenn alle zugesagt haben (siehe Modul-Docstring).
    """
    if intent not in ("CAPTURE", "AUTHORIZE"):
        raise PayPalError(f"Ungültiger PayPal-Intent: {intent}")
    token = await _get_access_token()
    payload = {
        "intent": intent,
        "purchase_units": [
            {
                "reference_id": f"mediation-{mediation_id}",
                "description": description,
                "amount": {
                    "currency_code": "EUR",
                    "value": f"{amount_eur:.2f}",
                },
            }
        ],
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"{_api_base()}/v2/checkout/orders",
            json=payload,
            headers=_json_headers(token),
        )
    _raise_for_error(resp, "PayPal-Order konnte nicht erstellt werden")
    return resp.json()


async def capture_order(order_id: str) -> dict:
    """Bucht eine Order mit intent="CAPTURE" sofort ab (Ein-Zahler-Flows).

    Gibt die volle Antwort zurück; der Aufrufer muss ``status == "COMPLETED"``
    prüfen. Für die Fall-Freischaltung NICHT verwenden - dort läuft es über
    authorize_order() + capture_authorization().
    """
    token = await _get_access_token()
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"{_api_base()}/v2/checkout/orders/{order_id}/capture",
            json={},
            headers=_json_headers(token),
        )
    _raise_for_error(resp, "PayPal-Capture fehlgeschlagen")
    return resp.json()


async def authorize_order(order_id: str) -> dict:
    """Reserviert (autorisiert) den Betrag einer zuvor genehmigten Order.

    Es wird noch NICHTS abgebucht - der Betrag ist beim Zahler nur blockiert.
    Gibt ``{"authorization_id": ..., "status": ..., "expires_at": ...}`` zurück;
    ``expires_at`` ist das Ende der 3-tägigen Honor Period, sofern PayPal es
    mitliefert.
    """
    token = await _get_access_token()
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"{_api_base()}/v2/checkout/orders/{order_id}/authorize",
            # Der Aufruf hat KEINEN Body. Ohne json=/content setzt httpx auch
            # keinen Content-Type - PayPal antwortet dann mit
            # UNSUPPORTED_MEDIA_TYPE. Deshalb leerer JSON-Body + Header.
            json={},
            headers=_json_headers(token),
        )
    _raise_for_error(resp, "PayPal-Autorisierung fehlgeschlagen")
    data = resp.json()

    auth = None
    for unit in data.get("purchase_units") or []:
        for candidate in (unit.get("payments") or {}).get("authorizations") or []:
            auth = candidate
            break
        if auth:
            break
    if not auth or not auth.get("id"):
        raise PayPalError(f"PayPal lieferte keine Autorisierung zurück: {resp.text}")

    return {
        "authorization_id": auth["id"],
        "status": auth.get("status"),
        "expires_at": auth.get("expiration_time"),
        "raw": data,
    }


async def capture_authorization(authorization_id: str, amount_eur: float | None = None) -> dict:
    """Zieht eine zuvor reservierte Autorisierung tatsächlich ein.

    Erst hier fließt Geld. Wirft AuthorizationExpiredError, wenn die
    Reservierung abgelaufen oder aufgehoben wurde.
    """
    token = await _get_access_token()
    payload: dict = {"final_capture": True}
    if amount_eur is not None:
        payload["amount"] = {"currency_code": "EUR", "value": f"{amount_eur:.2f}"}
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"{_api_base()}/v2/payments/authorizations/{authorization_id}/capture",
            json=payload,
            headers=_json_headers(token),
        )
    _raise_for_error(resp, "PayPal-Capture fehlgeschlagen")
    return resp.json()


async def verify_webhook_signature(headers: dict, event_body: str) -> bool:
    """Prüft bei PayPal, ob ein eingehender Webhook echt ist.

    Ohne diese Prüfung könnte jeder einen Request an unseren Webhook schicken
    und damit Zahlungen als erfolgreich melden. Ist PAYPAL_WEBHOOK_ID nicht
    gesetzt, gilt der Webhook als NICHT verifiziert (fail closed).

    ``event_body`` muss der exakte Roh-Body des Requests sein - schon ein
    unterschiedlich formatiertes JSON lässt die Signaturprüfung scheitern.
    """
    if not settings.PAYPAL_WEBHOOK_ID:
        return False

    def _h(name: str) -> str:
        # Header sind case-insensitiv; PayPal schickt sie in Großschreibung.
        return headers.get(name) or headers.get(name.lower()) or ""

    required = [
        "PAYPAL-AUTH-ALGO",
        "PAYPAL-CERT-URL",
        "PAYPAL-TRANSMISSION-ID",
        "PAYPAL-TRANSMISSION-SIG",
        "PAYPAL-TRANSMISSION-TIME",
    ]
    if not all(_h(k) for k in required):
        return False

    token = await _get_access_token()
    # webhook_event muss als JSON-Objekt (nicht als String) mitgeschickt werden.
    import json

    payload = {
        "auth_algo": _h("PAYPAL-AUTH-ALGO"),
        "cert_url": _h("PAYPAL-CERT-URL"),
        "transmission_id": _h("PAYPAL-TRANSMISSION-ID"),
        "transmission_sig": _h("PAYPAL-TRANSMISSION-SIG"),
        "transmission_time": _h("PAYPAL-TRANSMISSION-TIME"),
        "webhook_id": settings.PAYPAL_WEBHOOK_ID,
        "webhook_event": json.loads(event_body),
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"{_api_base()}/v1/notifications/verify-webhook-signature",
            json=payload,
            headers=_json_headers(token),
        )
    if resp.status_code != 200:
        return False
    return resp.json().get("verification_status") == "SUCCESS"


async def void_authorization(authorization_id: str) -> None:
    """Hebt eine Reservierung auf (Storno) - der Betrag wird beim Zahler wieder frei.

    Eine bereits abgelaufene Autorisierung gilt als erfolgreich storniert.
    """
    token = await _get_access_token()
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"{_api_base()}/v2/payments/authorizations/{authorization_id}/void",
            json={},
            headers=_json_headers(token),
        )
    if resp.status_code in (200, 201, 204):
        return
    try:
        data = resp.json()
    except ValueError:
        data = {}
    if _issue_codes(data) & AUTHORIZATION_EXPIRED_CODES:
        return
    raise PayPalError(f"PayPal-Storno fehlgeschlagen: {resp.text}")
