"""Ende-zu-Ende-Simulation der Fall-Bezahlung (PayPal AUTHORIZE -> CAPTURE).

Läuft OHNE Netz und OHNE echte PayPal-Zugangsdaten: ``FakePayPal`` ersetzt die
Funktionen aus app/paypal.py und hält Orders/Reservierungen im Speicher, inkl.
der PayPal-Regeln, die uns im Echtbetrieb treffen (Betrag einer Order ist fix,
eine Order lässt sich nur EINMAL autorisieren, eine Reservierung nur einmal
einziehen, Idempotenz über PayPal-Request-Id).

Datenbank: frische SQLite-Datei im Temp-Ordner (DATABASE_URL wird VOR dem
Import der App gesetzt).

Aufruf (Server, im Container):
    docker exec medipact-api python -m tests.test_payment_flow
Lokal:
    cd backend && python -m tests.test_payment_flow
"""
from __future__ import annotations

import asyncio
import os
import sys
import tempfile
import traceback
from datetime import datetime, timedelta, timezone

_TMP = tempfile.mkdtemp(prefix="medipact-paytest-")
os.environ["DATABASE_URL"] = f"sqlite:///{_TMP}/test.db"
os.environ.setdefault("DATA_DIR", _TMP)
sys.path.insert(0, ".")

from fastapi import HTTPException  # noqa: E402

from app import paypal as real_paypal  # noqa: E402
from app.database import Base, SessionLocal, engine  # noqa: E402
import app.models  # noqa: E402,F401  (registriert alle Tabellen)
from app.models.discount_code import DiscountCode  # noqa: E402
from app.models.invoice import Invoice  # noqa: E402
from app.models.mediation import Mediation  # noqa: E402
from app.models.mediation_participant import MediationParticipant  # noqa: E402
from app.models.user import User  # noqa: E402
from app.routers import mediations as R  # noqa: E402
from app.routers import paypal_webhooks as W  # noqa: E402
from app.services import billing  # noqa: E402

# Sicherheitsnetz: _reset_db() löscht alle Tabellen. Niemals gegen etwas
# anderes als die Wegwerf-SQLite laufen lassen.
assert str(engine.url).startswith("sqlite:///") and _TMP in str(engine.url), engine.url


# ── Fake PayPal ─────────────────────────────────────────────────────────────


class FakePayPal:
    def __init__(self) -> None:
        self.orders: dict[str, dict] = {}
        self.auths: dict[str, dict] = {}
        self.n = 0
        self.fail_next_capture: Exception | None = None
        self.capture_calls = 0

    def _id(self, prefix: str) -> str:
        self.n += 1
        return f"{prefix}{self.n:04d}"

    # -- Orders --
    async def create_order(self, amount_eur, mediation_id, *, intent="CAPTURE", description=""):
        oid = self._id("ORD")
        self.orders[oid] = {
            "amount": round(float(amount_eur), 2),
            "intent": intent,
            "status": "CREATED",
            "auth_id": None,
            "mediation_id": mediation_id,
        }
        return {"id": oid, "status": "CREATED"}

    def approve(self, order_id: str) -> None:
        """Simuliert die Bestätigung durch den Nutzer im PayPal-Fenster."""
        self.orders[order_id]["status"] = "APPROVED"

    async def authorize_order(self, order_id):
        o = self.orders.get(order_id)
        if not o:
            raise real_paypal.PayPalError("RESOURCE_NOT_FOUND")
        if o["intent"] != "AUTHORIZE":
            raise real_paypal.PayPalError("ACTION_DOES_NOT_MATCH_INTENT")
        if o["auth_id"]:
            # Echtes PayPal: 422 ORDER_ALREADY_AUTHORIZED. app/paypal.py fängt
            # das ab und liefert die vorhandene Reservierung - genau das
            # bildet der Fake ab.
            return self._auth_result(o["auth_id"], self.auths[o["auth_id"]])
        if o["status"] != "APPROVED":
            raise real_paypal.PayPalError("ORDER_NOT_APPROVED")
        aid = self._id("AUTH")
        self.auths[aid] = {
            "amount": o["amount"],
            "status": "CREATED",
            "expires": datetime.now(timezone.utc) + timedelta(days=29),
        }
        o["auth_id"] = aid
        o["status"] = "COMPLETED"
        return self._auth_result(aid, self.auths[aid])

    def _auth_result(self, aid, a):
        return {
            "authorization_id": aid,
            "status": a["status"],
            "expires_at": a["expires"].strftime("%Y-%m-%dT%H:%M:%SZ"),
            "amount_eur": a["amount"],
            "raw": {},
        }

    async def capture_authorization(self, authorization_id, amount_eur=None):
        self.capture_calls += 1
        if self.fail_next_capture:
            e, self.fail_next_capture = self.fail_next_capture, None
            raise e
        a = self.auths.get(authorization_id)
        if not a:
            raise real_paypal.AuthorizationExpiredError("INVALID_RESOURCE_ID")
        if a["status"] == "VOIDED" or a["status"] == "EXPIRED":
            raise real_paypal.AuthorizationExpiredError(a["status"])
        if a["status"] == "CAPTURED":
            # Idempotenz über PayPal-Request-Id: gleiche Antwort wie beim ersten Mal.
            return {"id": a["capture_id"], "status": "COMPLETED"}
        amt = a["amount"] if amount_eur is None else round(float(amount_eur), 2)
        if amt > round(a["amount"] * 1.15, 2):
            raise real_paypal.PayPalError("AMOUNT_CANNOT_BE_GREATER_THAN_AUTHORIZED")
        a["status"] = "CAPTURED"
        a["captured"] = amt
        a["capture_id"] = self._id("CAP")
        return {"id": a["capture_id"], "status": "COMPLETED"}

    async def void_authorization(self, authorization_id):
        a = self.auths.get(authorization_id)
        if a and a["status"] == "CREATED":
            a["status"] = "VOIDED"

    def total_captured(self) -> float:
        return round(sum(a.get("captured", 0.0) for a in self.auths.values()), 2)


