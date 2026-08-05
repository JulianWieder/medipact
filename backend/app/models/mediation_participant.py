from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String

from app.database import Base


class MediationParticipant(Base):
    __tablename__ = "mediation_participants"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)

    # ── Zahlung pro Partei ────────────────────────────────────────────────
    # Jede zahlungspflichtige Partei zahlt ihren eigenen Anteil (siehe
    # app/pricing.py). Der Fall wird erst freigeschaltet (mediation.is_paid),
    # wenn ALLE zahlungspflichtigen Parteien bezahlt haben.
    # `amount_due` ist der zu zahlende Betrag NACH Rabatt (0 => nichts zu zahlen).
    amount_due = Column(Float, nullable=True)
    paid = Column(Boolean, nullable=False, default=False, server_default="0")
    paid_at = Column(DateTime, nullable=True)
    paypal_order_id = Column(String, nullable=True)

    # ── Reservieren, dann einziehen ───────────────────────────────────────
    # Der Fall startet erst, wenn ALLE zahlungspflichtigen Parteien zugesagt
    # haben. Damit das Geld der ersten Partei nicht monatelang bei uns liegt,
    # während die Gegenseite zögert, wird beim Bezahlen zunächst nur
    # RESERVIERT (PayPal-Autorisierung, siehe app/paypal.py):
    #   authorized = True  -> Betrag ist beim Zahler blockiert, noch nicht geflossen
    #   paid       = True  -> Betrag wurde tatsächlich eingezogen
    # `paid` bleibt damit die maßgebliche Größe für Rechnungen und Umsatz;
    # `authorized` steuert nur, wann eingezogen werden darf.
    authorized = Column(Boolean, nullable=False, default=False, server_default="0")
    authorized_at = Column(DateTime, nullable=True)
    paypal_authorization_id = Column(String, nullable=True)
    # Ende der PayPal-Honor-Period (~3 Tage). Danach kann der Einzug scheitern
    # und die Partei muss erneut bezahlen (AuthorizationExpiredError).
    authorization_expires_at = Column(DateTime, nullable=True)
    # Merker, dass wegen dieser Reservierung bereits eine Ablauf-Erinnerung
    # rausging (scripts/check_authorizations.py läuft stündlich - ohne Merker
    # ginge die Mail jede Stunde erneut raus). Wird mit der Reservierung
    # zurückgesetzt.
    authorization_reminder_sent_at = Column(DateTime, nullable=True)
    # ── Freiwillige Kostenübernahme ───────────────────────────────────────
    # Eine Partei darf den Anteil einer anderen mitbezahlen (Ausgangslage ist
    # oft asymmetrisch: eine Seite will die Mediation, die andere scheut die
    # Kosten). Steht hier eine Teilnehmer-ID, hat DIESE Partei ihren Anteil
    # nicht selbst zu tragen – die genannte Partei übernimmt ihn.
    #
    # Zwei Wege, beide über dieses eine Feld (siehe services/billing.py):
    #   gebündelt – der Übernehmende hat selbst noch nicht bezahlt. Dann
    #     steckt der fremde Anteil in SEINEM Betrag (eine PayPal-Reservierung,
    #     eine Rechnung); die übernommene Partei bleibt auf 0 € und
    #     `authorized`/`paid` bleiben hier False.
    #   separat – der Übernehmende hat seinen Anteil schon reserviert/bezahlt
    #     und kann ihn nicht mehr ändern. Dann bekommt DIESE Zeile eine eigene
    #     PayPal-Reservierung über den fremden Anteil; die Rechnung dazu geht
    #     an den Übernehmenden.
    covered_by_participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=True
    )
    # "bundle" | "separate" – welcher der beiden Wege oben. BEWUSST gespeichert
    # und nicht aus dem Zustand abgeleitet: eine separate Übernahme, deren
    # PayPal-Bestätigung nie ankommt, sähe sonst aus wie eine gebündelte und
    # der Fall würde freigeschaltet, obwohl dieser Anteil nie bezahlt wurde.
    coverage_mode = Column(String, nullable=True)

    # Angewendeter Rabattcode (Groß-/Kleinschreibung wie eingegeben) + Rabattbetrag in EUR.
    discount_code = Column(String, nullable=True)
    discount_amount = Column(Float, nullable=False, default=0.0, server_default="0")

    # Rechnungsadresse dieses Teilnehmers für DIESEN Fall (nicht global am
    # User, da eine Person theoretisch in mehreren Fällen unterschiedliche
    # Rechnungsadressen haben könnte). Wird vor dem Start der Mediation
    # abgefragt, da an diesem Punkt automatisch eine Rechnung erstellt wird
    # (siehe update_mediation in routers/mediations.py).
    billing_street = Column(String, nullable=True)
    billing_postal_code = Column(String, nullable=True)
    billing_city = Column(String, nullable=True)