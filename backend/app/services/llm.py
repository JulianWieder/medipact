"""Zentraler KI-Text-Zugang mit umschaltbarem Anbieter (Claude oder Gemini).

Alle Textfunktionen der App (Einladungstext, Paraphrase, Reflexion,
Zusammenfassung, Titel …) rufen ``ai_complete(prompt, max_tokens)`` auf.
Welcher Anbieter tatsächlich antwortet, steuert ``settings.AI_PROVIDER``
("claude" | "gemini") – umschaltbar per .env, ohne Code-Änderung.

Rückgabe ist immer der reine Antworttext (str). Fehlt der Key des gewählten
Anbieters oder schlägt die Anfrage fehl, wird eine HTTPException geworfen –
die Aufrufer entscheiden selbst, ob sie das durchreichen (blockieren) oder
abfangen (z.B. Paraphrase fällt auf den Originaltext zurück).
"""
import httpx
from fastapi import HTTPException

from app.config import settings

# Festes Claude-Modell (wie bisher überall verwendet).
CLAUDE_MODEL = "claude-haiku-4-5-20251001"


def ai_complete(prompt: str, max_tokens: int = 500) -> str:
    """Schickt den Prompt an den konfigurierten Anbieter und gibt den Text zurück."""
    provider = (settings.AI_PROVIDER or "claude").strip().lower()
    if provider == "gemini":
        return _gemini_complete(prompt, max_tokens)
    return _claude_complete(prompt, max_tokens)


def _claude_complete(prompt: str, max_tokens: int) -> str:
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="KI (Claude) ist nicht konfiguriert (ANTHROPIC_API_KEY fehlt).",
        )
    import anthropic

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    msg = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )
    return "".join(
        b.text for b in msg.content if getattr(b, "type", None) == "text"
    ).strip()


def _gemini_complete(prompt: str, max_tokens: int) -> str:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="KI (Gemini) ist nicht konfiguriert (GEMINI_API_KEY fehlt).",
        )
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent"
    )
    try:
        resp = httpx.post(
            url,
            params={"key": settings.GEMINI_API_KEY},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"maxOutputTokens": max_tokens},
            },
            timeout=30.0,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail="Gemini nicht erreichbar.") from exc

    if resp.status_code != 200:
        raise HTTPException(
            status_code=502, detail=f"Gemini-Fehler ({resp.status_code}): {resp.text[:200]}"
        )
    data = resp.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError, TypeError):
        return ""