PP = FakePayPal()


def _install_fake() -> None:
    for mod in (R, W, billing, real_paypal):
        for name in ("create_order", "authorize_order", "capture_authorization", "void_authorization"):
            if hasattr(mod, name):
                setattr(mod, name, getattr(PP, name))


# ── Testdaten ───────────────────────────────────────────────────────────────


def _reset_db() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


_user_n = 0


def _user(db, name: str, *, address: bool = True) -> User:
    global _user_n
    _user_n += 1
    u = User(
        name=name,
        email=f"{name.lower()}{_user_n}@test.de",
        hashed_password="x",
        role="party",
        is_verified=True,
        onboarding_completed_at=datetime.now(timezone.utc).replace(tzinfo=None),
    )
    if address:
        u.billing_street, u.billing_postal_code, u.billing_city = "Weg 1", "63263", "Neu-Isenburg"
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


def _case(db, mtype="trennung", package="online", parties=("Anna", "Ben")):
    m = Mediation(title="Testfall", mediation_type=mtype, package=package, status="active", phase="einladung")
    db.add(m)
    db.commit()
    db.refresh(m)
    users = []
    for i, name in enumerate(parties):
        u = _user(db, name)
        db.add(MediationParticipant(mediation_id=m.id, user_id=u.id, role="owner" if i == 0 else "other_party"))
        users.append(u)
    db.commit()
    return m, users


def run(coro):
    return asyncio.run(coro)


def pay(db, m, u, *, for_pid=None, tamper_order=None):
    """Kompletter Bezahlvorgang einer Partei: create-order -> approve -> capture-order."""
    body = R.PayPalOrderRequest(for_participant_id=for_pid) if for_pid else None
    o = run(R.create_paypal_order(m.id, body, db=db, user=u))
    oid = tamper_order or o["order_id"]
    PP.approve(oid)
    return run(
        R.capture_paypal_order(
            m.id, R.PayPalCaptureRequest(order_id=oid, for_participant_id=for_pid), db=db, user=u
        )
    )


def expect_http(status: int, fn, *a, **k):
    try:
        fn(*a, **k)
    except HTTPException as e:
        assert e.status_code == status, f"erwartet {status}, bekommen {e.status_code}: {e.detail}"
        return e
    raise AssertionError(f"erwartet HTTP {status}, aber kein Fehler")


def invoices(db, m) -> list[Invoice]:
    return db.query(Invoice).filter(Invoice.mediation_id == m.id).all()


# ── Szenarien ───────────────────────────────────────────────────────────────


