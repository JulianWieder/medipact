"""Minimaler Client für die PayPal Orders API (v2).

Nutzt den OAuth2 Client-Credentials-Flow, um ein Access-Token zu holen, und
ruft darüber die Orders-API auf (Create Order / Capture Order). Läuft im
Sandbox-Modus, solange PAYPAL_ENV="sandbox" gesetzt ist (Standard) - dort
kann ohne echtes Geld getestet werden. Für echte Zahlungen muss PAYPAL_ENV
auf "live" gesetzt und echte PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET aus dem
PayPal-Business-Konto hinterlegt werden.
"""

import httpx

from app.config import settings


class PayPalError(Exception):
    pass


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


async def create_order(amount_eur: float, mediation_id: int) -> dict:
    """Erstellt eine PayPal-Order über den angegebenen Betrag (EUR)."""
    token = await _get_access_token()
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "reference_id": f"mediation-{mediation_id}",
                "description": "medipact Mediationsfall - Freischaltung",
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
            headers={"Authorization": f"Bearer {token}"},
        )
    if resp.status_code not in (200, 201):
        raise PayPalError(f"PayPal-Order konnte nicht erstellt werden: {resp.text}")
    return resp.json()


async def capture_order(order_id: str) -> dict:
    """Erfasst (capture) eine zuvor genehmigte PayPal-Order.

    Gibt die volle Capture-Antwort von PayPal zurück; der Aufrufer muss
    `status == "COMPLETED"` prüfen, bevor er die Zahlung als erfolgreich
    behandelt.
    """
    token = await _get_access_token()
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            f"{_api_base()}/v2/checkout/orders/{order_id}/capture",
            headers={"Authorization": f"Bearer {token}"},
        )
    if resp.status_code not in (200, 201):
        raise PayPalError(f"PayPal-Capture fehlgeschlagen: {resp.text}")
    return resp.json()
