# Ratgeber: Suchsprache statt Verfahrenssprache

Stand: 31.07.2026

## Der Befund

Von 26 Ratgeber-Artikeln tragen 16 „Mediation" oder „Mediator" im Slug.
Das ist die Sprache des Verfahrens, nicht die der Betroffenen.

Der Kernsatz: **„Mediation" ist die Antwort, nicht die Frage.** Wer nachts
googelt, weiß nicht, dass es Mediation gibt — er sucht nach seinem Problem.

Wichtige Einschränkung, die man nicht übersehen darf: Das gilt **nur für
B2C**. Bei den Wirtschafts-Artikeln ist der Fachbegriff die Suchsprache,
weil dort HR-Leitungen und Geschäftsführer suchen, die „Wirtschaftsmediation"
tatsächlich eintippen. Diese Artikel bleiben, wie sie sind.

## Bereits erledigt (31.07.2026)

### Titel und H1 auf Suchsprache umgestellt

| Artikel | vorher (metaTitle) | nachher |
|---|---|---|
| `nachbarschaftsstreit-mediation` | Nachbarschaftsstreit: Mediation, Kosten & Ablauf | Nachbarschaftsstreit: Was tun bei Lärm & Hecke? |
| `sorgerecht-umgang-mediation` | Sorgerecht & Umgang: Einigung statt Gericht | Sorgerecht und Umgang: Wer bekommt was? |
| `weg-streit-mediation` | WEG-Streit: Mediation statt Beschlussanfechtung | WEG-Streit: Was tun bei Beschluss & Verwalter? |
| `familien-und-erbmediation` | Familien- & Erbmediation: Ablauf & Kosten | Streit ums Erbe in der Familie: Was tun? |
| `pflichtteil-mediation` | Pflichtteil & Mediation: einigen statt klagen | Pflichtteil einfordern: Wie viel steht mir zu? |
| `kuendigung-ohne-gericht` | Kündigung ohne Gericht klären: Mediation statt Arbeitsgericht | Kündigung erhalten: Was kann ich jetzt tun? |

### Nebenbefund: Längenregel war gebrochen

Der Meta-SEO-Überhaul vom 17.07. hatte alle Titles auf ≤60 und Descriptions
auf ≤155 Zeichen gebracht. **12 Artikel verstießen wieder dagegen** —
Spitzenreiter `trennung-von-einem-narzissten` mit 274 Zeichen Description
und `kuendigung-ohne-gericht` mit 72 Zeichen Title.

Das ist kein Schönheitsfehler: Ein abgeschnittener Titel transportiert die
Suchsprache gerade nicht mehr. Alle 26 Artikel sind jetzt wieder in der Norm.

Beim Kürzen wurde der emotionale Ton der vier starken Artikel bewusst
erhalten (`ich-will-mich-trennen`, `scheidung-ohne-rosenkrieg`,
`trennung-von-einem-narzissten`, `akuter-konflikt-was-tun`).

### Slugs umgezogen (31.07.2026)

`next.config.ts` hat jetzt einen `redirects()`-Block. Er ist neu — vorher gab
es im Projekt überhaupt keinen Mechanismus für Weiterleitungen. **Einträge
darin nie wieder entfernen**: Sie kosten nichts und werden gebraucht, solange
irgendwo im Netz ein Link auf die alte Adresse steht.

| alt | neu | warum |
|---|---|---|
| `familien-und-erbmediation` | `streit-ums-erbe-in-der-familie` | Kompositum wird nicht gesucht |
| `pflichtteil-mediation` | `pflichtteil-einfordern` | „einfordern" ist das Suchverb |
| `sorgerecht-umgang-mediation` | `sorgerecht-und-umgangsrecht` | beide Begriffe haben Volumen |
| `nachbarschaftsstreit-mediation` | `nachbarschaftsstreit-was-tun` | „was tun" ist die reale Query |

Alle vier sind per 301 weitergeleitet. Nicht anfassen: `wirtschaftsmediation`, `mediation-im-unternehmen`,
`mediation-am-arbeitsplatz`, `online-dispute-resolution`, `was-ist-mediation`,
`was-ist-ein-mediator`, `mediation-kosten`, `5-phasen-der-mediation`.
Das sind entweder B2B-Begriffe oder echte Definitions-Suchen mit Volumen.

## Offen: Inhaltliche Lücken

Kein Artikel bedient diese Fragen, obwohl sie den Einstieg in die
Konfliktarten bilden würden. Reihenfolge = Priorität.

**Trennung/Scheidung** (zahlt auf `/konflikte/trennung` ein)

1. Was steht mir bei der Scheidung zu?
2. Muss ich bei der Scheidung das Haus verkaufen?
3. Wer muss bei einer Trennung aus der Wohnung?
4. Trennungsjahr: Wie weist man es nach?

**Erbe** (zahlt auf `/konflikte/erbschaft` ein)

5. Geschwister streiten ums Erbe — was tun?
6. Erbengemeinschaft: Einer blockiert. Was jetzt?

**Nachbarschaft** (zahlt auf `/konflikte/nachbarschaft` ein)

7. Nachbar lärmt jede Nacht — was kann ich tun?
8. Wie hoch darf die Hecke des Nachbarn sein?

Bauform je Artikel: die Frage direkt in den ersten 30 Wörtern beantworten
(für „Nutzer fragen auch"), dann die Rechtslage, dann der Weg — Mediation
erst als Konsequenz, nicht als Aufhänger. Verlinkung auf `/kostenrechner`
mit passendem `?art=` und auf die jeweilige Konflikt-Landingpage.

## Was NICHT übernommen wird

Der Personen-Weg (Podcast, Buch, Instagram-Gesicht). Brand-Suchvolumen ist
ein nachlaufendes Signal und lässt sich nicht direkt bauen. Das
Produkt-Äquivalent sind benennbare Werkzeuge — „medipact Kostenrechner",
„Konflikt-Logbuch" —, nach denen namentlich gesucht werden kann.
