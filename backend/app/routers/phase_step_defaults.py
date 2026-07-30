"""
API-Endpoints zur Verwaltung der Standard-Schritte pro Mediationstyp und
Phase (phase_step_defaults). Nur für Plattform-Admins/Mediatoren – das ist
die globale Konfiguration, nicht der Pro-Fall-Override (siehe
mediations.py: workflow-rules, custom_steps.py: custom-steps).
"""
import json
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.phase_step_default import SHARED_MEDIATION_TYPE, PhaseStepDefault
from app.models.user import User
from app.security import get_current_db_user
from app.services.llm import ai_complete

router = APIRouter(prefix="/admin/phase-step-defaults", tags=["phase_step_defaults"])

# Konsistent mit is_admin in routers/auth.py (GET /me/role)
_ADMIN_ROLES = {"mediator", "admin"}


def _require_admin(user: User) -> None:
    if user.role not in _ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Nur Admins können Phasen-Schritte konfigurieren")


def _normalize_blocks(blocks: Optional[list]) -> Optional[list]:
    """
    Validiert die Block-Liste generisch (bewusst OHNE feste Typ-Union, damit
    neue Blocktypen reine Frontend-Änderungen bleiben). Jeder Block braucht eine
    id und einen type; config wird zu einem dict normalisiert, visible_if bleibt
    optional. Unbekannte Felder werden verworfen.
    """
    if blocks is None:
        return None
    normalized: list[dict] = []
    seen_ids: set[str] = set()
    for i, raw in enumerate(blocks):
        if not isinstance(raw, dict):
            continue
        btype = raw.get("type")
        if not btype:
            continue
        bid = str(raw.get("id") or f"b{i + 1}")
        # id-Kollisionen auflösen (stabile, eindeutige ids für Antwort-Zuordnung)
        while bid in seen_ids:
            bid = f"{bid}_{i}"
        seen_ids.add(bid)
        config = raw.get("config")
        normalized.append(
            {
                "id": bid,
                "type": str(btype),
                "config": config if isinstance(config, dict) else {},
                "visible_if": raw.get("visible_if") or None,
            }
        )
    return normalized


def _sort_key(step: PhaseStepDefault) -> tuple:
    """Sortierung einer gemischten Liste aus typspezifischen und globalen
    Schritten: nach position; bei gleicher position steht der typspezifische
    Schritt vorn, danach der globale. Muss identisch zu der Sortierung in
    mediations.get_phase_steps sein (Designer zeigt sonst eine andere
    Reihenfolge als die Teilnehmer sehen)."""
    return (
        step.position,
        1 if step.mediation_type == SHARED_MEDIATION_TYPE else 0,
        step.id,
    )


def _serialize(step: PhaseStepDefault) -> dict:
    return {
        "id": step.id,
        "mediation_type": step.mediation_type,
        # true = wiederverwendbarer Schritt, der in allen Mediationstypen gilt.
        "shared": step.mediation_type == SHARED_MEDIATION_TYPE,
        "phase": step.phase,
        "step_key": step.step_key,
        "variant_key": step.variant_key,
        "title": step.title,
        "description": step.description,
        "placeholder": step.placeholder,
        "reflection_mode": step.reflection_mode,
        "content_types": step.content_types.split(",") if step.content_types else None,
        "blocks": step.blocks or None,
        "visible_if": step.visible_if or None,
        "video_url": step.video_url,
        "meeting_url": step.meeting_url,
        "question": step.question,
        "contract_template": step.contract_template,
        "result_source_phase": step.result_source_phase,
        "feedback_occasion": step.feedback_occasion,
        "required_roles": step.required_roles.split(",") if step.required_roles else None,
        "position": step.position,
        "enabled": step.enabled,
    }


class PhaseStepDefaultCreate(BaseModel):
    mediation_type: str
    phase: str
    step_key: str
    # None = Standard-Schritt des Basistyps. Sonst: key einer MediationVariant.
    variant_key: Optional[str] = None
    title: str
    description: str = ""
    placeholder: str = ""
    reflection_mode: Optional[str] = None
    content_types: Optional[list[str]] = None
    blocks: Optional[list[dict[str, Any]]] = None
    visible_if: Optional[dict[str, Any]] = None
    video_url: Optional[str] = None
    meeting_url: Optional[str] = None
    question: Optional[str] = None
    contract_template: Optional[str] = None
    result_source_phase: Optional[str] = None
    feedback_occasion: Optional[str] = None
    required_roles: Optional[list[str]] = None
    enabled: bool = True


class PhaseStepDefaultUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    placeholder: Optional[str] = None
    reflection_mode: Optional[str] = None
    content_types: Optional[list[str]] = None
    blocks: Optional[list[dict[str, Any]]] = None
    visible_if: Optional[dict[str, Any]] = None
    video_url: Optional[str] = None
    meeting_url: Optional[str] = None
    question: Optional[str] = None
    contract_template: Optional[str] = None
    result_source_phase: Optional[str] = None
    feedback_occasion: Optional[str] = None
    required_roles: Optional[list[str]] = None
    enabled: Optional[bool] = None


class ReorderItem(BaseModel):
    id: int
    position: int


class ReorderRequest(BaseModel):
    items: list[ReorderItem]


@router.get("")
def list_phase_step_defaults(
    mediation_type: str,
    phase: str,
    variant_key: Optional[str] = None,
    include_shared: bool = False,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """
    Default-Schritte für (mediation_type, phase), sortiert nach Reihenfolge.

    Ohne variant_key werden nur die Standard-Schritte des Basistyps geliefert
    (variant_key IS NULL). Mit variant_key werden ausschließlich die
    zusätzlichen/abweichenden Schritte dieser Variante geliefert – diese
    ergänzen im späteren Fall-Kontext die Standard-Schritte, ersetzen sie hier
    aber nicht in der Anzeige (getrennte Listen im Designer).

    mediation_type="*" (SHARED_MEDIATION_TYPE) liefert die wiederverwendbaren
    Schritte, die in ALLEN Mediationstypen gelten (Tab "Alle Typen").

    include_shared=true mischt diese globalen Schritte zusätzlich in die Liste
    eines konkreten Typs – so sieht der Designer dieselbe Reihenfolge, die die
    Teilnehmer später sehen. Erkennbar am Feld "shared" im Ergebnis.
    """
    _require_admin(user)
    query = db.query(PhaseStepDefault).filter(
        PhaseStepDefault.mediation_type == mediation_type,
        PhaseStepDefault.phase == phase,
    )
    if variant_key:
        query = query.filter(PhaseStepDefault.variant_key == variant_key)
    else:
        query = query.filter(PhaseStepDefault.variant_key.is_(None))
    steps = query.all()

    # Globale Schritte nur zur Basis-Liste eines echten Typs dazumischen –
    # nicht zur Varianten-Liste (dort stünden sie doppelt) und nicht zur
    # Liste der globalen Schritte selbst.
    if include_shared and not variant_key and mediation_type != SHARED_MEDIATION_TYPE:
        steps += (
            db.query(PhaseStepDefault)
            .filter(
                PhaseStepDefault.mediation_type == SHARED_MEDIATION_TYPE,
                PhaseStepDefault.phase == phase,
                PhaseStepDefault.variant_key.is_(None),
            )
            .all()
        )

    steps.sort(key=_sort_key)
    return [_serialize(s) for s in steps]


@router.post("")
def create_phase_step_default(
    payload: PhaseStepDefaultCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    # Ein globaler Schritt gilt typübergreifend – Varianten gehören dagegen zu
    # genau einem Mediationstyp. Die Kombination ist bedeutungslos.
    if payload.mediation_type == SHARED_MEDIATION_TYPE and payload.variant_key:
        raise HTTPException(
            status_code=400,
            detail="Ein globaler Schritt (Alle Typen) kann keiner Variante zugeordnet werden",
        )

    existing = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == payload.mediation_type,
            PhaseStepDefault.phase == payload.phase,
            PhaseStepDefault.step_key == payload.step_key,
            PhaseStepDefault.variant_key == payload.variant_key,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Step-Key existiert bereits für diesen Mediationstyp/Phase/Variante",
        )

    # Innerhalb eines Falls muss step_key eindeutig bleiben (daran hängen
    # MediationStepContent, MediationStepRule und die Notizen). Ein globaler
    # Schritt trifft in JEDEM Typ auf dessen Schritte – deshalb typübergreifend
    # gegen Kollisionen prüfen.
    collision_scope = None
    if payload.mediation_type == SHARED_MEDIATION_TYPE:
        collision_scope = PhaseStepDefault.mediation_type != SHARED_MEDIATION_TYPE
    else:
        collision_scope = PhaseStepDefault.mediation_type == SHARED_MEDIATION_TYPE
    clash = (
        db.query(PhaseStepDefault)
        .filter(
            collision_scope,
            PhaseStepDefault.phase == payload.phase,
            PhaseStepDefault.step_key == payload.step_key,
        )
        .first()
    )
    if clash:
        raise HTTPException(
            status_code=409,
            detail=(
                "Step-Key kollidiert mit einem globalen Schritt (Alle Typen)"
                if payload.mediation_type != SHARED_MEDIATION_TYPE
                else f"Step-Key wird bereits im Mediationstyp „{clash.mediation_type}“ verwendet"
            ),
        )

    count = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == payload.mediation_type,
            PhaseStepDefault.phase == payload.phase,
            PhaseStepDefault.variant_key == payload.variant_key,
        )
        .count()
    )

    step = PhaseStepDefault(
        mediation_type=payload.mediation_type,
        phase=payload.phase,
        step_key=payload.step_key,
        variant_key=payload.variant_key,
        title=payload.title,
        description=payload.description,
        placeholder=payload.placeholder,
        reflection_mode=payload.reflection_mode,
        content_types=",".join(payload.content_types) if payload.content_types else None,
        blocks=_normalize_blocks(payload.blocks),
        visible_if=payload.visible_if,
        video_url=payload.video_url,
        meeting_url=payload.meeting_url,
        question=payload.question,
        contract_template=payload.contract_template,
        result_source_phase=payload.result_source_phase,
        feedback_occasion=payload.feedback_occasion,
        required_roles=",".join(payload.required_roles) if payload.required_roles else None,
        position=count,
        enabled=payload.enabled,
    )
    db.add(step)
    db.commit()
    db.refresh(step)
    return _serialize(step)