def t_happy_path_two_parties():
    db = SessionLocal()
    m, (a, b) = _case(db)
    r1 = pay(db, m, a)
    assert r1["you"]["authorized"] and not r1["is_paid"], r1["you"]
    assert PP.total_captured() == 0.0, "vor der zweiten Zusage darf nichts eingezogen sein"
    r2 = pay(db, m, b)
    assert r2["is_paid"], "Fall muss nach der zweiten Zusage frei sein"
    assert PP.total_captured() == 798.0, PP.total_captured()
    inv = invoices(db, m)
    assert len(inv) == 2, f"2 Rechnungen erwartet, {len(inv)}"
    assert sorted(i.amount for i in inv) == [399.0, 399.0], [i.amount for i in inv]
    db.close()


def t_once_model_only_owner_pays():
    db = SessionLocal()
    m, (a, b) = _case(db, mtype="erbschaft")
    expect_http(400, lambda: run(R.create_paypal_order(m.id, None, db=db, user=b)))
    r = pay(db, m, a)
    assert r["is_paid"], "once: Fall frei nach Zahlung der Eigentümerin"
    assert PP.total_captured() == 399.0
    db.close()


def t_einvernehmlich_package():
    db = SessionLocal()
    m, (a, b) = _case(db, package="einvernehmlich")
    pay(db, m, a)
    r = pay(db, m, b)
    assert r["is_paid"]
    assert sorted(i.amount for i in invoices(db, m)) == [299.0, 299.0]
    db.close()


def t_discount_full_and_percent():
    db = SessionLocal()
    m, (a, b) = _case(db)
    db.add(DiscountCode(code="FREI", kind="full", value=0, active=True, scope="participant"))
    db.add(DiscountCode(code="HALB", kind="percent", value=50, active=True, scope="participant"))
    db.commit()
    R.apply_discount(m.id, R.DiscountApplyRequest(code="frei"), db=db, user=a)
    run(R.redeem_free(m.id, db=db, user=a))
    R.apply_discount(m.id, R.DiscountApplyRequest(code="HALB"), db=db, user=b)
    r = pay(db, m, b)
    assert r["is_paid"]
    assert PP.total_captured() == 199.5, PP.total_captured()
    codes = {c.code: c.used_count for c in db.query(DiscountCode).all()}
    assert codes == {"FREI": 1, "HALB": 1}, codes
    db.close()


def t_addons_entry_tariff():
    db = SessionLocal()
    m, (a, b) = _case(db, mtype="nachbarschaft")
    R.set_addons(m.id, R.AddonsUpdateRequest(keys=["videositzung"]), db=db, user=a)
    pay(db, m, a)
    expect_http(400, R.set_addons, m.id, R.AddonsUpdateRequest(keys=[]), db=db, user=a)
    r = pay(db, m, b)
    assert r["is_paid"]
    assert PP.total_captured() == 49.0 + 79.0 + 49.0, PP.total_captured()
    db.close()


def t_coverage_bundle():
    db = SessionLocal()
    m, (a, b) = _case(db)
    pb = db.query(MediationParticipant).filter_by(mediation_id=m.id, user_id=b.id).first()
    R.set_coverage(m.id, R.CoverageRequest(participant_id=pb.id, cover=True), db=db, user=a)
    r = pay(db, m, a)
    assert r["is_paid"], "gebündelte Übernahme: eine Zahlung reicht"
    assert PP.total_captured() == 798.0
    inv = invoices(db, m)
    assert len(inv) == 1 and inv[0].amount == 798.0, [(i.participant_id, i.amount) for i in inv]
    db.close()


def t_coverage_separate():
    db = SessionLocal()
    m, (a, b) = _case(db)
    pb = db.query(MediationParticipant).filter_by(mediation_id=m.id, user_id=b.id).first()
    pay(db, m, a)
    r = pay(db, m, a, for_pid=pb.id)
    assert r["is_paid"], "separate Übernahme muss den Fall freischalten"
    assert PP.total_captured() == 798.0
    inv = invoices(db, m)
    assert len(inv) == 2 and sorted(i.amount for i in inv) == [399.0, 399.0]
    db.close()


def t_release_own_authorization():
    db = SessionLocal()
    m, (a, b) = _case(db)
    pay(db, m, a)
    r = run(R.release_own_authorization(m.id, db=db, user=a))
    assert not r["you"]["authorized"]
    assert all(x["status"] == "VOIDED" for x in PP.auths.values() if x["status"] != "CAPTURED")
    # danach erneut zahlbar
    pay(db, m, a)
    r = pay(db, m, b)
    assert r["is_paid"]
    db.close()


