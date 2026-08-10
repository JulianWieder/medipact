"""Erinnert an unbeantwortete Absprachen im Betreuungskalender.

HINTERGRUND
───────────
Eine Bitte um Tausch, Absage, Verschiebung oder einen zusätzlichen Tag
(routers/betreuung.py) verschickt genau EINE E-Mail: die beim Stellen. Wird sie
nicht beantwortet, passiert nichts weiter – die Anfrage bleibt still auf
``offen`` stehen.

Das ist die gefährlichste Stelle des ganzen Kalenders. Denn eine unbeantwortete
Bitte sieht für beide Seiten verschieden aus: die eine Seite hat gefragt und
wartet, die andere hat die Mail übersehen und plant unverändert weiter. Am
fraglichen Freitag steht dann jemand vor der Tür – und im Logbuch steht,
die andere Seite habe „nicht reagiert". Genau solche Missverständnisse soll das
Werkzeug verhindern, nicht produzieren.

WAS DIESES SKRIPT TUT
  Offene Anfragen, die älter als ``--stunden`` (Vorgabe 48) sind, lösen EINE
  Erinnerung an die Person aus, die am Zug ist – also NICHT an die anfragende
  Seite. Der Merker ``request_reminder_sent_at`` (Migration j5k6l7m8n9o0)
  verhindert Wiederholungen; ein Gegenvorschlag dreht die Richtung um und
  setzt den Merker zurück, weil dann die andere Seite antworten muss.

  Anfragen zu Terminen, die bereits vorbei sind, werden übersprungen: eine
  Erinnerung an einen vergangenen Freitag hilft niemandem mehr.

AUFRUF (täglich per cron auf dem Server):
    0 8 * * * cd /pfad/zu/backend && python -m scripts.check_care_requests

Optionen:
    --dry-run    nur anzeigen, nichts ändern und nichts versenden
    --stunden N  ab welchem Alter erinnert wird (Vorgabe 48)
"""
import argparse
import logging
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, ".")

from app.database import SessionLocal  # noqa: E402
from app.email import send_care_request_email  # noqa: E402
from app.models.mediation_care_time import MediationCareTime  # noqa: E402
from app.models.mediation_participant import MediationParticipant  # noqa: E402
from app.models.user import User  # noqa: E402
from app.routers.betreuung import _when_text  # noqa: E402

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger("check_care_requests")


def _now() -> datetime:
    """Naiver UTC-Zeitstempel – wie alle Zeiten im Betreuungskalender."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _letzte_aktivitaet(t: MediationCareTime) -> datetime:
    """Wann wurde zuletzt etwas an dieser Anfrage getan?

    Ein Gegenvorschlag aktualisiert ``updated_at``; darauf zu warten ist
    richtig, denn ab dann ist die andere Seite am Zug und die Uhr läuft neu.
    """
    return t.updated_at or t.created_at or _now()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--stunden", type=int, default=48)
    args = parser.parse_args()

    grenze = _now() - timedelta(hours=max(1, args.stunden))
    heute = _now().date().isoformat()
    db = SessionLocal()
    erinnert = 0

    try:
        offene = (
            db.query(MediationCareTime)
            .filter(
                MediationCareTime.request_status == "offen",
                MediationCareTime.request_reminder_sent_at.is_(None),
            )
            .all()
        )
        logger.info("%d offene Anfragen ohne Erinnerung", len(offene))

        for t in offene:
            if _letzte_aktivitaet(t) > grenze:
                continue
            # Vergangene Termine: die Frage hat sich erledigt.
            bezug = t.request_start or t.planned_start
            if bezug and bezug.date().isoformat() < heute:
                continue
            if not t.request_by:
                continue

            # Am Zug ist, wer NICHT gefragt hat.
            empfaenger = (
                db.query(MediationParticipant, User)
                .join(User, MediationParticipant.user_id == User.id)
                .filter(
                    MediationParticipant.mediation_id == t.mediation_id,
                    MediationParticipant.id != t.request_by,
                    # Der Kind-Zugang beantwortet keine Absprachen.
                    MediationParticipant.role != "kind",
                )
                .all()
            )
            adressen = [u.email for _p, u in empfaenger if u.email]
            if not adressen:
                continue

            logger.info(
                "Erinnerung: Termin %s (%s, seit %s offen) -> %s",
                t.id,
                t.request_kind,
                _letzte_aktivitaet(t).date().isoformat(),
                ", ".join(adressen),
            )
            if args.dry_run:
                erinnert += 1
                continue

            for _p, u in empfaenger:
                if not u.email:
                    continue
                try:
                    send_care_request_email(
                        u.email,
                        getattr(u, "name", None) or u.email.split("@")[0],
                        t.mediation_id,
                        t.request_kind or "tausch",
                        "erinnerung",
                        _when_text(t),
                        message=t.request_message,
                    )
                except Exception:
                    logger.exception("Erinnerung an %s fehlgeschlagen", u.email)
            t.request_reminder_sent_at = _now()
            erinnert += 1

        if not args.dry_run:
            db.commit()
    finally:
        db.close()

    logger.info("Fertig: %d Erinnerungen%s", erinnert, " (dry-run)" if args.dry_run else "")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
