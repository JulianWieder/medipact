"""Admin-Endpunkte zum Ansehen/Bearbeiten der KI-Prompts (Workflow Manager).

Prompts liegen als Default im Code (app/prompts.py DEFAULT_PROMPTS) und können
pro Key in der DB (ai_prompts) überschrieben werden. Nur Mediatoren/Admins.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ai_prompt import AiPrompt
from app.models.user import User
from app.prompts import DEFAULT_PROMPTS, list_prompts
from app.security import get_current_db_user

router = APIRouter(prefix="/admin/ai-prompts", tags=["ai_prompts"])

_ADMIN_ROLES = {"mediator", "admin"}


def _require_admin(user: User) -> None:
    if user.role not in _ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Nur Mediatoren/Admins dürfen KI-Prompts bearbeiten")


class PromptUpdate(BaseModel):
    template: str


@router.get("")
def get_prompts(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Alle Prompts mit effektivem Text, Default und Platzhaltern."""
    _require_admin(user)
    return list_prompts(db)


@router.put("/{key}")
def update_prompt(
    key: str,
    payload: PromptUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Überschreibt den Prompt-Text für `key` (live wirksam)."""
    _require_admin(user)
    if key not in DEFAULT_PROMPTS:
        raise HTTPException(status_code=404, detail="Unbekannter Prompt-Key")
    if not payload.template.strip():
        raise HTTPException(status_code=400, detail="Prompt darf nicht leer sein")

    row = db.query(AiPrompt).filter(AiPrompt.key == key).first()
    if row:
        row.template = payload.template
    else:
        row = AiPrompt(key=key, template=payload.template)
        db.add(row)
    db.commit()
    return {"key": key, "template": payload.template, "is_custom": True}


@router.delete("/{key}")
def reset_prompt(
    key: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Setzt den Prompt auf den Code-Default zurück (löscht den DB-Override)."""
    _require_admin(user)
    if key not in DEFAULT_PROMPTS:
        raise HTTPException(status_code=404, detail="Unbekannter Prompt-Key")
    row = db.query(AiPrompt).filter(AiPrompt.key == key).first()
    if row:
        db.delete(row)
        db.commit()
    return {
        "key": key,
        "template": DEFAULT_PROMPTS[key]["template"],
        "is_custom": False,
    }
