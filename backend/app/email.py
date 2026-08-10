"""
E-Mail-Service für medipact.
Versendet Bestätigungs-E-Mails via SMTP (STARTTLS oder SSL).
"""
import smtplib
import ssl
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings


def _build_verification_email(to_email: str, to_name: str, verify_url: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Bitte bestätige deine E-Mail-Adresse – medipact"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email

    text_body = f"""\
Hallo {to_name},

vielen Dank für deine Registrierung bei medipact.

Bitte bestätige deine E-Mail-Adresse, indem du auf folgenden Link klickst:

{verify_url}

Der Link ist 24 Stunden gültig.

Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.

Viele Grüße
Das medipact-Team
"""

    html_body = f"""\
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:#059669;padding:32px 40px;">
              <span style="font-size:22px;font-weight:900;color:#ffffff;
                           letter-spacing:-0.5px;">medipact</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;
                         color:#0f172a;line-height:1.3;">
                E-Mail-Adresse bestätigen
              </h1>
              <p style="margin:0 0 12px;font-size:15px;color:#475569;line-height:1.6;">
                Hallo {to_name},
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
                vielen Dank für deine Registrierung bei <strong>medipact</strong>.
                Bitte bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.
              </p>
              <a href="{verify_url}"
                 style="display:inline-block;background:#059669;color:#ffffff;
                        font-size:15px;font-weight:700;text-decoration:none;
                        padding:14px 32px;border-radius:12px;">
                E-Mail-Adresse bestätigen
              </a>
              <p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                Der Link ist <strong>24 Stunden</strong> gültig.<br>
                Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;
                       border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                © 2025 medipact · <a href="https://medipact.de" style="color:#059669;text-decoration:none;">medipact.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))
    return msg


def send_verification_email(to_email: str, to_name: str, token: str) -> None:
    """
    Versendet eine Bestätigungs-E-Mail an den Nutzer.
    Nutzt SMTP-Einstellungen aus den Settings (SMTP_HOST, SMTP_PORT, …).
    """
    verify_url = f"{settings.APP_BASE_URL}/auth/verify?token={token}"
    msg = _build_verification_email(to_email, to_name, verify_url)

    if not settings.SMTP_HOST:
        # Kein SMTP konfiguriert – URL in den Logs ausgeben (Entwicklungsmodus)
        print(f"[DEV] Verification URL for {to_email}: {verify_url}")
        return

    context = ssl.create_default_context()

    if settings.SMTP_USE_SSL:
        # SSL direkt (Port 465)
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as server:
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER or settings.EMAIL_FROM, to_email, msg.as_string())
    else:
        # STARTTLS (Port 587) oder plain
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls(context=context)
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER or settings.EMAIL_FROM, to_email, msg.as_string())


def _build_password_reset_email(to_email: str, to_name: str, reset_url: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Setze dein medipact-Passwort zurück"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email

    text_body = f"""\
Hallo {to_name},

du hast eine Anfrage zum Zurücksetzen deines Passworts für medipact gestellt.

Bitte klicke auf folgenden Link, um dein Passwort zu ändern:

{reset_url}

Der Link ist 1 Stunde gültig.

Wenn du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail. Dein Passwort bleibt unverändert.

Viele Grüße
Das medipact-Team
"""

    html_body = f"""\
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:#059669;padding:32px 40px;">
              <span style="font-size:22px;font-weight:900;color:#ffffff;
                           letter-spacing:-0.5px;">medipact</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;
                         color:#0f172a;line-height:1.3;">
                Passwort zurücksetzen
              </h1>
              <p style="margin:0 0 12px;font-size:15px;color:#475569;line-height:1.6;">
                Hallo {to_name},
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
                du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.
                Klicke auf den Button unten, um ein neues Passwort zu setzen.
              </p>
              <a href="{reset_url}"
                 style="display:inline-block;background:#059669;color:#ffffff;
                        font-size:15px;font-weight:700;text-decoration:none;
                        padding:14px 32px;border-radius:12px;">
                Passwort zurücksetzen
              </a>
              <p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                Der Link ist <strong>1 Stunde</strong> gültig.<br>
                Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;
                       border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                © 2025 medipact · <a href="https://medipact.de" style="color:#059669;text-decoration:none;">medipact.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))
    return msg