@router.patch("/{step_id}")
def update_phase_step_default(
    step_id: int,
    payload: PhaseStepDefaultUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    step = db.query(PhaseStepDefault).filter(PhaseStepDefault.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step nicht gefunden")

    update_data = payload.model_dump(exclude_unset=True)
    if "required_roles" in update_data:
        roles = update_data.pop("required_roles")
        step.required_roles = ",".join(roles) if roles else None
    if "content_types" in update_data:
        types = update_data.pop("content_types")
        step.content_types = ",".join(types) if types else None
    if "blocks" in update_data:
        step.blocks = _normalize_blocks(update_data.pop("blocks"))
    for key, value in update_data.items():
        setattr(step, key, value)

    db.commit()
    db.refresh(step)
    return _serialize(step)


@router.delete("/{step_id}")
def delete_phase_step_default(
    step_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    step = db.query(PhaseStepDefault).filter(PhaseStepDefault.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step nicht gefunden")

    db.delete(step)
    db.commit()
    return {"status": "deleted"}


@router.post("/reorder")
def reorder_phase_step_defaults(
    payload: ReorderRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Setzt die position für mehrere Steps in einem Batch (Drag & Drop im Admin-UI)."""
    _require_admin(user)

    ids = [item.id for item in payload.items]
    steps = {
        s.id: s
        for s in db.query(PhaseStepDefault).filter(PhaseStepDefault.id.in_(ids)).all()
    }
    if len(steps) != len(ids):
        raise HTTPException(status_code=404, detail="Mindestens ein Step wurde nicht gefunden")

    for item in payload.items:
        steps[item.id].position = item.position

    db.commit()
    return [_serialize(steps[item.id]) for item in payload.items]


# ── KI-Vorbefüllung: Blöcke für einen Schritt generieren ────────────────────

_BLOCK_SPEC = """Verfügbare Blocktypen (type -> erlaubte config-Felder):
- textausgabe {text}            Erklär-/Anleitungstext für die Teilnehmer
- video {url}                   Video einbetten
- bild {url, caption}
- texteingabe {label, placeholder}   Freitext-Eingabe der Partei
- frage {prompt}                Offene Frage
- auswahl {prompt, options:[...], multi:false}
- skala {prompt, min, max, minLabel, maxLabel}
- ranking {prompt, options:[...]}
- liste {prompt, placeholder}   Partei sammelt beliebig viele Einträge
- betrag {label, currency}
- vertrauliche_notiz {prompt}   nur der Mediator sieht die Eingabe
- datei_upload {prompt}
- zustimmung {text}             ankreuzbare Bestätigung
- unterschrift {statement}
- videokonferenz {url}
- termin {}
- feedback {occasion}           occasion = "after_videocall" oder "before_contract"
- vertrag {template}
- hinweis {text, variant}       variant = "info" | "warnung" | "erfolg"
- akkordeon {title, text}
- gate {text}
- ki_zusammenfassung {prompt}   laufen im Hintergrund, für Teilnehmer unsichtbar
- ki_reframing {prompt}
- ki_interessen {prompt}
- ki_optionen {prompt}
- ki_gemeinsamkeiten {prompt}
"""

_PHASE_HINT = {
    "einladung": "Vor-Phase: Begrüßung/Einladung.",
    "einleitung": "Rahmen, Gesprächsregeln, Ziele klären.",
    "themensammlung": "Wertfrei alle strittigen Themen sammeln.",
    "interessen": "Interessen und Bedürfnisse hinter den Positionen herausarbeiten.",
    "optionen": "Möglichst viele Lösungsoptionen sammeln, ohne zu bewerten.",
    "verhandlung": "Optionen bewerten und eine tragfähige Lösung verhandeln.",
    "abschluss": "Ergebnis festhalten, Vereinbarung, Abschluss.",
}


class GenerateBlocksRequest(BaseModel):
    mediation_type: str
    phase: str
    title: str = ""
    instruction: Optional[str] = None


@router.post("/generate-blocks")
def generate_blocks(
    payload: GenerateBlocksRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Erzeugt per KI eine Blockliste als Startpunkt für einen Schritt.

    Gibt {"blocks": [...]} zurück (bereits normalisiert). Der Aufrufer entscheidet,
    ob er die Blöcke übernimmt. Nur Admins/Mediatoren.
    """
    _require_admin(user)

    phase_hint = _PHASE_HINT.get(payload.phase, "")
    extra = f"\nZusätzliche Anweisung des Mediators: {payload.instruction}" if payload.instruction else ""
    # Globale Schritte laufen in jedem Konflikttyp – der Text darf also weder
    # Trennung noch Nachbarschaft noch B2B voraussetzen.
    type_hint = (
        "ALLE Mediationsarten (Trennung, Erbschaft, Nachbarschaft, Verbraucher, "
        "B2B …) – formuliere bewusst typneutral, ohne Annahmen über die Art des "
        "Konflikts oder das Verhältnis der Parteien"
        if payload.mediation_type == SHARED_MEDIATION_TYPE
        else payload.mediation_type
    )
    prompt = (
        "Du gestaltest die Seite eines Schritts in einer Online-Mediation. "
        f"Mediationstyp: {type_hint}. Phase: {payload.phase} ({phase_hint}). "
        f"Titel des Schritts: {payload.title or '(ohne Titel)'}.{extra}\n\n"
        "Erzeuge eine sinnvolle, in sich schlüssige Abfolge von 3 bis 6 Blöcken für "
        "diese Seite. Beginne in der Regel mit einer kurzen Textausgabe (Anleitung), "
        "füge passende Eingaben hinzu und – wo hilfreich – einen KI-Analyseblock. "
        "Schlage außerdem einen kurzen, prägnanten Titel für den Schritt vor. "
        "Schreibe auf Deutsch, warm und verständlich.\n\n"
        f"{_BLOCK_SPEC}\n"
        "Antworte AUSSCHLIESSLICH mit einem JSON-Objekt der Form "
        '{"title": "<kurzer Schritt-Titel>", "blocks": [ {"type": "<einer der Typen>", '
        '"config": { ... }}, ... ]}. Keine Erklärung, kein Markdown, nur das JSON-Objekt.'
    )

    raw = ai_complete(prompt, max_tokens=1100)
    start = raw.find("{")
    end = raw.rfind("}")
    title = ""
    parsed_blocks: list = []
    if start != -1 and end != -1 and end > start:
        try:
            obj = json.loads(raw[start : end + 1])
            if isinstance(obj, dict):
                if isinstance(obj.get("title"), str):
                    title = obj["title"].strip()
                if isinstance(obj.get("blocks"), list):
                    parsed_blocks = obj["blocks"]
            elif isinstance(obj, list):
                parsed_blocks = obj
        except (ValueError, TypeError):
            parsed_blocks = []

    blocks = _normalize_blocks(parsed_blocks) or []
    return {"title": title, "blocks": blocks}
