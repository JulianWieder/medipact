"""
Simple in-memory rate limiter for FastAPI.
No external dependencies required.

Default: 10 requests per minute per IP for auth endpoints.
"""
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
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

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
