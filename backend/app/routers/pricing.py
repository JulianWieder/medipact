"""Öffentliche Preisauskunft.

GET /pricing/matrix liefert die in app/pricing.py gepflegten Preise als JSON.

**Warum das existiert.** Die Preise standen bisher an zwei Stellen: in
app/pricing.py (maßgeblich) und – für Marketing-Seiten wie den
Prozesskostenrechner unter /kostenrechner – als handgepflegte Kopie im
Frontend. Die Matrix hat sich innerhalb weniger Monate mehrfach geändert
(20 € → 49 € beim Einstiegstarif, WG gestrichen, ODR-Familie ergänzt);
eine Kopie läuft dabei zwangsläufig irgendwann auseinander, und ein
Rechner mit veralteten Preisen ist schlimmer als keiner.

**Bewusst öffentlich und ohne Auth.** Es sind exakt die Zahlen, die auch
auf /preise stehen. Der Endpunkt ist rein lesend, gibt nichts
Fallbezogenes preis und wird vom Frontend serverseitig mit Cache
abgerufen – deshalb ist der Rate-Limiter großzügig gesetzt.

**Legacy-Typen erscheinen NICHT.** "wg" wird seit dem 25.07.2026 nicht
mehr angeboten und steht in pricing.py nur noch für Bestandsfälle. Die
Liste hier ist die der buchbaren Typen; wer Preise für Bestandsfälle
braucht, nimmt die Funktionen aus pricing.py direkt.
"""
from __future__ import annotations

from fastapi import APIRouter, Request, Response

from app import pricing
from app.rate_limit import RateLimiter

router = APIRouter(prefix="/pricing", tags=["pricing"])

# Großzügig: der Endpunkt ist statisch und wird im Normalfall aus dem
# Frontend-Cache bedient. Der Limiter ist nur ein Missbrauchs-Riegel.
_limiter = RateLimiter(max_requests=60, window_seconds=60)

# Nicht mehr buchbare Typen – siehe Modul-Docstring.
LEGACY_TYPES: set[str] = {"wg"}


def _offered_types() -> list[str]:
    """Buchbare Konflikttypen in der Reihenfolge, in der sie in pricing.py
    stehen (= gewollte Anzeige-Reihenfolge)."""
    return [t for t in pricing.PRICE_MATRIX if t not in LEGACY_TYPES]


@router.get("/matrix")
def pricing_matrix(request: Request, response: Response) -> dict:
    _limiter.check(request)

    # Preise ändern sich selten. Eine Stunde Cache nimmt Last weg, ohne dass
    # eine Preisänderung länger als eine Stunde unsichtbar bleibt.
    response.headers["Cache-Control"] = "public, max-age=3600"

    types: dict[str, dict] = {}
    for key in _offered_types():
        row = pricing.PRICE_MATRIX[key]
        types[key] = {
            "billing_model": pricing.billing_model(key),
            # None = Kombination wird nicht angeboten. Bewusst durchgereicht,
            # damit das Frontend "nicht buchbar" von "kostenlos" unterscheiden
            # kann.
            "prices": {pkg: (float(v) if v is not None else None) for pkg, v in row.items()},
            "packages": pricing.available_packages(key),
            "addons": pricing.addons_for(key),
        }

    return {
        "packages": [
            {"key": pkg, "label": pricing.PACKAGE_LABELS[pkg]} for pkg in pricing.PACKAGES
        ],
        "default_package": pricing.DEFAULT_PACKAGE,
        "types": types,
        "addons": {
            key: {
                "label": cfg["label"],
                "description": cfg["description"],
                "price_eur": float(cfg["price_eur"]),
            }
            for key, cfg in pricing.ADDONS.items()
        },
        "logbuch_premium_eur": float(pricing.LOGBUCH_PREMIUM_PRICE_EUR),
        "currency": "EUR",
    }
