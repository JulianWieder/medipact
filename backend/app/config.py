from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings


_INSECURE_DEFAULT = "dev-secret-key"
_VALID_PAYPAL_ENVS = {"sandbox", "live"}


class Settings(BaseSettings):
    SECRET_KEY: str = _INSECURE_DEFAULT
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    APP_BASE_URL: str = "http://localhost:3000"  # Override in production
    # Comma-separated list of allowed CORS origins, e.g. "https://app.medipact.de,https://www.medipact.de"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    # Set to true in production to enforce a real SECRET_KEY
    PRODUCTION: bool = False
    # Schaltet die Dev-Test-Endpunkte (/v1/chat/gemini, /v1/chat/claude,
    # /v1/paypal/ping) frei – auch auf dem Live-Server. Unabhängig von PRODUCTION,
    # damit man auf dem Server per localhost testen kann. Sicher, weil der Backend-
    # Port in docker-compose auf 127.0.0.1 gebunden ist und nginx /v1 nicht proxyt.
    # Standard aus; zum Testen auf true setzen, danach wieder auf false.
    ENABLE_DEV_TEST: bool = False
    # ── SMTP email settings ──────────────────────────────────────────────────
    SMTP_HOST: str = ""          # e.g. mail.deine-domain.de
    SMTP_PORT: int = 587         # 587 = STARTTLS, 465 = SSL, 25 = plain
    SMTP_USER: str = ""          # e.g. noreply@deine-domain.de
    SMTP_PASSWORD: str = ""
    SMTP_USE_TLS: bool = True    # STARTTLS on port 587
    SMTP_USE_SSL: bool = False   # SSL on port 465 — set True and SMTP_USE_TLS=False
    EMAIL_FROM: str = "medipact <noreply@medipact.de>"
    DB_PATH: str = ""  # Optional: Pfad zur SQLite-DB (z.B. /data/medipact.db in Docker)
    ANTHROPIC_API_KEY: str = ""  # Für KI-Reflexion in Mediationsphasen + Paraphrasierung der Einladungsnachricht
    OPENAI_API_KEY: str = ""  # Für die Transkription der Einladungs-Video-Botschaft (Whisper)
    OPENAI_TRANSCRIBE_MODEL: str = "whisper-1"
    # ── KI (Google Gemini) ───────────────────────────────────────────────────
    GEMINI_API_KEY: str = ""  # API-Key aus Google AI Studio
    GEMINI_MODEL: str = "gemini-1.5-flash"  # bei Bedarf via .env überschreiben
    # Welcher Anbieter die KI-Textfunktionen bedient (Einladungstext, Reflexion,
    # Zusammenfassung, Titel …): "claude" (Standard) oder "gemini". Umschalten per
    # .env, ohne Code-Änderung – z.B. AI_PROVIDER=gemini für die Dev-Phase.
    AI_PROVIDER: str = "claude"
    # Verzeichnis für hochgeladene Video-Botschaften bei Mediations-Einladungen
    # (z.B. /data/invite_videos in Docker, analog zu DB_PATH).
    INVITE_VIDEO_DIR: str = "media/invite_videos"
    # Maximale Dateigröße für Einladungs-Videos in MB
    INVITE_VIDEO_MAX_MB: int = 50
    # ── Google Meet (automatische Videokonferenz-Links) ──────────────────────
    # Zentrales Google-Konto, über das medipact Kalendertermine mit Meet-Link
    # anlegt. OAuth-Client aus der Google Cloud Console; Refresh-Token einmalig
    # per scripts/google_meet_get_refresh_token.py erzeugen. Siehe
    # docs/google-meet-setup.md. Solange leer, ist die Funktion deaktiviert und
    # der "Meet-Link erzeugen"-Button meldet, dass Google noch nicht verbunden ist.
    GOOGLE_OAUTH_CLIENT_ID: str = ""
    GOOGLE_OAUTH_CLIENT_SECRET: str = ""
    GOOGLE_OAUTH_REFRESH_TOKEN: str = ""
    # Kalender, in dem die Termine angelegt werden ("primary" = Hauptkalender
    # des zentralen Kontos).
    GOOGLE_CALENDAR_ID: str = "primary"
    # Zeitzone für die erzeugten Termine (IANA-Name).
    GOOGLE_MEET_TIMEZONE: str = "Europe/Berlin"
    # ── Google-Meet-AUFNAHME (Einladungs-Video-/Audio-Botschaft via Meet) ────
    # Anders als der reine Meet-LINK oben braucht die serverseitige AUFNAHME
    # (spaces.create mit auto recording+transcription + Abruf der Artefakte)
    # zusätzlich:
    #   • einen Google-WORKSPACE-Tarif (Business Standard / Enterprise /
    #     Education Plus) mit vom Admin aktivierter Aufnahme+Transkription,
    #   • die aktivierte "Google Meet REST API" im Cloud-Projekt,
    #   • einen Refresh-Token mit den zusätzlichen Meet-Scopes
    #     (meetings.space.created + meetings.space.readonly), ggf. drive.readonly.
    # Solange dieses Flag False ist, bleibt die Meet-Aufnahme deaktiviert und die
    # UI fällt auf die bisherige Browser-Aufnahme zurück. Siehe
    # docs/google-meet-setup.md (Abschnitt „Meet-Aufnahme").
    GOOGLE_MEET_RECORDING_ENABLED: bool = False
    # ── PayPal-Zahlungen ─────────────────────────────────────────────────────
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    # "sandbox" für Tests ohne echtes Geld, "live" für echte Zahlungen.
    # Liest wahlweise PAYPAL_ENV oder (aus Kompatibilität) PAYPAL_MODE aus der .env.
    PAYPAL_ENV: str = Field(
        default="sandbox",
        validation_alias=AliasChoices("PAYPAL_ENV", "PAYPAL_MODE"),
    )
    # Preis pro Teilnehmer in EUR (einmalig, beim Freischalten der Mediation)
    PRICE_PER_PARTICIPANT_EUR: float = 499.0

    class Config:
        env_file = ".env"

    @field_validator("PAYPAL_ENV")
    @classmethod
    def _validate_paypal_env(cls, value: str) -> str:
        if value not in _VALID_PAYPAL_ENVS:
            raise ValueError(
                f"PAYPAL_ENV muss 'sandbox' oder 'live' sein, nicht '{value}'."
            )
        return value

    @property
    def cors_origins_list(self) -> list[str]:
        """CORS_ORIGINS als bereinigte Liste statt Comma-String."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()

if settings.PRODUCTION:
    _errors = []
    if settings.SECRET_KEY == _INSECURE_DEFAULT:
        _errors.append(
            "SECRET_KEY muss gesetzt sein. Generiere einen sicheren Schlüssel mit: "
            "python -c \"import secrets; print(secrets.token_hex(32))\""
        )
    if settings.PAYPAL_ENV == "live" and not (
        settings.PAYPAL_CLIENT_ID and settings.PAYPAL_CLIENT_SECRET
    ):
        _errors.append(
            "PAYPAL_CLIENT_ID und PAYPAL_CLIENT_SECRET müssen gesetzt sein, "
            "wenn PAYPAL_ENV='live' ist."
        )
    if _errors:
        raise RuntimeError(
            "Ungültige Produktionskonfiguration:\n- " + "\n- ".join(_errors)
        )
