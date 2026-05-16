"""
E-Mail-Service für medipact.
Versendet Bestätigungs-E-Mails via SMTP (STARTTLS oder SSL).
"""
import smtplib
import ssl
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
