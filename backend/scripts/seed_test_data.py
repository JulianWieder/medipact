"""
Synthetische Testdaten für den medipact-Workspace.

Erzeugt realistische Beispieldaten direkt über die echten SQLAlchemy-Models:
  - Nutzer (Parteien, Mediatoren, ein Admin)
  - Mediationsfälle (verschiedene Typen/Status/Phasen) + Teilnehmer
  - Rechnungen (open/paid/refunded/failed)
  - Terminslots + Abstimmungen
  - Kundenerlebnis-Feedback

Gedacht zum Testen von Dashboard, Fallliste (inkl. Status-Filter), Kalender,
Feedback-Widget und Rechnungsmodul – NICHT für Produktionsdaten.

Ausführen (im backend/-Ordner, gleiche venv wie die App):

    python -m scripts.seed_test_data

Mehrfaches Ausführen ist sicher: das Skript bricht ab, wenn die Marker-Mail
bereits existiert (siehe MARKER_EMAIL unten).
"""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.security import hash_password  # noqa: E402
from app.models.user import User  # noqa: E402
from app.models.mediation import Mediation  # noqa: E402
from app.models.mediation_participant import MediationParticipant  # noqa: E402
from app.models.invoice import Invoice  # noqa: E402
from app.models.mediation_appointment import (  # noqa: E402
    MediationAppointmentSlot,
    MediationAppointmentVote,
)
from app.models.mediation_feedback import MediationFeedback  # noqa: E402