def send_password_reset_email(to_email: str, to_name: str, token: str) -> None:
    """
    Versendet eine Passwort-Zurücksetzen-E-Mail an den Nutzer.
    Nutzt SMTP-Einstellungen aus den Settings (SMTP_HOST, SMTP_PORT, …).
    """
    reset_url = f"{settings.APP_BASE_URL}/auth/reset-password?token={token}"
    msg = _build_password_reset_email(to_email, to_name, reset_url)

    if not settings.SMTP_HOST:
        # Kein SMTP konfiguriert – URL in den Logs ausgeben (Entwicklungsmodus)
        print(f"[DEV] Password reset URL for {to_email}: {reset_url}")
        return

    context = ssl.create_default_context()

    if settings.SMTP_USE_SSL:
        # SSL direkt (Port 465)
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as server:
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER or settings.EMAIL_FROM, to_email, msg.as_string())
    else:
        # STARTTLS (Port 587) oder plain
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls(context=context)
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER or settings.EMAIL_FROM, to_email, msg.as_string())


def _send(msg: MIMEMultipart, to_email: str, dev_note: str) -> None:
    """Gemeinsamer SMTP-Versand. Ohne SMTP_HOST wird nur geloggt (Dev-Modus)."""
    if not settings.SMTP_HOST:
        print(f"[DEV] {dev_note} -> {to_email}")
        return

    context = ssl.create_default_context()
    sender = settings.SMTP_USER or settings.EMAIL_FROM
    if settings.SMTP_USE_SSL:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as server:
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(sender, to_email, msg.as_string())
    else:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls(context=context)
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(sender, to_email, msg.as_string())


def _simple_email(
    to_email: str, subject: str, heading: str, paragraphs: list[str], cta: tuple[str, str] | None
) -> MIMEMultipart:
    """Baut eine schlichte medipact-Mail im Layout der übrigen Benachrichtigungen."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email

    text = "\n\n".join(paragraphs)
    if cta:
        text += f"\n\n{cta[0]}: {cta[1]}"
    text += "\n\nViele Grüße\nDas medipact-Team\n"

    body_html = "".join(
        f'<p style="margin:0 0 12px;font-size:15px;color:#475569;line-height:1.6;">{p}</p>'
        for p in paragraphs
    )
    cta_html = (
        f'<a href="{cta[1]}" style="display:inline-block;margin-top:16px;background:#059669;'
        f'color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;'
        f'border-radius:12px;">{cta[0]}</a>'
        if cta
        else ""
    )

    html = f"""\
<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <tr><td style="background:#059669;padding:32px 40px;">
          <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">medipact</span>
        </td></tr>
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;line-height:1.3;">{heading}</h1>
          {body_html}
          {cta_html}
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
            © 2026 medipact · <a href="https://medipact.de" style="color:#059669;text-decoration:none;">medipact.de</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
