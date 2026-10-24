"""
Simple in-memory rate limiter for FastAPI.
No external dependencies required.

Default: 10 requests per minute per IP for auth endpoints.
"""
import ipaddress
import time
from collections import defaultdict
from threading import Lock

from fastapi import Request, HTTPException


class RateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._store: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    def _get_client_ip(self, request: Request) -> str:
        # Die API laeuft im Docker-Container und ist nur ueber 127.0.0.1:8000
        # erreichbar (backend/docker-compose.yml). Jede Verbindung kommt also
        # aus dem Next.js auf demselben Server - im Container sichtbar als
        # Gateway des Docker-Netzes (172.x), nicht als 127.0.0.1. Vorher galt
        # nur 127.0.0.1 als vertrauenswuerdig, damit zaehlten ALLE Logins der
        # Plattform in einen einzigen Topf.
        #
        # X-Real-IP statt X-Forwarded-For: nginx setzt X-Real-IP auf
        # $remote_addr und ueberschreibt damit, was der Browser mitschickt.
        # Den linken Eintrag von X-Forwarded-For dagegen kann jeder Client
        # selbst setzen. Fehlt der Header, bleibt es bei der direkten IP.
        direct_ip = request.client.host if request.client else "unknown"
        try:
            vertraut = ipaddress.ip_address(direct_ip)
            vertraut = vertraut.is_loopback or vertraut.is_private
        except ValueError:
            vertraut = False
        if vertraut:
            real_ip = (request.headers.get("X-Real-IP") or "").strip()
            if real_ip:
                return real_ip
        return direct_ip

    def check(self, request: Request) -> None:
        """Raise HTTP 429 if rate limit is exceeded."""
        ip = self._get_client_ip(request)
        now = time.monotonic()
        window_start = now - self.window_seconds

        with self._lock:
            # Remove timestamps outside current window
            self._store[ip] = [t for t in self._store[ip] if t > window_start]

            if len(self._store[ip]) >= self.max_requests:
                raise HTTPException(
                    status_code=429,
                    detail=f"Zu viele Anfragen. Bitte warten Sie {self.window_seconds} Sekunden.",
                )

            self._store[ip].append(now)


# Auth endpoints: max 10 requests per minute per IP
auth_limiter = RateLimiter(max_requests=10, window_seconds=60)

# Invite creation: max 20 per Stunde pro IP
invite_limiter = RateLimiter(max_requests=20, window_seconds=3600)
