"""Wacht über ablaufende PayPal-Zahlungsreservierungen.

HINTERGRUND
───────────
Seit dem Umbau auf ``intent="AUTHORIZE"`` (siehe app/paypal.py) wird der Anteil
einer Partei beim Bezahlen zunächst nur RESERVIERT. Eingezogen wird erst, wenn
alle zahlungspflichtigen Parteien zugesagt haben.

Eine PayPal-Reservierung ist aber nicht unbegrenzt haltbar: nach rund 3 Tagen
endet die sichere Einzugsfrist (Honor Period), nach 29 Tagen verfällt sie
endgültig. Zögert die Gegenseite, verfällt also die Reservierung der ersten
Partei - ohne dass es jemand merkt.

WAS DIESES SKRIPT TUT
  1. Reservierungen, die bald ablaufen  -> erinnert die SÄUMIGE Gegenseite
     (sie hält den Fall auf), einmal pro Reservierung.
  2. Reservierungen, die abgelaufen sind -> setzt die Partei zurück (sie
     erscheint wieder als "offen") und informiert sie per Mail, dass NICHTS
     abgebucht wurde.

AUFRUF (stündlich per cron auf dem Server):
    0 * * * * cd /pfad/zu/backend && python -m scripts.check_authorizations

Optionen:
    --dry-run   nur anzeigen, nichts ändern und nichts versenden
"""
import argparse
import logging
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, ".")

from app.config import settings  # noqa: E402
from app.database import SessionLocal  # noqa: E402
from app.email import (  # noqa: E402
    send_authorization_expired_email,
    send_authorization_expiring_email,
)
from app.models.mediation import Mediation  # noqa: E402
from app.models.mediation_participant import MediationParticipant  # noqa: E402
from app.models.user import User  # noqa: E402
from app.services import billing  # noqa: E402

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger("check_authorizations")


def _now() -> datetime:
    # In der DB liegen naive UTC-Zeitstempel (siehe billing.mark_participant_*).
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _user(db, participant: MediationParticipant) -> User | None:
    return db.query(User).filter(User.id == participant.user_id).first()


def _pending_counterparties(db, mediation: Mediation) -> list[MediationParticipant]:
    """Zahlungspflichtige Parteien, die noch NICHT zugesagt haben."""
    return [
        p
        for p in billing.owing_participants(db, mediation)
        if not p.paid and not p.authorized
    ]


def run(dry_run: bool = False) -> dict:
    db = SessionLocal()
    now = _now()
    reminder_cutoff = now + timedelta(hours=settings.PAYPAL_AUTH_REMINDER_HOURS)

    stats = {"erinnert": 0, "abgelaufen": 0, "geprueft": 0}

    try:
        offen = (
            db.query(MediationParticipant)
            .filter(
                MediationParticipant.authorized.is_(True),
                MediationParticipant.paid.is_(False),
                MediationParticipant.authorization_expires_at.isnot(None),
            )
            .all()
        )
        stats["geprueft"] = len(offen)

        for p in offen:
            mediation = (
                db.query(Mediation).filter(Mediation.id == p.mediation_id).first()
            )
            if not mediation or mediation.is_paid:
                continue

            expires = p.authorization_expires_at
            payer = _user(db, p)

            # ── Fall A: bereits abgelaufen ───────────────────────────────
            if expires <= now:
                logger.info(
                    "Reservierung abgelaufen: Teilnehmer %s (Fall %s)", p.id, mediation.id
                )
                stats["abgelaufen"] += 1
                if dry_run:
                    continue
                billing.clear_participant_authorization(db, p)
                if payer and payer.email:
                    try:
                        send_authorization_expired_email(
                            payer.email, payer.name or "", mediation.id, mediation.title or "dein Fall"
                        )
                    except Exception:
                        logger.exception("Ablauf-Mail an %s fehlgeschlagen", payer.email)
                continue

            # ── Fall B: läuft bald ab -> Gegenseite anstupsen ────────────
            # Nur EINMAL pro Reservierung: das Skript läuft stündlich, ohne
            # Merker ginge die Mail bis zu 24 Mal raus.
            if expires <= reminder_cutoff and p.authorization_reminder_sent_at is None:
                hours_left = max(int((expires - now).total_seconds() // 3600), 1)
                sent_any = False
                for other in _pending_counterparties(db, mediation):
                    u = _user(db, other)
                    if not u or not u.email:
                        continue
                    logger.info(
                        "Erinnerung an %s (Fall %s, %sh Restzeit)",
                        u.email, mediation.id, hours_left,
                    )
                    stats["erinnert"] += 1
                    if dry_run:
                        continue
                    try:
                        send_authorization_expiring_email(
                            u.email, u.name or "", mediation.id,
                            mediation.title or "dein Fall", hours_left,
                        )
                        sent_any = True
                    except Exception:
                        logger.exception("Erinnerungs-Mail an %s fehlgeschlagen", u.email)
                if sent_any and not dry_run:
                    p.authorization_reminder_sent_at = now
                    db.commit()
    finally:
        db.close()

    logger.info(
        "Fertig: %s geprüft, %s erinnert, %s abgelaufen%s",
        stats["geprueft"], stats["erinnert"], stats["abgelaufen"],
        " (dry-run)" if dry_run else "",
    )
    return stats


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run", action="store_true", help="nur anzeigen, nichts ändern/senden"
    )
    args = parser.parse_args()
    run(dry_run=args.dry_run)
