"""Dev-Test-Endpunkte für die externen APIs (Gemini, Claude, PayPal).

NUR für lokales Testen gedacht: dieser Router wird in main.py ausschließlich
eingebunden, wenn settings.PRODUCTION == False. Auf dem Live-Server ist er also
automatisch deaktiviert. Kein Auth-Schutz – deshalb NICHT in Produktion aktivieren.

Beispiele:
  curl -X POST http://127.0.0.1:8000/v1/chat/gemini \
       -H "Content-Type: application/json" \
       -d '{"prompt": "Antworte nur mit dem Wort TEST."}'
  curl -X POST http://127.0.0.1:8000/v1/chat/claude \
       -H "Content-Type: application/json" -d '{"prompt": "Sag TEST."}'
  curl http://127.0.0.1:8000/v1/paypal/ping
"""
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings

router = APIRouter(prefix="/v1", tags=["dev_test"])


class ChatRequest(BaseModel):
    prompt: str


@router.post("/chat/gemini")
async def chat_gemini(payload: ChatRequest):
    """Schickt den Prompt an die Google-Gemini-API und gibt die Antwort zurück."""
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY fehlt (in .env setzen).")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent"
    )
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                url,
                params={"key": settings.GEMINI_API_KEY},
                json={"contents": [{"parts": [{"text": payload.prompt}]}]},
            )
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail="Gemini nicht erreichbar.") from exc

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Gemini-Fehler ({resp.status_code}): {resp.text}")

    data = resp.json()
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError):
        # z.B. wenn die Antwort durch Safety-Filter blockiert wurde
        return {"model": settings.GEMINI_MODEL, "text": "", "raw": data}
    return {"model": settings.GEMINI_MODEL, "text": text}


@router.post("/chat/claude")
def chat_claude(payload: ChatRequest):
    """Schickt den Prompt an die Anthropic-Claude-API und gibt die Antwort zurück."""
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(status_code=503, detail="ANTHROPIC_API_KEY fehlt (in .env setzen).")

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        model = "claude-haiku-4-5-20251001"
        msg = client.messages.create(
            model=model,
            max_tokens=300,
            messages=[{"role": "user", "content": payload.prompt}],
        )
        text = "".join(
            b.text for b in msg.content if getattr(b, "type", None) == "text"
        ).strip()
        return {"model": model, "text": text}
    except Exception as exc:  # anthropic wirft eigene Fehlertypen
        raise HTTPException(status_code=502, detail=f"Claude-Fehler: {exc}") from exc


@router.get("/paypal/ping")
async def paypal_ping():
    """Verbindungstest zu PayPal: holt ein OAuth-Token (kein Geldfluss)."""
    from app.paypal import PayPalError, _api_base, _get_access_token

    try:
        token = await _get_access_token()
    except PayPalError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {
        "ok": True,
        "env": settings.PAYPAL_ENV,
        "api_base": _api_base(),
        "token_preview": token[:10] + "…",
    }
