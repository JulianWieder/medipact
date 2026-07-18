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
#
# Einstiegs-Typen (Strategie "Trichter": Nachbarschaft/WG/Verbraucher = nied-
# rigschwellig, 20 € pro Partei, Umsatz über buchbare Add-ons – siehe ADDONS).
# Monetarisierung über Trennung/Erbschaft/Geschäft (Premium-Typen).
PRICE_MATRIX: dict[str, dict[str, float | None]] = {
    "nachbarschaft": {"online": 20.0,  "hybrid": None,  "vollservice": None},
    "wg":            {"online": 20.0,  "hybrid": None,  "vollservice": None},
    "verbraucher":   {"online": 20.0,  "hybrid": None,  "vollservice": None},
    "trennung":      {"online": 399.0, "hybrid": 499.0, "vollservice": 899.0},
    "erbschaft":     {"online": 399.0, "hybrid": None,  "vollservice": None},
    "geschaeft":     {"online": 399.0, "hybrid": None,  "vollservice": None},
}

# Abrechnungsmodell je Konflikttyp (laut /preise). Gilt paketübergreifend.
BILLING_MODEL: dict[str, str] = {
    "nachbarschaft": "per_party",  # 20 € je Partei (früher 249 € split)
    "wg": "per_party",
    "verbraucher": "per_party",
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


# ── Buchbare Add-ons (Einstiegs-Typen) ──────────────────────────────────────
#
# Beim 20-€-Einstiegstarif (Nachbarschaft/WG/Verbraucher) ist der Basispreis
# bewusst niedrig; Umsatz entsteht über optional zubuchbare Add-ons. Eine
# Partei wählt ihre Add-ons VOR der Zahlung (PUT /mediations/{id}/addons);
# der Betrag wird auf ihren Anteil aufgeschlagen (siehe services/billing.py).
# Preise – wie alles hier – bewusst NUR an dieser Stelle gepflegt.
# TODO(Julian): Preise/Formulierungen prüfen, ggf. weitere Add-ons ergänzen.

ADDON_TYPES: set[str] = {"nachbarschaft", "wg", "verbraucher"}

ADDONS: dict[str, dict] = {
    "videositzung": {
        "label": "Live-Videositzung mit Mediator:in",
        "description": "60 Minuten moderierte Videositzung mit einer erfahrenen Mediator:in – zusätzlich zum Online-Prozess.",
        "price_eur": 79.0,
    },
    "vereinbarung": {
        "label": "Geprüfte Abschlussvereinbarung",
        "description": "Eure Einigung wird als rechtssicher formulierte, unterschriftsreife Abschlussvereinbarung aufbereitet und geprüft.",
        "price_eur": 49.0,
    },
    "express": {
        "label": "Express-Bearbeitung",
        "description": "Priorisierte Bearbeitung: Rückmeldungen und Freigaben innerhalb von 24 Stunden an Werktagen.",
        "price_eur": 29.0,
    },
}


def addons_available(mediation_type: str) -> bool:
    return (mediation_type or "").lower() in ADDON_TYPES


def addons_for(mediation_type: str) -> list[dict]:
    """Buchbare Add-ons für einen Konflikttyp – für das Auswahl-UI im
    Freischalt-Schritt. Leere Liste, wenn der Typ keine Add-ons anbietet."""
    if not addons_available(mediation_type):
        return []
    return [
        {"key": key, "label": cfg["label"], "description": cfg["description"], "price_eur": float(cfg["price_eur"])}
        for key, cfg in ADDONS.items()
    ]


def addon_price(mediation_type: str, addon_key: str) -> float | None:
    """Preis eines Add-ons (EUR) oder None, wenn es für den Typ nicht buchbar ist."""
    if not addons_available(mediation_type):
        return None
    cfg = ADDONS.get((addon_key or "").strip().lower())
    return float(cfg["price_eur"]) if cfg else None


# ── Business-Abos (Firmenkunden) ─────────────────────────────────────────────
#
# Ein Firmenkunde (Organization) hat einen Abo-Plan; das Abo schaltet die
# internen Fälle des Unternehmens frei (Fälle inklusive, keine Pro-Partei-
# Paywall – siehe app/services/billing.py). Der Monatspreis wird aktuell noch
# nach der Anzahl der Firmen-Mediatoren berechnet – die endgültige Preisachse
# (Sitze/Mitarbeiter vs. parallele Fälle vs. Flat) ist eine offene Produkt-
# Entscheidung (siehe docs/business-mandanten-spec.md, §7/§10). Bis dahin bleibt
# die bestehende Formel bestehen:
#   Monatspreis = base_eur + per_mediator_eur × max(0, Mediatoren − included_mediators)
# ``max_mediators`` = None bedeutet unbegrenzt. Zahlen sind – wie oben –
# bewusst NUR hier gepflegt.
# TODO(Julian): Platzhalter-Preise prüfen/anpassen, sobald sie feststehen.

ABO_PLANS: tuple[str, ...] = ("starter", "praxis", "kanzlei")
DEFAULT_ABO_PLAN = "starter"

# Anzeige-Labels der Business-Pläne. Schlüssel bleiben stabil (DB-Werte in
# organizations.plan); nur die Labels wurden auf Firmenkunden umgestellt
# (früher Anbieter-/Kanzlei-Framing).
ABO_PLAN_LABELS = {
    "starter": "Starter",
    "praxis": "Team",
    "kanzlei": "Unternehmen",
}

ABO_PRICING: dict[str, dict] = {
    #            Grundpreis  je weiterer Mediator  inklusive  max (None = unbegrenzt)
    "starter": {"base_eur": 49.0,  "per_mediator_eur": 49.0, "included_mediators": 1, "max_mediators": 1},
    "praxis":  {"base_eur": 99.0,  "per_mediator_eur": 39.0, "included_mediators": 2, "max_mediators": 10},
    "kanzlei": {"base_eur": 249.0, "per_mediator_eur": 29.0, "included_mediators": 5, "max_mediators": None},
}


def normalize_abo_plan(plan: str | None) -> str:
    p = (plan or "").strip().lower()
    return p if p in ABO_PLANS else DEFAULT_ABO_PLAN


def abo_plan_allows(plan: str, mediator_count: int) -> bool:
    """Ob der Plan die gegebene Mediatoren-Anzahl zulässt."""
    cfg = ABO_PRICING[normalize_abo_plan(plan)]
    limit = cfg["max_mediators"]
    return limit is None or mediator_count <= int(limit)


def organization_monthly_price(plan: str, mediator_count: int) -> float:
    """Monatlicher Abo-Preis eines Mandanten (EUR) bei ``mediator_count``
    Mediatoren. Mediatoren über ``included_mediators`` kosten je
    ``per_mediator_eur`` zusätzlich."""
    cfg = ABO_PRICING[normalize_abo_plan(plan)]
    extra = max(0, int(mediator_count) - int(cfg["included_mediators"]))
    return round(float(cfg["base_eur"]) + extra * float(cfg["per_mediator_eur"]), 2)


def abo_plan_options() -> list[dict]:
    """Alle Pläne inkl. Konditionen – für Auswahl-UIs im Frontend."""
    out = []
    for key in ABO_PLANS:
        cfg = ABO_PRICING[key]
        out.append({
            "key": key,
            "label": ABO_PLAN_LABELS[key],
            "base_eur": float(cfg["base_eur"]),
            "per_mediator_eur": float(cfg["per_mediator_eur"]),
            "included_mediators": int(cfg["included_mediators"]),
            "max_mediators": cfg["max_mediators"],
        })
    return out
