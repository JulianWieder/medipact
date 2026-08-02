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
            "Erstelle auf Basis der folgenden Eingaben der Parteien einen klaren, "
            "verbindlichen Mediationsvertrag auf Deutsch.\n\n"
            "Die Eingaben sind nach Schritten und Fragen geordnet. Hinter jeder Frage "
            "stehen die Antworten der einzelnen Parteien. Achte auf die Markierungen:\n"
            "- [EINIG] beide Seiten haben dasselbe geantwortet -> übernimm es als "
            "verbindliche Regelung.\n"
            "- [UNTERSCHIEDLICH] die Seiten haben verschieden geantwortet -> formuliere "
            "KEINE Regelung, sondern führe den Punkt am Ende unter „Offene Punkte“ auf, "
            "mit beiden Positionen. Erfinde keinen Kompromiss.\n\n"
            "Der Vertrag soll:\n"
            "- Den vereinbarten Ablauf festhalten (Format der Gespräche, wer teilnehmen "
            "darf, Dauer und Rhythmus der Sitzungen)\n"
            "- Die gemeinsamen Gesprächsregeln als Liste aufführen\n"
            "- Regeln, was bei Unsicherheit gilt (Bedenkzeit, Einzelgespräch, externer Rat)\n"
            "- Vertraulichkeit, Freiwilligkeit, Eigenverantwortung und Allparteilichkeit "
            "des Mediators ausdrücklich nennen\n"
            "- Kostenverteilung und Beendigung regeln\n"
            "- Das Ziel der Mediation benennen\n"
            "- Auf die Online-Besonderheiten eingehen (digitale Vertraulichkeit, Umgang "
            "mit technischen Problemen)\n"
            "- Mit den Abschnitten „Offene Punkte“ und einem Unterschriftenblock enden\n"
            "- Respektvoll und ohne Juristendeutsch formuliert sein, maximal 600 Wörter\n\n"
            "Erfinde nichts, was nicht in den Eingaben steht.\n\n"
            "Eingaben der Parteien:\n\n{notes_text}"
        ),
    },
    "phase_analyse": {
        "label": "Fall-Analyse: KI-Zusammenfassung einer Phase (Parteien + Mediator)",
        "placeholders": ["title", "type_label", "phase_label", "inputs_text"],
        "template": (
            "Du bist ein erfahrener, neutraler Mediationsexperte. Fasse für den Mediator "
            "die folgenden Eingaben aus der Phase '{phase_label}' des Mediationsfalls "
            "'{title}' (Konfliktart: {type_label}) zusammen.\n\n"
            "Die Eingaben stammen von den Streitparteien und ggf. vom Mediator. "
            "Arbeite heraus:\n"
            "- Die zentralen Aussagen und Anliegen jeder Partei\n"
            "- Gemeinsamkeiten und Unterschiede der Sichtweisen\n"
            "- Offene Punkte oder Spannungsfelder, die in dieser Phase sichtbar wurden\n\n"
            "Schreibe auf Deutsch, sachlich, ausgewogen und ohne Partei zu ergreifen, "
            "in kurzen Absätzen (max. 250 Wörter).\n\n"
            "EINGABEN DER PHASE '{phase_label}':\n{inputs_text}\n\n"
            "Antworte NUR mit dem Zusammenfassungstext, ohne Vorrede und ohne Markdown."
        ),
    },
    "swot_ziel": {
        "label": "Fall-Analyse: SWOT zur Fall-Finalisierung & Ziel (JSON)",
        "placeholders": [
            "title", "type_label", "current_phase", "description",
            "participants_list", "inputs_text",
        ],
        "template": (
            "Du bist ein erfahrener Mediationsexperte. Analysiere den folgenden Mediationsfall "
            "mit Blick auf die FINALISIERUNG des Falls: Wie realistisch ist eine Einigung, "
            "was ist das gemeinsame Ziel und was muss noch passieren, um den Fall erfolgreich "
            "abzuschließen?\n\n"
            "FALLDETAILS:\n"
            "- Titel: {title}\n"
            "- Konfliktart: {type_label}\n"
            "- Aktuelle Phase: {current_phase}\n"
            "- Beschreibung: {description}\n\n"
            "BETEILIGTE:\n{participants_list}\n\n"
            "ALLE BISHERIGEN EINGABEN (Parteien + Mediator, nach Phasen):\n{inputs_text}\n\n"
            "Erstelle eine Analyse mit folgendem JSON-Format (auf Deutsch):\n"
            "{{\n"
            "  \"ziel\": \"Das aus den Eingaben erkennbare gemeinsame Ziel der Mediation (1-2 Sätze)\",\n"
            "  \"zusammenfassung\": \"2-3 Sätze: Wie weit ist der Fall, wie realistisch ist eine Einigung?\",\n"
            "  \"swot\": {{\n"
            "    \"staerken\": [\"Was spricht für eine erfolgreiche Finalisierung\", \"...\"],\n"
            "    \"schwaechen\": [\"Was erschwert die Finalisierung aktuell\", \"...\"],\n"
            "    \"chancen\": [\"Welche Möglichkeiten sollten genutzt werden\", \"...\"],\n"
            "    \"risiken\": [\"Was kann die Einigung noch gefährden\", \"...\"]\n"
            "  }},\n"
            "  \"finalisierung\": [\"Konkreter Schritt 1 zur Fall-Finalisierung\", \"Schritt 2\", \"Schritt 3\"]\n"
            "}}\n\n"
            "WICHTIG: Antworte NUR mit dem JSON-Objekt, ohne Erklärung, ohne Markdown-Code-Blöcke."
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
    "logbuch_analyse": {
        "label": "Logbuch: Nächste Schritte + psychologischer Tipp nach einem Eintrag (JSON)",
        "placeholders": [
            "type_label", "heute", "intake_text", "history_text",
            "entry_type", "entry_text",
        ],
        "template": (
            "Du begleitest eine Person, die einen laufenden Konflikt in einem privaten "
            "Konflikt-Logbuch dokumentiert (Konfliktart: {type_label}). Es gibt KEINE "
            "Gegenseite in diesem Werkzeug und noch keine Mediation – die Person hält nur "
            "fest, was passiert, und wünscht sich danach eine kurze, hochwertige "
            "Einordnung: Was wäre jetzt ein guter nächster Schritt?\n\n"
            "Heutiges Datum: {heute}\n\n"
            "GRUNDDATEN DES KONFLIKTS (einmalige Fallaufnahme):\n{intake_text}\n\n"
            "BISHERIGE EINTRÄGE (Chronologie, gekürzt):\n{history_text}\n\n"
            "NEUER EINTRAG (Art: {entry_type}):\n{entry_text}\n\n"
            "Deine Aufgabe:\n"
            "1. QUALITÄTS-PRÜFUNG: Gib nur dann eine Empfehlung, wenn der neue Eintrag "
            "genug Substanz für eine WIRKLICH hilfreiche, konkrete Empfehlung enthält. "
            "Ist er zu dünn, vage oder rein emotional ohne verwertbare Fakten, antworte "
            "exakt mit {{\"skip\": true}} – lieber keine Empfehlung als eine banale.\n"
            "2. NÄCHSTE SCHRITTE: 1–3 konkrete, praktische Schritte, die zur Lage passen "
            "(z.B. Anwältin für Erstberatung kontaktieren, den Auszug schriftlich per "
            "Brief/E-Mail festhalten, Fotos mit Datum sichern, Kontoauszüge kopieren, "
            "eine Frist notieren, ein klärendes Gespräch vorschlagen). Priorisiere: der "
            "wichtigste Schritt zuerst. Begründe jeden Schritt in einem Satz.\n"
            "3. PSYCHOLOGISCHER TIPP: EIN kurzer, konkreter Tipp für den Umgang mit der "
            "Belastung (z.B. Abgrenzung, Schlaf, nicht im Affekt antworten, soziale "
            "Unterstützung) – warm, auf Augenhöhe, ohne Floskeln, ohne Diagnosen.\n\n"
            "Regeln: Sprich die Person mit \"Sie\" an. KEINE Rechtsberatung – du darfst "
            "empfehlen, rechtlichen Rat einzuholen, aber keine Rechtslage behaupten. "
            "Nichts erfinden, was nicht in den Einträgen steht. Keine Wiederholung von "
            "Schritten, die laut Chronologie bereits erledigt sind.\n\n"
            "Antworte NUR mit einem JSON-Objekt in diesem Format (auf Deutsch):\n"
            "{{\n"
            "  \"einschaetzung\": \"1-2 Sätze: kurze, wertschätzende Einordnung des Eintrags\",\n"
            "  \"naechste_schritte\": [\n"
            "    {{\"titel\": \"Kurzer Imperativ, z.B. 'Auszug schriftlich festhalten'\", "
            "\"warum\": \"Ein Satz Begründung\"}}\n"
            "  ],\n"
            "  \"tipp\": \"Der psychologische Tipp (2-3 Sätze)\"\n"
            "}}\n"
            "Oder – wenn der Eintrag zu wenig Substanz hat – exakt: {{\"skip\": true}}\n\n"
            "WICHTIG: NUR das JSON-Objekt, ohne Erklärung, ohne Markdown-Code-Blöcke."
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