def t_expired_authorization_on_settle():
    db = SessionLocal()
    m, (a, b) = _case(db)
    pay(db, m, a)
    pa = db.query(MediationParticipant).filter_by(mediation_id=m.id, user_id=a.id).first()
    PP.auths[pa.paypal_authorization_id]["status"] = "EXPIRED"
    r = pay(db, m, b)
    assert not r["is_paid"] and "warning" in r, r.get("warning")
    db.refresh(pa)
    assert not pa.authorized
    r = pay(db, m, a)
    assert r["is_paid"], "nach erneuter Zahlung der abgelaufenen Partei frei"
    db.close()


def t_order_of_other_case_rejected():
    """Eine billige Order aus Fall X darf keinen teuren Fall Y bezahlen."""
    db = SessionLocal()
    cheap, (c1, _) = _case(db, mtype="nachbarschaft")
    o = run(R.create_paypal_order(cheap.id, None, db=db, user=c1))
    m, (a, b) = _case(db)
    run(R.create_paypal_order(m.id, None, db=db, user=a))
    PP.approve(o["order_id"])
    e = expect_http(
        409,
        lambda: run(R.capture_paypal_order(m.id, R.PayPalCaptureRequest(order_id=o["order_id"]), db=db, user=a)),
    )
    assert e
    db.close()


def t_amount_changed_after_order():
    """Add-ons nach create-order geändert -> Reservierung passt nicht mehr."""
    db = SessionLocal()
    m, (a, b) = _case(db, mtype="nachbarschaft")
    o = run(R.create_paypal_order(m.id, None, db=db, user=a))
    R.set_addons(m.id, R.AddonsUpdateRequest(keys=["videositzung", "vereinbarung"]), db=db, user=a)
    PP.approve(o["order_id"])
    expect_http(
        409,
        lambda: run(R.capture_paypal_order(m.id, R.PayPalCaptureRequest(order_id=o["order_id"]), db=db, user=a)),
    )
    pa = db.query(MediationParticipant).filter_by(mediation_id=m.id, user_id=a.id).first()
    assert not pa.authorized
    assert all(x["status"] == "VOIDED" for x in PP.auths.values() if x["amount"] == 49.0 and x["status"] != "CAPTURED")
    # neuer Versuch mit richtigem Betrag klappt
    pay(db, m, a)
    r = pay(db, m, b)
    assert r["is_paid"]
    db.close()


def t_transient_capture_error_recovers():
    """Netzfehler beim Einzug: kein 500 für den Nutzer, Cron holt nach."""
    db = SessionLocal()
    m, (a, b) = _case(db)
    pay(db, m, a)
    PP.fail_next_capture = real_paypal.PayPalError("INTERNAL_SERVER_ERROR")
    r = pay(db, m, b)  # darf NICHT werfen
    assert not r["is_paid"]
    # Cron-Lauf: Einzug nachholen
    from scripts import check_authorizations as C

    C.run()
    db.expire_all()
    db.refresh(m)
    assert m.is_paid, "Cron muss hängende Einzüge nachholen"
    assert PP.total_captured() == 798.0
    db.close()


def t_webhook_then_browser_race():
    """Webhook hat schon reserviert, dann kommt der Browser mit capture-order."""
    db = SessionLocal()
    m, (a, b) = _case(db)
    o = run(R.create_paypal_order(m.id, None, db=db, user=a))
    PP.approve(o["order_id"])
    pa = db.query(MediationParticipant).filter_by(mediation_id=m.id, user_id=a.id).first()
    run(W._recover_authorization(db, pa))
    db.refresh(pa)
    assert pa.authorized and pa.authorization_expires_at is not None, "Webhook muss Ablaufdatum mitspeichern"
    r = run(R.capture_paypal_order(m.id, R.PayPalCaptureRequest(order_id=o["order_id"]), db=db, user=a))
    assert r["you"]["authorized"], "Browser-Aufruf nach Webhook muss erfolgreich sein"
    db.close()


def t_double_submit_capture_order():
    """Doppelklick / Retry nach Timeout: zweiter capture-order-Aufruf."""
    db = SessionLocal()
    m, (a, b) = _case(db)
    pay(db, m, a)
    o = run(R.create_paypal_order(m.id, None, db=db, user=b))
    PP.approve(o["order_id"])
    req = R.PayPalCaptureRequest(order_id=o["order_id"])
    r1 = run(R.capture_paypal_order(m.id, req, db=db, user=b))
    assert r1["is_paid"]
    r2 = run(R.capture_paypal_order(m.id, req, db=db, user=b))
    assert r2["is_paid"]
    assert PP.total_captured() == 798.0
    assert len(invoices(db, m)) == 2
    db.close()


