"""Konto-Löschung.

Zwei Wege, und der Unterschied ist bewusst hart:

1. **Wer in keinem Verfahren steckt, löscht sofort und endgültig.** Das ist
   der Normalfall der Kalender-App: eine Person, ein Logbuch, ein
   Betreuungskalender, keine Gegenseite, kein Geld geflossen. Da gibt es
   nichts abzuwägen — Konto und Daten sind weg, ohne Rückfrage bei uns.

2. **Wer Partei einer laufenden Mediation ist, stellt einen Antrag.** Nicht
   aus Bequemlichkeit: an einem Verfahren hängen die Eingaben der Gegenseite,
   unterschriebene Vereinbarungen und Rechnungen mit gesetzlicher
   Aufbewahrungsfrist (§ 147 AO, 10 Jahre). Wer hier einseitig löscht, löscht
   Material, das der anderen Seite gehört. Der Antrag wird vermerkt, das
   Konto nach Abschluss des Verfahrens gelöscht.

Beides erfüllt die Store-Auflagen: Google verlangt eine Löschfunktion, nicht
deren Bedingungslosigkeit — verlangt aber, dass benannt wird, was bleibt und
warum. Genau dafür gibt es `loesch_lage()`, das die Oberfläche VOR dem Klick
anzeigt.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import Table, inspect as sa_inspect
from sqlalchemy.orm import Session

from app.database import Base
from app.models.mediation import Mediation
from app.models.mediation_participant import MediationParticipant
from app.models.user import User

# Spalten, die auf eine Teilnahme zeigen. Sie heißen nicht überall gleich
# (`participant_id`, `author_participant_id`, `request_by`, `voter_id` …),
# deshalb wird über den Fremdschlüssel erkannt, nicht über den Namen.
_TEILNEHMER_TABELLE = "mediation_participants"
_FALL_TABELLE = "mediations"
_NUTZER_TABELLE = "users"


# ── Lage feststellen ────────────────────────────────────────────────────────


def _eigene_teilnahmen(user: User, db: Session) -> list[tuple[MediationParticipant, Mediation]]:
    return (
        db.query(MediationParticipant, Mediation)
        .join(Mediation, MediationParticipant.mediation_id == Mediation.id)
        .filter(MediationParticipant.user_id == user.id)
        .all()
    )


def loesch_lage(user: User, db: Session) -> dict[str, Any]:
    """Was passiert, wenn diese Person jetzt löscht?

    Wird von der Oberfläche VOR der Bestätigung angezeigt. Die Antwort ist
    absichtlich in ganzen Sätzen formuliert und nicht in Codes: Google
    verlangt, dass die Seite benennt, was gelöscht wird, was bleibt und warum
    — und diese Sätze sind die Quelle dafür.
    """
    paare = _eigene_teilnahmen(user, db)
    verfahren = [(p, m) for p, m in paare if (m.mode or "mediation") != "logbuch"]
    buecher = [(p, m) for p, m in paare if (m.mode or "mediation") == "logbuch"]

    if verfahren:
        return {
            "sofort_moeglich": False,
            "grund": "laufendes_verfahren",
            "verfahren": [
                {"id": m.id, "titel": m.title, "status": m.status} for _p, m in verfahren
            ],
            "wird_geloescht": [
                "Dein Zugang, sobald das Verfahren abgeschlossen ist.",
                "Dein Profil, deine Stammdaten und deine persönlichen Notizen.",
            ],
            "bleibt": [
                "Die Beiträge der anderen Partei – die gehören nicht dir.",
                "Vereinbarungen, die beide Seiten unterschrieben haben.",
                "Rechnungen: die müssen wir zehn Jahre aufbewahren (§ 147 AO).",
            ],
            "dauer": "Wir melden uns innerhalb von 30 Tagen mit dem weiteren Ablauf.",
            "bereits_beantragt": user.deletion_requested_at is not None,
        }

    return {
        "sofort_moeglich": True,
        "grund": None,
        "verfahren": [],
        "wird_geloescht": [
            "Dein Konto und deine Anmeldedaten.",
            f"Deine Logbücher und Kalender ({len(buecher)}) samt Einträgen, "
            "Betreuungszeiten, Absprachen und hochgeladenen Dateien.",
            "Zugänge, die du für Kinder oder die andere Seite angelegt hast.",
        ],
        "bleibt": [
            "Nichts. Ohne Verfahren gibt es nichts, das aufbewahrt werden müsste.",
        ],
        "dauer": "Sofort. Die Löschung lässt sich nicht rückgängig machen.",
        "bereits_beantragt": False,
    }


# ── Löschen ─────────────────────────────────────────────────────────────────


def _tabellen_kindzuerst() -> list[Table]:
    """Alle Tabellen in einer Reihenfolge, in der Löschen keine Fremdschlüssel
    verletzt: `sorted_tables` liefert Eltern vor Kindern, gelöscht wird
    umgekehrt.

    Bewusst aus den Metadaten abgeleitet statt als Liste gepflegt. Eine
    abgetippte Tabellenliste ist beim nächsten neuen Feature still
    unvollständig — und „still unvollständig" heißt hier: Daten, die jemand
    ausdrücklich löschen wollte, bleiben liegen.
    """
    return list(reversed(Base.metadata.sorted_tables))


def _spalten_die_zeigen_auf(tabelle: Table, ziel: str) -> list[str]:
    """Spalten dieser Tabelle, die per Fremdschlüssel auf `ziel` verweisen."""
    treffer = []
    for spalte in tabelle.columns:
        for fk in spalte.foreign_keys:
            if fk.column.table.name == ziel:
                treffer.append(spalte.name)
    return treffer


def konto_sofort_loeschen(user: User, db: Session) -> dict[str, int]:
    """Harte Löschung für Konten ohne laufendes Verfahren.

    SICHERHEITSNETZ: Die Funktion prüft die Lage selbst noch einmal und wirft,
    wenn ein Verfahren existiert. Sie darf nie in die Lage kommen, an einem
    Mediationsfall zu arbeiten — auch nicht, wenn ein Aufrufer die Prüfung
    vergisst.

    Alles läuft in EINER Transaktion. Fehlt irgendwo eine Abhängigkeit, bricht
    der Fremdschlüssel und es wird gar nichts gelöscht. Ein lauter Fehler ist
    hier deutlich besser als ein halb gelöschtes Konto.
    """
    paare = _eigene_teilnahmen(user, db)
    if any((m.mode or "mediation") != "logbuch" for _p, m in paare):
        raise ValueError(
            "Sofortlöschung bei laufendem Verfahren – das darf nicht passieren."
        )

    teilnahme_ids = [p.id for p, _m in paare]
    buch_ids = [m.id for _p, m in paare]

    # Bücher, die noch jemand anderes benutzt, bleiben stehen. Beim
    # Betreuungskalender ist das der Regelfall: zwei Elternteile in einem Buch.
    # Gelöscht wird dann nur, was dieser Person gehört – die andere Seite
    # verliert ihren Kalender nicht, weil das Gegenüber geht.
    alleine: list[int] = []
    for buch_id in buch_ids:
        andere = (
            db.query(MediationParticipant)
            .filter(
                MediationParticipant.mediation_id == buch_id,
                MediationParticipant.user_id != user.id,
            )
            .count()
        )
        if andere == 0:
            alleine.append(buch_id)

    geloescht: dict[str, int] = {}

    def _weg(tabelle: Table, bedingung) -> None:
        anzahl = db.execute(tabelle.delete().where(bedingung)).rowcount or 0
        if anzahl:
            geloescht[tabelle.name] = geloescht.get(tabelle.name, 0) + anzahl

    for tabelle in _tabellen_kindzuerst():
        if tabelle.name in (_NUTZER_TABELLE, _FALL_TABELLE, _TEILNEHMER_TABELLE):
            continue  # kommen zum Schluss, in fester Reihenfolge

        # 1. Alles, was an einem allein gehaltenen Buch hängt.
        for name in _spalten_die_zeigen_auf(tabelle, _FALL_TABELLE):
            if alleine:
                _weg(tabelle, tabelle.c[name].in_(alleine))

        # 2. Alles, was an einer Teilnahme dieser Person hängt – auch in
        #    Büchern, die weiterlaufen. Das sind ihre eigenen Einträge,
        #    Betreuungsregeln und Absprachen.
        for name in _spalten_die_zeigen_auf(tabelle, _TEILNEHMER_TABELLE):
            if teilnahme_ids:
                _weg(tabelle, tabelle.c[name].in_(teilnahme_ids))

        # 3. Was direkt am Nutzer hängt (Chat-Nachrichten, Onboarding-
        #    Antworten). NICHT mediation_children.user_id: das ist der
        #    Zugang des KINDES, ein eigenes Konto – es wird über das Buch
        #    entfernt, nicht über diese Zeile.
        if tabelle.name != "mediation_children":
            for name in _spalten_die_zeigen_auf(tabelle, _NUTZER_TABELLE):
                _weg(tabelle, tabelle.c[name] == user.id)

    # Sechs Tabellen hängen an nichts davon: ai_prompts, discount_codes,
    # mediation_variants, phase_step_defaults, organizations – reine
    # Stammdaten, die zu Recht stehen bleiben. Die sechste ist die Ausnahme:
    #
    # newsletter_subscribers speichert eine E-Mail-Adresse und kennt keinen
    # Nutzer. Rechtlich ist das eine eigene Einwilligung mit eigenem
    # Abmeldeweg – man KÖNNTE sie also stehen lassen. Wir tun es nicht: Wer
    # sein Konto löscht, hat unmissverständlich gesagt, dass er hier weg will,
    # und würde eine Woche später Post von uns nicht als saubere
    # Rechtsauffassung empfinden, sondern als Missachtung.
    from app.models.newsletter_subscriber import NewsletterSubscriber

    _weg(
        sa_inspect(NewsletterSubscriber).local_table,
        sa_inspect(NewsletterSubscriber).local_table.c.email == user.email,
    )

    teilnehmer = sa_inspect(MediationParticipant).local_table
    faelle = sa_inspect(Mediation).local_table
    nutzer = sa_inspect(User).local_table

    if alleine:
        _weg(teilnehmer, teilnehmer.c.mediation_id.in_(alleine))
    _weg(teilnehmer, teilnehmer.c.user_id == user.id)
    if alleine:
        _weg(faelle, faelle.c.id.in_(alleine))
    _weg(nutzer, nutzer.c.id == user.id)

    db.commit()
    return geloescht


def loeschung_beantragen(user: User, db: Session, notiz: str | None = None) -> None:
    """Weicher Weg für Parteien laufender Verfahren.

    Das Konto bleibt bestehen und benutzbar – die Person ist Partei, sie kann
    nicht mitten im Verfahren verschwinden, ohne die Gegenseite im Regen
    stehen zu lassen. Vermerkt wird der Wunsch; gelöscht wird nach Abschluss.
    """
    user.deletion_requested_at = datetime.utcnow()
    if notiz:
        user.deletion_note = notiz[:2000]
    db.commit()


def loeschung_zuruecknehmen(user: User, db: Session) -> None:
    user.deletion_requested_at = None
    user.deletion_note = None
    db.commit()
