"""Zentrale, im Workflow Manager editierbare KI-Prompts.

DEFAULT_PROMPTS enthält für jeden Key den Standard-Prompt (aus dem Code) plus
Metadaten (Label, verfügbare Platzhalter). get_prompt(key, **werte) lädt den
ggf. im Admin überschriebenen Text aus der DB (Tabelle ai_prompts) und füllt die
Platzhalter. Fehlende/unbekannte Platzhalter bleiben unverändert stehen; ein
kaputtes Template fällt automatisch auf den Default zurück – die App stürzt
dadurch nie ab.

Platzhalter werden als {name} geschrieben. Literale geschweifte Klammern (z.B.
JSON-Beispiele) müssen im Template als {{ und }} doppelt geschrieben werden.
"""
from app.database import SessionLocal
from app.models.ai_prompt import AiPrompt


class _SafeDict(dict):
    """format_map-Hilfsdict: unbekannte Platzhalter bleiben als {name} stehen."""

    def __missing__(self, key):
        return "{" + key + "}"


# key -> {label, placeholders, template}
DEFAULT_PROMPTS: dict[str, dict] = {
    "invite_paraphrase": {
        "label": "Einladung: persönliche Nachricht umformulieren (beim Versand)",
        "placeholders": ["mediation_title", "message"],
        "template": (
            "Du hilfst dabei, eine persönliche Nachricht innerhalb einer Einladungs-E-Mail zu einer "
            "Mediation umzuformulieren. Behalte den Kerninhalt und die Absicht der Person exakt bei, "
            "mache den Ton aber warm, wertschätzend und einladend. Ziel ist, dass die empfangende "
            "Person sich registriert und sich die beigefügte persönliche Video-Botschaft ansieht. "
            "Antworte NUR mit dem umformulierten Text (max. 80 Wörter), ohne Anführungszeichen, "
            "ohne Erklärung, ohne Markdown.\n\n"
            "Mediationsthema: {mediation_title}\n\n"
            "Original-Nachricht:\n{message}"
        ),
    },
    "invite_improve": {
        "label": "Einladung: Text verbessern (Button „Verbessern“)",
        "placeholders": ["text"],
        "template": (
            "Der folgende Text stammt aus der automatischen Transkription einer gesprochenen "
            "Video-Nachricht (oder wurde von Hand geschrieben). Glätte ihn zu einem klaren, gut "
            "lesbaren Text: entferne Füllwörter, Versprecher, Wiederholungen und Satzbrüche, "
            "korrigiere Grammatik und Zeichensetzung. Behalte Inhalt, Tonfall und Ich-Perspektive "
            "der Person exakt bei -- erfinde nichts hinzu und ändere die Aussage nicht. "
            "Antworte NUR mit dem verbesserten Text, ohne Anführungszeichen, ohne Erklärung, "
            "ohne Markdown.\n\n"
            "Text:\n{text}"
        ),
    },
    "invite_generate": {
        "label": "Einladung: Text + Betreff + Fall-Titel generieren („Professionell formulieren“)",
        "placeholders": ["type_label", "mediation_title", "description"],
        "template": (
            "Du hilfst einer Person, die eine andere Konfliktpartei zu einer Mediation einlädt. "
            "Aus der folgenden kurzen, formlosen Beschreibung sollst du drei Dinge erstellen:\n"
            "1. \"message\": eine persönliche Einladungsnachricht in der ICH-Perspektive der "
            "einladenden Person (max. 90 Wörter). Ton: warm, respektvoll, wertschätzend, "
            "professionell, deeskalierend. Ziel ist, dass die andere Seite sich einlässt und "
            "der Mediation beitritt. Keine Schuldzuweisungen.\n"
            "2. \"subject\": eine kurze, sachliche Überschrift/Betreffzeile (max. 8 Wörter), "
            "ohne Anführungszeichen.\n"
            "3. \"title\": ein prägnanter Fall-Titel für die Mediation (max. 6 Wörter).\n\n"
            "Mediationsbereich: {type_label}\n"
            "Bisheriger Fall-Titel (nur Kontext): {mediation_title}\n\n"
            "Beschreibung der Person:\n{description}\n\n"
            "Antworte AUSSCHLIESSLICH mit einem JSON-Objekt mit genau den Schlüsseln "
            "\"message\", \"subject\", \"title\" – ohne Markdown, ohne Code-Fences, ohne Erklärung."
        ),
    },
    "summarize_results": {
        "label": "Phase: Ergebnis-Zusammenfassung für alle Teilnehmer",
        "placeholders": ["inputs_text"],
        "template": (
            "Du bist ein neutraler Mediator. Fasse die folgenden Eingaben der\n"
            "Teilnehmer so zusammen, dass der Text ALLEN Teilnehmern gemeinsam angezeigt\n"
            "werden kann. Schreibe auf Deutsch, sachlich, respektvoll und ausgewogen, in\n"
            "kurzen Absätzen. Benenne gemeinsame Themen sowie unterschiedliche Sichtweisen,\n"
            "ohne Partei zu ergreifen und ohne Vorwürfe zuzuspitzen.\n\n"
            "EINGABEN:\n{inputs_text}\n\n"
            "Antworte NUR mit dem Zusammenfassungstext, ohne Vorrede und ohne Markdown."
        ),
    },
    "generate_title": {
        "label": "Fall-Titel aus Beschreibung generieren (beim Anlegen)",
        "placeholders": ["type_label", "description"],
        "template": (
            "Du bist ein Mediationsassistent. Erstelle einen kurzen, prägnanten Titel (max. 6 Wörter) "
            "für eine Mediation im Bereich '{type_label}' auf Basis dieser Beschreibung:\n\n"
            "{description}\n\n"
            "Antworte NUR mit dem Titel, ohne Anführungszeichen, ohne Erklärung."
        ),
    },
    "reflect": {
        "label": "Schritt-Reflexion: Eingaben der Parteien zusammenfassen",
        "placeholders": ["step_title", "parts"],
        "template": (
            "Du bist ein neutraler Mediationsassistent. "
            "Fasse die folgenden Eingaben der Parteien zum Schritt '{step_title}' "
            "sachlich, neutral und respektvoll zusammen. "
            "Hebe gemeinsame Punkte hervor. Keine Bewertung, kein Ratschlag.\n\n{parts}"
        ),
    },
    "contract": {
        "label": "Mediationsvertrag aus den Phase-1-Eingaben generieren",
        "placeholders": ["notes_text"],
        "template": (
            "Du bist ein erfahrener Mediationsassistent. "
            "Erstelle auf Basis der folgenden Eingaben der Parteien einen kurzen, klaren Mediationsvertrag auf Deutsch. "
            "Der Vertrag soll:\n"
            "- Die gemeinsamen Regeln für das Verfahren festhalten\n"
            "- Die Rollen der Beteiligten klären\n"
            "- Die Grundsätze (Freiwilligkeit, Vertraulichkeit, Eigenverantwortung, Neutralität) explizit nennen\n"
            "- Besonders auf die Online-Besonderheiten eingehen (digitale Vertraulichkeit, Umgang mit technischen Problemen)\n"
            "- Das gemeinsame Ziel der Mediation benennen\n"
            "- In einem respektvollen, verbindlichen Ton gehalten sein\n"
            "- Maximal 400 Wörter\n\n"
            "Eingaben der Parteien:\n\n{notes_text}"
        ),
    },
    "analyse": {
        "label": "Mediator-Analyse: SWOT + Gesprächstipps (JSON)",
        "placeholders": [
            "title", "type_label", "current_phase", "description",
            "priority", "participants_list", "notes_text",
        ],
        "template": (
            "Du bist ein erfahrener Mediationsexperte. Analysiere den folgenden Mediationsfall und gib eine strukturierte JSON-Antwort zurück.\n\n"
            "FALLDETAILS:\n"
            "- Titel: {title}\n"
            "- Konfliktart: {type_label}\n"
            "- Aktuelle Phase: {current_phase}\n"
            "- Beschreibung: {description}\n"
            "- Priorität/Dringlichkeit: {priority}\n\n"
            "BETEILIGTE:\n{participants_list}\n\n"
            "BISHERIGE NOTIZEN DER PARTEIEN:\n{notes_text}\n\n"
            "Erstelle eine Analyse mit folgendem JSON-Format (auf Deutsch):\n"
            "{{\n"
            "  \"swot\": {{\n"
            "    \"staerken\": [\"...\", \"...\"],\n"
            "    \"schwaechen\": [\"...\", \"...\"],\n"
            "    \"chancen\": [\"...\", \"...\"],\n"
            "    \"risiken\": [\"...\", \"...\"]\n"
            "  }},\n"
            "  \"zusammenfassung\": \"2-3 Sätze zur Gesamtlage der Mediation\",\n"
            "  \"empfehlungen\": [\"...\", \"...\"],\n"
            "  \"teilnehmer_tipps\": [\n"
            "    {{\n"
            "      \"name\": \"Name des Teilnehmers\",\n"
            "      \"rolle\": \"Rolle\",\n"
            "      \"tipps\": [\"Konkreter Gesprächstipp 1\", \"Tipp 2\", \"Tipp 3\"]\n"
            "    }}\n"
            "  ]\n"
            "}}\n\n"
            "WICHTIG: Antworte NUR mit dem JSON-Objekt, ohne Erklärung, ohne Markdown-Code-Blöcke."
        ),
    },
}


