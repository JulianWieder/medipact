import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = Path(__file__).resolve().parent.parent

# Postgres, z.B. postgresql+psycopg://user:pass@host:5432/medipact
# (in Docker zeigt der Host auf den "db"-Service, siehe docker-compose.yml).
# Ohne DATABASE_URL: Fallback auf die bisherige lokale SQLite-Datei — rein
# für schnelles lokales Ausprobieren, nicht für den produktiven Einsatz.
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{BASE_DIR / 'medipact.db'}")

# SQLite braucht diesen Flag für Multi-Thread-Zugriff aus FastAPI heraus;
# Postgres kennt "check_same_thread" nicht. pool_pre_ping prüft Verbindungen
# aus dem Pool auf Gültigkeit, bevor sie benutzt werden — sinnvoll gegen von
# Postgres/Proxy gekappte Idle-Verbindungen, für SQLite ein No-Op.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
