from pydantic_settings import BaseSettings


_INSECURE_DEFAULT = "dev-secret-key"


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
    # ── SMTP email settings ──────────────────────────────────────────────────
    SMTP_HOST: str = ""          # e.g. mail.deine-domain.de
    SMTP_PORT: int = 587         # 587 = STARTTLS, 465 = SSL, 25 = plain
    SMTP_USER: str = ""          # e.g. noreply@deine-domain.de
    SMTP_PASSWORD: str = ""
    SMTP_USE_TLS: bool = True    # STARTTLS on port 587
    SMTP_USE_SSL: bool = False   # SSL on port 465 — set True and SMTP_USE_TLS=False
    EMAIL_FROM: str = "medipact <noreply@medipact.de>"
    DB_PATH: str = ""  # Optional: Pfad zur SQLite-DB (z.B. /data/medipact.db in Docker)
    ANTHROPIC_API_KEY: str = ""  # Für KI-Reflexion in Mediationsphasen
    # ── PayPal-Zahlungen ─────────────────────────────────────────────────────
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    # "sandbox" für Tests ohne echtes Geld, "live" für echte Zahlungen
    PAYPAL_ENV: str = "sandbox"
    # Preis pro Teilnehmer in EUR (einmalig, beim Freischalten der Mediation)
    PRICE_PER_PARTICIPANT_EUR: float = 499.0

    class Config:
        env_file = ".env"


settings = Settings()

if settings.PRODUCTION and settings.SECRET_KEY == _INSECURE_DEFAULT:
    raise RuntimeError(
        "SECRET_KEY muss in der Produktionsumgebung gesetzt sein. "
        "Generiere einen sicheren Schlüssel mit: "
        "python -c \"import secrets; print(secrets.token_hex(32))\""
    )