MARKER_EMAIL = "anna.weber@example.com"
TEST_PASSWORD = "test1234"  # für alle erzeugten Test-Accounts


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if db.query(User).filter(User.email == MARKER_EMAIL).first():
            print(f"Abgebrochen: Testdaten scheinen bereits vorhanden zu sein ({MARKER_EMAIL} existiert).")
            return

        # ── Nutzer ───────────────────────────────────────────────────────────
        pw = hash_password(TEST_PASSWORD)

        admin = User(name="Sandra Admin", email="admin@example.com", hashed_password=pw, role="admin", is_verified=True)
        mediator1 = User(name="Julian Mediator", email="julian.mediator@example.com", hashed_password=pw, role="mediator", is_verified=True)
        mediator2 = User(name="Lea Vogel", email="lea.vogel@example.com", hashed_password=pw, role="mediator", is_verified=True)

        anna = User(name="Anna Weber", email=MARKER_EMAIL, hashed_password=pw, role="party", is_verified=True)
        thomas = User(name="Thomas Weber", email="thomas.weber@example.com", hashed_password=pw, role="party", is_verified=True)
        mia = User(name="Mia Schneider", email="mia.schneider@example.com", hashed_password=pw, role="party", is_verified=True)
        ben = User(name="Ben Schneider", email="ben.schneider@example.com", hashed_password=pw, role="party", is_verified=True)
        klaus = User(name="Klaus Hoffmann", email="klaus.hoffmann@example.com", hashed_password=pw, role="party", is_verified=True)
        petra = User(name="Petra Hoffmann", email="petra.hoffmann@example.com", hashed_password=pw, role="party", is_verified=True)
        jonas = User(name="Jonas Brandt", email="jonas.brandt@example.com", hashed_password=pw, role="party", is_verified=True)
        sophie = User(name="Sophie Lang", email="sophie.lang@example.com", hashed_password=pw, role="party", is_verified=True)

        users = [admin, mediator1, mediator2, anna, thomas, mia, ben, klaus, petra, jonas, sophie]
        db.add_all(users)
        db.commit()
        for u in users:
            db.refresh(u)

        now = datetime.utcnow()

        # ── Mediationsfälle ──────────────────────────────────────────────────
        # (title, type, status, phase, priority, description)
        case_specs = [
            ("Trennung Weber", "trennung", "active", "interessenanalyse", "hoch",
             "Trennung nach 12 Jahren Ehe, Klärung von Umgangsregelung und Vermögensaufteilung."),
            ("Erbschaft Schneider", "erbschaft", "active", "themensammlung", "mittel",
             "Erbstreit zwischen zwei Geschwistern um das Elternhaus."),
            ("Nachbarschaft Hoffmann/Brandt", "nachbarschaft", "active", "optionsentwicklung", "mittel",
             "Streit über eine Grundstücksgrenze und einen Sichtschutzzaun."),
            ("Trennung Lang", "trennung", "pending", None, "niedrig",
             "Einvernehmliche Trennung, noch keine Sitzung gestartet."),
            ("Erbschaft Vogel", "erbschaft", "draft", None, "niedrig",
             "Erste Anfrage, Fall wurde angelegt aber noch nicht freigeschaltet."),
            ("Nachbarschaft Müller", "nachbarschaft", "completed", "abschluss", "niedrig",
             "Lärmkonflikt zwischen Mietparteien, erfolgreich beigelegt."),
            ("Trennung Hartmann", "trennung", "completed", "abschluss", "hoch",
             "Scheidung mit gemeinsamem Sorgerecht, Mediationsvertrag unterschrieben."),
            ("Erbschaft Brandt", "erbschaft", "active", "vereinbarung", "hoch",
             "Komplexer Erbfall mit Immobilie und Unternehmensanteilen."),
        ]

        mediations: list[Mediation] = []
        for title, mtype, status, phase, priority, description in case_specs:
            m = Mediation(
                title=title,
                mediation_type=mtype,
                description=description,
                priority=priority,
                role=None,
                status=status,
                phase=phase,
                is_paid=status in ("active", "completed"),
            )
            db.add(m)
            mediations.append(m)
        db.commit()
        for m in mediations:
            db.refresh(m)

        # ── Teilnehmer ───────────────────────────────────────────────────────
        # mediation_index -> [(user, role)]
        participant_specs = {
            0: [(anna, "owner"), (thomas, "other_party"), (mediator1, "mediator")],
            1: [(mia, "owner"), (ben, "other_party"), (mediator1, "mediator")],
            2: [(klaus, "owner"), (jonas, "other_party"), (mediator2, "mediator")],
            3: [(sophie, "owner"), (mediator2, "mediator")],
            4: [(petra, "owner")],
            5: [(klaus, "owner"), (jonas, "other_party"), (mediator2, "mediator")],
            6: [(anna, "owner"), (thomas, "other_party"), (mediator1, "mediator")],
            7: [(jonas, "owner"), (petra, "other_party"), (mediator2, "mediator")],
        }

        participants_by_mediation: dict[int, list[MediationParticipant]] = {}
        for idx, specs in participant_specs.items():
            plist = []
            for user, role in specs:
                p = MediationParticipant(mediation_id=mediations[idx].id, user_id=user.id, role=role)
                db.add(p)
                plist.append(p)
            participants_by_mediation[idx] = plist
        db.commit()
        for plist in participants_by_mediation.values():
            for p in plist:
                db.refresh(p)

        # ── Rechnungen ───────────────────────────────────────────────────────
        invoice_specs = [
            (0, 998.0, "paid", "anna.weber@example.com", "Anna Weber", -5),
            (1, 998.0, "open", "mia.schneider@example.com", "Mia Schneider", -2),
            (2, 998.0, "paid", "klaus.hoffmann@example.com", "Klaus Hoffmann", -10),
            (5, 499.0, "refunded", "klaus.hoffmann@example.com", "Klaus Hoffmann", -40),
            (6, 998.0, "paid", "anna.weber@example.com", "Anna Weber", -60),
            (7, 1497.0, "failed", "jonas.brandt@example.com", "Jonas Brandt", -1),
        ]
        for year_seq, (idx, amount, status, payer_email, payer_name, days_ago) in enumerate(invoice_specs, start=1):
            issued = now + timedelta(days=days_ago)
            inv = Invoice(
                invoice_number=f"RE-{issued.year}-{year_seq:04d}",
                mediation_id=mediations[idx].id,
                payer_name=payer_name,
                payer_email=payer_email,
                amount=amount,
                currency="EUR",
                status=status,
                paypal_order_id=f"TESTORDER{1000 + year_seq}" if status in ("paid", "refunded") else None,
                issued_at=issued,
                paid_at=issued + timedelta(hours=2) if status == "paid" else None,
            )
            db.add(inv)
        db.commit()

        # ── Terminslots + Abstimmungen ───────────────────────────────────────
        # Fall 0 (Trennung Weber): ein bestätigter Termin
        slot1 = MediationAppointmentSlot(
            mediation_id=mediations[0].id,
            proposed_datetime=now + timedelta(days=3, hours=-now.hour + 10),
            mediator_confirmed_at=now - timedelta(days=1),
        )
        db.add(slot1)
        db.commit()
        db.refresh(slot1)
        for p in participants_by_mediation[0]:
            db.add(MediationAppointmentVote(slot_id=slot1.id, participant_id=p.id, accepted=True))

        # Fall 2 (Nachbarschaft Hoffmann/Brandt): noch offene Abstimmung
        slot2 = MediationAppointmentSlot(
            mediation_id=mediations[2].id,
            proposed_datetime=now + timedelta(days=5, hours=-now.hour + 14),
        )
        db.add(slot2)
        db.commit()
        db.refresh(slot2)
        parts2 = participants_by_mediation[2]
        db.add(MediationAppointmentVote(slot_id=slot2.id, participant_id=parts2[0].id, accepted=True))
        db.add(MediationAppointmentVote(slot_id=slot2.id, participant_id=parts2[1].id, accepted=False))

        db.commit()

        # ── Feedback ─────────────────────────────────────────────────────────
        feedback_specs = [
            (0, participants_by_mediation[0][0], "after_videocall", {
                "vertrauen_in_prozess": 8,
                "gefuehl": 4,
                "weiterer_termin": "Nein",
            }, -4),
            (0, participants_by_mediation[0][1], "after_videocall", {
                "vertrauen_in_prozess": 6,
                "gefuehl": 3,
                "weiterer_termin": "Ja, bitte",
            }, -4),
            (1, participants_by_mediation[1][0], "before_contract", {
                "abschlusssicherheit": 7,
                "einigung_wahrscheinlichkeit": 8,
                "gehoert_gefuehl": 5,
                "weiterer_termin": "Nein",
            }, -1),
            (6, participants_by_mediation[6][0], "before_contract", {
                "abschlusssicherheit": 9,
                "einigung_wahrscheinlichkeit": 9,
                "gehoert_gefuehl": 5,
                "weiterer_termin": "Nein",
            }, -55),
        ]
        for idx, participant, occasion, answers, days_ago in feedback_specs:
            ts = now + timedelta(days=days_ago)
            db.add(MediationFeedback(
                mediation_id=mediations[idx].id,
                participant_id=participant.id,
                occasion=occasion,
                answers=json.dumps(answers, ensure_ascii=False),
                created_at=ts,
                updated_at=ts,
            ))
        db.commit()

        print("Testdaten erfolgreich angelegt:")
        print(f"  {len(users)} Nutzer (Passwort für alle: '{TEST_PASSWORD}')")
        print(f"  {len(mediations)} Mediationsfälle")
        print(f"  {len(invoice_specs)} Rechnungen")
        print("  2 Terminslots, 4 Feedback-Einträge")
        print()
        print("Login-Beispiele:")
        print(f"  Admin:     admin@example.com / {TEST_PASSWORD}")
        print(f"  Mediator:  julian.mediator@example.com / {TEST_PASSWORD}")
        print(f"  Partei:    anna.weber@example.com / {TEST_PASSWORD}")

    finally:
        db.close()


if __name__ == "__main__":
    main()