def t_paywall():
    db = SessionLocal()
    m, (a, b) = _case(db)
    pa = db.query(MediationParticipant).filter_by(mediation_id=m.id, user_id=a.id).first()
    expect_http(402, billing.ensure_unlocked, m, pa, a, db)
    pay(db, m, a)
    pay(db, m, b)
    db.refresh(m)
    billing.ensure_unlocked(m, pa, a, db)
    db.close()


# ── PayPal-Client (app/paypal.py) gegen simulierte HTTP-Antworten ───────────


class _Resp:
    def __init__(self, status, data):
        self.status_code, self._data = status, data
        self.text = str(data)

    def json(self):
        return self._data


class _Client:
    """Ersetzt httpx.AsyncClient; Antworten kommen aus einer Routing-Funktion."""

    route = None
    calls: list = []

    def __init__(self, *a, **k):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, *a):
        return False

    async def post(self, url, **k):
        _Client.calls.append(("POST", url, k.get("headers") or {}))
        return _Client.route("POST", url, k)

    async def get(self, url, **k):
        _Client.calls.append(("GET", url, k.get("headers") or {}))
        return _Client.route("GET", url, k)


def _with_client(route):
    import importlib

    pp = importlib.reload(real_paypal)  # echte Funktionen, nicht der Fake
    pp.settings.PAYPAL_CLIENT_ID, pp.settings.PAYPAL_CLIENT_SECRET = "id", "secret"
    pp.httpx.AsyncClient = _Client
    _Client.route, _Client.calls = route, []
    return pp


def _token_or(fn):
    def route(method, url, k):
        if url.endswith("/oauth2/token"):
            return _Resp(200, {"access_token": "T"})
        return fn(method, url, k)
    return route


def t_client_already_authorized_reads_order():
    order = {"purchase_units": [{"payments": {"authorizations": [
        {"id": "A1", "status": "CREATED", "expiration_time": "2026-11-02T10:00:00Z",
         "amount": {"value": "399.00", "currency_code": "EUR"}}]}}]}

    def route(method, url, k):
        if method == "POST" and url.endswith("/authorize"):
            return _Resp(422, {"name": "UNPROCESSABLE_ENTITY", "details": [{"issue": "ORDER_ALREADY_AUTHORIZED"}]})
        if method == "GET":
            return _Resp(200, order)
        raise AssertionError(url)

    pp = _with_client(_token_or(route))
    r = run(pp.authorize_order("O1"))
    assert r["authorization_id"] == "A1" and r["amount_eur"] == 399.0, r
    hdr = [c[2] for c in _Client.calls if c[1].endswith("/authorize")][0]
    assert hdr.get("PayPal-Request-Id") == "authz-O1", hdr


def t_client_capture_idempotent_and_declined():
    def route(method, url, k):
        return _Resp(422, {"name": "UNPROCESSABLE_ENTITY", "details": [{"issue": "AUTHORIZATION_ALREADY_CAPTURED"}]})

    pp = _with_client(_token_or(route))
    assert run(pp.capture_authorization("A1", 399.0))["status"] == "COMPLETED"
    hdr = [c[2] for c in _Client.calls if "/capture" in c[1]][0]
    assert hdr.get("PayPal-Request-Id") == "cap-A1", hdr

    pp = _with_client(_token_or(lambda m, u, k: _Resp(201, {"id": "C1", "status": "DECLINED"})))
    try:
        run(pp.capture_authorization("A2", 10.0))
    except pp.AuthorizationExpiredError:
        pass
    else:
        raise AssertionError("DECLINED muss AuthorizationExpiredError werfen")

    pp = _with_client(_token_or(lambda m, u, k: _Resp(500, {"name": "INTERNAL_SERVER_ERROR"})))
    try:
        run(pp.capture_authorization("A3", 10.0))
    except pp.AuthorizationExpiredError:
        raise AssertionError("500 ist vorübergehend, kein Ablauf")
    except pp.PayPalError:
        pass


TESTS = [v for k, v in list(globals().items()) if k.startswith("t_")]


def main() -> int:
    _install_fake()
    failed = 0
    for t in TESTS:
        _reset_db()
        PP.__init__()
        try:
            t()
            print(f"  ok    {t.__name__}")
        except Exception:
            failed += 1
            print(f"  FAIL  {t.__name__}")
            traceback.print_exc(limit=4)
    print(f"\n{len(TESTS) - failed}/{len(TESTS)} Szenarien grün")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