"""
    msg.attach(MIMEText(text, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))
    return msg


KIND_LABELS = {
    "tausch": "Tausch",
    "zusatztag": "zusätzlicher Tag",
    "absage": "Absage",
    "verschiebung": "Verschiebung",
}


def send_care_request_email(
    to_email: str,
    to_name: str,
    mediation_id: int,
    kind: str,
    action: str,
    when_text: str,
    message: str | None = None,
) -> None:
    """Benachrichtigt die andere Person über eine Absprache im Betreuungskalender.

    Bewusst im Ton des Logbuchs, nicht im Verfahrensdeutsch der Einladungen:
    hier stimmen sich zwei Eltern über Betreuungszeiten ab, es läuft kein
    Verfahren. Der Inhalt der Anfrage steht in der Mail, damit man nicht erst
    einloggen muss, um zu wissen, worum es geht.
    """
    label = KIND_LABELS.get(kind, "Änderung")
    headings = {
        "angefragt": f"Bitte um {label}",
        "gegenvorschlag": f"Gegenvorschlag zur {label}",
        "akzeptiert": f"{label.capitalize()} angenommen",
        "abgelehnt": f"{label.capitalize()} abgelehnt",
        "zurueckgezogen": f"{label.capitalize()} zurückgezogen",
    }
    leads = {
        "angefragt": f"Im Betreuungskalender wurde um eine {label} gebeten.",
        "gegenvorschlag": "Zu deiner Anfrage im Betreuungskalender gibt es einen Gegenvorschlag.",
        "akzeptiert": "Deine Anfrage im Betreuungskalender wurde angenommen. Der Plan ist angepasst.",
        "abgelehnt": "Deine Anfrage im Betreuungskalender wurde abgelehnt. Der Plan bleibt wie er war.",
        "zurueckgezogen": "Eine Anfrage im Betreuungskalender wurde zurückgezogen.",
    }
    heading = headings.get(action, "Neues im Betreuungskalender")
    paragraphs = [
        f"Hallo {to_name},",
        leads.get(action, "Es gibt Neues im Betreuungskalender."),
        f"<strong>Betrifft:</strong> {when_text}",
    ]
    if message and message.strip():
        paragraphs.append(f"„{message.strip()}“")
    if action in ("angefragt", "gegenvorschlag"):
        paragraphs.append(
            "Du kannst im Kalender zustimmen, ablehnen oder selbst etwas anderes vorschlagen."
        )

    url = f"{settings.APP_BASE_URL}/dashboard/logbuch/{mediation_id}"
    msg = _simple_email(
        to_email,
        f"Betreuungskalender: {heading}",
        heading,
        paragraphs,
        ("Kalender öffnen", url),
    )
    _send(msg, to_email, f"care-request {action}/{kind} -> {to_email}")


def send_authorization_expiring_email(
    to_email: str, to_name: str, mediation_id: int, mediation_title: str, hours_left: int
) -> None:
    """Erinnert die Gegenseite, dass eine Reservierung der anderen Partei bald verfällt.

    Angeschrieben wird die Partei, die NOCH NICHT zugestimmt hat - sie hält den
    Fall auf, und die Reservierung der anderen Seite läuft ab (siehe
    scripts/check_authorizations.py).
    """
    url = f"{settings.APP_BASE_URL}/dashboard/{mediation_id}"
    msg = _simple_email(
        to_email,
        f"Nur noch {hours_left} Stunden: „{mediation_title}“ wartet auf dich",
        "Die Gegenseite wartet auf deine Zustimmung",
        [
            f"Hallo {to_name},",
            f"für den Fall <strong>{mediation_title}</strong> hat die andere Seite ihren Anteil "
            f"bereits reserviert. Solange du nicht zustimmst, kann die Mediation nicht starten.",
            f"Die Reservierung der Gegenseite verfällt in etwa <strong>{hours_left} Stunden</strong>. "
            f"Danach muss sie erneut bezahlen – das verzögert euren Fall unnötig.",
        ],
        ("Jetzt zustimmen", url),
    )
    _send(msg, to_email, f"Ablauf-Erinnerung ({hours_left}h) für Fall {mediation_id}")


def send_authorization_expired_email(
    to_email: str, to_name: str, mediation_id: int, mediation_title: str
) -> None:
    """Informiert die zahlende Partei, dass ihre Reservierung verfallen ist.

    Es wurde KEIN Geld abgebucht - sie muss lediglich erneut zahlen, sobald die
    Gegenseite so weit ist.
    """
    url = f"{settings.APP_BASE_URL}/dashboard/{mediation_id}"
    msg = _simple_email(
        to_email,
        f"Deine Zahlungsreservierung für „{mediation_title}“ ist abgelaufen",
        "Reservierung abgelaufen – es wurde nichts abgebucht",
        [
            f"Hallo {to_name},",
            f"deine Zahlungsreservierung für <strong>{mediation_title}</strong> ist abgelaufen, "
            f"weil die Gegenseite nicht rechtzeitig zugestimmt hat.",
            "<strong>Es wurde kein Geld abgebucht.</strong> Der vorgemerkte Betrag ist bei "
            "deinem Zahlungsmittel wieder frei.",
            "Sobald die andere Seite bereit ist, kannst du die Freischaltung erneut vornehmen.",
        ],
        ("Zum Fall", url),
    )
    _send(msg, to_email, f"Ablauf-Info für Fall {mediation_id}")


def _build_invoice_email(
    to_email: str, to_name: str, invoice_number: str, mediation_title: str
) -> MIMEMultipart:
    msg = MIMEMultipart("mixed")
    msg["Subject"] = f"Deine Rechnung {invoice_number} – medipact"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email

    alt = MIMEMultipart("alternative")

    text_body = f"""\