def _load_template(key: str) -> str:
    """Effektives Template: DB-Override falls vorhanden, sonst Default aus dem Code."""
    default = DEFAULT_PROMPTS.get(key, {}).get("template", "")
    try:
        db = SessionLocal()
        try:
            row = db.query(AiPrompt).filter(AiPrompt.key == key).first()
            if row and (row.template or "").strip():
                return row.template
        finally:
            db.close()
    except Exception:
        pass
    return default


def get_prompt(key: str, **kwargs) -> str:
    """Liefert den fertig gefüllten Prompt für `key`.

    Reihenfolge: DB-Override → Default. Platzhalter werden per format_map gefüllt;
    unbekannte bleiben stehen, ein kaputtes Template fällt auf den Default zurück.
    """
    default = DEFAULT_PROMPTS.get(key, {}).get("template", "")
    template = _load_template(key)
    try:
        return template.format_map(_SafeDict(kwargs))
    except Exception:
        try:
            return default.format_map(_SafeDict(kwargs))
        except Exception:
            return default


def list_prompts(db) -> list[dict]:
    """Alle Prompts mit effektivem Text, Default, Platzhaltern (für den Admin-Editor)."""
    try:
        overrides = {r.key: r.template for r in db.query(AiPrompt).all()}
    except Exception:
        # Tabelle evtl. noch nicht migriert -> nur Defaults anzeigen.
        overrides = {}
    result = []
    for key, meta in DEFAULT_PROMPTS.items():
        result.append(
            {
                "key": key,
                "label": meta["label"],
                "placeholders": meta["placeholders"],
                "default": meta["template"],
                "template": overrides.get(key, meta["template"]),
                "is_custom": key in overrides,
            }
        )
    return result
