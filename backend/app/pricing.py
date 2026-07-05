"""Zentrale, editierbare Preis-Logik für die Fall-Freischaltung.

Preis eines Falls = ``PRICE_MATRIX[mediation_type][package]``. Wie dieser Preis
auf die Parteien verteilt wird, bestimmt ``BILLING_MODEL[mediation_type]``:

  • "per_party" – jede Partei zahlt den vollen Preis (z.B. Trennung: 399 € × 2).
  • "split"     – der Preis wird gleichmäßig auf alle Parteien geteilt
                  (z.B. Nachbarschaft 249 € bei 2 Parteien = je 124,50 €).
  • "once"      – nur EINE Partei (die Fall-Eigentümer:in) zahlt; die andere 0 €
                  (z.B. Erbschaft/Geschäft: einmalig für den Fall).

WICHTIG: Alle Zahlen stehen bewusst NUR hier, an einer Stelle. Werte stammen von
der Preisseite (/preise). Mit ``None`` markierte (Typ, Paket)-Kombinationen
werden NICHT angeboten. Fehlende Hybrid-/Vollservice-Preise bitte hier ergänzen,
sobald sie feststehen – der restliche Code muss dafür nicht angefasst werden.
"""
from __future__ import annotations

# Reihenfolge = Anzeige-Reihenfolge im Frontend.
PACKAGES: tuple[str, ...] = ("online", "hybrid", "vollservice")
DEFAULT_PACKAGE = "online"

PACKAGE_LABELS = {
    "online": "Online-Prozess",
    "hybrid": "Hybrid",
    "vollservice": "Vollservice",
}

# EUR-Grundpreis je (Konflikttyp, Paket). None = Kombination nicht angeboten.
# TODO(Julian): fehlende Werte (None) füllen, falls die Kombination angeboten wird.
PRICE_MATRIX: dict[str, dict[str, float | None]] = {
    "nachbarschaft": {"online": 249.0, "hybrid": None, "vollservice": None},
    "trennung":      {"online": 399.0, "hybrid": 499.0, "vollservice": 899.0},
    "erbschaft":     {"online": 399.0, "hybrid": None, "vollservice": None},
    "geschaeft":     {"online": 399.0, "hybrid": None, "vollservice": None},
}

# Abrechnungsmodell je Konflikttyp (laut /preise). Gilt paketübergreifend.
BILLING_MODEL: dict[str, str] = {
    "nachbarschaft": "split",
    "trennung": "per_party",
    "erbschaft": "once",
    "geschaeft": "once",
}

# Fallback, falls ein unbekannter Typ/ein unbekanntes Paket auftaucht.
FALLBACK_PRICE = 499.0
FALLBACK_BILLING_MODEL = "per_party"


def normalize_package(package: str | None) -> str:
    pkg = (package or "").strip().lower()
    return pkg if pkg in PACKAGES else DEFAULT_PACKAGE


def billing_model(mediation_type: str) -> str:
    return BILLING_MODEL.get((mediation_type or "").lower(), FALLBACK_BILLING_MODEL)


def base_price(mediation_type: str, package: str) -> float:
    """Grundpreis des Falls (vor Aufteilung/Rabatt). Fällt auf FALLBACK_PRICE
    zurück, wenn Typ/Paket unbekannt oder die Kombination None (nicht angeboten) ist."""
    row = PRICE_MATRIX.get((mediation_type or "").lower())
    if not row:
        return FALLBACK_PRICE
    value = row.get(normalize_package(package))
    return float(value) if value is not None else FALLBACK_PRICE


def is_offered(mediation_type: str, package: str) -> bool:
    row = PRICE_MATRIX.get((mediation_type or "").lower())
    if not row:
        return False
    return row.get(normalize_package(package)) is not None


def available_packages(mediation_type: str) -> list[dict]:
    """Angebotene Pakete für einen Konflikttyp inkl. Grundpreis – für das
    Paket-Auswahl-UI bei der Fallerstellung."""
    row = PRICE_MATRIX.get((mediation_type or "").lower(), {})
    out = []
    for pkg in PACKAGES:
        price = row.get(pkg)
        if price is not None:
            out.append({"key": pkg, "label": PACKAGE_LABELS[pkg], "price_eur": float(price)})
    return out


def participant_owes(mediation_type: str, *, is_owner: bool) -> bool:
    """Ob eine Partei bei diesem Abrechnungsmodell überhaupt zahlungspflichtig ist.
    Bei "once" zahlt nur die Eigentümer:in; sonst alle."""
    if billing_model(mediation_type) == "once":
        return is_owner
    return True


def participant_due(
    mediation_type: str,
    package: str,
    *,
    participant_count: int,
    is_owner: bool,
) -> float:
    """Fälliger Grundbetrag EINER Partei (vor Rabatt), je nach Abrechnungsmodell."""
    price = base_price(mediation_type, package)
    model = billing_model(mediation_type)
    if model == "once":
        return round(price, 2) if is_owner else 0.0
    if model == "split":
        return round(price / max(participant_count, 1), 2)
    # per_party (Default)
    return round(price, 2)