Hallo {to_name},

anbei erhältst du die Rechnung {invoice_number} für "{mediation_title}" als PDF zum Download.

Bei Fragen melde dich gerne unter {settings.EMAIL_FROM}.

Viele Grüße
Das medipact-Team
"""

    html_body = f"""\
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,.08);">
          <tr>
            <td style="background:#059669;padding:32px 40px;">
              <span style="font-size:22px;font-weight:900;color:#ffffff;
                           letter-spacing:-0.5px;">medipact</span>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;
                         color:#0f172a;line-height:1.3;">
                Deine Rechnung {invoice_number}
              </h1>
              <p style="margin:0 0 12px;font-size:15px;color:#475569;line-height:1.6;">
                Hallo {to_name},
              </p>
              <p style="margin:0 0 12px;font-size:15px;color:#475569;line-height:1.6;">
                anbei erhältst du die Rechnung für <strong>{mediation_title}</strong> als PDF zum Download.
              </p>
              <p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                Bei Fragen melde dich gerne unter {settings.EMAIL_FROM}.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;
                       border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                © 2026 medipact · <a href="https://medipact.de" style="color:#059669;text-decoration:none;">medipact.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    alt.attach(MIMEText(text_body, "plain", "utf-8"))
    alt.attach(MIMEText(html_body, "html", "utf-8"))
    msg.attach(alt)
    return msg


def send_invoice_email(
    to_email: str,
    to_name: str,
    invoice_number: str,
    mediation_title: str,
    pdf_bytes: bytes,
) -> None:
    """
    Versendet eine Rechnung als PDF-Anhang.

    Wird NIE automatisch aufgerufen - nur explizit über
    POST /invoices/{id}/send-email, nachdem ein Mediator/Admin die Rechnung
    geprüft und freigegeben hat (siehe routers/invoices.py).
    """
    msg = _build_invoice_email(to_email, to_name, invoice_number, mediation_title)

    attachment = MIMEApplication(pdf_bytes, _subtype="pdf")
    attachment.add_header(
        "Content-Disposition", "attachment", filename=f"{invoice_number}.pdf"
    )
    msg.attach(attachment)

    if not settings.SMTP_HOST:
        # Kein SMTP konfiguriert – im Entwicklungsmodus nur loggen, nicht senden.
        print(f"[DEV] Would send invoice {invoice_number} ({len(pdf_bytes)} bytes) to {to_email}")
        return

    context = ssl.create_default_context()

    if settings.SMTP_USE_SSL:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as server:
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER or settings.EMAIL_FROM, to_email, msg.as_string())
    else:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls(context=context)
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER or settings.EMAIL_FROM, to_email, msg.as_string())
