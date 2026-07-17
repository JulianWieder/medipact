# medipact – Workflow-Inhalte

*Vollständiger Stand aller Workflow-Schritte und Blöcke je Mediationstyp, rekonstruiert aus den Seed-Migrationen bis Head `r0s1t2u3v4`. Stand: 17.07.2026.*


\newpage

# Trennung & Scheidung

## Standard-Workflow

### Phase 0 – Einladung

#### Ihr Start — die Trennung sortieren  `[start_intake]`

Der geführte Einstieg: Geschichte, Fakten, Blick nach vorn.

> **Text:** Eine Trennung wirft hundert Fragen auf einmal auf. Die nächsten fünf Minuten gehören nur Ihnen und Ihrer Situation: kein Juristendeutsch, keine Formular-Batterie — ein Gespräch. Wir stellen Ihnen die Fragen, die eine erfahrene Mediatorin im ersten Gespräch stellen würde. Alles bleibt vertraulich.

> **zustimmung:** Bevor wir starten, das Fundament jeder Mediation — vier Grundsätze: FREIWILLIGKEIT (niemand muss, alle wollen — Sie können jederzeit aussteigen). VERTRAULICHKEIT (was Sie hier schreiben, dient nur der Mediation). ALLPARTEILICHKEIT (die Mediation steht auf keiner Seite — sie steht für eine faire Lösung). ERGEBNISOFFENHEIT (die Lösung entwickeln Sie selbst, nichts wird vorgegeben). Wichtig: Mediation ersetzt keine Rechtsberatung. Ich möchte auf dieser Grundlage arbeiten.

> **Text:** Erzählen Sie zuerst frei — noch keine Bewertung, kein Urteil, keine Lösung. Erst die Geschichte, dann die Fakten, dann der Blick nach vorn.

> **Frage:** Was ist passiert? Beschreiben Sie Ihre Trennungssituation so, wie Sie sie einer guten Freundin erzählen würden — in Ihren Worten.
> — *map_to:* description

> **Frage:** Wer gehört alles dazu — Partner:in, Kinder, vielleicht neue Partner? Und wie sprechen Sie heute miteinander?

> **Frage:** Was haben Sie schon versucht, um das zu klären — und woran ist es bisher gescheitert?

> **Text:** Jetzt die nüchternen Eckdaten. Sie helfen, den Fall richtig einzuordnen — alles Weitere klären wir später gemeinsam.

> **Datum:** Datum der Eheschließung
> — *help:* Falls nicht verheiratet: einfach überspringen.

> **Datum:** Datum der (räumlichen) Trennung
> — *help:* Ab hier läuft z. B. das Trennungsjahr.

> **auswahl:** Haben Sie gemeinsame Kinder?
> — *options:* ["Ja, minderjährige Kinder", "Ja, nur volljährige Kinder", "Nein"]
> — *multi:* false

> **Text:** Zum Schluss drehen wir die Perspektive: weg von dem, was war — hin zu dem, was werden soll.

> **Frage:** Was brennt gerade am meisten? Wenn nur EIN Thema in den nächsten Wochen geklärt würde — welches müsste es sein?
> — *map_to:* priority
> — *placeholder:* z. B. Kinderbetreuung, Unterhalt, Wohnung, Konten, Kommunikation

> **Frage:** Gibt es akute Risiken oder Eskalationen — etwa Drohungen, gesperrte Konten, verweigerten Umgang, Kontaktabbruch? (Bei Gewalt oder Angst um Ihre Sicherheit ist eine Mediation nicht der richtige erste Schritt — holen Sie sich bitte direkte Hilfe.)

> **Frage:** Stellen Sie sich vor, in drei Monaten ist das hier gut geklärt: Woran merken Sie es zuerst — ganz konkret, im Alltag?

> **skala:** Wie zuversichtlich sind Sie heute, dass eine faire Einigung möglich ist?
> — *min:* 1
> — *max:* 10
> — *minLabel:* kaum vorstellbar
> — *maxLabel:* sehr zuversichtlich

#### Willkommen  `[basis_einladung]`

Schön, dass ihr diesen Weg gemeinsam geht.

> **Text:** Willkommen bei medipact. In einer Mediation findet ihr mit Unterstützung einer neutralen Person eigenverantwortlich eine Lösung für eure Trennung bzw. Scheidung – etwa Kinder, Wohnung und Finanzen. Nehmt euch für jeden Schritt in Ruhe Zeit.

> **hinweis:** Alles, was ihr hier eingebt, dient ausschließlich der Mediation und wird vertraulich behandelt.
> — *variant:* info

> **akkordeon:** Die Mediation folgt sechs Phasen: 1. Einleitung (Rahmen, Regeln, euer Ziel), 2. Themensammlung (alles auf den Tisch – ohne Wertung), 3. Interessenklärung (was hinter den Forderungen steckt), 4. Lösungsoptionen (Ideen sammeln, noch nicht bewerten), 5. Verhandlung (prüfen, was wirklich trägt) und 6. Abschluss (verbindliche Vereinbarung). Bei einer Trennung geht es dabei typischerweise um Kinder und Betreuung, Wohnung und Hausrat sowie Finanzen und Unterhalt. Ihr bestimmt das Tempo – kein Schritt wird übersprungen, aber keiner dauert länger, als ihr braucht.

> **hinweis:** Hilfreich zur Vorbereitung (nichts davon ist Pflicht): ein Überblick über Einkommen und Fixkosten, Unterlagen zur Wohnung (Mietvertrag/Kredit) und ein ehrlicher Blick auf die aktuellen Betreuungszeiten der Kinder.
> — *variant:* info

### Phase 1 – Einleitung

#### Einführung  `[intro]`

Ein kurzer Einstieg ins Verfahren. Nimm dir einen Moment, bevor es losgeht.

Inhaltsarten: `"video"`

#### Willkommen  `[einl_intro]`

Ankommen und Orientierung.

> **Text:** Du bist hier, weil etwas schiefgelaufen ist. Vielleicht fühlst du Frustration, Erschöpfung, vielleicht auch Hoffnung, dass sich endlich etwas ändert. All das ist vollkommen in Ordnung.

> **Video:** 

> **Text:** Mediation gibt dir den Raum, gehört zu werden – ohne Urteil, ohne Druck. Dieser Prozess funktioniert nur, wenn alle freiwillig und in ihrem eigenen Tempo mitgehen. Nimm dir einen Moment. Atme durch.

> **akkordeon:** Eine Trennung hat zwei Ebenen: die emotionale Trennung und die Sachfragen (Kinder, Wohnung, Finanzen). Die Mediation hilft, beide zu entflechten – damit alte Verletzungen nicht die Entscheidungen über die Zukunft eurer Kinder bestimmen. Sie ersetzt kein Scheidungsverfahren, bereitet aber eine einvernehmliche Scheidungsfolgenvereinbarung vor, die deutlich günstiger und schonender ist als ein Rosenkrieg vor Gericht.

#### Terminvereinbarung  `[terminvereinbarung]`

Wählt gemeinsam einen Termin für das erste Gespräch.

Inhaltsarten: `"termin"`

#### Erstgespräch  `[einl_videocall]`

Das erste gemeinsame Gespräch.

> **Text:** Zum ersten Mal seid ihr alle im selben Raum – digital, aber gemeinsam. Das erste Gespräch setzt den Ton für alles, was folgt.

> **Videokonferenz:** 

> **Text:** Wenn du bereit bist, tritt dem Raum bei. Du kannst dein Mikrofon zunächst stummschalten und einfach ankommen. Es gibt keinen Druck, sofort zu reden.

#### Erstgespräch  `[videocall]`

Euer erstes gemeinsames Gespräch per Video, mit Transkript.

Inhaltsarten: `"videokonferenz"`

#### Gesprächsregeln  `[einl_regeln]`

Sicherheit durch gemeinsame Regeln.

> **Text:** In einem Konflikt verlieren wir oft das Gefühl von Kontrolle. Gemeinsame Regeln geben Sicherheit – sie schaffen den Rahmen, in dem echter Dialog erst möglich wird.

> **Video:** 

> **Frage:** Was brauchst du, damit du dich sicher genug fühlst, ehrlich zu sein? Formuliere es konkret – nicht für die andere Seite, für dich.

#### Kurzes Feedback  `[feedback_after_videocall]`

Wie war das erste Gespräch für dich?

Inhaltsarten: `"feedback"`

#### Deine Rolle  `[einl_rollen]`

Wer möchtest du in diesem Prozess sein?

> **Text:** Wir spielen in Konflikten oft Rollen, die wir nicht bewusst gewählt haben: Täter, Opfer, Retter. Hier hast du die Chance, innezuhalten und zu fragen: Wer möchte ich in diesem Prozess sein?

> **Video:** 

> **Frage:** Mach transparent, wie du dich in dieser Situation siehst – und was du von den anderen brauchst.

#### Regeln festlegen  `[einleitung]`

Jede Partei formuliert ihre Erwartungen an das Verfahren. Was ist dir wichtig? Welche Regeln sollen gelten?

*Platzhalter:* z.B. Keine Unterbrechungen, ausreden lassen …

Inhaltsarten: `"video,text"`

#### Vertrauen  `[einl_vertrauen]`

Genug Vertrauen für ehrliche Gespräche.

> **Text:** Vertrauen entsteht nicht auf Knopfdruck, besonders wenn es beschädigt wurde. Aber für diesen Prozess braucht ihr kein vollständiges Vertrauen – nur genug, um heute ehrlich sprechen zu können.

> **Video:** 

> **Frage:** Was ist dein Minimum? Was brauchst du, damit du dich wenigstens ein Stück weit öffnen kannst?

#### Rollen klären  `[einleitung_rollen]`

Welche Rolle übernimmt jede Person in dieser Mediation? Hier werden Zuständigkeiten und Erwartungen transparent gemacht.

*Platzhalter:* z.B. Ich sehe meine Rolle als …

Inhaltsarten: `"video,text"`

#### Dein Ziel  `[einl_ziel]`

Vom Problem zur Lösung.

> **Text:** Wir wissen im Konflikt oft sehr genau, was wir nicht wollen. Aber was willst du wirklich? Stell dir vor, dieser Prozess ist gelungen – wie fühlt sich das an, und was ist dann anders?

> **Video:** 

> **texteingabe:** Dein Ziel
> — *placeholder:* Formuliere dein Ziel positiv: nicht, was aufhören soll, sondern was stattdessen sein soll.

#### Vertrauen schaffen  `[einleitung_vertrauen]`

Was braucht ihr, um offen sprechen zu können? Notiert, was euch hilft, Vertrauen in den Prozess aufzubauen.

*Platzhalter:* z.B. Vertraulichkeit über alles, was hier gesprochen wird …

Inhaltsarten: `"video,text"`

#### Ziel der Mediation definieren  `[einleitung_ziel]`

Was soll am Ende dieser Mediation erreicht sein? Jede Partei formuliert ihr persönliches Ziel für den Prozess.

*Platzhalter:* z.B. Eine faire Lösung für beide Seiten finden …

Inhaltsarten: `"video,text"`

#### Reflexion vor dem Vertrag  `[feedback_before_contract]`

Kurze Einschätzung, bevor ihr den Mediationsvertrag unterzeichnet.

Inhaltsarten: `"feedback"`

#### Mediationsvertrag  `[contract]`

Der gemeinsame Mediationsvertrag zum Abschluss der Einleitungsphase.

Inhaltsarten: `"vertrag"`

### Phase 2 – Themensammlung

#### Konfliktpunkte sammeln  `[themensammlung_konflikte]`

*Reflexion: interactive*

Nennen Sie alle Themen und Streitpunkte, die in dieser Mediation geklärt werden sollen. Noch keine Bewertung – nur sammeln.

*Platzhalter:* z.B. Aufteilung der Betreuungszeiten, Unterhaltszahlungen …

#### Ankommen & Rahmen  `[themen_ankommen]`

Struktur und Entlastung: erst ordnen, dann klären.

> **Text:** Jetzt geht es um eine geordnete Bestandsaufnahme. Ziel dieses Abschnitts ist nicht, Recht zu bekommen, sondern Ordnung und Entlastung: Wir sammeln in Ruhe alle Themen, die auf den Tisch gehören – ohne sie schon zu bewerten oder zu lösen.

> **hinweis:** Wichtig: Niemand wird unterbrochen. Jede Seite bekommt gleich viel Zeit und Raum. Was dir wichtig ist, wird festgehalten und geht nicht verloren.
> — *variant:* info

> **zustimmung:** Ich bin bereit, in diesem Abschnitt erst zu sammeln und noch nicht zu diskutieren oder zu lösen.

#### Ihre Perspektive  `[themensammlung_perspektive]`

*Reflexion: interactive*

Schildern Sie Ihre persönliche Sicht auf den Konflikt. Ohne Wertung – nur Ihre Wahrnehmung der Situation.

*Platzhalter:* z.B. Ich erlebe die Situation so, dass …

#### Deine Sicht – ununterbrochen  `[themen_statement]`

Dein Eingangsstatement, das niemand unterbricht.

> **Text:** Schildere in eigenen Worten, wie du die Situation erlebst. Nimm dir so viel Raum, wie du brauchst – hier unterbricht dich niemand. Sprich aus deiner Sicht (in Ich-Form), statt der anderen Seite Vorwürfe zu machen.

> **texteingabe:** Wie erlebst du die Situation?
> — *placeholder:* Was ist passiert, was beschäftigt dich, wo hakt die Zusammenarbeit / das Miteinander gerade?

> **video_aufnahme:** Wenn du magst, sprich deine Sicht als kurze Videobotschaft ein – manchmal ist Reden leichter als Schreiben.

> **auswahl:** Welche Bereiche betreffen euch?
> — *multi:* true
> — *options:* ["Kinder & Umgang", "Wohnung & Hausrat", "Finanzen & Unterhalt", "Vermögen & Schulden"]

> **skala:** Wie belastend ist die Situation für dich gerade?
> — *min:* 1
> — *max:* 10
> — *minLabel:* gut auszuhalten
> — *maxLabel:* sehr belastend

#### Prioritäten setzen  `[themensammlung_prioritaeten]`

*Reflexion: interactive*

Welche Themen sind für Sie am dringendsten? Benennen Sie die Punkte, die zuerst geklärt werden müssen.

*Platzhalter:* z.B. Zuerst muss das Thema Wohnung geklärt werden, weil …

#### Aus Vorwurf wird Thema  `[themen_zu_themen]`

Wir filtern die Schärfe heraus und behalten die Sachthemen.

> **Text:** In der Hitze fallen schnell Vorwürfe. Für die Mediation übersetzen wir sie in sachliche Themen: Aus „der blockiert immer alles“ wird z. B. das Thema „Abstimmung von Freigaben und Abläufen“. Es geht nicht darum, wer angefangen hat, sondern worüber ihr gemeinsam sprechen wollt.

> **liste:** Welche Themen gehören für dich auf die gemeinsame Agenda? Formuliere sie möglichst neutral (Überschriften, keine Vorwürfe).
> — *placeholder:* Ein Thema, sachlich formuliert …

> **ki_reframing:** Formuliere die eingegebenen Themen und Aussagen in eine sachliche, vorwurfsfreie Sprache um. Mache aus Vorwürfen neutrale Themen-Überschriften, ohne den Inhalt zu verfälschen.
> — *autorun:* false

#### Gemeinsame Themen-Agenda  `[themen_agenda]`

Alle Themen sichtbar – nichts geht verloren.

> **Text:** Aus euren Punkten entsteht jetzt eine gemeinsame, sachliche Agenda. Wenn beide Seiten sehen, dass ihre Themen aufgenommen wurden, sinkt die Anspannung – das ist die Grundlage für die nächsten Schritte.

> **ranking:** Bring die gesammelten Themen in die Reihenfolge, in der wir sie aus deiner Sicht bearbeiten sollten.

> **KI-Zusammenfassung:** Fasse die Themen beider Parteien zu einer neutralen, gemeinsamen Themen-Agenda zusammen. Führe gleiche/ähnliche Themen zusammen und liste sie als sachliche Überschriften auf, ohne zu werten.
> — *autorun:* false

> **vertrauliche_notiz:** Gibt es etwas, das du zunächst nur der mediierenden Person mitteilen möchtest (nicht der anderen Seite)?

> **gate:** Weiter geht es, sobald beide Seiten ihre Themen eingebracht und die gemeinsame Agenda gesehen haben.

### Phase 3 – Interessen

#### Ihre Bedürfnisse und Interessen  `[interessen_beduerfnisse]`

*Reflexion: interactive*

Was brauchen Sie wirklich? Hinter jeder Position steckt ein tieferes Bedürfnis. Beschreiben Sie, was Ihnen wichtig ist.

*Platzhalter:* z.B. Ich brauche Sicherheit, Verlässlichkeit, Respekt …

#### Unter die Oberfläche  `[int_eisberg]`

Das Eisberg-Modell: Was liegt unter der Wasserlinie?

> **Text:** Bisher ging es um Positionen – das, was sichtbar über der Wasserlinie liegt („Ich will X“). Darunter liegen die eigentlichen Antriebe: Bedürfnisse, Sorgen, Werte. Wenn wir diese verstehen, wird eine Lösung möglich, die für beide trägt. Dies ist meist die längste, aber wichtigste Phase – nimm dir Zeit.

> **Video:** 

> **hinweis:** Typische Interessen unter der Wasserlinie bei Trennungen: den Kontakt zu den Kindern nicht verlieren, finanzielle Sicherheit, Anerkennung des in der Beziehung Geleisteten – und die Möglichkeit eines fairen Neuanfangs.
> — *variant:* info

#### Befürchtungen und Ängste  `[interessen_aengste]`

*Reflexion: interactive*

Was befürchten Sie? Was darf auf keinen Fall passieren? Diese Informationen helfen, tragfähige Lösungen zu finden.

*Platzhalter:* z.B. Ich befürchte, dass meine Kinder darunter leiden …

#### Was steckt dahinter?  `[int_wfragen]`

W-Fragen nach dem Kern: nicht das Was, sondern das Warum.

> **Text:** Denk an einen Moment aus dem Konflikt, der dich besonders getroffen hat. Wir fragen jetzt nicht nach den Fakten, sondern nach der Bedeutung: Was war daran für dich das Schwierigste – und warum?

> **Frage:** Was ist dir bei diesen Themen wirklich wichtig – und warum? Was brauchst du, damit sich die Situation für dich gut anfühlt?

> **skala:** Wie wichtig ist dir eine Einigung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* weniger wichtig
> — *maxLabel:* sehr wichtig

> **Frage:** Was braucht dein Kind aus deiner Sicht in dieser Situation am dringendsten?

#### Kern des Konflikts  `[interessen_kern]`

*Reflexion: interactive*

Was ist Ihrer Meinung nach der eigentliche Kern dieses Konflikts? Oft steckt hinter dem sichtbaren Streit ein tieferes Thema.

*Platzhalter:* z.B. Im Kern geht es mir darum, dass ich gehört werde …

#### Vom Vorwurf zum Bedürfnis  `[int_reframing]`

Hinter jedem harten Einspruch steckt ein Bedürfnis.

> **Text:** Vorwürfe sind oft nur die laute Verpackung eines Bedürfnisses. Hinter „die halten sich an keine Regeln“ kann der Wunsch nach Sicherheit und Anerkennung der eigenen Verantwortung stehen. Was ging in dir vor, als der Konflikt eskalierte?

> **Frage:** Was ging in dir vor, als es zum Streit kam? Welche Sorge oder welches Bedürfnis steckt hinter deiner Reaktion?

> **ki_interessen:** Leite aus den geäußerten Positionen und Vorwürfen die dahinterliegenden Interessen und Bedürfnisse jeder Partei ab (z. B. Anerkennung, Sicherheit, Verlässlichkeit, Respekt, Einbindung).
> — *autorun:* false

#### Perspektivwechsel  `[int_perspektive]`

Zirkuläre Fragen: die Empathie-Brücke.

> **Text:** Jetzt kommt der entscheidende Moment: der Wechsel der Perspektive. Wenn du hörst, welche Last, welche Sorge und welches Bedürfnis die andere Seite antreibt – wie wirkt das auf dich? Oft zeigt sich: Es ging nie um die Person, sondern um eine unerfüllte Sorge.

> **Frage:** Wenn du der anderen Seite so zuhörst und ihr Bedürfnis dahinter siehst: Wie verändert das deinen Blick auf den Konflikt?

> **ki_gemeinsamkeiten:** Identifiziere gemeinsame und ergänzende Interessen beider Parteien und benenne, wo trotz des Konflikts ein gemeinsames Anliegen sichtbar wird.
> — *autorun:* false

### Phase 4 – Optionen

#### Lösungsideen sammeln  `[optionen_ideen]`

Sammeln Sie alle möglichen Lösungen – ohne Bewertung. Jede Idee ist willkommen, auch ungewöhnliche. Quantität vor Qualität.

*Platzhalter:* z.B. Eine mögliche Lösung wäre, dass …

#### Erst sammeln, nicht bewerten  `[opt_sammeln_regel]`

Die goldene Regel des Brainstormings.

> **Text:** Jetzt kennt ihr die Interessen hinter dem Streit. Darauf bauen wir Lösungen. Die wichtigste Regel: erst sammeln, dann bewerten. In diesem Abschnitt ist jede Idee erlaubt – auch ungewöhnliche. Je mehr Optionen auf dem Tisch liegen, desto größer die Chance auf eine Lösung, die für beide passt.

> **hinweis:** Noch wird nichts entschieden. Kritik und „ja, aber …“ heben wir uns für den nächsten Abschnitt auf.
> — *variant:* info

#### Kreative Optionen  `[optionen_kreativ]`

Denken Sie außerhalb gewohnter Muster. Was wäre möglich, wenn es keine Einschränkungen gäbe? Was haben andere in ähnlichen Situationen gemacht?

*Platzhalter:* z.B. Was wäre, wenn wir …

#### Ideen sammeln  `[opt_ideen]`

So viele Lösungsideen wie möglich.

> **liste:** Welche Lösungsmöglichkeiten fallen dir ein? Denk an Optionen, die auch das Bedürfnis der anderen Seite berücksichtigen.
> — *placeholder:* Eine Idee …

> **texteingabe:** Eine Idee, die beiden helfen könnte
> — *placeholder:* Beschreibe eine Lösung, bei der beide Seiten etwas Wichtiges bekommen.

> **hinweis:** Denkanstöße: Betreuungsmodelle (Wechselmodell, Residenzmodell, erweiterter Umgang), Wohnlösungen (Übernahme, Verkauf, Nestmodell), Modelle für Unterhalt und die Aufteilung von Vermögen und Schulden. Modelle, die beiden Elternteilen verlässliche Zeit mit den Kindern geben, tragen erfahrungsgemäß am längsten.
> — *variant:* info

#### Win-Win-Ansätze  `[optionen_winwin]`

Welche der gesammelten Lösungen könnten für alle Seiten akzeptabel sein? Suchen Sie nach Ideen, die mehrere Interessen gleichzeitig erfüllen.

*Platzhalter:* z.B. Beide Seiten könnten davon profitieren, wenn …

#### Auf Interessen aufbauen  `[opt_winwin]`

Aus Bedürfnissen werden Win-Win-Optionen.

> **Text:** Die besten Lösungen erfüllen die Kernbedürfnisse beider Seiten gleichzeitig – zum Beispiel schnelle Umsetzung für die eine und rechtzeitige Einbindung/Sicherheit für die andere Seite. Lass uns die Ideen daraufhin schärfen.

> **ki_optionen:** Erarbeite auf Basis der gesammelten Ideen und der zuvor ermittelten Interessen mehrere faire, umsetzbare Lösungsoptionen, die die Kernbedürfnisse beider Seiten zugleich berücksichtigen.
> — *autorun:* false

> **Frage:** Welche der Optionen erfüllt aus deiner Sicht ein wichtiges Bedürfnis der anderen Seite – ohne dir zu schaden?

### Phase 5 – Verhandlung

#### Lösungen bewerten  `[verhandlung_bewertung]`

Welche der gesammelten Optionen sind für Sie akzeptabel? Was spricht dafür, was dagegen? Begründen Sie Ihre Einschätzung.

*Platzhalter:* z.B. Option X ist für mich akzeptabel, weil … Nicht akzeptabel wäre …

#### Optionen bewerten  `[ver_bewerten]`

Jetzt wird geprüft, was wirklich trägt.

> **Text:** Nun bewertet ihr die gesammelten Optionen. Es geht nicht ums Gewinnen, sondern um eine Lösung, die für beide funktioniert und im Alltag hält.

> **ranking:** Bring die Lösungsoptionen in deine bevorzugte Reihenfolge.

> **skala:** Wie zufrieden wärst du mit deiner bevorzugten Option?
> — *min:* 1
> — *max:* 10
> — *minLabel:* gar nicht
> — *maxLabel:* voll und ganz

#### Bedingungen und Grenzen  `[verhandlung_bedingungen]`

Unter welchen Bedingungen können Sie einer Lösung zustimmen? Was sind Ihre Grenzen – also was kommt auf keinen Fall infrage?

*Platzhalter:* z.B. Ich könnte zustimmen, wenn … Nicht akzeptabel wäre auf jeden Fall …

#### Realitäts-Check & Bedingungen  `[ver_bedingungen]`

Unter welchen Bedingungen trägt die Lösung?

> **Text:** Eine Vereinbarung hält nur, wenn sie realistisch ist. Prüfe deine bevorzugte Lösung ehrlich: Was brauchst du, damit sie funktioniert – und was könntest du der anderen Seite anbieten?

> **Frage:** Unter welchen Bedingungen ist die Lösung für dich tragfähig? Was ist dein Beitrag, was brauchst du von der anderen Seite?

> **ki_gemeinsamkeiten:** Identifiziere Übereinstimmungen und verbleibende Konfliktpunkte zwischen den Parteien. Markiere klar, wo eine Einigung bereits nahe liegt und wo noch verhandelt werden muss.
> — *autorun:* false

> **Frage:** Was ist deine beste Alternative, falls ihr euch nicht einigt, z.B. ein Gerichtsverfahren? Was würde das an Zeit, Kosten und für die Kinder bedeuten?

#### Konkrete Vereinbarungen  `[verhandlung_vereinbarung]`

Welche konkreten Schritte, Regeln oder Vereinbarungen schlagen Sie vor? Je konkreter, desto besser – mit Datum, Betrag, Häufigkeit.

*Platzhalter:* z.B. Wir vereinbaren, dass ab dem 01.06. … in Höhe von … monatlich …

#### Verbindliche Vereinbarung  `[ver_vereinbarung]`

Wer macht was bis wann?

> **Text:** Aus einer guten Absicht wird erst dann eine Lösung, wenn sie konkret wird. Haltet fest: Wer macht was bis wann? Je genauer, desto verlässlicher – und desto weniger Anlass für neuen Streit.

> **texteingabe:** Konkrete Schritte (wer / was / bis wann)
> — *placeholder:* z. B.: Ich stimme neue Vorhaben künftig vorab kurz mit der anderen Seite ab – ab sofort.

> **zustimmung:** Ich bin bereit, die gemeinsam festgehaltenen Schritte verbindlich umzusetzen.

> **hinweis:** Für rechtliche Verbindlichkeit (Unterhalt, Sorge, Zugewinn) ist häufig eine notarielle Beurkundung oder anwaltliche Prüfung nötig. Diese Vereinbarung ersetzt keine Rechtsberatung.
> — *variant:* warnung

### Abschluss

#### Ergebnis der Mediation  `[abschluss_ergebnis]`

Halten Sie fest, was vereinbart wurde. Jede Vereinbarung so konkret wie möglich: Wer tut was, wann, unter welchen Bedingungen?

*Platzhalter:* z.B. Beide Parteien sind übereingekommen, dass …

#### Abschluss & Vereinbarung  `[basis_abschluss]`

Verbindlich festhalten.

> **Text:** Haltet eure Vereinbarung verbindlich fest – etwa Betreuung, Unterhalt und Wohnung.

> **Vertrag:** 
> — *template:* Trennungs- und Scheidungsfolgenvereinbarung  
  
1. Betreuung der Kinder: …  
2. Unterhalt: …  
3. Wohnung/Hausrat: …  
4. Finanzen/Vermögen: …  
  
Ort, Datum:

> **hinweis:** Für rechtliche Verbindlichkeit (z.B. Unterhalt, Sorge, Zugewinn) ist häufig eine notarielle Beurkundung oder anwaltliche Prüfung nötig. Diese Vereinbarung ersetzt keine Rechtsberatung.
> — *variant:* warnung

> **unterschrift:** 
> — *statement:* Ich bestätige die oben festgehaltene Vereinbarung.

> **Feedback:** 
> — *occasion:* before_contract

> **Frage:** Woran werdet ihr in drei Monaten merken, dass die Vereinbarung trägt – für euch und für die Kinder?

> **Terminabstimmung:** 

#### Nächste Schritte und Verantwortlichkeiten  `[abschluss_schritte]`

Wer ist für die Umsetzung verantwortlich? Was passiert, wenn eine Vereinbarung nicht eingehalten wird? Konkrete Fristen setzen.

*Platzhalter:* z.B. Bis zum … wird von … folgendes erledigt: …

#### Abschluss und Reflexion  `[abschluss_feedback]`

Wie war der Mediationsprozess für Sie? Was nehmen Sie mit? Ein bewusster Abschluss stärkt die Nachhaltigkeit der Vereinbarungen.

*Platzhalter:* z.B. Für mich war besonders hilfreich, dass … Ich nehme mit, dass …

## Variante: Evaluative Mediation (Realitätscheck)

*Der ehrliche Blick auf Zahlen und Risiken: Was kostet der Streit wirklich, wie stehen die Chancen vor Gericht, wo liegt die Einigungszone? Optionen bekommen ein Preisschild.*

### Phase 1 – Einleitung

#### Evaluative Mediation: der ehrliche Realitätscheck  `[ev_methode]`

Hier wird bewertet: Zahlen, Risiken, Chancen – unbequem ehrlich, dafür schnell.

> **Text:** In dieser Methode bleiben Mediator und KI nicht neutral zurückhaltend – sie bewerten aktiv: Wie stehen die Chancen vor Gericht? Was kostet der Streit wirklich? Welche Option hat den besten Erwartungswert? Ideal, wenn es primär um Geld, Verträge und Risiko geht.

> **akkordeon:** Die Einschätzungen sind Orientierung für die Verhandlung – sie ersetzen keine Rechtsberatung. Für eine anwaltliche Ersteinschätzung gibt es die Bonus-Leistung im Prozess.

> **zustimmung:** Ich will eine ehrliche Einschätzung – auch wenn sie unbequem ist.

### Phase 3 – Interessen

#### Was kostet der Streit?  `[ev_realitaet]`

Der Moment der Wahrheit: Streitwert, Eskalationskosten, Erfolgsaussichten – schwarz auf weiß.

> **betrag:** Um welchen Wert geht es (Streitwert)?
> — *currency:* €

> **betrag:** Geschätzte Kosten bei voller Eskalation (Anwälte, Gericht, interne Zeit, entgangene Geschäfte)
> — *currency:* €

> **skala:** Wie schätzt du deine Erfolgsaussichten vor Gericht ein?
> — *min:* 0
> — *max:* 10
> — *minLabel:* chancenlos
> — *maxLabel:* sicherer Sieg

> **vertrauliche_notiz:** Deine Schmerzgrenze: Bis zu welchem Ergebnis würdest du noch abschließen? (sieht nur der Mediator)

> **hinweis:** Psychologie (Verlustaversion): Menschen überschätzen ihre Prozesschancen systematisch und unterschätzen Dauer und Kosten. Der richtige Vergleichsmaßstab ist nicht der Sieg – sondern das wahrscheinliche Szenario nach zwei Jahren Verfahren.
> — *variant:* warning

> **ki_prompt:** Erstelle aus den Angaben beider Seiten eine nüchterne Kosten-Risiko-Gegenüberstellung: bestes, wahrscheinliches und schlechtestes Szenario je Seite (inkl. Zeit- und Beziehungskosten). Rechne vor, ab welchem Einigungswert eine Einigung für jede Seite rational besser ist als das wahrscheinliche Prozess-Szenario.
> — *autorun:* false

### Phase 4 – Optionen

#### Optionen mit Preisschild  `[ev_bewertung]`

Jede Option bekommt Risiko, Kosten und Dauer – dann wird sortiert.

> **ki_optionen:** Entwickle Lösungsoptionen und bewerte JEDE mit: Risiko (hoch/mittel/niedrig), einmalige und laufende Kosten, Umsetzungsdauer und Erwartungswert je Seite. Markiere die Option mit dem besten Erwartungswert für BEIDE Seiten und begründe kurz.
> — *autorun:* false

> **ranking:** Sortiere die bewerteten Optionen nach deiner Präferenz.

### Phase 5 – Verhandlung

#### Die Einigungszone  `[ev_zone]`

Ab jetzt wird jede Forderung am wahrscheinlichen Szenario gemessen – nicht am Wunschergebnis.

> **ki_gemeinsamkeiten:** Ermittle aus den Schmerzgrenzen und den Szenario-Rechnungen die rechnerische Einigungszone (ohne vertrauliche Grenzen offenzulegen). Benenne, ob eine Zone existiert, wie breit sie ungefähr ist und welcher Bereich für beide Seiten dem wahrscheinlichen Prozess-Szenario überlegen ist.
> — *autorun:* false

> **Text:** Regie: Jede Forderung wird ab jetzt am wahrscheinlichen Szenario gemessen – nicht am besten. Wer mehr will als die Einigungszone hergibt, verhandelt gegen die eigene Rechnung.

> **ki_optionen:** Entwickle innerhalb der Einigungszone zwei bis drei Abschluss-Optionen (z.B. Einmalzahlung vs. Raten, sofort vs. gestuft, mit/ohne künftige Zusammenarbeit) und weise für jede den Vorteil gegenüber dem wahrscheinlichen Prozess-Szenario aus.
> — *autorun:* false

> **zustimmung:** Ich verhandle auf Basis des wahrscheinlichen Szenarios weiter – nicht des besten.

### Abschluss

#### Der Vergleich  `[ev_vergleich]`

Das Ergebnis in einem Satz: schneller, günstiger und planbarer als jedes Verfahren.

> **Text:** Der Abschluss hält fest, was beide Seiten dem Verfahren voraus haben: Zeit, Kosten, Planbarkeit – und die Entscheidung lag bei euch, nicht bei einem Gericht.

> **unterschrift:** 
> — *statement:* Ich bestätige den erarbeiteten Vergleich.

## Variante: Harvard-Methode (sachbezogen zum Ja)

*Hart in der Sache, weich zu den Menschen: Interessen statt Positionen, Plan B (BATNA), Optionen-Werkstatt, objektive Kriterien – bis beide Seiten guten Gewissens Ja sagen können.*

### Phase 1 – Einleitung

#### So funktioniert die Harvard-Methode  `[hv_methode]`

Der inszenierte Einstieg: vier Prinzipien, ein Ziel – das beiderseitige Ja.

> **Text:** Willkommen zur Harvard-Methode – der weltweit meistgenutzten Verhandlungsmethode (aus „Getting to Yes“, Harvard Negotiation Project). Die Regel Nummer eins: Wir verhandeln hart in der Sache, aber weich zu den Menschen. Am Ende steht keine faule Mitte, sondern eine Lösung, zu der beide Seiten aus eigener Überzeugung Ja sagen.

> **akkordeon:** Der Konflikt ist das Problem – nicht die Person auf der anderen Seite. Vorwürfe kosten Verhandlungsmacht; wer sachlich bleibt, führt das Gespräch.

> **akkordeon:** Eine Position ist eine Forderung („Ich will 60 %“). Ein Interesse ist der Grund dahinter (Sicherheit, Anerkennung, Liquidität). Positionen kollidieren – Interessen lassen sich fast immer gleichzeitig erfüllen.

> **akkordeon:** Erst die Menge, dann die Auswahl. Wer Ideen sofort bewertet, bekommt keine mehr. In der Optionen-Werkstatt gilt deshalb: sammeln ohne Kritik – aussortiert wird später.

> **akkordeon:** Nicht wer lauter ist gewinnt, sondern was sich an neutralen Maßstäben messen lässt: Marktwert, Gutachten, Branchenstandard, Rechtsprechung.

> **zustimmung:** Ich verhandle über Interessen, nicht über Positionen – und ich bewerte Ideen erst, wenn alle auf dem Tisch liegen.

### Phase 3 – Interessen

#### Dein Plan B (BATNA)  `[hv_batna]`

Vertraulicher Realitätsanker: Wer seinen Plan B kennt, verhandelt ruhig und souverän.

> **Text:** BATNA heißt: die beste Alternative, falls es KEINE Einigung gibt (Best Alternative To a Negotiated Agreement). Sie ist dein Maßstab: Jede Einigung muss besser sein als dein Plan B – und keine darf schlechter sein. Wer seine BATNA kennt, muss nichts annehmen und nichts fürchten. Diese Angaben sieht nur der Mediator, nie die Gegenseite.

> **vertrauliche_notiz:** Was ist deine beste Alternative, wenn ihr euch NICHT einigt? (z.B. Gericht, neuer Lieferant, Verkauf, Auszug – so konkret wie möglich)

> **skala:** Wie stark ist dein Plan B wirklich?
> — *min:* 1
> — *max:* 10
> — *minLabel:* schwach / teuer
> — *maxLabel:* stark / jederzeit machbar

> **hinweis:** Psychologie: Verhandlungsmacht kommt nicht aus Lautstärke, sondern aus der Qualität deines Plan B. Und: Die Gegenseite hat auch einen – meist schlechter, als du befürchtest.
> — *variant:* info

> **ki_interessen:** Leite aus den geäußerten Positionen die dahinterliegenden Interessen jeder Partei ab. Zeige für jede Seite: die Forderung, das vermutete Interesse dahinter und ein Interesse, das beide teilen.
> — *autorun:* false

### Phase 4 – Optionen

#### Optionen-Werkstatt: erst Menge, dann Bewertung  `[hv_werkstatt]`

Brainstorm-Bühne mit KI-Verstärkung – der Kuchen wird größer, bevor er verteilt wird.

> **hinweis:** Werkstatt-Regel: Sammeln ohne Bewerten. Auch halbfertige oder verrückte Ideen zählen – Bewertungsangst ist der schnellste Weg, gute Lösungen zu verlieren.
> — *variant:* info

> **liste:** Sammle Lösungsideen – Menge vor Qualität. Was könnte den Kuchen größer machen (Zusatzleistungen, Zeitachsen, Tauschgeschäfte)?
> — *placeholder:* Idee hinzufügen …

> **ki_optionen:** Erarbeite aus den Ideen und Interessen BEIDER Seiten mindestens fünf konkrete Lösungsoptionen. Nutze unterschiedliche Prioritäten für Tauschgewinne (was der einen Seite wenig kostet und der anderen viel bringt), erweitere den Kuchen statt ihn nur zu teilen, und füge bewusst eine unkonventionelle Option hinzu. Formuliere jede Option so, dass beide Seiten ihr Interesse darin wiederfinden.
> — *autorun:* false

> **ranking:** Bringe die Optionen in DEINE Reihenfolge (die Gegenseite sieht nur das Ergebnis, nicht deine Gedanken).

### Phase 5 – Verhandlung

#### Objektive Kriterien & das Paket  `[hv_kriterien]`

Die Ja-Straße: neutrale Maßstäbe vereinbaren, Pakete schnüren, Teilzustimmungen sammeln.

> **auswahl:** Welche neutralen Maßstäbe akzeptierst du für die Bewertung?
> — *multi:* true
> — *options:* ["Marktwert / unabhängiges Gutachten", "Branchenüblicher Standard", "Rechtsprechung in vergleichbaren Fällen", "Gleichbehandlung (wie in früheren Fällen gelöst)", "Hälftige Teilung als Ausgangspunkt", "Einschätzung eines externen Experten"]

> **ki_gemeinsamkeiten:** Identifiziere aus Rankings und Kriterien-Auswahl beider Seiten, wo die Einigung bereits nahe liegt und wo die echten Reibungspunkte sind. Beginne mit den Übereinstimmungen.
> — *autorun:* false

> **ki_optionen:** Schnüre aus den am besten bewerteten Optionen zwei bis drei GESAMTPAKETE. Weise für jedes Paket aus, welches Kerninteresse jeder Seite es erfüllt und an welchem objektiven Kriterium es sich misst. Ziel: Beide Seiten können zu einem Paket ein klares Ja sagen.
> — *autorun:* false

> **zustimmung:** Ich bin bereit, auf Basis eines dieser Pakete abzuschließen, wenn es besser ist als mein Plan B.

> **hinweis:** Psychologie: Jedes kleine Ja macht das große Ja leichter (Konsistenz-Prinzip). Deshalb sammeln wir Teilzustimmungen, statt alles an einer einzigen Entscheidung hängen zu lassen.
> — *variant:* success

### Abschluss

#### Das Ja festhalten  `[hv_ja_fixieren]`

Commitment sichern: schriftlich, konkret, mit Blick nach vorn.

> **Text:** Was schriftlich festgehalten wird, hält. Nicht als Misstrauen, sondern als Psychologie: Ein dokumentiertes, selbst formuliertes Commitment wird um ein Vielfaches häufiger eingehalten als ein mündliches.

> **texteingabe:** Blick nach vorn: Was wirst du in einem Jahr über diese Lösung sagen?
> — *placeholder:* In einem Jahr …

> **unterschrift:** 
> — *statement:* Ich stehe zu der gefundenen Lösung und setze meinen Teil um.

## Variante: Shuttle-Mediation (getrennte Gespräche)

*Die Parteien treffen sich zunächst nicht: Der Mediator pendelt vertraulich zwischen den Seiten. Ideal bei hoher Eskalation, Machtgefälle oder hartem B2B-Poker.*

### Phase 1 – Einleitung

#### Shuttle-Mediation: Der Mediator pendelt  `[sh_methode]`

Getrennte Räume, volle Vertraulichkeit – die Konfrontation entfällt, die Lösung nicht.

> **Text:** In dieser Mediation sitzt ihr euch zunächst NICHT gegenüber. Jede Seite hat ihren eigenen, vertraulichen Raum – der Mediator pendelt dazwischen, übersetzt, filtert Schärfe heraus und trägt nur das weiter, was freigegeben ist. Erst wenn eine Einigung greifbar ist, kommt es zur Zusammenführung.

> **akkordeon:** Bei hoher Eskalation, wenn direkte Gespräche sofort entgleisen; bei Machtgefälle (z.B. Chef/Mitarbeiter, Konzern/Zulieferer); und im harten B2B-Verhandlungspoker, wo keine Seite ihre Karten zeigen will.

> **zustimmung:** Vertraulichkeitsregel: Nichts aus meinem Einzelgespräch geht ohne meine ausdrückliche Freigabe an die andere Seite.

### Phase 2 – Themensammlung

#### Dein vertraulicher Raum  `[sh_einzelraum]`

Hier darfst du offen sein: Nur der Mediator liest mit.

> **vertrauliche_notiz:** Was soll der Mediator wissen, was die Gegenseite (noch) nicht hören soll? (Hintergründe, Befürchtungen, rote Linien)

> **vertrauliche_notiz:** Ganz ehrlich: Was wäre dein bestes realistisches Ergebnis – und was das schlechteste, das du gerade noch akzeptieren könntest?

> **skala:** Wie viel Vertrauen hast du aktuell in eine Einigung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* keins
> — *maxLabel:* volles Vertrauen

### Phase 3 – Interessen

#### Was darf rüber?  `[sh_freigabe]`

Kontrollierte Dosierung: Deine Botschaft wird übersetzt, bevor sie die Seite wechselt.

> **texteingabe:** Deine Botschaft an die Gegenseite – der Mediator übermittelt sie.
> — *placeholder:* Was soll die andere Seite von dir hören?

> **hinweis:** Psychologie: In getrennten Räumen eskaliert nichts. Der Mediator dosiert die Information und nimmt die Schärfe heraus – so bleibt der Inhalt, aber der Stachel geht verloren.
> — *variant:* info

> **ki_reframing:** Übersetze die Botschaft in eine annehmbare, gesichtswahrende Form, ohne den Inhalt zu verfälschen. Gesichtswahrung ist die Währung der Shuttle-Mediation: Die Gegenseite muss zustimmen können, ohne als Verlierer dazustehen.
> — *autorun:* false

### Phase 4 – Optionen

#### Der Einigungskorridor  `[sh_korridor]`

Die KI ermittelt aus beiden vertraulichen Lagen, OB und WO ein Korridor existiert.

> **ki_gemeinsamkeiten:** Ermittle aus den vertraulichen Angaben beider Seiten (beste/gerade noch akzeptable Ergebnisse), OB ein Einigungskorridor existiert und WO er ungefähr liegt – OHNE vertrauliche Details oder Schmerzgrenzen offenzulegen. Formuliere nur die Überlappung in neutralen Worten.
> — *autorun:* false

> **ki_optionen:** Entwickle Lösungsoptionen INNERHALB des Einigungskorridors. Formuliere jede Option so, dass keine Seite ihr Gesicht verliert und keine als Sieger oder Verlierer dasteht. Der Vorschlag kommt vom Mediator – nicht von einer Partei.
> — *autorun:* false

> **hinweis:** Ankereffekt: Die erste genannte Zahl setzt den Rahmen der ganzen Verhandlung. Deshalb bringt hier der Mediator die Vorschläge ein – so wirkt kein einseitiger Anker.
> — *variant:* warning

### Phase 5 – Verhandlung

#### Pendel-Runden  `[sh_runden]`

Runde für Runde nähern sich die Angebote an – die KI baut Brücken, wenn es stockt.

> **Text:** Regie: Der Mediator holt in jeder Runde von beiden Seiten ein aktualisiertes Angebot ein und pendelt damit zur anderen Seite. Du entscheidest jede Runde neu – ohne Druck des direkten Gegenübers.

> **vertrauliche_notiz:** Dein aktuelles Angebot für diese Runde – und deine Schmerzgrenze (sieht nur der Mediator).

> **ki_optionen:** Die Runde stockt: Entwickle eine Brücken-Option, die genau zwischen den aktuellen Angeboten liegt, aber nicht einfach die Mitte teilt – sondern die wichtigsten Interessen beider Seiten kombiniert (z.B. mehr Betrag gegen längere Frist, Zusage gegen Garantie).
> — *autorun:* false

> **zustimmung:** Ich akzeptiere den vom Mediator vorgeschlagenen Korridor als Grundlage für die letzte Runde.

### Abschluss

#### Die Zusammenführung  `[sh_zusammenfuehrung]`

Der große Moment: Erst für das Ja kommen beide Seiten wieder an einen Tisch.

> **Text:** Jetzt – und erst jetzt – kommen beide Seiten wieder in einen gemeinsamen (virtuellen) Raum. Nicht um zu verhandeln, sondern um das gefundene Ergebnis gemeinsam zu besiegeln. Die schwere Arbeit ist getan; dieser Termin ist der Handschlag.

> **unterschrift:** 
> — *statement:* Ich bestätige das in den Pendel-Runden erarbeitete Ergebnis.

## Variante: Transformative Mediation (Beziehung zuerst)

*Erst die Menschen, dann die Sache: Empowerment und Anerkennung, Perspektivwechsel, gemeinsames Zukunftsbild – für alle, die weiter zusammenarbeiten oder Familie bleiben.*

### Phase 1 – Einleitung

#### Transformative Mediation: erst die Menschen, dann die Sache  `[tf_methode]`

Zwei Säulen tragen alles: eigene Stärke (Empowerment) und echtes Anerkennen (Recognition).

> **Text:** Diese Methode dreht die Reihenfolge um: Bevor wir über die Streitsache sprechen, stärken wir das Gespräch selbst. Denn wo Menschen weiter zusammenarbeiten oder Familie bleiben, ist die Beziehung das eigentliche Verhandlungsergebnis.

> **akkordeon:** Jede Seite gewinnt Klarheit über die eigenen Ziele, Ressourcen und Entscheidungen. Wer sich stark fühlt, muss nicht mehr laut sein.

> **akkordeon:** Die Perspektive der anderen Seite wirklich zu verstehen ist keine Schwäche, sondern der schnellste Weg, selbst verstanden zu werden.

> **zustimmung:** Ich bin bereit, der anderen Seite zuzuhören, ohne zu unterbrechen – und werde selbst ohne Unterbrechung sprechen können.

### Phase 2 – Themensammlung

#### Deine Geschichte  `[tf_geschichte]`

Kein Fragenkatalog – eine Bühne: Erzähl den Konflikt, wie du ihn erlebt hast.

> **texteingabe:** Erzähl den Konflikt als Geschichte: Wie hat es angefangen? Was war der Wendepunkt? Wo stehst du heute?
> — *placeholder:* Am Anfang …

> **video_aufnahme:** Optional: Erzähl deine Geschichte als kurze Videobotschaft – gesprochen wirkt sie oft stärker als geschrieben.

> **KI-Zusammenfassung:** Fasse die Geschichten beider Seiten wertschätzend zusammen. Hebe hervor, was jeder Seite erkennbar wichtig ist und wo sich die Erzählungen berühren. Keine Schuldzuweisungen, keine Bewertung.
> — *autorun:* false

### Phase 3 – Interessen

#### Der Perspektivwechsel  `[tf_perspektive]`

Die Königsdisziplin: Beschreibe den Konflikt so, dass die Gegenseite nicken würde.

> **Text:** Regie: Steig für zehn Minuten in die Schuhe der anderen Seite. Nicht um recht zu geben – sondern um zu verstehen, wogegen du eigentlich verhandelst.

> **texteingabe:** Beschreibe den Konflikt aus Sicht der Gegenseite – so fair und genau, dass sie nicken würde.
> — *placeholder:* Aus ihrer Sicht …

> **ki_reframing:** Vergleiche die Selbstbeschreibung jeder Seite mit der Fremdbeschreibung durch die andere. Zeige die Recognition-Momente: Wo hat eine Seite die andere bereits richtig verstanden? Formuliere diese Momente ausdrücklich als Anerkennung.
> — *autorun:* false

> **hinweis:** Psychologie: Wer die Gegenseite präzise wiedergibt, wird selbst eher gehört – Zuhören erzeugt Zuhören (Reziprozität).
> — *variant:* success

### Phase 4 – Optionen

#### Anerkennung & gemeinsame Optionen  `[tf_anerkennung]`

Aus Wertschätzung werden Optionen: Die KI verbindet Beziehung und Sachlösung.

> **texteingabe:** Nenne zwei Dinge, die du an der anderen Seite oder an eurer bisherigen Zusammenarbeit schätzt.
> — *placeholder:* 1. … 2. …

> **skala:** Wie wichtig ist dir die künftige Beziehung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* abwickeln
> — *maxLabel:* unbedingt erhalten

> **ki_optionen:** Entwickle Lösungsoptionen, die die Sachfrage lösen UND die Beziehung stärken. Beginne jede Option mit dem gemeinsamen Nutzen für die künftige Zusammenarbeit bzw. das künftige Miteinander und greife die gegenseitige Wertschätzung ausdrücklich auf.
> — *autorun:* false

### Phase 5 – Verhandlung

#### Das gemeinsame Zukunftsbild  `[tf_zukunft]`

Verhandelt wird rückwärts: erst das Bild in zwölf Monaten, dann der Weg dorthin.

> **texteingabe:** Wie sieht eine gute Zusammenarbeit / ein gutes Miteinander in zwölf Monaten konkret aus?
> — *placeholder:* In zwölf Monaten …

> **ki_gemeinsamkeiten:** Lege die Zukunftsbilder beider Seiten übereinander: Wo decken sie sich bereits? Formuliere daraus ein gemeinsames Zukunftsbild in drei Sätzen und benenne die zwei Punkte, die noch zu klären sind.
> — *autorun:* false

> **ki_optionen:** Entwickle für die noch offenen Punkte Optionen, die zum gemeinsamen Zukunftsbild passen – jede Option als konkreter erster Schritt, den beide Seiten sofort gehen könnten.
> — *autorun:* false

> **zustimmung:** Ich trage das gemeinsame Zukunftsbild mit.

### Abschluss

#### Abschluss mit Anerkennung  `[tf_ritual]`

Kein Vertragstermin, ein Ritual: Vorsatz und Wunsch besiegeln die Transformation.

> **texteingabe:** Was nimmst du dir konkret vor – und was wünschst du der anderen Seite?
> — *placeholder:* Ich nehme mir vor … / Ich wünsche dir …

> **unterschrift:** 
> — *statement:* Ich stehe zu meinem Vorsatz und zum gemeinsamen Zukunftsbild.


\newpage

# Erbschaft & Nachlass

## Standard-Workflow

### Phase 0 – Einladung

#### Ihr Start — den Erbfall sortieren  `[start_intake]`

Der geführte Einstieg: Geschichte, Fakten, Blick nach vorn.

> **Text:** Ein Erbfall bringt Trauer und Organisation auf einmal — und oft alte Familienthemen dazu. Die nächsten fünf Minuten gehören Ihrer Sicht der Dinge: ein Gespräch, keine Formular-Batterie. Wir fragen, was eine erfahrene Mediatorin im ersten Gespräch fragen würde. Alles bleibt vertraulich.

> **zustimmung:** Bevor wir starten, das Fundament jeder Mediation — vier Grundsätze: FREIWILLIGKEIT (niemand muss, alle wollen — Sie können jederzeit aussteigen). VERTRAULICHKEIT (was Sie hier schreiben, dient nur der Mediation). ALLPARTEILICHKEIT (die Mediation steht auf keiner Seite — sie steht für eine faire Lösung). ERGEBNISOFFENHEIT (die Lösung entwickeln Sie selbst, nichts wird vorgegeben). Wichtig: Mediation ersetzt keine Rechtsberatung. Ich möchte auf dieser Grundlage arbeiten.

> **Text:** Erzählen Sie zuerst frei — noch keine Bewertung, kein Urteil, keine Lösung. Erst die Geschichte, dann die Fakten, dann der Blick nach vorn.

> **Frage:** Was ist die Situation? Erzählen Sie in Ihren Worten: Wer ist verstorben, worum wird gerungen, und wie ist es dazu gekommen?
> — *map_to:* description

> **Frage:** Wer gehört zur Erbengemeinschaft — und wie stehen die Beteiligten heute zueinander?

> **Frage:** Was haben Sie schon versucht, um das zu klären — und woran ist es bisher gescheitert?

> **Text:** Jetzt die nüchternen Eckdaten. Sie helfen, den Fall richtig einzuordnen — alles Weitere klären wir später gemeinsam.

> **Datum:** Wann ist der Erbfall eingetreten?
> — *help:* Der Todestag — wichtig für Fristen (z. B. Ausschlagung).

> **auswahl:** Gibt es ein Testament oder einen Erbvertrag?
> — *options:* ["Ja, ein Testament", "Ja, einen Erbvertrag", "Nein — gesetzliche Erbfolge", "Unklar / wird noch gesucht"]
> — *multi:* false

> **Frage:** Was gehört grob zum Nachlass — Immobilien, Konten, Unternehmen, besondere Gegenstände? Eine Schätzung reicht völlig.

> **Text:** Zum Schluss drehen wir die Perspektive: weg von dem, was war — hin zu dem, was werden soll.

> **Frage:** Was brennt gerade am meisten? Wenn nur EIN Thema in den nächsten Wochen geklärt würde — welches müsste es sein?
> — *map_to:* priority
> — *placeholder:* z. B. Immobilie, Fristen, Auszahlung, Pflichtteil, Familienfrieden

> **Frage:** Gibt es Fristen oder akute Eskalationen — etwa eine drohende Ausschlagungsfrist, blockierte Konten, eingeschaltete Anwälte oder Kontaktabbruch in der Familie?

> **Frage:** Stellen Sie sich vor, in drei Monaten ist das hier gut geklärt: Woran merken Sie es zuerst — ganz konkret, im Alltag?

> **skala:** Wie zuversichtlich sind Sie heute, dass eine faire Einigung möglich ist?
> — *min:* 1
> — *max:* 10
> — *minLabel:* kaum vorstellbar
> — *maxLabel:* sehr zuversichtlich

#### Willkommen  `[basis_einladung]`

Schön, dass ihr diesen Weg gemeinsam geht.

> **Text:** Willkommen bei medipact. In einer Mediation findet ihr mit Unterstützung einer neutralen Person eigenverantwortlich eine Lösung für den Nachlass und eine faire Verteilung des Erbes. Nehmt euch für jeden Schritt in Ruhe Zeit.

> **hinweis:** Alles, was ihr hier eingebt, dient ausschließlich der Mediation und wird vertraulich behandelt.
> — *variant:* info

> **akkordeon:** Die Mediation folgt sechs Phasen: 1. Einleitung (Rahmen, Regeln, euer Ziel), 2. Themensammlung (alles auf den Tisch – ohne Wertung), 3. Interessenklärung (was hinter den Forderungen steckt), 4. Lösungsoptionen (Ideen sammeln, noch nicht bewerten), 5. Verhandlung (prüfen, was wirklich trägt) und 6. Abschluss (verbindliche Vereinbarung). Bei einer Erbschaft geht es dabei typischerweise um Immobilien, Geldvermögen, persönliche Gegenstände und offene Fragen zu Testament und Erbfolge. Ihr bestimmt das Tempo – kein Schritt wird übersprungen, aber keiner dauert länger, als ihr braucht.

> **hinweis:** Hilfreich zur Vorbereitung (nichts davon ist Pflicht): Testament oder Erbvertrag, ein grobes Nachlassverzeichnis, Kontoauszüge bzw. Grundbuchauszug und eine Liste der Gegenstände, um die es dir wirklich geht.
> — *variant:* info

### Phase 1 – Einleitung

#### Einführung  `[intro]`

Ein kurzer Einstieg ins Verfahren. Nimm dir einen Moment, bevor es losgeht.

Inhaltsarten: `"video"`

#### Willkommen  `[einl_intro]`

Ankommen und Orientierung.

> **Text:** Du bist hier, weil etwas schiefgelaufen ist. Vielleicht fühlst du Frustration, Erschöpfung, vielleicht auch Hoffnung, dass sich endlich etwas ändert. All das ist vollkommen in Ordnung.

> **Video:** 

> **Text:** Mediation gibt dir den Raum, gehört zu werden – ohne Urteil, ohne Druck. Dieser Prozess funktioniert nur, wenn alle freiwillig und in ihrem eigenen Tempo mitgehen. Nimm dir einen Moment. Atme durch.

> **akkordeon:** Erbkonflikte sind selten reine Geldkonflikte. Mit dem Nachlass kommen Trauer, alte Familienrollen und die Frage zurück, wer gesehen und anerkannt wurde. Die Mediation gibt beidem Raum: den Sachfragen der Aufteilung und dem, was zwischen euch steht. Sie kann Familienbeziehungen erhalten, wo ein Gerichtsprozess sie meist endgültig zerstört.

#### Terminvereinbarung  `[terminvereinbarung]`

Wählt gemeinsam einen Termin für das erste Gespräch.

Inhaltsarten: `"termin"`

#### Erstgespräch  `[einl_videocall]`

Das erste gemeinsame Gespräch.

> **Text:** Zum ersten Mal seid ihr alle im selben Raum – digital, aber gemeinsam. Das erste Gespräch setzt den Ton für alles, was folgt.

> **Videokonferenz:** 

> **Text:** Wenn du bereit bist, tritt dem Raum bei. Du kannst dein Mikrofon zunächst stummschalten und einfach ankommen. Es gibt keinen Druck, sofort zu reden.

#### Erstgespräch  `[videocall]`

Euer erstes gemeinsames Gespräch per Video, mit Transkript.

Inhaltsarten: `"videokonferenz"`

#### Gesprächsregeln  `[einl_regeln]`

Sicherheit durch gemeinsame Regeln.

> **Text:** In einem Konflikt verlieren wir oft das Gefühl von Kontrolle. Gemeinsame Regeln geben Sicherheit – sie schaffen den Rahmen, in dem echter Dialog erst möglich wird.

> **Video:** 

> **Frage:** Was brauchst du, damit du dich sicher genug fühlst, ehrlich zu sein? Formuliere es konkret – nicht für die andere Seite, für dich.

#### Kurzes Feedback  `[feedback_after_videocall]`

Wie war das erste Gespräch für dich?

Inhaltsarten: `"feedback"`

#### Deine Rolle  `[einl_rollen]`

Wer möchtest du in diesem Prozess sein?

> **Text:** Wir spielen in Konflikten oft Rollen, die wir nicht bewusst gewählt haben: Täter, Opfer, Retter. Hier hast du die Chance, innezuhalten und zu fragen: Wer möchte ich in diesem Prozess sein?

> **Video:** 

> **Frage:** Mach transparent, wie du dich in dieser Situation siehst – und was du von den anderen brauchst.

#### Regeln festlegen  `[einleitung]`

Jede Partei formuliert ihre Erwartungen an das Verfahren. Was ist dir wichtig? Welche Regeln sollen gelten?

*Platzhalter:* z.B. Keine Unterbrechungen, ausreden lassen …

Inhaltsarten: `"video,text"`

#### Vertrauen  `[einl_vertrauen]`

Genug Vertrauen für ehrliche Gespräche.

> **Text:** Vertrauen entsteht nicht auf Knopfdruck, besonders wenn es beschädigt wurde. Aber für diesen Prozess braucht ihr kein vollständiges Vertrauen – nur genug, um heute ehrlich sprechen zu können.

> **Video:** 

> **Frage:** Was ist dein Minimum? Was brauchst du, damit du dich wenigstens ein Stück weit öffnen kannst?

#### Rollen klären  `[einleitung_rollen]`

Welche Rolle übernimmt jede Person in dieser Mediation? Hier werden Zuständigkeiten und Erwartungen transparent gemacht.

*Platzhalter:* z.B. Ich sehe meine Rolle als …

Inhaltsarten: `"video,text"`

#### Dein Ziel  `[einl_ziel]`

Vom Problem zur Lösung.

> **Text:** Wir wissen im Konflikt oft sehr genau, was wir nicht wollen. Aber was willst du wirklich? Stell dir vor, dieser Prozess ist gelungen – wie fühlt sich das an, und was ist dann anders?

> **Video:** 

> **texteingabe:** Dein Ziel
> — *placeholder:* Formuliere dein Ziel positiv: nicht, was aufhören soll, sondern was stattdessen sein soll.

#### Vertrauen schaffen  `[einleitung_vertrauen]`

Was braucht ihr, um offen sprechen zu können? Notiert, was euch hilft, Vertrauen in den Prozess aufzubauen.

*Platzhalter:* z.B. Vertraulichkeit über alles, was hier gesprochen wird …

Inhaltsarten: `"video,text"`

#### Ziel der Mediation definieren  `[einleitung_ziel]`

Was soll am Ende dieser Mediation erreicht sein? Jede Partei formuliert ihr persönliches Ziel für den Prozess.

*Platzhalter:* z.B. Eine faire Lösung für beide Seiten finden …

Inhaltsarten: `"video,text"`

#### Reflexion vor dem Vertrag  `[feedback_before_contract]`

Kurze Einschätzung, bevor ihr den Mediationsvertrag unterzeichnet.

Inhaltsarten: `"feedback"`

#### Mediationsvertrag  `[contract]`

Der gemeinsame Mediationsvertrag zum Abschluss der Einleitungsphase.

Inhaltsarten: `"vertrag"`

### Phase 2 – Themensammlung

#### Konfliktpunkte sammeln  `[themensammlung_konflikte]`

*Reflexion: interactive*

Nennen Sie alle Themen und Streitpunkte, die in dieser Mediation geklärt werden sollen. Noch keine Bewertung – nur sammeln.

*Platzhalter:* z.B. Aufteilung der Betreuungszeiten, Unterhaltszahlungen …

#### Ankommen & Rahmen  `[themen_ankommen]`

Struktur und Entlastung: erst ordnen, dann klären.

> **Text:** Jetzt geht es um eine geordnete Bestandsaufnahme. Ziel dieses Abschnitts ist nicht, Recht zu bekommen, sondern Ordnung und Entlastung: Wir sammeln in Ruhe alle Themen, die auf den Tisch gehören – ohne sie schon zu bewerten oder zu lösen.

> **hinweis:** Wichtig: Niemand wird unterbrochen. Jede Seite bekommt gleich viel Zeit und Raum. Was dir wichtig ist, wird festgehalten und geht nicht verloren.
> — *variant:* info

> **zustimmung:** Ich bin bereit, in diesem Abschnitt erst zu sammeln und noch nicht zu diskutieren oder zu lösen.

#### Ihre Perspektive  `[themensammlung_perspektive]`

*Reflexion: interactive*

Schildern Sie Ihre persönliche Sicht auf den Konflikt. Ohne Wertung – nur Ihre Wahrnehmung der Situation.

*Platzhalter:* z.B. Ich erlebe die Situation so, dass …

#### Deine Sicht – ununterbrochen  `[themen_statement]`

Dein Eingangsstatement, das niemand unterbricht.

> **Text:** Schildere in eigenen Worten, wie du die Situation erlebst. Nimm dir so viel Raum, wie du brauchst – hier unterbricht dich niemand. Sprich aus deiner Sicht (in Ich-Form), statt der anderen Seite Vorwürfe zu machen.

> **texteingabe:** Wie erlebst du die Situation?
> — *placeholder:* Was ist passiert, was beschäftigt dich, wo hakt die Zusammenarbeit / das Miteinander gerade?

> **video_aufnahme:** Wenn du magst, sprich deine Sicht als kurze Videobotschaft ein – manchmal ist Reden leichter als Schreiben.

> **auswahl:** Worum geht es?
> — *multi:* true
> — *options:* ["Immobilie(n)", "Geldvermögen & Konten", "Persönliche Gegenstände", "Testament & Erbfolge", "Schulden & Verbindlichkeiten"]

#### Prioritäten setzen  `[themensammlung_prioritaeten]`

*Reflexion: interactive*

Welche Themen sind für Sie am dringendsten? Benennen Sie die Punkte, die zuerst geklärt werden müssen.

*Platzhalter:* z.B. Zuerst muss das Thema Wohnung geklärt werden, weil …

#### Aus Vorwurf wird Thema  `[themen_zu_themen]`

Wir filtern die Schärfe heraus und behalten die Sachthemen.

> **Text:** In der Hitze fallen schnell Vorwürfe. Für die Mediation übersetzen wir sie in sachliche Themen: Aus „der blockiert immer alles“ wird z. B. das Thema „Abstimmung von Freigaben und Abläufen“. Es geht nicht darum, wer angefangen hat, sondern worüber ihr gemeinsam sprechen wollt.

> **liste:** Welche Themen gehören für dich auf die gemeinsame Agenda? Formuliere sie möglichst neutral (Überschriften, keine Vorwürfe).
> — *placeholder:* Ein Thema, sachlich formuliert …

> **ki_reframing:** Formuliere die eingegebenen Themen und Aussagen in eine sachliche, vorwurfsfreie Sprache um. Mache aus Vorwürfen neutrale Themen-Überschriften, ohne den Inhalt zu verfälschen.
> — *autorun:* false

#### Gemeinsame Themen-Agenda  `[themen_agenda]`

Alle Themen sichtbar – nichts geht verloren.

> **Text:** Aus euren Punkten entsteht jetzt eine gemeinsame, sachliche Agenda. Wenn beide Seiten sehen, dass ihre Themen aufgenommen wurden, sinkt die Anspannung – das ist die Grundlage für die nächsten Schritte.

> **ranking:** Bring die gesammelten Themen in die Reihenfolge, in der wir sie aus deiner Sicht bearbeiten sollten.

> **KI-Zusammenfassung:** Fasse die Themen beider Parteien zu einer neutralen, gemeinsamen Themen-Agenda zusammen. Führe gleiche/ähnliche Themen zusammen und liste sie als sachliche Überschriften auf, ohne zu werten.
> — *autorun:* false

> **vertrauliche_notiz:** Gibt es etwas, das du zunächst nur der mediierenden Person mitteilen möchtest (nicht der anderen Seite)?

> **gate:** Weiter geht es, sobald beide Seiten ihre Themen eingebracht und die gemeinsame Agenda gesehen haben.

### Phase 3 – Interessen

#### Ihre Bedürfnisse und Interessen  `[interessen_beduerfnisse]`

*Reflexion: interactive*

Was brauchen Sie wirklich? Hinter jeder Position steckt ein tieferes Bedürfnis. Beschreiben Sie, was Ihnen wichtig ist.

*Platzhalter:* z.B. Ich brauche Sicherheit, Verlässlichkeit, Respekt …

#### Unter die Oberfläche  `[int_eisberg]`

Das Eisberg-Modell: Was liegt unter der Wasserlinie?

> **Text:** Bisher ging es um Positionen – das, was sichtbar über der Wasserlinie liegt („Ich will X“). Darunter liegen die eigentlichen Antriebe: Bedürfnisse, Sorgen, Werte. Wenn wir diese verstehen, wird eine Lösung möglich, die für beide trägt. Dies ist meist die längste, aber wichtigste Phase – nimm dir Zeit.

> **Video:** 

> **hinweis:** Typische Interessen unter der Wasserlinie bei Erbschaften: Erinnerungen bewahren, als gleichwertiges Familienmitglied anerkannt werden, Gerechtigkeit über die reine Erbquote hinaus – und den Familienfrieden nicht dauerhaft zu verlieren.
> — *variant:* info

#### Befürchtungen und Ängste  `[interessen_aengste]`

*Reflexion: interactive*

Was befürchten Sie? Was darf auf keinen Fall passieren? Diese Informationen helfen, tragfähige Lösungen zu finden.

*Platzhalter:* z.B. Ich befürchte, dass meine Kinder darunter leiden …

#### Was steckt dahinter?  `[int_wfragen]`

W-Fragen nach dem Kern: nicht das Was, sondern das Warum.

> **Text:** Denk an einen Moment aus dem Konflikt, der dich besonders getroffen hat. Wir fragen jetzt nicht nach den Fakten, sondern nach der Bedeutung: Was war daran für dich das Schwierigste – und warum?

> **Frage:** Was ist dir bei diesen Themen wirklich wichtig – und warum? Was brauchst du, damit sich die Situation für dich gut anfühlt?

> **skala:** Wie wichtig ist dir eine Einigung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* weniger wichtig
> — *maxLabel:* sehr wichtig

> **Frage:** Geht es dir bei den strittigen Gegenständen eher um den materiellen Wert, die Erinnerung oder um Fairness?

#### Kern des Konflikts  `[interessen_kern]`

*Reflexion: interactive*

Was ist Ihrer Meinung nach der eigentliche Kern dieses Konflikts? Oft steckt hinter dem sichtbaren Streit ein tieferes Thema.

*Platzhalter:* z.B. Im Kern geht es mir darum, dass ich gehört werde …

#### Vom Vorwurf zum Bedürfnis  `[int_reframing]`

Hinter jedem harten Einspruch steckt ein Bedürfnis.

> **Text:** Vorwürfe sind oft nur die laute Verpackung eines Bedürfnisses. Hinter „die halten sich an keine Regeln“ kann der Wunsch nach Sicherheit und Anerkennung der eigenen Verantwortung stehen. Was ging in dir vor, als der Konflikt eskalierte?

> **Frage:** Was ging in dir vor, als es zum Streit kam? Welche Sorge oder welches Bedürfnis steckt hinter deiner Reaktion?

> **ki_interessen:** Leite aus den geäußerten Positionen und Vorwürfen die dahinterliegenden Interessen und Bedürfnisse jeder Partei ab (z. B. Anerkennung, Sicherheit, Verlässlichkeit, Respekt, Einbindung).
> — *autorun:* false

#### Perspektivwechsel  `[int_perspektive]`

Zirkuläre Fragen: die Empathie-Brücke.

> **Text:** Jetzt kommt der entscheidende Moment: der Wechsel der Perspektive. Wenn du hörst, welche Last, welche Sorge und welches Bedürfnis die andere Seite antreibt – wie wirkt das auf dich? Oft zeigt sich: Es ging nie um die Person, sondern um eine unerfüllte Sorge.

> **Frage:** Wenn du der anderen Seite so zuhörst und ihr Bedürfnis dahinter siehst: Wie verändert das deinen Blick auf den Konflikt?

> **ki_gemeinsamkeiten:** Identifiziere gemeinsame und ergänzende Interessen beider Parteien und benenne, wo trotz des Konflikts ein gemeinsames Anliegen sichtbar wird.
> — *autorun:* false

### Phase 4 – Optionen

#### Lösungsideen sammeln  `[optionen_ideen]`

Sammeln Sie alle möglichen Lösungen – ohne Bewertung. Jede Idee ist willkommen, auch ungewöhnliche. Quantität vor Qualität.

*Platzhalter:* z.B. Eine mögliche Lösung wäre, dass …

#### Erst sammeln, nicht bewerten  `[opt_sammeln_regel]`

Die goldene Regel des Brainstormings.

> **Text:** Jetzt kennt ihr die Interessen hinter dem Streit. Darauf bauen wir Lösungen. Die wichtigste Regel: erst sammeln, dann bewerten. In diesem Abschnitt ist jede Idee erlaubt – auch ungewöhnliche. Je mehr Optionen auf dem Tisch liegen, desto größer die Chance auf eine Lösung, die für beide passt.

> **hinweis:** Noch wird nichts entschieden. Kritik und „ja, aber …“ heben wir uns für den nächsten Abschnitt auf.
> — *variant:* info

#### Kreative Optionen  `[optionen_kreativ]`

Denken Sie außerhalb gewohnter Muster. Was wäre möglich, wenn es keine Einschränkungen gäbe? Was haben andere in ähnlichen Situationen gemacht?

*Platzhalter:* z.B. Was wäre, wenn wir …

#### Ideen sammeln  `[opt_ideen]`

So viele Lösungsideen wie möglich.

> **liste:** Welche Lösungsmöglichkeiten fallen dir ein? Denk an Optionen, die auch das Bedürfnis der anderen Seite berücksichtigen.
> — *placeholder:* Eine Idee …

> **texteingabe:** Eine Idee, die beiden helfen könnte
> — *placeholder:* Beschreibe eine Lösung, bei der beide Seiten etwas Wichtiges bekommen.

> **hinweis:** Denkanstöße: Verkauf und Erlösteilung, Übernahme gegen Ausgleichszahlung, Tausch von Sachwerten, gemeinsame Vermietung einer Immobilie – und für Erinnerungsstücke faire Verfahren wie Losverfahren oder abwechselndes Auswählen.
> — *variant:* info

#### Win-Win-Ansätze  `[optionen_winwin]`

Welche der gesammelten Lösungen könnten für alle Seiten akzeptabel sein? Suchen Sie nach Ideen, die mehrere Interessen gleichzeitig erfüllen.

*Platzhalter:* z.B. Beide Seiten könnten davon profitieren, wenn …

#### Auf Interessen aufbauen  `[opt_winwin]`

Aus Bedürfnissen werden Win-Win-Optionen.

> **Text:** Die besten Lösungen erfüllen die Kernbedürfnisse beider Seiten gleichzeitig – zum Beispiel schnelle Umsetzung für die eine und rechtzeitige Einbindung/Sicherheit für die andere Seite. Lass uns die Ideen daraufhin schärfen.

> **ki_optionen:** Erarbeite auf Basis der gesammelten Ideen und der zuvor ermittelten Interessen mehrere faire, umsetzbare Lösungsoptionen, die die Kernbedürfnisse beider Seiten zugleich berücksichtigen.
> — *autorun:* false

> **Frage:** Welche der Optionen erfüllt aus deiner Sicht ein wichtiges Bedürfnis der anderen Seite – ohne dir zu schaden?

### Phase 5 – Verhandlung

#### Lösungen bewerten  `[verhandlung_bewertung]`

Welche der gesammelten Optionen sind für Sie akzeptabel? Was spricht dafür, was dagegen? Begründen Sie Ihre Einschätzung.

*Platzhalter:* z.B. Option X ist für mich akzeptabel, weil … Nicht akzeptabel wäre …

#### Optionen bewerten  `[ver_bewerten]`

Jetzt wird geprüft, was wirklich trägt.

> **Text:** Nun bewertet ihr die gesammelten Optionen. Es geht nicht ums Gewinnen, sondern um eine Lösung, die für beide funktioniert und im Alltag hält.

> **ranking:** Bring die Lösungsoptionen in deine bevorzugte Reihenfolge.

> **skala:** Wie zufrieden wärst du mit deiner bevorzugten Option?
> — *min:* 1
> — *max:* 10
> — *minLabel:* gar nicht
> — *maxLabel:* voll und ganz

#### Bedingungen und Grenzen  `[verhandlung_bedingungen]`

Unter welchen Bedingungen können Sie einer Lösung zustimmen? Was sind Ihre Grenzen – also was kommt auf keinen Fall infrage?

*Platzhalter:* z.B. Ich könnte zustimmen, wenn … Nicht akzeptabel wäre auf jeden Fall …

#### Realitäts-Check & Bedingungen  `[ver_bedingungen]`

Unter welchen Bedingungen trägt die Lösung?

> **Text:** Eine Vereinbarung hält nur, wenn sie realistisch ist. Prüfe deine bevorzugte Lösung ehrlich: Was brauchst du, damit sie funktioniert – und was könntest du der anderen Seite anbieten?

> **Frage:** Unter welchen Bedingungen ist die Lösung für dich tragfähig? Was ist dein Beitrag, was brauchst du von der anderen Seite?

> **ki_gemeinsamkeiten:** Identifiziere Übereinstimmungen und verbleibende Konfliktpunkte zwischen den Parteien. Markiere klar, wo eine Einigung bereits nahe liegt und wo noch verhandelt werden muss.
> — *autorun:* false

> **Frage:** Was ist deine beste Alternative ohne Einigung, z.B. eine Teilungs-versteigerung oder Erbauseinandersetzungsklage? Was würde das an Zeit, Kosten und für die Familie bedeuten?

#### Konkrete Vereinbarungen  `[verhandlung_vereinbarung]`

Welche konkreten Schritte, Regeln oder Vereinbarungen schlagen Sie vor? Je konkreter, desto besser – mit Datum, Betrag, Häufigkeit.

*Platzhalter:* z.B. Wir vereinbaren, dass ab dem 01.06. … in Höhe von … monatlich …

#### Verbindliche Vereinbarung  `[ver_vereinbarung]`

Wer macht was bis wann?

> **Text:** Aus einer guten Absicht wird erst dann eine Lösung, wenn sie konkret wird. Haltet fest: Wer macht was bis wann? Je genauer, desto verlässlicher – und desto weniger Anlass für neuen Streit.

> **texteingabe:** Konkrete Schritte (wer / was / bis wann)
> — *placeholder:* z. B.: Ich stimme neue Vorhaben künftig vorab kurz mit der anderen Seite ab – ab sofort.

> **zustimmung:** Ich bin bereit, die gemeinsam festgehaltenen Schritte verbindlich umzusetzen.

> **hinweis:** Erbauseinandersetzungen – besonders mit Immobilien – bedürfen häufig notarieller Beurkundung. Diese Vereinbarung ersetzt keine Rechtsberatung.
> — *variant:* warnung

### Abschluss

#### Ergebnis der Mediation  `[abschluss_ergebnis]`

Halten Sie fest, was vereinbart wurde. Jede Vereinbarung so konkret wie möglich: Wer tut was, wann, unter welchen Bedingungen?

*Platzhalter:* z.B. Beide Parteien sind übereingekommen, dass …

#### Abschluss & Vereinbarung  `[basis_abschluss]`

Erbauseinandersetzung festhalten.

> **Text:** Haltet die Aufteilung verbindlich fest (Erbauseinandersetzung).

> **Vertrag:** 
> — *template:* Erbauseinandersetzungsvereinbarung  
  
1. Immobilie(n): …  
2. Geldvermögen: …  
3. Persönliche Gegenstände: …  
4. Ausgleichszahlungen: …  
  
Ort, Datum:

> **hinweis:** Erbauseinandersetzungen – besonders mit Immobilien – bedürfen häufig notarieller Beurkundung. Diese Vereinbarung ersetzt keine Rechtsberatung.
> — *variant:* warnung

> **unterschrift:** 
> — *statement:* Ich bestätige die oben festgehaltene Aufteilung.

> **Feedback:** 
> — *occasion:* before_contract

> **Frage:** Woran werdet ihr als Familie merken, dass diese Lösung Bestand hat – auch beim nächsten Familientreffen?

> **Terminabstimmung:** 

#### Nächste Schritte und Verantwortlichkeiten  `[abschluss_schritte]`

Wer ist für die Umsetzung verantwortlich? Was passiert, wenn eine Vereinbarung nicht eingehalten wird? Konkrete Fristen setzen.

*Platzhalter:* z.B. Bis zum … wird von … folgendes erledigt: …

#### Abschluss und Reflexion  `[abschluss_feedback]`

Wie war der Mediationsprozess für Sie? Was nehmen Sie mit? Ein bewusster Abschluss stärkt die Nachhaltigkeit der Vereinbarungen.

*Platzhalter:* z.B. Für mich war besonders hilfreich, dass … Ich nehme mit, dass …

## Variante: Evaluative Mediation (Realitätscheck)

*Der ehrliche Blick auf Zahlen und Risiken: Was kostet der Streit wirklich, wie stehen die Chancen vor Gericht, wo liegt die Einigungszone? Optionen bekommen ein Preisschild.*

### Phase 1 – Einleitung

#### Evaluative Mediation: der ehrliche Realitätscheck  `[ev_methode]`

Hier wird bewertet: Zahlen, Risiken, Chancen – unbequem ehrlich, dafür schnell.

> **Text:** In dieser Methode bleiben Mediator und KI nicht neutral zurückhaltend – sie bewerten aktiv: Wie stehen die Chancen vor Gericht? Was kostet der Streit wirklich? Welche Option hat den besten Erwartungswert? Ideal, wenn es primär um Geld, Verträge und Risiko geht.

> **akkordeon:** Die Einschätzungen sind Orientierung für die Verhandlung – sie ersetzen keine Rechtsberatung. Für eine anwaltliche Ersteinschätzung gibt es die Bonus-Leistung im Prozess.

> **zustimmung:** Ich will eine ehrliche Einschätzung – auch wenn sie unbequem ist.

### Phase 3 – Interessen

#### Was kostet der Streit?  `[ev_realitaet]`

Der Moment der Wahrheit: Streitwert, Eskalationskosten, Erfolgsaussichten – schwarz auf weiß.

> **betrag:** Um welchen Wert geht es (Streitwert)?
> — *currency:* €

> **betrag:** Geschätzte Kosten bei voller Eskalation (Anwälte, Gericht, interne Zeit, entgangene Geschäfte)
> — *currency:* €

> **skala:** Wie schätzt du deine Erfolgsaussichten vor Gericht ein?
> — *min:* 0
> — *max:* 10
> — *minLabel:* chancenlos
> — *maxLabel:* sicherer Sieg

> **vertrauliche_notiz:** Deine Schmerzgrenze: Bis zu welchem Ergebnis würdest du noch abschließen? (sieht nur der Mediator)

> **hinweis:** Psychologie (Verlustaversion): Menschen überschätzen ihre Prozesschancen systematisch und unterschätzen Dauer und Kosten. Der richtige Vergleichsmaßstab ist nicht der Sieg – sondern das wahrscheinliche Szenario nach zwei Jahren Verfahren.
> — *variant:* warning

> **ki_prompt:** Erstelle aus den Angaben beider Seiten eine nüchterne Kosten-Risiko-Gegenüberstellung: bestes, wahrscheinliches und schlechtestes Szenario je Seite (inkl. Zeit- und Beziehungskosten). Rechne vor, ab welchem Einigungswert eine Einigung für jede Seite rational besser ist als das wahrscheinliche Prozess-Szenario.
> — *autorun:* false

### Phase 4 – Optionen

#### Optionen mit Preisschild  `[ev_bewertung]`

Jede Option bekommt Risiko, Kosten und Dauer – dann wird sortiert.

> **ki_optionen:** Entwickle Lösungsoptionen und bewerte JEDE mit: Risiko (hoch/mittel/niedrig), einmalige und laufende Kosten, Umsetzungsdauer und Erwartungswert je Seite. Markiere die Option mit dem besten Erwartungswert für BEIDE Seiten und begründe kurz.
> — *autorun:* false

> **ranking:** Sortiere die bewerteten Optionen nach deiner Präferenz.

### Phase 5 – Verhandlung

#### Die Einigungszone  `[ev_zone]`

Ab jetzt wird jede Forderung am wahrscheinlichen Szenario gemessen – nicht am Wunschergebnis.

> **ki_gemeinsamkeiten:** Ermittle aus den Schmerzgrenzen und den Szenario-Rechnungen die rechnerische Einigungszone (ohne vertrauliche Grenzen offenzulegen). Benenne, ob eine Zone existiert, wie breit sie ungefähr ist und welcher Bereich für beide Seiten dem wahrscheinlichen Prozess-Szenario überlegen ist.
> — *autorun:* false

> **Text:** Regie: Jede Forderung wird ab jetzt am wahrscheinlichen Szenario gemessen – nicht am besten. Wer mehr will als die Einigungszone hergibt, verhandelt gegen die eigene Rechnung.

> **ki_optionen:** Entwickle innerhalb der Einigungszone zwei bis drei Abschluss-Optionen (z.B. Einmalzahlung vs. Raten, sofort vs. gestuft, mit/ohne künftige Zusammenarbeit) und weise für jede den Vorteil gegenüber dem wahrscheinlichen Prozess-Szenario aus.
> — *autorun:* false

> **zustimmung:** Ich verhandle auf Basis des wahrscheinlichen Szenarios weiter – nicht des besten.

### Abschluss

#### Der Vergleich  `[ev_vergleich]`

Das Ergebnis in einem Satz: schneller, günstiger und planbarer als jedes Verfahren.

> **Text:** Der Abschluss hält fest, was beide Seiten dem Verfahren voraus haben: Zeit, Kosten, Planbarkeit – und die Entscheidung lag bei euch, nicht bei einem Gericht.

> **unterschrift:** 
> — *statement:* Ich bestätige den erarbeiteten Vergleich.

## Variante: Harvard-Methode (sachbezogen zum Ja)

*Hart in der Sache, weich zu den Menschen: Interessen statt Positionen, Plan B (BATNA), Optionen-Werkstatt, objektive Kriterien – bis beide Seiten guten Gewissens Ja sagen können.*

### Phase 1 – Einleitung

#### So funktioniert die Harvard-Methode  `[hv_methode]`

Der inszenierte Einstieg: vier Prinzipien, ein Ziel – das beiderseitige Ja.

> **Text:** Willkommen zur Harvard-Methode – der weltweit meistgenutzten Verhandlungsmethode (aus „Getting to Yes“, Harvard Negotiation Project). Die Regel Nummer eins: Wir verhandeln hart in der Sache, aber weich zu den Menschen. Am Ende steht keine faule Mitte, sondern eine Lösung, zu der beide Seiten aus eigener Überzeugung Ja sagen.

> **akkordeon:** Der Konflikt ist das Problem – nicht die Person auf der anderen Seite. Vorwürfe kosten Verhandlungsmacht; wer sachlich bleibt, führt das Gespräch.

> **akkordeon:** Eine Position ist eine Forderung („Ich will 60 %“). Ein Interesse ist der Grund dahinter (Sicherheit, Anerkennung, Liquidität). Positionen kollidieren – Interessen lassen sich fast immer gleichzeitig erfüllen.

> **akkordeon:** Erst die Menge, dann die Auswahl. Wer Ideen sofort bewertet, bekommt keine mehr. In der Optionen-Werkstatt gilt deshalb: sammeln ohne Kritik – aussortiert wird später.

> **akkordeon:** Nicht wer lauter ist gewinnt, sondern was sich an neutralen Maßstäben messen lässt: Marktwert, Gutachten, Branchenstandard, Rechtsprechung.

> **zustimmung:** Ich verhandle über Interessen, nicht über Positionen – und ich bewerte Ideen erst, wenn alle auf dem Tisch liegen.

### Phase 3 – Interessen

#### Dein Plan B (BATNA)  `[hv_batna]`

Vertraulicher Realitätsanker: Wer seinen Plan B kennt, verhandelt ruhig und souverän.

> **Text:** BATNA heißt: die beste Alternative, falls es KEINE Einigung gibt (Best Alternative To a Negotiated Agreement). Sie ist dein Maßstab: Jede Einigung muss besser sein als dein Plan B – und keine darf schlechter sein. Wer seine BATNA kennt, muss nichts annehmen und nichts fürchten. Diese Angaben sieht nur der Mediator, nie die Gegenseite.

> **vertrauliche_notiz:** Was ist deine beste Alternative, wenn ihr euch NICHT einigt? (z.B. Gericht, neuer Lieferant, Verkauf, Auszug – so konkret wie möglich)

> **skala:** Wie stark ist dein Plan B wirklich?
> — *min:* 1
> — *max:* 10
> — *minLabel:* schwach / teuer
> — *maxLabel:* stark / jederzeit machbar

> **hinweis:** Psychologie: Verhandlungsmacht kommt nicht aus Lautstärke, sondern aus der Qualität deines Plan B. Und: Die Gegenseite hat auch einen – meist schlechter, als du befürchtest.
> — *variant:* info

> **ki_interessen:** Leite aus den geäußerten Positionen die dahinterliegenden Interessen jeder Partei ab. Zeige für jede Seite: die Forderung, das vermutete Interesse dahinter und ein Interesse, das beide teilen.
> — *autorun:* false

### Phase 4 – Optionen

#### Optionen-Werkstatt: erst Menge, dann Bewertung  `[hv_werkstatt]`

Brainstorm-Bühne mit KI-Verstärkung – der Kuchen wird größer, bevor er verteilt wird.

> **hinweis:** Werkstatt-Regel: Sammeln ohne Bewerten. Auch halbfertige oder verrückte Ideen zählen – Bewertungsangst ist der schnellste Weg, gute Lösungen zu verlieren.
> — *variant:* info

> **liste:** Sammle Lösungsideen – Menge vor Qualität. Was könnte den Kuchen größer machen (Zusatzleistungen, Zeitachsen, Tauschgeschäfte)?
> — *placeholder:* Idee hinzufügen …

> **ki_optionen:** Erarbeite aus den Ideen und Interessen BEIDER Seiten mindestens fünf konkrete Lösungsoptionen. Nutze unterschiedliche Prioritäten für Tauschgewinne (was der einen Seite wenig kostet und der anderen viel bringt), erweitere den Kuchen statt ihn nur zu teilen, und füge bewusst eine unkonventionelle Option hinzu. Formuliere jede Option so, dass beide Seiten ihr Interesse darin wiederfinden.
> — *autorun:* false

> **ranking:** Bringe die Optionen in DEINE Reihenfolge (die Gegenseite sieht nur das Ergebnis, nicht deine Gedanken).

### Phase 5 – Verhandlung

#### Objektive Kriterien & das Paket  `[hv_kriterien]`

Die Ja-Straße: neutrale Maßstäbe vereinbaren, Pakete schnüren, Teilzustimmungen sammeln.

> **auswahl:** Welche neutralen Maßstäbe akzeptierst du für die Bewertung?
> — *multi:* true
> — *options:* ["Marktwert / unabhängiges Gutachten", "Branchenüblicher Standard", "Rechtsprechung in vergleichbaren Fällen", "Gleichbehandlung (wie in früheren Fällen gelöst)", "Hälftige Teilung als Ausgangspunkt", "Einschätzung eines externen Experten"]

> **ki_gemeinsamkeiten:** Identifiziere aus Rankings und Kriterien-Auswahl beider Seiten, wo die Einigung bereits nahe liegt und wo die echten Reibungspunkte sind. Beginne mit den Übereinstimmungen.
> — *autorun:* false

> **ki_optionen:** Schnüre aus den am besten bewerteten Optionen zwei bis drei GESAMTPAKETE. Weise für jedes Paket aus, welches Kerninteresse jeder Seite es erfüllt und an welchem objektiven Kriterium es sich misst. Ziel: Beide Seiten können zu einem Paket ein klares Ja sagen.
> — *autorun:* false

> **zustimmung:** Ich bin bereit, auf Basis eines dieser Pakete abzuschließen, wenn es besser ist als mein Plan B.

> **hinweis:** Psychologie: Jedes kleine Ja macht das große Ja leichter (Konsistenz-Prinzip). Deshalb sammeln wir Teilzustimmungen, statt alles an einer einzigen Entscheidung hängen zu lassen.
> — *variant:* success

### Abschluss

#### Das Ja festhalten  `[hv_ja_fixieren]`

Commitment sichern: schriftlich, konkret, mit Blick nach vorn.

> **Text:** Was schriftlich festgehalten wird, hält. Nicht als Misstrauen, sondern als Psychologie: Ein dokumentiertes, selbst formuliertes Commitment wird um ein Vielfaches häufiger eingehalten als ein mündliches.

> **texteingabe:** Blick nach vorn: Was wirst du in einem Jahr über diese Lösung sagen?
> — *placeholder:* In einem Jahr …

> **unterschrift:** 
> — *statement:* Ich stehe zu der gefundenen Lösung und setze meinen Teil um.

## Variante: Shuttle-Mediation (getrennte Gespräche)

*Die Parteien treffen sich zunächst nicht: Der Mediator pendelt vertraulich zwischen den Seiten. Ideal bei hoher Eskalation, Machtgefälle oder hartem B2B-Poker.*

### Phase 1 – Einleitung

#### Shuttle-Mediation: Der Mediator pendelt  `[sh_methode]`

Getrennte Räume, volle Vertraulichkeit – die Konfrontation entfällt, die Lösung nicht.

> **Text:** In dieser Mediation sitzt ihr euch zunächst NICHT gegenüber. Jede Seite hat ihren eigenen, vertraulichen Raum – der Mediator pendelt dazwischen, übersetzt, filtert Schärfe heraus und trägt nur das weiter, was freigegeben ist. Erst wenn eine Einigung greifbar ist, kommt es zur Zusammenführung.

> **akkordeon:** Bei hoher Eskalation, wenn direkte Gespräche sofort entgleisen; bei Machtgefälle (z.B. Chef/Mitarbeiter, Konzern/Zulieferer); und im harten B2B-Verhandlungspoker, wo keine Seite ihre Karten zeigen will.

> **zustimmung:** Vertraulichkeitsregel: Nichts aus meinem Einzelgespräch geht ohne meine ausdrückliche Freigabe an die andere Seite.

### Phase 2 – Themensammlung

#### Dein vertraulicher Raum  `[sh_einzelraum]`

Hier darfst du offen sein: Nur der Mediator liest mit.

> **vertrauliche_notiz:** Was soll der Mediator wissen, was die Gegenseite (noch) nicht hören soll? (Hintergründe, Befürchtungen, rote Linien)

> **vertrauliche_notiz:** Ganz ehrlich: Was wäre dein bestes realistisches Ergebnis – und was das schlechteste, das du gerade noch akzeptieren könntest?

> **skala:** Wie viel Vertrauen hast du aktuell in eine Einigung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* keins
> — *maxLabel:* volles Vertrauen

### Phase 3 – Interessen

#### Was darf rüber?  `[sh_freigabe]`

Kontrollierte Dosierung: Deine Botschaft wird übersetzt, bevor sie die Seite wechselt.

> **texteingabe:** Deine Botschaft an die Gegenseite – der Mediator übermittelt sie.
> — *placeholder:* Was soll die andere Seite von dir hören?

> **hinweis:** Psychologie: In getrennten Räumen eskaliert nichts. Der Mediator dosiert die Information und nimmt die Schärfe heraus – so bleibt der Inhalt, aber der Stachel geht verloren.
> — *variant:* info

> **ki_reframing:** Übersetze die Botschaft in eine annehmbare, gesichtswahrende Form, ohne den Inhalt zu verfälschen. Gesichtswahrung ist die Währung der Shuttle-Mediation: Die Gegenseite muss zustimmen können, ohne als Verlierer dazustehen.
> — *autorun:* false

### Phase 4 – Optionen

#### Der Einigungskorridor  `[sh_korridor]`

Die KI ermittelt aus beiden vertraulichen Lagen, OB und WO ein Korridor existiert.

> **ki_gemeinsamkeiten:** Ermittle aus den vertraulichen Angaben beider Seiten (beste/gerade noch akzeptable Ergebnisse), OB ein Einigungskorridor existiert und WO er ungefähr liegt – OHNE vertrauliche Details oder Schmerzgrenzen offenzulegen. Formuliere nur die Überlappung in neutralen Worten.
> — *autorun:* false

> **ki_optionen:** Entwickle Lösungsoptionen INNERHALB des Einigungskorridors. Formuliere jede Option so, dass keine Seite ihr Gesicht verliert und keine als Sieger oder Verlierer dasteht. Der Vorschlag kommt vom Mediator – nicht von einer Partei.
> — *autorun:* false

> **hinweis:** Ankereffekt: Die erste genannte Zahl setzt den Rahmen der ganzen Verhandlung. Deshalb bringt hier der Mediator die Vorschläge ein – so wirkt kein einseitiger Anker.
> — *variant:* warning

### Phase 5 – Verhandlung

#### Pendel-Runden  `[sh_runden]`

Runde für Runde nähern sich die Angebote an – die KI baut Brücken, wenn es stockt.

> **Text:** Regie: Der Mediator holt in jeder Runde von beiden Seiten ein aktualisiertes Angebot ein und pendelt damit zur anderen Seite. Du entscheidest jede Runde neu – ohne Druck des direkten Gegenübers.

> **vertrauliche_notiz:** Dein aktuelles Angebot für diese Runde – und deine Schmerzgrenze (sieht nur der Mediator).

> **ki_optionen:** Die Runde stockt: Entwickle eine Brücken-Option, die genau zwischen den aktuellen Angeboten liegt, aber nicht einfach die Mitte teilt – sondern die wichtigsten Interessen beider Seiten kombiniert (z.B. mehr Betrag gegen längere Frist, Zusage gegen Garantie).
> — *autorun:* false

> **zustimmung:** Ich akzeptiere den vom Mediator vorgeschlagenen Korridor als Grundlage für die letzte Runde.

### Abschluss

#### Die Zusammenführung  `[sh_zusammenfuehrung]`

Der große Moment: Erst für das Ja kommen beide Seiten wieder an einen Tisch.

> **Text:** Jetzt – und erst jetzt – kommen beide Seiten wieder in einen gemeinsamen (virtuellen) Raum. Nicht um zu verhandeln, sondern um das gefundene Ergebnis gemeinsam zu besiegeln. Die schwere Arbeit ist getan; dieser Termin ist der Handschlag.

> **unterschrift:** 
> — *statement:* Ich bestätige das in den Pendel-Runden erarbeitete Ergebnis.

## Variante: Transformative Mediation (Beziehung zuerst)

*Erst die Menschen, dann die Sache: Empowerment und Anerkennung, Perspektivwechsel, gemeinsames Zukunftsbild – für alle, die weiter zusammenarbeiten oder Familie bleiben.*

### Phase 1 – Einleitung

#### Transformative Mediation: erst die Menschen, dann die Sache  `[tf_methode]`

Zwei Säulen tragen alles: eigene Stärke (Empowerment) und echtes Anerkennen (Recognition).

> **Text:** Diese Methode dreht die Reihenfolge um: Bevor wir über die Streitsache sprechen, stärken wir das Gespräch selbst. Denn wo Menschen weiter zusammenarbeiten oder Familie bleiben, ist die Beziehung das eigentliche Verhandlungsergebnis.

> **akkordeon:** Jede Seite gewinnt Klarheit über die eigenen Ziele, Ressourcen und Entscheidungen. Wer sich stark fühlt, muss nicht mehr laut sein.

> **akkordeon:** Die Perspektive der anderen Seite wirklich zu verstehen ist keine Schwäche, sondern der schnellste Weg, selbst verstanden zu werden.

> **zustimmung:** Ich bin bereit, der anderen Seite zuzuhören, ohne zu unterbrechen – und werde selbst ohne Unterbrechung sprechen können.

### Phase 2 – Themensammlung

#### Deine Geschichte  `[tf_geschichte]`

Kein Fragenkatalog – eine Bühne: Erzähl den Konflikt, wie du ihn erlebt hast.

> **texteingabe:** Erzähl den Konflikt als Geschichte: Wie hat es angefangen? Was war der Wendepunkt? Wo stehst du heute?
> — *placeholder:* Am Anfang …

> **video_aufnahme:** Optional: Erzähl deine Geschichte als kurze Videobotschaft – gesprochen wirkt sie oft stärker als geschrieben.

> **KI-Zusammenfassung:** Fasse die Geschichten beider Seiten wertschätzend zusammen. Hebe hervor, was jeder Seite erkennbar wichtig ist und wo sich die Erzählungen berühren. Keine Schuldzuweisungen, keine Bewertung.
> — *autorun:* false

### Phase 3 – Interessen

#### Der Perspektivwechsel  `[tf_perspektive]`

Die Königsdisziplin: Beschreibe den Konflikt so, dass die Gegenseite nicken würde.

> **Text:** Regie: Steig für zehn Minuten in die Schuhe der anderen Seite. Nicht um recht zu geben – sondern um zu verstehen, wogegen du eigentlich verhandelst.

> **texteingabe:** Beschreibe den Konflikt aus Sicht der Gegenseite – so fair und genau, dass sie nicken würde.
> — *placeholder:* Aus ihrer Sicht …

> **ki_reframing:** Vergleiche die Selbstbeschreibung jeder Seite mit der Fremdbeschreibung durch die andere. Zeige die Recognition-Momente: Wo hat eine Seite die andere bereits richtig verstanden? Formuliere diese Momente ausdrücklich als Anerkennung.
> — *autorun:* false

> **hinweis:** Psychologie: Wer die Gegenseite präzise wiedergibt, wird selbst eher gehört – Zuhören erzeugt Zuhören (Reziprozität).
> — *variant:* success

### Phase 4 – Optionen

#### Anerkennung & gemeinsame Optionen  `[tf_anerkennung]`

Aus Wertschätzung werden Optionen: Die KI verbindet Beziehung und Sachlösung.

> **texteingabe:** Nenne zwei Dinge, die du an der anderen Seite oder an eurer bisherigen Zusammenarbeit schätzt.
> — *placeholder:* 1. … 2. …

> **skala:** Wie wichtig ist dir die künftige Beziehung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* abwickeln
> — *maxLabel:* unbedingt erhalten

> **ki_optionen:** Entwickle Lösungsoptionen, die die Sachfrage lösen UND die Beziehung stärken. Beginne jede Option mit dem gemeinsamen Nutzen für die künftige Zusammenarbeit bzw. das künftige Miteinander und greife die gegenseitige Wertschätzung ausdrücklich auf.
> — *autorun:* false

### Phase 5 – Verhandlung

#### Das gemeinsame Zukunftsbild  `[tf_zukunft]`

Verhandelt wird rückwärts: erst das Bild in zwölf Monaten, dann der Weg dorthin.

> **texteingabe:** Wie sieht eine gute Zusammenarbeit / ein gutes Miteinander in zwölf Monaten konkret aus?
> — *placeholder:* In zwölf Monaten …

> **ki_gemeinsamkeiten:** Lege die Zukunftsbilder beider Seiten übereinander: Wo decken sie sich bereits? Formuliere daraus ein gemeinsames Zukunftsbild in drei Sätzen und benenne die zwei Punkte, die noch zu klären sind.
> — *autorun:* false

> **ki_optionen:** Entwickle für die noch offenen Punkte Optionen, die zum gemeinsamen Zukunftsbild passen – jede Option als konkreter erster Schritt, den beide Seiten sofort gehen könnten.
> — *autorun:* false

> **zustimmung:** Ich trage das gemeinsame Zukunftsbild mit.

### Abschluss

#### Abschluss mit Anerkennung  `[tf_ritual]`

Kein Vertragstermin, ein Ritual: Vorsatz und Wunsch besiegeln die Transformation.

> **texteingabe:** Was nimmst du dir konkret vor – und was wünschst du der anderen Seite?
> — *placeholder:* Ich nehme mir vor … / Ich wünsche dir …

> **unterschrift:** 
> — *statement:* Ich stehe zu meinem Vorsatz und zum gemeinsamen Zukunftsbild.


\newpage

# Nachbarschaft

## Standard-Workflow

### Phase 0 – Einladung

#### Ihr Start — den Konflikt sortieren  `[start_intake]`

Der geführte Einstieg: Geschichte, Fakten, Blick nach vorn.

> **Text:** Ein Nachbarschaftskonflikt wohnt nebenan — man begegnet sich jeden Tag. Umso wichtiger, ihn gut zu lösen. Die nächsten fünf Minuten gehören Ihrer Sicht: ein Gespräch, keine Formular-Batterie. Wir fragen, was eine erfahrene Mediatorin im ersten Gespräch fragen würde. Alles bleibt vertraulich.

> **zustimmung:** Bevor wir starten, das Fundament jeder Mediation — vier Grundsätze: FREIWILLIGKEIT (niemand muss, alle wollen — Sie können jederzeit aussteigen). VERTRAULICHKEIT (was Sie hier schreiben, dient nur der Mediation). ALLPARTEILICHKEIT (die Mediation steht auf keiner Seite — sie steht für eine faire Lösung). ERGEBNISOFFENHEIT (die Lösung entwickeln Sie selbst, nichts wird vorgegeben). Wichtig: Mediation ersetzt keine Rechtsberatung. Ich möchte auf dieser Grundlage arbeiten.

> **Text:** Erzählen Sie zuerst frei — noch keine Bewertung, kein Urteil, keine Lösung. Erst die Geschichte, dann die Fakten, dann der Blick nach vorn.

> **Frage:** Was ist vorgefallen? Erzählen Sie die Geschichte in Ihren Worten — gern auch, wie es angefangen hat.
> — *map_to:* description

> **Frage:** Wer ist beteiligt — nur Sie und die Nachbarn, oder auch Vermieter, Verwaltung, weitere Parteien?

> **Frage:** Was haben Sie schon versucht, um das zu klären — und woran ist es bisher gescheitert?

> **Text:** Jetzt die nüchternen Eckdaten. Sie helfen, den Fall richtig einzuordnen — alles Weitere klären wir später gemeinsam.

> **Frage:** Seit wann schwelt der Konflikt — und gab es einen konkreten Auslöser?

> **auswahl:** Worum geht es hauptsächlich?
> — *options:* ["Lärm", "Grenze / Zaun", "Bäume / Hecke / Garten", "Zuwegung / Parken", "Bauvorhaben", "Tiere", "Sonstiges"]
> — *multi:* true

> **auswahl:** Wie ist der Kontakt heute?
> — *options:* ["Wir reden noch normal miteinander", "Nur noch das Nötigste", "Funkstille", "Behörden oder Anwälte sind schon eingeschaltet"]
> — *multi:* false

> **Text:** Zum Schluss drehen wir die Perspektive: weg von dem, was war — hin zu dem, was werden soll.

> **Frage:** Was brennt gerade am meisten? Wenn nur EIN Thema in den nächsten Wochen geklärt würde — welches müsste es sein?
> — *map_to:* priority
> — *placeholder:* z. B. nachts endlich Ruhe, die Grenzfrage, das nächste Gespräch

> **Frage:** Gibt es akute Eskalationen — Anzeigen, Beschädigungen, Drohungen, laufende Verfahren?

> **Frage:** Stellen Sie sich vor, in drei Monaten ist das hier gut geklärt: Woran merken Sie es zuerst — ganz konkret, im Alltag?

> **skala:** Wie zuversichtlich sind Sie heute, dass eine faire Einigung möglich ist?
> — *min:* 1
> — *max:* 10
> — *minLabel:* kaum vorstellbar
> — *maxLabel:* sehr zuversichtlich

#### Willkommen  `[basis_einladung]`

Schön, dass ihr diesen Weg gemeinsam geht.

> **Text:** Willkommen bei medipact. In einer Mediation findet ihr mit Unterstützung einer neutralen Person eigenverantwortlich eine Lösung für euren Nachbarschaftskonflikt. Nehmt euch für jeden Schritt in Ruhe Zeit.

> **hinweis:** Alles, was ihr hier eingebt, dient ausschließlich der Mediation und wird vertraulich behandelt.
> — *variant:* info

> **akkordeon:** Die Mediation folgt sechs Phasen: 1. Einleitung (Rahmen, Regeln, euer Ziel), 2. Themensammlung (alles auf den Tisch – ohne Wertung), 3. Interessenklärung (was hinter den Forderungen steckt), 4. Lösungsoptionen (Ideen sammeln, noch nicht bewerten), 5. Verhandlung (prüfen, was wirklich trägt) und 6. Abschluss (verbindliche Vereinbarung). Bei einem Nachbarschaftskonflikt geht es dabei typischerweise um Lärm, Grenzen, Pflanzen, Wege oder Haustiere. Ihr bestimmt das Tempo – kein Schritt wird übersprungen, aber keiner dauert länger, als ihr braucht.

> **hinweis:** Hilfreich zur Vorbereitung: kurze Notizen zu konkreten Vorfällen (was, wann, wie oft), ggf. Fotos oder ein Lageplan. Wichtig: Es geht nicht um eine Beweissammlung fürs Rechthaben, sondern darum, dass die andere Seite versteht, was dich belastet.
> — *variant:* info

### Phase 1 – Einleitung

#### Einführung  `[intro]`

Ein kurzer Einstieg ins Verfahren. Nimm dir einen Moment, bevor es losgeht.

Inhaltsarten: `"video"`

#### Willkommen  `[einl_intro]`

Ankommen und Orientierung.

> **Text:** Du bist hier, weil etwas schiefgelaufen ist. Vielleicht fühlst du Frustration, Erschöpfung, vielleicht auch Hoffnung, dass sich endlich etwas ändert. All das ist vollkommen in Ordnung.

> **Video:** 

> **Text:** Mediation gibt dir den Raum, gehört zu werden – ohne Urteil, ohne Druck. Dieser Prozess funktioniert nur, wenn alle freiwillig und in ihrem eigenen Tempo mitgehen. Nimm dir einen Moment. Atme durch.

> **akkordeon:** Ihr begegnet euch auch morgen wieder – am Zaun, im Treppenhaus, auf der Straße. Ziel der Mediation ist deshalb kein Sieg und auch keine Freundschaft, sondern ein entspannter Alltag. Erfahrungsgemäß wirken wenige, konkrete Absprachen mehr als große Grundsatzklärungen.

#### Terminvereinbarung  `[terminvereinbarung]`

Wählt gemeinsam einen Termin für das erste Gespräch.

Inhaltsarten: `"termin"`

#### Erstgespräch  `[einl_videocall]`

Das erste gemeinsame Gespräch.

> **Text:** Zum ersten Mal seid ihr alle im selben Raum – digital, aber gemeinsam. Das erste Gespräch setzt den Ton für alles, was folgt.

> **Videokonferenz:** 

> **Text:** Wenn du bereit bist, tritt dem Raum bei. Du kannst dein Mikrofon zunächst stummschalten und einfach ankommen. Es gibt keinen Druck, sofort zu reden.

#### Erstgespräch  `[videocall]`

Euer erstes gemeinsames Gespräch per Video, mit Transkript.

Inhaltsarten: `"videokonferenz"`

#### Gesprächsregeln  `[einl_regeln]`

Sicherheit durch gemeinsame Regeln.

> **Text:** In einem Konflikt verlieren wir oft das Gefühl von Kontrolle. Gemeinsame Regeln geben Sicherheit – sie schaffen den Rahmen, in dem echter Dialog erst möglich wird.

> **Video:** 

> **Frage:** Was brauchst du, damit du dich sicher genug fühlst, ehrlich zu sein? Formuliere es konkret – nicht für die andere Seite, für dich.

#### Kurzes Feedback  `[feedback_after_videocall]`

Wie war das erste Gespräch für dich?

Inhaltsarten: `"feedback"`

#### Deine Rolle  `[einl_rollen]`

Wer möchtest du in diesem Prozess sein?

> **Text:** Wir spielen in Konflikten oft Rollen, die wir nicht bewusst gewählt haben: Täter, Opfer, Retter. Hier hast du die Chance, innezuhalten und zu fragen: Wer möchte ich in diesem Prozess sein?

> **Video:** 

> **Frage:** Mach transparent, wie du dich in dieser Situation siehst – und was du von den anderen brauchst.

#### Regeln festlegen  `[einleitung]`

Jede Partei formuliert ihre Erwartungen an das Verfahren. Was ist dir wichtig? Welche Regeln sollen gelten?

*Platzhalter:* z.B. Keine Unterbrechungen, ausreden lassen …

Inhaltsarten: `"video,text"`

#### Vertrauen  `[einl_vertrauen]`

Genug Vertrauen für ehrliche Gespräche.

> **Text:** Vertrauen entsteht nicht auf Knopfdruck, besonders wenn es beschädigt wurde. Aber für diesen Prozess braucht ihr kein vollständiges Vertrauen – nur genug, um heute ehrlich sprechen zu können.

> **Video:** 

> **Frage:** Was ist dein Minimum? Was brauchst du, damit du dich wenigstens ein Stück weit öffnen kannst?

#### Rollen klären  `[einleitung_rollen]`

Welche Rolle übernimmt jede Person in dieser Mediation? Hier werden Zuständigkeiten und Erwartungen transparent gemacht.

*Platzhalter:* z.B. Ich sehe meine Rolle als …

Inhaltsarten: `"video,text"`

#### Dein Ziel  `[einl_ziel]`

Vom Problem zur Lösung.

> **Text:** Wir wissen im Konflikt oft sehr genau, was wir nicht wollen. Aber was willst du wirklich? Stell dir vor, dieser Prozess ist gelungen – wie fühlt sich das an, und was ist dann anders?

> **Video:** 

> **texteingabe:** Dein Ziel
> — *placeholder:* Formuliere dein Ziel positiv: nicht, was aufhören soll, sondern was stattdessen sein soll.

#### Vertrauen schaffen  `[einleitung_vertrauen]`

Was braucht ihr, um offen sprechen zu können? Notiert, was euch hilft, Vertrauen in den Prozess aufzubauen.

*Platzhalter:* z.B. Vertraulichkeit über alles, was hier gesprochen wird …

Inhaltsarten: `"video,text"`

#### Ziel der Mediation definieren  `[einleitung_ziel]`

Was soll am Ende dieser Mediation erreicht sein? Jede Partei formuliert ihr persönliches Ziel für den Prozess.

*Platzhalter:* z.B. Eine faire Lösung für beide Seiten finden …

Inhaltsarten: `"video,text"`

#### Reflexion vor dem Vertrag  `[feedback_before_contract]`

Kurze Einschätzung, bevor ihr den Mediationsvertrag unterzeichnet.

Inhaltsarten: `"feedback"`

#### Mediationsvertrag  `[contract]`

Der gemeinsame Mediationsvertrag zum Abschluss der Einleitungsphase.

Inhaltsarten: `"vertrag"`

### Phase 2 – Themensammlung

#### Konfliktpunkte sammeln  `[themensammlung_konflikte]`

*Reflexion: interactive*

Nennen Sie alle Themen und Streitpunkte, die in dieser Mediation geklärt werden sollen. Noch keine Bewertung – nur sammeln.

*Platzhalter:* z.B. Aufteilung der Betreuungszeiten, Unterhaltszahlungen …

#### Ankommen & Rahmen  `[themen_ankommen]`

Struktur und Entlastung: erst ordnen, dann klären.

> **Text:** Jetzt geht es um eine geordnete Bestandsaufnahme. Ziel dieses Abschnitts ist nicht, Recht zu bekommen, sondern Ordnung und Entlastung: Wir sammeln in Ruhe alle Themen, die auf den Tisch gehören – ohne sie schon zu bewerten oder zu lösen.

> **hinweis:** Wichtig: Niemand wird unterbrochen. Jede Seite bekommt gleich viel Zeit und Raum. Was dir wichtig ist, wird festgehalten und geht nicht verloren.
> — *variant:* info

> **zustimmung:** Ich bin bereit, in diesem Abschnitt erst zu sammeln und noch nicht zu diskutieren oder zu lösen.

#### Ihre Perspektive  `[themensammlung_perspektive]`

*Reflexion: interactive*

Schildern Sie Ihre persönliche Sicht auf den Konflikt. Ohne Wertung – nur Ihre Wahrnehmung der Situation.

*Platzhalter:* z.B. Ich erlebe die Situation so, dass …

#### Deine Sicht – ununterbrochen  `[themen_statement]`

Dein Eingangsstatement, das niemand unterbricht.

> **Text:** Schildere in eigenen Worten, wie du die Situation erlebst. Nimm dir so viel Raum, wie du brauchst – hier unterbricht dich niemand. Sprich aus deiner Sicht (in Ich-Form), statt der anderen Seite Vorwürfe zu machen.

> **texteingabe:** Wie erlebst du die Situation?
> — *placeholder:* Was ist passiert, was beschäftigt dich, wo hakt die Zusammenarbeit / das Miteinander gerade?

> **video_aufnahme:** Wenn du magst, sprich deine Sicht als kurze Videobotschaft ein – manchmal ist Reden leichter als Schreiben.

> **auswahl:** Worum geht es?
> — *multi:* true
> — *options:* ["Lärm", "Grundstücksgrenze", "Bäume / Hecken / Pflanzen", "Wege / Zufahrt", "Haustiere", "Müll / Ordnung"]

> **skala:** Wie sehr belastet dich der Konflikt im Alltag?
> — *min:* 1
> — *max:* 10
> — *minLabel:* kaum
> — *maxLabel:* sehr stark

#### Prioritäten setzen  `[themensammlung_prioritaeten]`

*Reflexion: interactive*

Welche Themen sind für Sie am dringendsten? Benennen Sie die Punkte, die zuerst geklärt werden müssen.

*Platzhalter:* z.B. Zuerst muss das Thema Wohnung geklärt werden, weil …

#### Aus Vorwurf wird Thema  `[themen_zu_themen]`

Wir filtern die Schärfe heraus und behalten die Sachthemen.

> **Text:** In der Hitze fallen schnell Vorwürfe. Für die Mediation übersetzen wir sie in sachliche Themen: Aus „der blockiert immer alles“ wird z. B. das Thema „Abstimmung von Freigaben und Abläufen“. Es geht nicht darum, wer angefangen hat, sondern worüber ihr gemeinsam sprechen wollt.

> **liste:** Welche Themen gehören für dich auf die gemeinsame Agenda? Formuliere sie möglichst neutral (Überschriften, keine Vorwürfe).
> — *placeholder:* Ein Thema, sachlich formuliert …

> **ki_reframing:** Formuliere die eingegebenen Themen und Aussagen in eine sachliche, vorwurfsfreie Sprache um. Mache aus Vorwürfen neutrale Themen-Überschriften, ohne den Inhalt zu verfälschen.
> — *autorun:* false

#### Gemeinsame Themen-Agenda  `[themen_agenda]`

Alle Themen sichtbar – nichts geht verloren.

> **Text:** Aus euren Punkten entsteht jetzt eine gemeinsame, sachliche Agenda. Wenn beide Seiten sehen, dass ihre Themen aufgenommen wurden, sinkt die Anspannung – das ist die Grundlage für die nächsten Schritte.

> **ranking:** Bring die gesammelten Themen in die Reihenfolge, in der wir sie aus deiner Sicht bearbeiten sollten.

> **KI-Zusammenfassung:** Fasse die Themen beider Parteien zu einer neutralen, gemeinsamen Themen-Agenda zusammen. Führe gleiche/ähnliche Themen zusammen und liste sie als sachliche Überschriften auf, ohne zu werten.
> — *autorun:* false

> **vertrauliche_notiz:** Gibt es etwas, das du zunächst nur der mediierenden Person mitteilen möchtest (nicht der anderen Seite)?

> **gate:** Weiter geht es, sobald beide Seiten ihre Themen eingebracht und die gemeinsame Agenda gesehen haben.

### Phase 3 – Interessen

#### Ihre Bedürfnisse und Interessen  `[interessen_beduerfnisse]`

*Reflexion: interactive*

Was brauchen Sie wirklich? Hinter jeder Position steckt ein tieferes Bedürfnis. Beschreiben Sie, was Ihnen wichtig ist.

*Platzhalter:* z.B. Ich brauche Sicherheit, Verlässlichkeit, Respekt …

#### Unter die Oberfläche  `[int_eisberg]`

Das Eisberg-Modell: Was liegt unter der Wasserlinie?

> **Text:** Bisher ging es um Positionen – das, was sichtbar über der Wasserlinie liegt („Ich will X“). Darunter liegen die eigentlichen Antriebe: Bedürfnisse, Sorgen, Werte. Wenn wir diese verstehen, wird eine Lösung möglich, die für beide trägt. Dies ist meist die längste, aber wichtigste Phase – nimm dir Zeit.

> **Video:** 

> **hinweis:** Typische Interessen unter der Wasserlinie in der Nachbarschaft: Ruhe und Erholung im eigenen Zuhause, Respekt und Gehört-Werden, Kontrolle über das eigene Grundstück – und verlässliche, berechenbare Absprachen.
> — *variant:* info

#### Befürchtungen und Ängste  `[interessen_aengste]`

*Reflexion: interactive*

Was befürchten Sie? Was darf auf keinen Fall passieren? Diese Informationen helfen, tragfähige Lösungen zu finden.

*Platzhalter:* z.B. Ich befürchte, dass meine Kinder darunter leiden …

#### Was steckt dahinter?  `[int_wfragen]`

W-Fragen nach dem Kern: nicht das Was, sondern das Warum.

> **Text:** Denk an einen Moment aus dem Konflikt, der dich besonders getroffen hat. Wir fragen jetzt nicht nach den Fakten, sondern nach der Bedeutung: Was war daran für dich das Schwierigste – und warum?

> **Frage:** Was ist dir bei diesen Themen wirklich wichtig – und warum? Was brauchst du, damit sich die Situation für dich gut anfühlt?

> **skala:** Wie wichtig ist dir eine Einigung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* weniger wichtig
> — *maxLabel:* sehr wichtig

> **hinweis:** Denk daran: Ihr bleibt Nachbarn. Eine Lösung, mit der beide dauerhaft leben können, ist mehr wert als ein kurzfristiger Sieg.
> — *variant:* info

#### Kern des Konflikts  `[interessen_kern]`

*Reflexion: interactive*

Was ist Ihrer Meinung nach der eigentliche Kern dieses Konflikts? Oft steckt hinter dem sichtbaren Streit ein tieferes Thema.

*Platzhalter:* z.B. Im Kern geht es mir darum, dass ich gehört werde …

#### Vom Vorwurf zum Bedürfnis  `[int_reframing]`

Hinter jedem harten Einspruch steckt ein Bedürfnis.

> **Text:** Vorwürfe sind oft nur die laute Verpackung eines Bedürfnisses. Hinter „die halten sich an keine Regeln“ kann der Wunsch nach Sicherheit und Anerkennung der eigenen Verantwortung stehen. Was ging in dir vor, als der Konflikt eskalierte?

> **Frage:** Was ging in dir vor, als es zum Streit kam? Welche Sorge oder welches Bedürfnis steckt hinter deiner Reaktion?

> **ki_interessen:** Leite aus den geäußerten Positionen und Vorwürfen die dahinterliegenden Interessen und Bedürfnisse jeder Partei ab (z. B. Anerkennung, Sicherheit, Verlässlichkeit, Respekt, Einbindung).
> — *autorun:* false

#### Perspektivwechsel  `[int_perspektive]`

Zirkuläre Fragen: die Empathie-Brücke.

> **Text:** Jetzt kommt der entscheidende Moment: der Wechsel der Perspektive. Wenn du hörst, welche Last, welche Sorge und welches Bedürfnis die andere Seite antreibt – wie wirkt das auf dich? Oft zeigt sich: Es ging nie um die Person, sondern um eine unerfüllte Sorge.

> **Frage:** Wenn du der anderen Seite so zuhörst und ihr Bedürfnis dahinter siehst: Wie verändert das deinen Blick auf den Konflikt?

> **ki_gemeinsamkeiten:** Identifiziere gemeinsame und ergänzende Interessen beider Parteien und benenne, wo trotz des Konflikts ein gemeinsames Anliegen sichtbar wird.
> — *autorun:* false

### Phase 4 – Optionen

#### Lösungsideen sammeln  `[optionen_ideen]`

Sammeln Sie alle möglichen Lösungen – ohne Bewertung. Jede Idee ist willkommen, auch ungewöhnliche. Quantität vor Qualität.

*Platzhalter:* z.B. Eine mögliche Lösung wäre, dass …

#### Erst sammeln, nicht bewerten  `[opt_sammeln_regel]`

Die goldene Regel des Brainstormings.

> **Text:** Jetzt kennt ihr die Interessen hinter dem Streit. Darauf bauen wir Lösungen. Die wichtigste Regel: erst sammeln, dann bewerten. In diesem Abschnitt ist jede Idee erlaubt – auch ungewöhnliche. Je mehr Optionen auf dem Tisch liegen, desto größer die Chance auf eine Lösung, die für beide passt.

> **hinweis:** Noch wird nichts entschieden. Kritik und „ja, aber …“ heben wir uns für den nächsten Abschnitt auf.
> — *variant:* info

#### Kreative Optionen  `[optionen_kreativ]`

Denken Sie außerhalb gewohnter Muster. Was wäre möglich, wenn es keine Einschränkungen gäbe? Was haben andere in ähnlichen Situationen gemacht?

*Platzhalter:* z.B. Was wäre, wenn wir …

#### Ideen sammeln  `[opt_ideen]`

So viele Lösungsideen wie möglich.

> **liste:** Welche Lösungsmöglichkeiten fallen dir ein? Denk an Optionen, die auch das Bedürfnis der anderen Seite berücksichtigen.
> — *placeholder:* Eine Idee …

> **texteingabe:** Eine Idee, die beiden helfen könnte
> — *placeholder:* Beschreibe eine Lösung, bei der beide Seiten etwas Wichtiges bekommen.

> **hinweis:** Denkanstöße: feste Ruhezeiten, klarer Turnus für Rückschnitt von Hecken und Bäumen, Sichtschutz oder Zaun, Regeln für Wege und Zufahrt – und ein kurzer Draht für die Zukunft: erst ansprechen, dann eskalieren.
> — *variant:* info

#### Win-Win-Ansätze  `[optionen_winwin]`

Welche der gesammelten Lösungen könnten für alle Seiten akzeptabel sein? Suchen Sie nach Ideen, die mehrere Interessen gleichzeitig erfüllen.

*Platzhalter:* z.B. Beide Seiten könnten davon profitieren, wenn …

#### Auf Interessen aufbauen  `[opt_winwin]`

Aus Bedürfnissen werden Win-Win-Optionen.

> **Text:** Die besten Lösungen erfüllen die Kernbedürfnisse beider Seiten gleichzeitig – zum Beispiel schnelle Umsetzung für die eine und rechtzeitige Einbindung/Sicherheit für die andere Seite. Lass uns die Ideen daraufhin schärfen.

> **ki_optionen:** Erarbeite auf Basis der gesammelten Ideen und der zuvor ermittelten Interessen mehrere faire, umsetzbare Lösungsoptionen, die die Kernbedürfnisse beider Seiten zugleich berücksichtigen.
> — *autorun:* false

> **Frage:** Welche der Optionen erfüllt aus deiner Sicht ein wichtiges Bedürfnis der anderen Seite – ohne dir zu schaden?

### Phase 5 – Verhandlung

#### Lösungen bewerten  `[verhandlung_bewertung]`

Welche der gesammelten Optionen sind für Sie akzeptabel? Was spricht dafür, was dagegen? Begründen Sie Ihre Einschätzung.

*Platzhalter:* z.B. Option X ist für mich akzeptabel, weil … Nicht akzeptabel wäre …

#### Optionen bewerten  `[ver_bewerten]`

Jetzt wird geprüft, was wirklich trägt.

> **Text:** Nun bewertet ihr die gesammelten Optionen. Es geht nicht ums Gewinnen, sondern um eine Lösung, die für beide funktioniert und im Alltag hält.

> **ranking:** Bring die Lösungsoptionen in deine bevorzugte Reihenfolge.

> **skala:** Wie zufrieden wärst du mit deiner bevorzugten Option?
> — *min:* 1
> — *max:* 10
> — *minLabel:* gar nicht
> — *maxLabel:* voll und ganz

#### Bedingungen und Grenzen  `[verhandlung_bedingungen]`

Unter welchen Bedingungen können Sie einer Lösung zustimmen? Was sind Ihre Grenzen – also was kommt auf keinen Fall infrage?

*Platzhalter:* z.B. Ich könnte zustimmen, wenn … Nicht akzeptabel wäre auf jeden Fall …

#### Realitäts-Check & Bedingungen  `[ver_bedingungen]`

Unter welchen Bedingungen trägt die Lösung?

> **Text:** Eine Vereinbarung hält nur, wenn sie realistisch ist. Prüfe deine bevorzugte Lösung ehrlich: Was brauchst du, damit sie funktioniert – und was könntest du der anderen Seite anbieten?

> **Frage:** Unter welchen Bedingungen ist die Lösung für dich tragfähig? Was ist dein Beitrag, was brauchst du von der anderen Seite?

> **ki_gemeinsamkeiten:** Identifiziere Übereinstimmungen und verbleibende Konfliktpunkte zwischen den Parteien. Markiere klar, wo eine Einigung bereits nahe liegt und wo noch verhandelt werden muss.
> — *autorun:* false

> **Frage:** Was ist deine Alternative ohne Einigung, z.B. Ordnungsamt oder Klage? Realistisch betrachtet: Zeit, Kosten – und wie wäre danach das Verhältnis?

#### Konkrete Vereinbarungen  `[verhandlung_vereinbarung]`

Welche konkreten Schritte, Regeln oder Vereinbarungen schlagen Sie vor? Je konkreter, desto besser – mit Datum, Betrag, Häufigkeit.

*Platzhalter:* z.B. Wir vereinbaren, dass ab dem 01.06. … in Höhe von … monatlich …

#### Verbindliche Vereinbarung  `[ver_vereinbarung]`

Wer macht was bis wann?

> **Text:** Aus einer guten Absicht wird erst dann eine Lösung, wenn sie konkret wird. Haltet fest: Wer macht was bis wann? Je genauer, desto verlässlicher – und desto weniger Anlass für neuen Streit.

> **texteingabe:** Konkrete Schritte (wer / was / bis wann)
> — *placeholder:* z. B.: Ich stimme neue Vorhaben künftig vorab kurz mit der anderen Seite ab – ab sofort.

> **zustimmung:** Ich bin bereit, die gemeinsam festgehaltenen Schritte verbindlich umzusetzen.

> **Terminabstimmung:** 

### Abschluss

#### Ergebnis der Mediation  `[abschluss_ergebnis]`

Halten Sie fest, was vereinbart wurde. Jede Vereinbarung so konkret wie möglich: Wer tut was, wann, unter welchen Bedingungen?

*Platzhalter:* z.B. Beide Parteien sind übereingekommen, dass …

#### Abschluss & Vereinbarung  `[basis_abschluss]`

Absprachen verbindlich festhalten.

> **Text:** Haltet die Absprachen verbindlich fest – wer macht was, ab wann, welche Ruhezeiten und Regeln gelten.

> **Vertrag:** 
> — *template:* Nachbarschaftliche Vereinbarung  
  
1. Vereinbarte Regeln: …  
2. Wer setzt was bis wann um: …  
3. Ruhezeiten / Nutzung: …  
  
Ort, Datum:

> **unterschrift:** 
> — *statement:* Ich bestätige die oben festgehaltenen Absprachen.

> **Terminabstimmung:** 

> **Feedback:** 
> — *occasion:* before_contract

> **Frage:** Woran werdet ihr in einem Monat merken, dass die Absprachen im Alltag funktionieren?

#### Nächste Schritte und Verantwortlichkeiten  `[abschluss_schritte]`

Wer ist für die Umsetzung verantwortlich? Was passiert, wenn eine Vereinbarung nicht eingehalten wird? Konkrete Fristen setzen.

*Platzhalter:* z.B. Bis zum … wird von … folgendes erledigt: …

#### Abschluss und Reflexion  `[abschluss_feedback]`

Wie war der Mediationsprozess für Sie? Was nehmen Sie mit? Ein bewusster Abschluss stärkt die Nachhaltigkeit der Vereinbarungen.

*Platzhalter:* z.B. Für mich war besonders hilfreich, dass … Ich nehme mit, dass …

## Variante: Evaluative Mediation (Realitätscheck)

*Der ehrliche Blick auf Zahlen und Risiken: Was kostet der Streit wirklich, wie stehen die Chancen vor Gericht, wo liegt die Einigungszone? Optionen bekommen ein Preisschild.*

### Phase 1 – Einleitung

#### Evaluative Mediation: der ehrliche Realitätscheck  `[ev_methode]`

Hier wird bewertet: Zahlen, Risiken, Chancen – unbequem ehrlich, dafür schnell.

> **Text:** In dieser Methode bleiben Mediator und KI nicht neutral zurückhaltend – sie bewerten aktiv: Wie stehen die Chancen vor Gericht? Was kostet der Streit wirklich? Welche Option hat den besten Erwartungswert? Ideal, wenn es primär um Geld, Verträge und Risiko geht.

> **akkordeon:** Die Einschätzungen sind Orientierung für die Verhandlung – sie ersetzen keine Rechtsberatung. Für eine anwaltliche Ersteinschätzung gibt es die Bonus-Leistung im Prozess.

> **zustimmung:** Ich will eine ehrliche Einschätzung – auch wenn sie unbequem ist.

### Phase 3 – Interessen

#### Was kostet der Streit?  `[ev_realitaet]`

Der Moment der Wahrheit: Streitwert, Eskalationskosten, Erfolgsaussichten – schwarz auf weiß.

> **betrag:** Um welchen Wert geht es (Streitwert)?
> — *currency:* €

> **betrag:** Geschätzte Kosten bei voller Eskalation (Anwälte, Gericht, interne Zeit, entgangene Geschäfte)
> — *currency:* €

> **skala:** Wie schätzt du deine Erfolgsaussichten vor Gericht ein?
> — *min:* 0
> — *max:* 10
> — *minLabel:* chancenlos
> — *maxLabel:* sicherer Sieg

> **vertrauliche_notiz:** Deine Schmerzgrenze: Bis zu welchem Ergebnis würdest du noch abschließen? (sieht nur der Mediator)

> **hinweis:** Psychologie (Verlustaversion): Menschen überschätzen ihre Prozesschancen systematisch und unterschätzen Dauer und Kosten. Der richtige Vergleichsmaßstab ist nicht der Sieg – sondern das wahrscheinliche Szenario nach zwei Jahren Verfahren.
> — *variant:* warning

> **ki_prompt:** Erstelle aus den Angaben beider Seiten eine nüchterne Kosten-Risiko-Gegenüberstellung: bestes, wahrscheinliches und schlechtestes Szenario je Seite (inkl. Zeit- und Beziehungskosten). Rechne vor, ab welchem Einigungswert eine Einigung für jede Seite rational besser ist als das wahrscheinliche Prozess-Szenario.
> — *autorun:* false

### Phase 4 – Optionen

#### Optionen mit Preisschild  `[ev_bewertung]`

Jede Option bekommt Risiko, Kosten und Dauer – dann wird sortiert.

> **ki_optionen:** Entwickle Lösungsoptionen und bewerte JEDE mit: Risiko (hoch/mittel/niedrig), einmalige und laufende Kosten, Umsetzungsdauer und Erwartungswert je Seite. Markiere die Option mit dem besten Erwartungswert für BEIDE Seiten und begründe kurz.
> — *autorun:* false

> **ranking:** Sortiere die bewerteten Optionen nach deiner Präferenz.

### Phase 5 – Verhandlung

#### Die Einigungszone  `[ev_zone]`

Ab jetzt wird jede Forderung am wahrscheinlichen Szenario gemessen – nicht am Wunschergebnis.

> **ki_gemeinsamkeiten:** Ermittle aus den Schmerzgrenzen und den Szenario-Rechnungen die rechnerische Einigungszone (ohne vertrauliche Grenzen offenzulegen). Benenne, ob eine Zone existiert, wie breit sie ungefähr ist und welcher Bereich für beide Seiten dem wahrscheinlichen Prozess-Szenario überlegen ist.
> — *autorun:* false

> **Text:** Regie: Jede Forderung wird ab jetzt am wahrscheinlichen Szenario gemessen – nicht am besten. Wer mehr will als die Einigungszone hergibt, verhandelt gegen die eigene Rechnung.

> **ki_optionen:** Entwickle innerhalb der Einigungszone zwei bis drei Abschluss-Optionen (z.B. Einmalzahlung vs. Raten, sofort vs. gestuft, mit/ohne künftige Zusammenarbeit) und weise für jede den Vorteil gegenüber dem wahrscheinlichen Prozess-Szenario aus.
> — *autorun:* false

> **zustimmung:** Ich verhandle auf Basis des wahrscheinlichen Szenarios weiter – nicht des besten.

### Abschluss

#### Der Vergleich  `[ev_vergleich]`

Das Ergebnis in einem Satz: schneller, günstiger und planbarer als jedes Verfahren.

> **Text:** Der Abschluss hält fest, was beide Seiten dem Verfahren voraus haben: Zeit, Kosten, Planbarkeit – und die Entscheidung lag bei euch, nicht bei einem Gericht.

> **unterschrift:** 
> — *statement:* Ich bestätige den erarbeiteten Vergleich.

## Variante: Harvard-Methode (sachbezogen zum Ja)

*Hart in der Sache, weich zu den Menschen: Interessen statt Positionen, Plan B (BATNA), Optionen-Werkstatt, objektive Kriterien – bis beide Seiten guten Gewissens Ja sagen können.*

### Phase 1 – Einleitung

#### So funktioniert die Harvard-Methode  `[hv_methode]`

Der inszenierte Einstieg: vier Prinzipien, ein Ziel – das beiderseitige Ja.

> **Text:** Willkommen zur Harvard-Methode – der weltweit meistgenutzten Verhandlungsmethode (aus „Getting to Yes“, Harvard Negotiation Project). Die Regel Nummer eins: Wir verhandeln hart in der Sache, aber weich zu den Menschen. Am Ende steht keine faule Mitte, sondern eine Lösung, zu der beide Seiten aus eigener Überzeugung Ja sagen.

> **akkordeon:** Der Konflikt ist das Problem – nicht die Person auf der anderen Seite. Vorwürfe kosten Verhandlungsmacht; wer sachlich bleibt, führt das Gespräch.

> **akkordeon:** Eine Position ist eine Forderung („Ich will 60 %“). Ein Interesse ist der Grund dahinter (Sicherheit, Anerkennung, Liquidität). Positionen kollidieren – Interessen lassen sich fast immer gleichzeitig erfüllen.

> **akkordeon:** Erst die Menge, dann die Auswahl. Wer Ideen sofort bewertet, bekommt keine mehr. In der Optionen-Werkstatt gilt deshalb: sammeln ohne Kritik – aussortiert wird später.

> **akkordeon:** Nicht wer lauter ist gewinnt, sondern was sich an neutralen Maßstäben messen lässt: Marktwert, Gutachten, Branchenstandard, Rechtsprechung.

> **zustimmung:** Ich verhandle über Interessen, nicht über Positionen – und ich bewerte Ideen erst, wenn alle auf dem Tisch liegen.

### Phase 3 – Interessen

#### Dein Plan B (BATNA)  `[hv_batna]`

Vertraulicher Realitätsanker: Wer seinen Plan B kennt, verhandelt ruhig und souverän.

> **Text:** BATNA heißt: die beste Alternative, falls es KEINE Einigung gibt (Best Alternative To a Negotiated Agreement). Sie ist dein Maßstab: Jede Einigung muss besser sein als dein Plan B – und keine darf schlechter sein. Wer seine BATNA kennt, muss nichts annehmen und nichts fürchten. Diese Angaben sieht nur der Mediator, nie die Gegenseite.

> **vertrauliche_notiz:** Was ist deine beste Alternative, wenn ihr euch NICHT einigt? (z.B. Gericht, neuer Lieferant, Verkauf, Auszug – so konkret wie möglich)

> **skala:** Wie stark ist dein Plan B wirklich?
> — *min:* 1
> — *max:* 10
> — *minLabel:* schwach / teuer
> — *maxLabel:* stark / jederzeit machbar

> **hinweis:** Psychologie: Verhandlungsmacht kommt nicht aus Lautstärke, sondern aus der Qualität deines Plan B. Und: Die Gegenseite hat auch einen – meist schlechter, als du befürchtest.
> — *variant:* info

> **ki_interessen:** Leite aus den geäußerten Positionen die dahinterliegenden Interessen jeder Partei ab. Zeige für jede Seite: die Forderung, das vermutete Interesse dahinter und ein Interesse, das beide teilen.
> — *autorun:* false

### Phase 4 – Optionen

#### Optionen-Werkstatt: erst Menge, dann Bewertung  `[hv_werkstatt]`

Brainstorm-Bühne mit KI-Verstärkung – der Kuchen wird größer, bevor er verteilt wird.

> **hinweis:** Werkstatt-Regel: Sammeln ohne Bewerten. Auch halbfertige oder verrückte Ideen zählen – Bewertungsangst ist der schnellste Weg, gute Lösungen zu verlieren.
> — *variant:* info

> **liste:** Sammle Lösungsideen – Menge vor Qualität. Was könnte den Kuchen größer machen (Zusatzleistungen, Zeitachsen, Tauschgeschäfte)?
> — *placeholder:* Idee hinzufügen …

> **ki_optionen:** Erarbeite aus den Ideen und Interessen BEIDER Seiten mindestens fünf konkrete Lösungsoptionen. Nutze unterschiedliche Prioritäten für Tauschgewinne (was der einen Seite wenig kostet und der anderen viel bringt), erweitere den Kuchen statt ihn nur zu teilen, und füge bewusst eine unkonventionelle Option hinzu. Formuliere jede Option so, dass beide Seiten ihr Interesse darin wiederfinden.
> — *autorun:* false

> **ranking:** Bringe die Optionen in DEINE Reihenfolge (die Gegenseite sieht nur das Ergebnis, nicht deine Gedanken).

### Phase 5 – Verhandlung

#### Objektive Kriterien & das Paket  `[hv_kriterien]`

Die Ja-Straße: neutrale Maßstäbe vereinbaren, Pakete schnüren, Teilzustimmungen sammeln.

> **auswahl:** Welche neutralen Maßstäbe akzeptierst du für die Bewertung?
> — *multi:* true
> — *options:* ["Marktwert / unabhängiges Gutachten", "Branchenüblicher Standard", "Rechtsprechung in vergleichbaren Fällen", "Gleichbehandlung (wie in früheren Fällen gelöst)", "Hälftige Teilung als Ausgangspunkt", "Einschätzung eines externen Experten"]

> **ki_gemeinsamkeiten:** Identifiziere aus Rankings und Kriterien-Auswahl beider Seiten, wo die Einigung bereits nahe liegt und wo die echten Reibungspunkte sind. Beginne mit den Übereinstimmungen.
> — *autorun:* false

> **ki_optionen:** Schnüre aus den am besten bewerteten Optionen zwei bis drei GESAMTPAKETE. Weise für jedes Paket aus, welches Kerninteresse jeder Seite es erfüllt und an welchem objektiven Kriterium es sich misst. Ziel: Beide Seiten können zu einem Paket ein klares Ja sagen.
> — *autorun:* false

> **zustimmung:** Ich bin bereit, auf Basis eines dieser Pakete abzuschließen, wenn es besser ist als mein Plan B.

> **hinweis:** Psychologie: Jedes kleine Ja macht das große Ja leichter (Konsistenz-Prinzip). Deshalb sammeln wir Teilzustimmungen, statt alles an einer einzigen Entscheidung hängen zu lassen.
> — *variant:* success

### Abschluss

#### Das Ja festhalten  `[hv_ja_fixieren]`

Commitment sichern: schriftlich, konkret, mit Blick nach vorn.

> **Text:** Was schriftlich festgehalten wird, hält. Nicht als Misstrauen, sondern als Psychologie: Ein dokumentiertes, selbst formuliertes Commitment wird um ein Vielfaches häufiger eingehalten als ein mündliches.

> **texteingabe:** Blick nach vorn: Was wirst du in einem Jahr über diese Lösung sagen?
> — *placeholder:* In einem Jahr …

> **unterschrift:** 
> — *statement:* Ich stehe zu der gefundenen Lösung und setze meinen Teil um.

## Variante: Shuttle-Mediation (getrennte Gespräche)

*Die Parteien treffen sich zunächst nicht: Der Mediator pendelt vertraulich zwischen den Seiten. Ideal bei hoher Eskalation, Machtgefälle oder hartem B2B-Poker.*

### Phase 1 – Einleitung

#### Shuttle-Mediation: Der Mediator pendelt  `[sh_methode]`

Getrennte Räume, volle Vertraulichkeit – die Konfrontation entfällt, die Lösung nicht.

> **Text:** In dieser Mediation sitzt ihr euch zunächst NICHT gegenüber. Jede Seite hat ihren eigenen, vertraulichen Raum – der Mediator pendelt dazwischen, übersetzt, filtert Schärfe heraus und trägt nur das weiter, was freigegeben ist. Erst wenn eine Einigung greifbar ist, kommt es zur Zusammenführung.

> **akkordeon:** Bei hoher Eskalation, wenn direkte Gespräche sofort entgleisen; bei Machtgefälle (z.B. Chef/Mitarbeiter, Konzern/Zulieferer); und im harten B2B-Verhandlungspoker, wo keine Seite ihre Karten zeigen will.

> **zustimmung:** Vertraulichkeitsregel: Nichts aus meinem Einzelgespräch geht ohne meine ausdrückliche Freigabe an die andere Seite.

### Phase 2 – Themensammlung

#### Dein vertraulicher Raum  `[sh_einzelraum]`

Hier darfst du offen sein: Nur der Mediator liest mit.

> **vertrauliche_notiz:** Was soll der Mediator wissen, was die Gegenseite (noch) nicht hören soll? (Hintergründe, Befürchtungen, rote Linien)

> **vertrauliche_notiz:** Ganz ehrlich: Was wäre dein bestes realistisches Ergebnis – und was das schlechteste, das du gerade noch akzeptieren könntest?

> **skala:** Wie viel Vertrauen hast du aktuell in eine Einigung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* keins
> — *maxLabel:* volles Vertrauen

### Phase 3 – Interessen

#### Was darf rüber?  `[sh_freigabe]`

Kontrollierte Dosierung: Deine Botschaft wird übersetzt, bevor sie die Seite wechselt.

> **texteingabe:** Deine Botschaft an die Gegenseite – der Mediator übermittelt sie.
> — *placeholder:* Was soll die andere Seite von dir hören?

> **hinweis:** Psychologie: In getrennten Räumen eskaliert nichts. Der Mediator dosiert die Information und nimmt die Schärfe heraus – so bleibt der Inhalt, aber der Stachel geht verloren.
> — *variant:* info

> **ki_reframing:** Übersetze die Botschaft in eine annehmbare, gesichtswahrende Form, ohne den Inhalt zu verfälschen. Gesichtswahrung ist die Währung der Shuttle-Mediation: Die Gegenseite muss zustimmen können, ohne als Verlierer dazustehen.
> — *autorun:* false

### Phase 4 – Optionen

#### Der Einigungskorridor  `[sh_korridor]`

Die KI ermittelt aus beiden vertraulichen Lagen, OB und WO ein Korridor existiert.

> **ki_gemeinsamkeiten:** Ermittle aus den vertraulichen Angaben beider Seiten (beste/gerade noch akzeptable Ergebnisse), OB ein Einigungskorridor existiert und WO er ungefähr liegt – OHNE vertrauliche Details oder Schmerzgrenzen offenzulegen. Formuliere nur die Überlappung in neutralen Worten.
> — *autorun:* false

> **ki_optionen:** Entwickle Lösungsoptionen INNERHALB des Einigungskorridors. Formuliere jede Option so, dass keine Seite ihr Gesicht verliert und keine als Sieger oder Verlierer dasteht. Der Vorschlag kommt vom Mediator – nicht von einer Partei.
> — *autorun:* false

> **hinweis:** Ankereffekt: Die erste genannte Zahl setzt den Rahmen der ganzen Verhandlung. Deshalb bringt hier der Mediator die Vorschläge ein – so wirkt kein einseitiger Anker.
> — *variant:* warning

### Phase 5 – Verhandlung

#### Pendel-Runden  `[sh_runden]`

Runde für Runde nähern sich die Angebote an – die KI baut Brücken, wenn es stockt.

> **Text:** Regie: Der Mediator holt in jeder Runde von beiden Seiten ein aktualisiertes Angebot ein und pendelt damit zur anderen Seite. Du entscheidest jede Runde neu – ohne Druck des direkten Gegenübers.

> **vertrauliche_notiz:** Dein aktuelles Angebot für diese Runde – und deine Schmerzgrenze (sieht nur der Mediator).

> **ki_optionen:** Die Runde stockt: Entwickle eine Brücken-Option, die genau zwischen den aktuellen Angeboten liegt, aber nicht einfach die Mitte teilt – sondern die wichtigsten Interessen beider Seiten kombiniert (z.B. mehr Betrag gegen längere Frist, Zusage gegen Garantie).
> — *autorun:* false

> **zustimmung:** Ich akzeptiere den vom Mediator vorgeschlagenen Korridor als Grundlage für die letzte Runde.

### Abschluss

#### Die Zusammenführung  `[sh_zusammenfuehrung]`

Der große Moment: Erst für das Ja kommen beide Seiten wieder an einen Tisch.

> **Text:** Jetzt – und erst jetzt – kommen beide Seiten wieder in einen gemeinsamen (virtuellen) Raum. Nicht um zu verhandeln, sondern um das gefundene Ergebnis gemeinsam zu besiegeln. Die schwere Arbeit ist getan; dieser Termin ist der Handschlag.

> **unterschrift:** 
> — *statement:* Ich bestätige das in den Pendel-Runden erarbeitete Ergebnis.

## Variante: Transformative Mediation (Beziehung zuerst)

*Erst die Menschen, dann die Sache: Empowerment und Anerkennung, Perspektivwechsel, gemeinsames Zukunftsbild – für alle, die weiter zusammenarbeiten oder Familie bleiben.*

### Phase 1 – Einleitung

#### Transformative Mediation: erst die Menschen, dann die Sache  `[tf_methode]`

Zwei Säulen tragen alles: eigene Stärke (Empowerment) und echtes Anerkennen (Recognition).

> **Text:** Diese Methode dreht die Reihenfolge um: Bevor wir über die Streitsache sprechen, stärken wir das Gespräch selbst. Denn wo Menschen weiter zusammenarbeiten oder Familie bleiben, ist die Beziehung das eigentliche Verhandlungsergebnis.

> **akkordeon:** Jede Seite gewinnt Klarheit über die eigenen Ziele, Ressourcen und Entscheidungen. Wer sich stark fühlt, muss nicht mehr laut sein.

> **akkordeon:** Die Perspektive der anderen Seite wirklich zu verstehen ist keine Schwäche, sondern der schnellste Weg, selbst verstanden zu werden.

> **zustimmung:** Ich bin bereit, der anderen Seite zuzuhören, ohne zu unterbrechen – und werde selbst ohne Unterbrechung sprechen können.

### Phase 2 – Themensammlung

#### Deine Geschichte  `[tf_geschichte]`

Kein Fragenkatalog – eine Bühne: Erzähl den Konflikt, wie du ihn erlebt hast.

> **texteingabe:** Erzähl den Konflikt als Geschichte: Wie hat es angefangen? Was war der Wendepunkt? Wo stehst du heute?
> — *placeholder:* Am Anfang …

> **video_aufnahme:** Optional: Erzähl deine Geschichte als kurze Videobotschaft – gesprochen wirkt sie oft stärker als geschrieben.

> **KI-Zusammenfassung:** Fasse die Geschichten beider Seiten wertschätzend zusammen. Hebe hervor, was jeder Seite erkennbar wichtig ist und wo sich die Erzählungen berühren. Keine Schuldzuweisungen, keine Bewertung.
> — *autorun:* false

### Phase 3 – Interessen

#### Der Perspektivwechsel  `[tf_perspektive]`

Die Königsdisziplin: Beschreibe den Konflikt so, dass die Gegenseite nicken würde.

> **Text:** Regie: Steig für zehn Minuten in die Schuhe der anderen Seite. Nicht um recht zu geben – sondern um zu verstehen, wogegen du eigentlich verhandelst.

> **texteingabe:** Beschreibe den Konflikt aus Sicht der Gegenseite – so fair und genau, dass sie nicken würde.
> — *placeholder:* Aus ihrer Sicht …

> **ki_reframing:** Vergleiche die Selbstbeschreibung jeder Seite mit der Fremdbeschreibung durch die andere. Zeige die Recognition-Momente: Wo hat eine Seite die andere bereits richtig verstanden? Formuliere diese Momente ausdrücklich als Anerkennung.
> — *autorun:* false

> **hinweis:** Psychologie: Wer die Gegenseite präzise wiedergibt, wird selbst eher gehört – Zuhören erzeugt Zuhören (Reziprozität).
> — *variant:* success

### Phase 4 – Optionen

#### Anerkennung & gemeinsame Optionen  `[tf_anerkennung]`

Aus Wertschätzung werden Optionen: Die KI verbindet Beziehung und Sachlösung.

> **texteingabe:** Nenne zwei Dinge, die du an der anderen Seite oder an eurer bisherigen Zusammenarbeit schätzt.
> — *placeholder:* 1. … 2. …

> **skala:** Wie wichtig ist dir die künftige Beziehung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* abwickeln
> — *maxLabel:* unbedingt erhalten

> **ki_optionen:** Entwickle Lösungsoptionen, die die Sachfrage lösen UND die Beziehung stärken. Beginne jede Option mit dem gemeinsamen Nutzen für die künftige Zusammenarbeit bzw. das künftige Miteinander und greife die gegenseitige Wertschätzung ausdrücklich auf.
> — *autorun:* false

### Phase 5 – Verhandlung

#### Das gemeinsame Zukunftsbild  `[tf_zukunft]`

Verhandelt wird rückwärts: erst das Bild in zwölf Monaten, dann der Weg dorthin.

> **texteingabe:** Wie sieht eine gute Zusammenarbeit / ein gutes Miteinander in zwölf Monaten konkret aus?
> — *placeholder:* In zwölf Monaten …

> **ki_gemeinsamkeiten:** Lege die Zukunftsbilder beider Seiten übereinander: Wo decken sie sich bereits? Formuliere daraus ein gemeinsames Zukunftsbild in drei Sätzen und benenne die zwei Punkte, die noch zu klären sind.
> — *autorun:* false

> **ki_optionen:** Entwickle für die noch offenen Punkte Optionen, die zum gemeinsamen Zukunftsbild passen – jede Option als konkreter erster Schritt, den beide Seiten sofort gehen könnten.
> — *autorun:* false

> **zustimmung:** Ich trage das gemeinsame Zukunftsbild mit.

### Abschluss

#### Abschluss mit Anerkennung  `[tf_ritual]`

Kein Vertragstermin, ein Ritual: Vorsatz und Wunsch besiegeln die Transformation.

> **texteingabe:** Was nimmst du dir konkret vor – und was wünschst du der anderen Seite?
> — *placeholder:* Ich nehme mir vor … / Ich wünsche dir …

> **unterschrift:** 
> — *statement:* Ich stehe zu meinem Vorsatz und zum gemeinsamen Zukunftsbild.


\newpage

# Geschäft & Wirtschaft

## Standard-Workflow

### Phase 0 – Einladung

#### Ihr Start — die Lagebesprechung  `[start_intake]`

Der geführte Einstieg: Geschichte, Fakten, Blick nach vorn.

> **Text:** Ungelöste Konflikte in Organisationen kosten dreifach: Geld, Tempo und gute Leute. Die nächsten fünf Minuten sind Ihr strukturiertes Erstgespräch — die Fragen, die ein erfahrener Wirtschaftsmediator im ersten Briefing stellt. Vertraulich, klar, ohne Umwege.

> **zustimmung:** Der Rahmen, damit Klärung überhaupt möglich wird: FREIWILLIGKEIT (Mediation wirkt nur, wenn die Beteiligten sie wollen — auch bei Hierarchie). VERTRAULICHKEIT (Ihre Angaben dienen der Mediation — sie sind kein Berichtswesen an Vorgesetzte oder die Organisation). ALLPARTEILICHKEIT (die Mediation steht auf keiner Seite — auch nicht auf der des Auftraggebers). ERGEBNISOFFENHEIT (tragfähige Lösungen entstehen im Prozess, nicht per Anweisung). Wichtig: Mediation ersetzt keine arbeitsrechtliche Beratung. Auf dieser Grundlage möchte ich arbeiten.

> **Text:** Erst das Briefing: Was ist los, wer steckt drin, und von wo aus schauen Sie darauf? Noch keine Bewertung — nur die Lage.

> **Frage:** Was ist die Lage? Beschreiben Sie den Konflikt wie in einem vertraulichen Briefing an einen externen Sparringspartner — Zahlen und Details kommen später.
> — *map_to:* description

> **Frage:** Wer ist beteiligt — mit welchen Rollen und Berichtslinien (Gesellschafter, Geschäftsführung, Teamleitung, Team, Kunde, Lieferant)? Gibt es ein Hierarchiegefälle zwischen den Parteien?

> **auswahl:** Und Sie selbst — welche Rolle haben Sie in diesem Konflikt?
> — *options:* ["Ich bin selbst Konfliktpartei", "Ich bin Führungskraft der Beteiligten", "Ich bin HR / interne Vermittlung", "Ich bin Gesellschafter:in / Inhaber:in"]
> — *multi:* false

> **Text:** Organisationskonflikte haben selten EINE Ursache. Jetzt geht es um Ebene, Verlauf und das, was der Konflikt schon heute kostet.

> **auswahl:** Auf welcher Ebene liegt der Konflikt vor allem?
> — *options:* ["Sache (Zahlen, Verträge, Leistung)", "Beziehung (Vertrauen, Kommunikation)", "Rolle (Zuständigkeit, Anerkennung)", "Struktur (Prozesse, Verantwortung, Ressourcen)"]
> — *multi:* true

> **Frage:** Seit wann läuft das — und wie hat es sich entwickelt? Was wurde schon versucht (Gespräche, Moderation, Machtwort), und warum hat es nicht gereicht?

> **skala:** Wo steht der Konflikt heute? Ihre ehrliche Einschätzung auf der Eskalationstreppe.
> — *min:* 1
> — *max:* 9
> — *minLabel:* 1 · man redet noch sachlich
> — *maxLabel:* 9 · Schaden wird in Kauf genommen
> — *sets_flag:* {"flag": "glasl_zone", "thresholds": [[1, "win_win"], [4, "win_lose"], [7, "lose_lose"]]}

> **Frage:** Was kostet der Konflikt schon heute — liegengebliebene Projekte, Fluktuation, Krankenstand, verlorene Kunden, Ihre eigene Energie?

> **Text:** Zum Schluss der Blick nach vorn: Was zuerst, was steht auf dem Spiel, und woran misst sich der Erfolg?

> **Frage:** Was muss zuerst gelöst werden? Wenn in den nächsten Wochen nur EIN Knoten platzen dürfte — welcher?
> — *map_to:* priority
> — *placeholder:* z. B. Zusammenarbeit im Team, Zahlungsfrage, Gesellschafterfrage

> **Frage:** Was steht auf dem Spiel, wenn nichts passiert — angedrohte Kündigungen, eingeschaltete Anwälte, Compliance-Themen, blockierte Entscheidungen, harte Fristen?

> **Frage:** Angenommen, in drei Monaten ist das geklärt: Woran merken es die Beteiligten — und woran merkt es die Organisation (Zahlen, Stimmung, Tempo)?

> **skala:** Wie zuversichtlich sind Sie heute, dass eine tragfähige Lösung möglich ist?
> — *min:* 1
> — *max:* 10
> — *minLabel:* kaum vorstellbar
> — *maxLabel:* sehr zuversichtlich

#### Willkommen  `[g_onboarding]`

Ankommen und Orientierung.

> **Text:** Willkommen. Konflikte in Organisationen sind selten reine Leistungsverweigerung – oft stecken Verlustängste, unklare Rollen oder strukturelle Widersprüche dahinter. Wir verstehen zuerst die Dynamik und finden dann einen tragfähigen Weg.

> **hinweis:** Alles, was hier eingegeben wird, dient ausschließlich der Klärung und wird vertraulich behandelt.
> — *variant:* info

> **akkordeon:** Der Prozess folgt sechs Phasen: 1. Einleitung (Rahmen und Haltung), 2. Diagnose (Konfliktart, Eskalationsstufe, Dynamik), 3. Interessenklärung, 4. Lösungsoptionen, 5. Verhandlung und 6. verbindlicher Abschluss mit Follow-up. Die Diagnose steht bewusst am Anfang: Ein Strukturkonflikt braucht andere Antworten als ein Beziehungskonflikt – und ab einer gewissen Eskalationsstufe ist interne Moderation nicht mehr das richtige Mittel.

> **hinweis:** Hilfreich zur Vorbereitung: Notiere dir zwei bis drei konkrete Situationen (was ist passiert, wann, wer war beteiligt) – Beobachtungen statt Bewertungen. Das macht die Klärung schneller und fairer.
> — *variant:* info

> **auswahl:** Um welches Einsatzfeld geht es?
> — *multi:* false
> — *options:* ["Team & Abteilung", "Führung & Betriebsrat", "Gesellschafter & Nachfolge", "Verträge & Lieferanten (B2B)", "IT- & Großprojekt (B2B)", "M&A & Integration (B2B)"]
> — *sets_flag:* {"flag": "business_scope", "map": {"Team & Abteilung": "intern", "Führung & Betriebsrat": "intern", "Gesellschafter & Nachfolge": "intern", "Verträge & Lieferanten (B2B)": "b2b", "IT- & Großprojekt (B2B)": "b2b", "M&A & Integration (B2B)": "b2b"}}

> **hinweis:** Innerbetrieblich (Team, Führung, Gesellschafter, Nachfolge) geht es meist um Arbeitsfähigkeit und Betriebsklima. Verlässt der Konflikt die Unternehmensgrenze (B2B), stehen Geld, Haftung oder eine strategische Partnerschaft auf dem Spiel – der Prozess blendet passende Zusatz-Schritte ein.
> — *variant:* info

#### Ihr Start im Firmen-Abo  `[abo_start]`

*Sichtbar wenn: `{"all": [{"flag": "abo", "eq": "ja"}]}`*

Schlanker Start für Beteiligte in Abo-Fällen: Rahmen akzeptieren, eigene Sicht, Einschätzung.

> **Text:** Ihr Unternehmen stellt diese Mediation im Rahmen seines Abos bereit — für Sie entstehen keine Kosten und kein Papierkram. Zwei Minuten für den Rahmen und Ihre Sicht, mehr braucht es jetzt nicht.

> **zustimmung:** Der Rahmen, auf den Sie sich verlassen können: FREIWILLIG (Ihre Teilnahme ist Ihre Entscheidung — Sie können jederzeit aussteigen). VERTRAULICH (Ihre Eingaben sieht die mediierende Person — nicht Ihr Arbeitgeber; an die Firma gehen nur Status und Ergebnis, nie Ihre Inhalte). ALLPARTEILICH (die Mediation steht auf keiner Seite — auch nicht auf der des Unternehmens). Auf dieser Grundlage mache ich mit.

> **Frage:** Ihre Sicht: Worum geht es in diesem Konflikt aus Ihrer Perspektive — und seit wann beschäftigt er Sie?
> — *map_to:* description

> **Frage:** Was müsste sich konkret ändern, damit die Zusammenarbeit für Sie wieder funktioniert?

> **skala:** Ihre ehrliche Einschätzung: Wo steht der Konflikt heute?
> — *min:* 1
> — *max:* 9
> — *minLabel:* 1 · man redet noch sachlich
> — *maxLabel:* 9 · Schaden wird in Kauf genommen
> — *sets_flag:* {"flag": "glasl_zone", "thresholds": [[1, "win_win"], [4, "win_lose"], [7, "lose_lose"]]}

> **hinweis:** Das war's fürs Erste. Als Nächstes führt Sie die Einleitung durch Gesprächsregeln und Ziele — die mediierende Person meldet sich für den ersten Termin.
> — *variant:* info

### Phase 1 – Einleitung

#### Einleitung & Regeln  `[g_einleitung]`

Rahmen und Haltung.

> **Text:** Wir klären den Rahmen. Die mediierende Person sorgt für einen fairen Ablauf und bleibt allparteilich – sie bewertet nicht und ergreift nicht Partei.

> **akkordeon:** Veränderung erzeugt fast immer Verlustängste – um Status, Komfort oder Kompetenz. Widerstand ist oft weniger Boykott als eine unbewältigte Übergangsphase. Wer das versteht, reagiert gelassener.

> **zustimmung:** Ich halte mich an die Gesprächsregeln: ausreden lassen, sachlich bleiben, Vertraulichkeit wahren.

> **Videokonferenz:** 

### Phase 2 – Themensammlung

#### Diagnose  `[g_diagnose]`

Konfliktart, Eskalationsstufe und Dynamik.

> **Text:** Zuerst verstehen wir den Konflikt genauer – seine Art, seine Schärfe und die Dynamik dahinter.

> **auswahl:** Welche Konfliktart trifft am ehesten zu?
> — *multi:* false
> — *options:* ["Sachkonflikt (Was oder Wie)", "Beziehungskonflikt (Wertschätzung, Sympathie)", "Rollenkonflikt (unklare Zuständigkeiten)", "Strukturkonflikt (systemische Widersprüche)"]

> **hinweis:** Wichtig: Ein Strukturkonflikt – etwa gegeneinander laufende Ziele zweier Abteilungen – lässt sich nicht auf der Beziehungsebene lösen.
> — *variant:* info

> **skala:** Wie weit ist der Konflikt eskaliert? (Glasl-Stufe 1 bis 9)
> — *min:* 1
> — *max:* 9
> — *minLabel:* Verhärtung
> — *maxLabel:* Gemeinsam in den Abgrund
> — *sets_flag:* {"flag": "glasl_zone", "thresholds": [[3, "win_win"], [6, "win_lose"], [9, "lose_lose"]]}

> **hinweis:** Stufe 1 bis 3: Gespräche und Moderation helfen noch (Win-Win). Stufe 4 bis 6: Lagerbildung, externe Mediation ratsam (Win-Lose). Stufe 7 bis 9: gegenseitige Schädigung (Lose-Lose).
> — *variant:* info

> **Frage:** Welche Funktion hat der Konflikt im System – was hält ihn aufrecht?

> **Frage:** Welche verdeckten Gewinne haben die Beteiligten daran, den Konflikt aufrechtzuerhalten?

> **vertrauliche_notiz:** Etwas, das du zunächst nur der mediierenden Person mitteilen möchtest?

#### Vertrag & Projekt-Fakten (B2B)  `[g_b2b_fakten]`

*Sichtbar wenn: `{"all": [{"flag": "business_scope", "eq": "b2b"}]}`*

Sachliche Grundlage für die Klärung mit dem Geschäftspartner.

> **Text:** Bei Konflikten mit Geschäftspartnern zählt die sachliche Grundlage: Liefertermine, Qualität, Service Level. Sammelt die Fakten – nicht als Beweissammlung fürs Rechthaben, sondern damit beide Seiten über dasselbe sprechen.

> **liste:** Strittige Punkte (Liefertermine, Qualität, SLA-Klauseln, Zahlungen …)
> — *placeholder:* Ein Punkt …

> **texteingabe:** Was sagt der Vertrag aus deiner Sicht?
> — *placeholder:* Relevante Klauseln, Vereinbarungen, mündliche Zusagen …

> **datei_upload:** Vertrag, SLA oder relevanter Schriftverkehr (optional)
> — *accept:* .pdf,.doc,.docx

> **hinweis:** Ziel der Mediation ist, dass das Projekt bzw. die Geschäftsbeziehung weiterläuft – statt jahrelang vor Gericht blockiert zu sein.
> — *variant:* info

### Phase 3 – Interessen

#### Interessen & Bedürfnisse  `[g_interessen]`

Interessen statt Positionen.

> **Text:** Hinter Forderungen (Positionen) stehen Bedürfnisse (Interessen). Wenn wir die Interessen verstehen, werden tragfähige Lösungen möglich.

> **Frage:** Was ist dir in diesem Konflikt wirklich wichtig – und warum?

> **ki_interessen:** Leite aus den Positionen die dahinterliegenden Interessen und Bedürfnisse der Beteiligten ab.

> **skala:** Wie wichtig ist dir eine Einigung für die weitere Zusammenarbeit?
> — *min:* 1
> — *max:* 10
> — *minLabel:* weniger wichtig
> — *maxLabel:* sehr wichtig

> **Frage:** Perspektivwechsel: Welches berechtigte Anliegen könnte die andere Seite haben – auch wenn dir ihr Verhalten nicht gefällt?

> **ki_gemeinsamkeiten:** Identifiziere gemeinsame und ergänzende Interessen der Beteiligten (z. B. Projekterfolg, Verlässlichkeit, Anerkennung) und benenne, wo trotz des Konflikts ein gemeinsames Anliegen sichtbar wird.

> **hinweis:** Wenn ihr danach weiter zusammenarbeiten müsst, zählt nicht nur die Sachlösung, sondern auch die Beziehung: Nehmt euch für die Fragen nach Anerkennung, Rolle und Kommunikation genauso viel Zeit wie für die harten Themen (transformativer Ansatz).
> — *variant:* info

### Phase 4 – Optionen

#### Lösungsoptionen  `[g_optionen]`

Ideen sammeln, ohne zu bewerten.

> **Text:** Sammelt möglichst viele Lösungsideen – bewertet wird erst später.

> **liste:** Welche Lösungsmöglichkeiten fallen dir ein?
> — *placeholder:* Eine Idee …

> **ki_optionen:** Erarbeite faire, umsetzbare Optionen, die die Interessen der Beteiligten und die Zusammenarbeit im Team berücksichtigen.

> **hinweis:** Die wichtigste Regel: erst sammeln, dann bewerten. Kritik und „ja, aber …“ heben wir uns für die Verhandlung auf. Denkt auch an strukturelle Lösungen (Rollen, Schnittstellen, Entscheidungswege) – nicht nur an Verhaltensappelle.
> — *variant:* info

> **Frage:** Welche der Optionen erfüllt ein wichtiges Bedürfnis der anderen Seite – ohne dir oder dem Team zu schaden?

### Phase 5 – Verhandlung

#### Bewerten & verhandeln  `[g_verhandlung]`

Verbindliche Lösung finden.

> **Text:** Jetzt bewertet ihr die Optionen und verhandelt eine verbindliche Lösung, die für die Beteiligten und das Team funktioniert.

> **texteingabe:** Deine bevorzugte Lösung
> — *placeholder:* Welche Option bevorzugst du – und unter welchen Bedingungen?

> **Frage:** Was ist deine beste Alternative, falls ihr euch nicht einigt? Was würde das an Zeit, Kosten und für die Zusammenarbeit bedeuten?

> **ki_gemeinsamkeiten:** Zeige Übereinstimmungen und offene Punkte auf und markiere, wo eine Einigung nahe liegt.

> **ranking:** Bring die Lösungsoptionen in deine bevorzugte Reihenfolge.

> **skala:** Wie tragfähig ist die favorisierte Lösung im Arbeitsalltag?
> — *min:* 1
> — *max:* 10
> — *minLabel:* gar nicht
> — *maxLabel:* voll und ganz

> **zustimmung:** Ich bin bereit, die gemeinsam festgehaltenen Schritte im Arbeitsalltag verbindlich umzusetzen.

#### Externe Mediation empfohlen  `[g_esk_extern]`

*Sichtbar wenn: `{"all": [{"flag": "glasl_zone", "eq": "win_lose"}]}`*

Eskalation Win-Lose.

> **hinweis:** Der Konflikt ist bereits in der Win-Lose-Zone. Eine externe, allparteiliche Mediation ist jetzt oft der bessere Weg als eine interne Moderation.
> — *variant:* warnung

> **bezahlung:** Externe Mediation hinzubuchen
> — *description:* Eine neutrale, externe mediierende Person übernimmt die weitere Klärung.
> — *price:* 149.0
> — *currency:* EUR
> — *unlock_text:* Danke – wir melden uns mit einem Terminvorschlag für die externe Mediation.

> **hinweis:** Bei extrem eskalierten Fronten arbeitet die externe Mediation auf Wunsch als Shuttle-Mediation: Die Parteien sitzen in getrennten (virtuellen) Räumen, die mediierende Person pendelt – niemand muss der anderen Seite direkt gegenübersitzen.
> — *variant:* info

#### Rechtliche Einschätzung (evaluativ)  `[g_b2b_evaluativ]`

*Sichtbar wenn: `{"all": [{"flag": "business_scope", "eq": "b2b"}]}`*

Wenn die Vertragslage den Rahmen setzt.

> **Text:** Bei harten Vertragsstreitigkeiten hilft ein evaluatives Element: Eine neutrale Person mit juristischem Hintergrund schätzt die Vertragslage ein und gibt eine Richtung vor – als Grundlage, nicht als Urteil.

> **Frage:** Angenommen, die Vertragslage spricht in einzelnen Punkten gegen euch: Welche Lösung wäre für euch trotzdem vertretbar – und was wäre euch dabei am wichtigsten?

> **bezahlung:** Rechtliche Ersteinschätzung hinzubuchen
> — *description:* Ein:e Wirtschaftsjurist:in bewertet die Vertragslage neutral und allparteilich (evaluative Mediation).
> — *price:* 190.0
> — *currency:* EUR
> — *unlock_text:* Danke – wir melden uns kurzfristig mit der rechtlichen Ersteinschätzung zu eurem Fall.

#### Grenzen der Mediation  `[g_esk_grenzen]`

*Sichtbar wenn: `{"all": [{"flag": "glasl_zone", "eq": "lose_lose"}]}`*

Eskalation Lose-Lose.

> **hinweis:** Lose-Lose-Zone: In dieser Eskalationsstufe hilft Mediation meist nicht mehr. Jetzt sind eine klare Führungsentscheidung (Machtwort), die Trennung der Konfliktparteien oder arbeitsrechtliche Schritte zu prüfen.
> — *variant:* warnung

> **vertrauliche_notiz:** Notiz für Führungskraft / HR – welche nächsten Schritte sind nötig?

### Abschluss

#### Abschluss & Vereinbarung  `[g_abschluss]`

Verbindlich festhalten.

> **Text:** Haltet die Vereinbarung verbindlich fest: wer macht was bis wann.

> **Vertrag:** 
> — *template:* Vereinbarung  
  
1. Vereinbarte Maßnahmen: …  
2. Wer setzt was bis wann um: …  
3. Überprüfung / Follow-up: …  
  
Ort, Datum:

> **unterschrift:** 
> — *statement:* Ich bestätige die oben festgehaltene Vereinbarung.

> **Terminabstimmung:** 

> **Feedback:** 
> — *occasion:* before_contract

> **Frage:** Woran merkt das Team in vier Wochen, dass die Vereinbarung wirkt – was ist dann konkret anders?

## Variante: Externe Mediation

*Neutrale dritte Person mit voller Allparteilichkeit.*

### Phase 0 – Einladung

#### Externe, neutrale Mediation  `[ext_neutral]`

Voller Schutz durch Neutralität.

> **Text:** Diese Mediation wird von einer externen, allparteilichen Person begleitet. Sie gehört keiner Seite an, bewertet nicht und hat kein eigenes Interesse am Ausgang – das schafft den sichersten Rahmen für offene Gespräche.

## Variante: Führungskraft moderiert selbst

*Mediativ orientierte Führung inkl. Rollen- und Machtwort-Grenzen.*

### Phase 0 – Einladung

#### Deine Rolle als Führungskraft  `[vg_rolle]`

Macht & Grenzen.

> **Text:** Als Führungskraft bist du nie ganz neutral – du beurteilst, entscheidest und verteilst am Ende auch Konsequenzen. Das verändert die Dynamik. Mach dir deine Rolle bewusst.

> **auswahl:** Welche Rolle nimmst du in diesem Konflikt ein?
> — *multi:* false
> — *options:* ["Allparteilicher Vermittler", "Zielorientierter Vorgesetzter", "Schiedsrichter (ich entscheide am Ende)"]

> **akkordeon:** Bei Gesetzesverstößen, Compliance-Themen oder fortgeschrittener Eskalation ist Schluss mit Moderation – dann braucht es eine klare Führungsentscheidung.

## Variante: Evaluative Mediation (Realitätscheck)

*Der ehrliche Blick auf Zahlen und Risiken: Was kostet der Streit wirklich, wie stehen die Chancen vor Gericht, wo liegt die Einigungszone? Optionen bekommen ein Preisschild.*

### Phase 1 – Einleitung

#### Evaluative Mediation: der ehrliche Realitätscheck  `[ev_methode]`

Hier wird bewertet: Zahlen, Risiken, Chancen – unbequem ehrlich, dafür schnell.

> **Text:** In dieser Methode bleiben Mediator und KI nicht neutral zurückhaltend – sie bewerten aktiv: Wie stehen die Chancen vor Gericht? Was kostet der Streit wirklich? Welche Option hat den besten Erwartungswert? Ideal, wenn es primär um Geld, Verträge und Risiko geht.

> **akkordeon:** Die Einschätzungen sind Orientierung für die Verhandlung – sie ersetzen keine Rechtsberatung. Für eine anwaltliche Ersteinschätzung gibt es die Bonus-Leistung im Prozess.

> **zustimmung:** Ich will eine ehrliche Einschätzung – auch wenn sie unbequem ist.

### Phase 3 – Interessen

#### Was kostet der Streit?  `[ev_realitaet]`

Der Moment der Wahrheit: Streitwert, Eskalationskosten, Erfolgsaussichten – schwarz auf weiß.

> **betrag:** Um welchen Wert geht es (Streitwert)?
> — *currency:* €

> **betrag:** Geschätzte Kosten bei voller Eskalation (Anwälte, Gericht, interne Zeit, entgangene Geschäfte)
> — *currency:* €

> **skala:** Wie schätzt du deine Erfolgsaussichten vor Gericht ein?
> — *min:* 0
> — *max:* 10
> — *minLabel:* chancenlos
> — *maxLabel:* sicherer Sieg

> **vertrauliche_notiz:** Deine Schmerzgrenze: Bis zu welchem Ergebnis würdest du noch abschließen? (sieht nur der Mediator)

> **hinweis:** Psychologie (Verlustaversion): Menschen überschätzen ihre Prozesschancen systematisch und unterschätzen Dauer und Kosten. Der richtige Vergleichsmaßstab ist nicht der Sieg – sondern das wahrscheinliche Szenario nach zwei Jahren Verfahren.
> — *variant:* warning

> **ki_prompt:** Erstelle aus den Angaben beider Seiten eine nüchterne Kosten-Risiko-Gegenüberstellung: bestes, wahrscheinliches und schlechtestes Szenario je Seite (inkl. Zeit- und Beziehungskosten). Rechne vor, ab welchem Einigungswert eine Einigung für jede Seite rational besser ist als das wahrscheinliche Prozess-Szenario.
> — *autorun:* false

### Phase 4 – Optionen

#### Optionen mit Preisschild  `[ev_bewertung]`

Jede Option bekommt Risiko, Kosten und Dauer – dann wird sortiert.

> **ki_optionen:** Entwickle Lösungsoptionen und bewerte JEDE mit: Risiko (hoch/mittel/niedrig), einmalige und laufende Kosten, Umsetzungsdauer und Erwartungswert je Seite. Markiere die Option mit dem besten Erwartungswert für BEIDE Seiten und begründe kurz.
> — *autorun:* false

> **ranking:** Sortiere die bewerteten Optionen nach deiner Präferenz.

### Phase 5 – Verhandlung

#### Die Einigungszone  `[ev_zone]`

Ab jetzt wird jede Forderung am wahrscheinlichen Szenario gemessen – nicht am Wunschergebnis.

> **ki_gemeinsamkeiten:** Ermittle aus den Schmerzgrenzen und den Szenario-Rechnungen die rechnerische Einigungszone (ohne vertrauliche Grenzen offenzulegen). Benenne, ob eine Zone existiert, wie breit sie ungefähr ist und welcher Bereich für beide Seiten dem wahrscheinlichen Prozess-Szenario überlegen ist.
> — *autorun:* false

> **Text:** Regie: Jede Forderung wird ab jetzt am wahrscheinlichen Szenario gemessen – nicht am besten. Wer mehr will als die Einigungszone hergibt, verhandelt gegen die eigene Rechnung.

> **ki_optionen:** Entwickle innerhalb der Einigungszone zwei bis drei Abschluss-Optionen (z.B. Einmalzahlung vs. Raten, sofort vs. gestuft, mit/ohne künftige Zusammenarbeit) und weise für jede den Vorteil gegenüber dem wahrscheinlichen Prozess-Szenario aus.
> — *autorun:* false

> **zustimmung:** Ich verhandle auf Basis des wahrscheinlichen Szenarios weiter – nicht des besten.

### Abschluss

#### Der Vergleich  `[ev_vergleich]`

Das Ergebnis in einem Satz: schneller, günstiger und planbarer als jedes Verfahren.

> **Text:** Der Abschluss hält fest, was beide Seiten dem Verfahren voraus haben: Zeit, Kosten, Planbarkeit – und die Entscheidung lag bei euch, nicht bei einem Gericht.

> **unterschrift:** 
> — *statement:* Ich bestätige den erarbeiteten Vergleich.

## Variante: Harvard-Methode (sachbezogen zum Ja)

*Hart in der Sache, weich zu den Menschen: Interessen statt Positionen, Plan B (BATNA), Optionen-Werkstatt, objektive Kriterien – bis beide Seiten guten Gewissens Ja sagen können.*

### Phase 1 – Einleitung

#### So funktioniert die Harvard-Methode  `[hv_methode]`

Der inszenierte Einstieg: vier Prinzipien, ein Ziel – das beiderseitige Ja.

> **Text:** Willkommen zur Harvard-Methode – der weltweit meistgenutzten Verhandlungsmethode (aus „Getting to Yes“, Harvard Negotiation Project). Die Regel Nummer eins: Wir verhandeln hart in der Sache, aber weich zu den Menschen. Am Ende steht keine faule Mitte, sondern eine Lösung, zu der beide Seiten aus eigener Überzeugung Ja sagen.

> **akkordeon:** Der Konflikt ist das Problem – nicht die Person auf der anderen Seite. Vorwürfe kosten Verhandlungsmacht; wer sachlich bleibt, führt das Gespräch.

> **akkordeon:** Eine Position ist eine Forderung („Ich will 60 %“). Ein Interesse ist der Grund dahinter (Sicherheit, Anerkennung, Liquidität). Positionen kollidieren – Interessen lassen sich fast immer gleichzeitig erfüllen.

> **akkordeon:** Erst die Menge, dann die Auswahl. Wer Ideen sofort bewertet, bekommt keine mehr. In der Optionen-Werkstatt gilt deshalb: sammeln ohne Kritik – aussortiert wird später.

> **akkordeon:** Nicht wer lauter ist gewinnt, sondern was sich an neutralen Maßstäben messen lässt: Marktwert, Gutachten, Branchenstandard, Rechtsprechung.

> **zustimmung:** Ich verhandle über Interessen, nicht über Positionen – und ich bewerte Ideen erst, wenn alle auf dem Tisch liegen.

### Phase 3 – Interessen

#### Dein Plan B (BATNA)  `[hv_batna]`

Vertraulicher Realitätsanker: Wer seinen Plan B kennt, verhandelt ruhig und souverän.

> **Text:** BATNA heißt: die beste Alternative, falls es KEINE Einigung gibt (Best Alternative To a Negotiated Agreement). Sie ist dein Maßstab: Jede Einigung muss besser sein als dein Plan B – und keine darf schlechter sein. Wer seine BATNA kennt, muss nichts annehmen und nichts fürchten. Diese Angaben sieht nur der Mediator, nie die Gegenseite.

> **vertrauliche_notiz:** Was ist deine beste Alternative, wenn ihr euch NICHT einigt? (z.B. Gericht, neuer Lieferant, Verkauf, Auszug – so konkret wie möglich)

> **skala:** Wie stark ist dein Plan B wirklich?
> — *min:* 1
> — *max:* 10
> — *minLabel:* schwach / teuer
> — *maxLabel:* stark / jederzeit machbar

> **hinweis:** Psychologie: Verhandlungsmacht kommt nicht aus Lautstärke, sondern aus der Qualität deines Plan B. Und: Die Gegenseite hat auch einen – meist schlechter, als du befürchtest.
> — *variant:* info

> **ki_interessen:** Leite aus den geäußerten Positionen die dahinterliegenden Interessen jeder Partei ab. Zeige für jede Seite: die Forderung, das vermutete Interesse dahinter und ein Interesse, das beide teilen.
> — *autorun:* false

### Phase 4 – Optionen

#### Optionen-Werkstatt: erst Menge, dann Bewertung  `[hv_werkstatt]`

Brainstorm-Bühne mit KI-Verstärkung – der Kuchen wird größer, bevor er verteilt wird.

> **hinweis:** Werkstatt-Regel: Sammeln ohne Bewerten. Auch halbfertige oder verrückte Ideen zählen – Bewertungsangst ist der schnellste Weg, gute Lösungen zu verlieren.
> — *variant:* info

> **liste:** Sammle Lösungsideen – Menge vor Qualität. Was könnte den Kuchen größer machen (Zusatzleistungen, Zeitachsen, Tauschgeschäfte)?
> — *placeholder:* Idee hinzufügen …

> **ki_optionen:** Erarbeite aus den Ideen und Interessen BEIDER Seiten mindestens fünf konkrete Lösungsoptionen. Nutze unterschiedliche Prioritäten für Tauschgewinne (was der einen Seite wenig kostet und der anderen viel bringt), erweitere den Kuchen statt ihn nur zu teilen, und füge bewusst eine unkonventionelle Option hinzu. Formuliere jede Option so, dass beide Seiten ihr Interesse darin wiederfinden.
> — *autorun:* false

> **ranking:** Bringe die Optionen in DEINE Reihenfolge (die Gegenseite sieht nur das Ergebnis, nicht deine Gedanken).

### Phase 5 – Verhandlung

#### Objektive Kriterien & das Paket  `[hv_kriterien]`

Die Ja-Straße: neutrale Maßstäbe vereinbaren, Pakete schnüren, Teilzustimmungen sammeln.

> **auswahl:** Welche neutralen Maßstäbe akzeptierst du für die Bewertung?
> — *multi:* true
> — *options:* ["Marktwert / unabhängiges Gutachten", "Branchenüblicher Standard", "Rechtsprechung in vergleichbaren Fällen", "Gleichbehandlung (wie in früheren Fällen gelöst)", "Hälftige Teilung als Ausgangspunkt", "Einschätzung eines externen Experten"]

> **ki_gemeinsamkeiten:** Identifiziere aus Rankings und Kriterien-Auswahl beider Seiten, wo die Einigung bereits nahe liegt und wo die echten Reibungspunkte sind. Beginne mit den Übereinstimmungen.
> — *autorun:* false

> **ki_optionen:** Schnüre aus den am besten bewerteten Optionen zwei bis drei GESAMTPAKETE. Weise für jedes Paket aus, welches Kerninteresse jeder Seite es erfüllt und an welchem objektiven Kriterium es sich misst. Ziel: Beide Seiten können zu einem Paket ein klares Ja sagen.
> — *autorun:* false

> **zustimmung:** Ich bin bereit, auf Basis eines dieser Pakete abzuschließen, wenn es besser ist als mein Plan B.

> **hinweis:** Psychologie: Jedes kleine Ja macht das große Ja leichter (Konsistenz-Prinzip). Deshalb sammeln wir Teilzustimmungen, statt alles an einer einzigen Entscheidung hängen zu lassen.
> — *variant:* success

### Abschluss

#### Das Ja festhalten  `[hv_ja_fixieren]`

Commitment sichern: schriftlich, konkret, mit Blick nach vorn.

> **Text:** Was schriftlich festgehalten wird, hält. Nicht als Misstrauen, sondern als Psychologie: Ein dokumentiertes, selbst formuliertes Commitment wird um ein Vielfaches häufiger eingehalten als ein mündliches.

> **texteingabe:** Blick nach vorn: Was wirst du in einem Jahr über diese Lösung sagen?
> — *placeholder:* In einem Jahr …

> **unterschrift:** 
> — *statement:* Ich stehe zu der gefundenen Lösung und setze meinen Teil um.

## Variante: Shuttle-Mediation (getrennte Gespräche)

*Die Parteien treffen sich zunächst nicht: Der Mediator pendelt vertraulich zwischen den Seiten. Ideal bei hoher Eskalation, Machtgefälle oder hartem B2B-Poker.*

### Phase 1 – Einleitung

#### Shuttle-Mediation: Der Mediator pendelt  `[sh_methode]`

Getrennte Räume, volle Vertraulichkeit – die Konfrontation entfällt, die Lösung nicht.

> **Text:** In dieser Mediation sitzt ihr euch zunächst NICHT gegenüber. Jede Seite hat ihren eigenen, vertraulichen Raum – der Mediator pendelt dazwischen, übersetzt, filtert Schärfe heraus und trägt nur das weiter, was freigegeben ist. Erst wenn eine Einigung greifbar ist, kommt es zur Zusammenführung.

> **akkordeon:** Bei hoher Eskalation, wenn direkte Gespräche sofort entgleisen; bei Machtgefälle (z.B. Chef/Mitarbeiter, Konzern/Zulieferer); und im harten B2B-Verhandlungspoker, wo keine Seite ihre Karten zeigen will.

> **zustimmung:** Vertraulichkeitsregel: Nichts aus meinem Einzelgespräch geht ohne meine ausdrückliche Freigabe an die andere Seite.

### Phase 2 – Themensammlung

#### Dein vertraulicher Raum  `[sh_einzelraum]`

Hier darfst du offen sein: Nur der Mediator liest mit.

> **vertrauliche_notiz:** Was soll der Mediator wissen, was die Gegenseite (noch) nicht hören soll? (Hintergründe, Befürchtungen, rote Linien)

> **vertrauliche_notiz:** Ganz ehrlich: Was wäre dein bestes realistisches Ergebnis – und was das schlechteste, das du gerade noch akzeptieren könntest?

> **skala:** Wie viel Vertrauen hast du aktuell in eine Einigung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* keins
> — *maxLabel:* volles Vertrauen

### Phase 3 – Interessen

#### Was darf rüber?  `[sh_freigabe]`

Kontrollierte Dosierung: Deine Botschaft wird übersetzt, bevor sie die Seite wechselt.

> **texteingabe:** Deine Botschaft an die Gegenseite – der Mediator übermittelt sie.
> — *placeholder:* Was soll die andere Seite von dir hören?

> **hinweis:** Psychologie: In getrennten Räumen eskaliert nichts. Der Mediator dosiert die Information und nimmt die Schärfe heraus – so bleibt der Inhalt, aber der Stachel geht verloren.
> — *variant:* info

> **ki_reframing:** Übersetze die Botschaft in eine annehmbare, gesichtswahrende Form, ohne den Inhalt zu verfälschen. Gesichtswahrung ist die Währung der Shuttle-Mediation: Die Gegenseite muss zustimmen können, ohne als Verlierer dazustehen.
> — *autorun:* false

### Phase 4 – Optionen

#### Der Einigungskorridor  `[sh_korridor]`

Die KI ermittelt aus beiden vertraulichen Lagen, OB und WO ein Korridor existiert.

> **ki_gemeinsamkeiten:** Ermittle aus den vertraulichen Angaben beider Seiten (beste/gerade noch akzeptable Ergebnisse), OB ein Einigungskorridor existiert und WO er ungefähr liegt – OHNE vertrauliche Details oder Schmerzgrenzen offenzulegen. Formuliere nur die Überlappung in neutralen Worten.
> — *autorun:* false

> **ki_optionen:** Entwickle Lösungsoptionen INNERHALB des Einigungskorridors. Formuliere jede Option so, dass keine Seite ihr Gesicht verliert und keine als Sieger oder Verlierer dasteht. Der Vorschlag kommt vom Mediator – nicht von einer Partei.
> — *autorun:* false

> **hinweis:** Ankereffekt: Die erste genannte Zahl setzt den Rahmen der ganzen Verhandlung. Deshalb bringt hier der Mediator die Vorschläge ein – so wirkt kein einseitiger Anker.
> — *variant:* warning

### Phase 5 – Verhandlung

#### Pendel-Runden  `[sh_runden]`

Runde für Runde nähern sich die Angebote an – die KI baut Brücken, wenn es stockt.

> **Text:** Regie: Der Mediator holt in jeder Runde von beiden Seiten ein aktualisiertes Angebot ein und pendelt damit zur anderen Seite. Du entscheidest jede Runde neu – ohne Druck des direkten Gegenübers.

> **vertrauliche_notiz:** Dein aktuelles Angebot für diese Runde – und deine Schmerzgrenze (sieht nur der Mediator).

> **ki_optionen:** Die Runde stockt: Entwickle eine Brücken-Option, die genau zwischen den aktuellen Angeboten liegt, aber nicht einfach die Mitte teilt – sondern die wichtigsten Interessen beider Seiten kombiniert (z.B. mehr Betrag gegen längere Frist, Zusage gegen Garantie).
> — *autorun:* false

> **zustimmung:** Ich akzeptiere den vom Mediator vorgeschlagenen Korridor als Grundlage für die letzte Runde.

### Abschluss

#### Die Zusammenführung  `[sh_zusammenfuehrung]`

Der große Moment: Erst für das Ja kommen beide Seiten wieder an einen Tisch.

> **Text:** Jetzt – und erst jetzt – kommen beide Seiten wieder in einen gemeinsamen (virtuellen) Raum. Nicht um zu verhandeln, sondern um das gefundene Ergebnis gemeinsam zu besiegeln. Die schwere Arbeit ist getan; dieser Termin ist der Handschlag.

> **unterschrift:** 
> — *statement:* Ich bestätige das in den Pendel-Runden erarbeitete Ergebnis.

## Variante: Transformative Mediation (Beziehung zuerst)

*Erst die Menschen, dann die Sache: Empowerment und Anerkennung, Perspektivwechsel, gemeinsames Zukunftsbild – für alle, die weiter zusammenarbeiten oder Familie bleiben.*

### Phase 1 – Einleitung

#### Transformative Mediation: erst die Menschen, dann die Sache  `[tf_methode]`

Zwei Säulen tragen alles: eigene Stärke (Empowerment) und echtes Anerkennen (Recognition).

> **Text:** Diese Methode dreht die Reihenfolge um: Bevor wir über die Streitsache sprechen, stärken wir das Gespräch selbst. Denn wo Menschen weiter zusammenarbeiten oder Familie bleiben, ist die Beziehung das eigentliche Verhandlungsergebnis.

> **akkordeon:** Jede Seite gewinnt Klarheit über die eigenen Ziele, Ressourcen und Entscheidungen. Wer sich stark fühlt, muss nicht mehr laut sein.

> **akkordeon:** Die Perspektive der anderen Seite wirklich zu verstehen ist keine Schwäche, sondern der schnellste Weg, selbst verstanden zu werden.

> **zustimmung:** Ich bin bereit, der anderen Seite zuzuhören, ohne zu unterbrechen – und werde selbst ohne Unterbrechung sprechen können.

### Phase 2 – Themensammlung

#### Deine Geschichte  `[tf_geschichte]`

Kein Fragenkatalog – eine Bühne: Erzähl den Konflikt, wie du ihn erlebt hast.

> **texteingabe:** Erzähl den Konflikt als Geschichte: Wie hat es angefangen? Was war der Wendepunkt? Wo stehst du heute?
> — *placeholder:* Am Anfang …

> **video_aufnahme:** Optional: Erzähl deine Geschichte als kurze Videobotschaft – gesprochen wirkt sie oft stärker als geschrieben.

> **KI-Zusammenfassung:** Fasse die Geschichten beider Seiten wertschätzend zusammen. Hebe hervor, was jeder Seite erkennbar wichtig ist und wo sich die Erzählungen berühren. Keine Schuldzuweisungen, keine Bewertung.
> — *autorun:* false

### Phase 3 – Interessen

#### Der Perspektivwechsel  `[tf_perspektive]`

Die Königsdisziplin: Beschreibe den Konflikt so, dass die Gegenseite nicken würde.

> **Text:** Regie: Steig für zehn Minuten in die Schuhe der anderen Seite. Nicht um recht zu geben – sondern um zu verstehen, wogegen du eigentlich verhandelst.

> **texteingabe:** Beschreibe den Konflikt aus Sicht der Gegenseite – so fair und genau, dass sie nicken würde.
> — *placeholder:* Aus ihrer Sicht …

> **ki_reframing:** Vergleiche die Selbstbeschreibung jeder Seite mit der Fremdbeschreibung durch die andere. Zeige die Recognition-Momente: Wo hat eine Seite die andere bereits richtig verstanden? Formuliere diese Momente ausdrücklich als Anerkennung.
> — *autorun:* false

> **hinweis:** Psychologie: Wer die Gegenseite präzise wiedergibt, wird selbst eher gehört – Zuhören erzeugt Zuhören (Reziprozität).
> — *variant:* success

### Phase 4 – Optionen

#### Anerkennung & gemeinsame Optionen  `[tf_anerkennung]`

Aus Wertschätzung werden Optionen: Die KI verbindet Beziehung und Sachlösung.

> **texteingabe:** Nenne zwei Dinge, die du an der anderen Seite oder an eurer bisherigen Zusammenarbeit schätzt.
> — *placeholder:* 1. … 2. …

> **skala:** Wie wichtig ist dir die künftige Beziehung?
> — *min:* 1
> — *max:* 10
> — *minLabel:* abwickeln
> — *maxLabel:* unbedingt erhalten

> **ki_optionen:** Entwickle Lösungsoptionen, die die Sachfrage lösen UND die Beziehung stärken. Beginne jede Option mit dem gemeinsamen Nutzen für die künftige Zusammenarbeit bzw. das künftige Miteinander und greife die gegenseitige Wertschätzung ausdrücklich auf.
> — *autorun:* false

### Phase 5 – Verhandlung

#### Das gemeinsame Zukunftsbild  `[tf_zukunft]`

Verhandelt wird rückwärts: erst das Bild in zwölf Monaten, dann der Weg dorthin.

> **texteingabe:** Wie sieht eine gute Zusammenarbeit / ein gutes Miteinander in zwölf Monaten konkret aus?
> — *placeholder:* In zwölf Monaten …

> **ki_gemeinsamkeiten:** Lege die Zukunftsbilder beider Seiten übereinander: Wo decken sie sich bereits? Formuliere daraus ein gemeinsames Zukunftsbild in drei Sätzen und benenne die zwei Punkte, die noch zu klären sind.
> — *autorun:* false

> **ki_optionen:** Entwickle für die noch offenen Punkte Optionen, die zum gemeinsamen Zukunftsbild passen – jede Option als konkreter erster Schritt, den beide Seiten sofort gehen könnten.
> — *autorun:* false

> **zustimmung:** Ich trage das gemeinsame Zukunftsbild mit.

### Abschluss

#### Abschluss mit Anerkennung  `[tf_ritual]`

Kein Vertragstermin, ein Ritual: Vorsatz und Wunsch besiegeln die Transformation.

> **texteingabe:** Was nimmst du dir konkret vor – und was wünschst du der anderen Seite?
> — *placeholder:* Ich nehme mir vor … / Ich wünsche dir …

> **unterschrift:** 
> — *statement:* Ich stehe zu meinem Vorsatz und zum gemeinsamen Zukunftsbild.


\newpage

# Organisation

## Standard-Workflow

### Phase 0 – Einladung

#### Grundkonfiguration (Firmen-Abo)  `[abo_grundkonfiguration]`

Einmal pro Unternehmen: Rahmen für alle Abo-Mediationen festlegen und akzeptieren.

> **Text:** Einmal einrichten, für alle Fälle gültig: Hier legen Sie den Rahmen fest, in dem Mediationen in Ihrem Unternehmen ablaufen — wer was sieht, wann mediiert wird und was gilt, wenn eine Klärung scheitert. Diese Konfiguration ist Teil Ihres Abos und muss akzeptiert sein, bevor der erste Fall startet.

> **Text:** Damit Mitarbeitende offen sprechen können, gilt: Beteiligte sehen ihre eigenen Eingaben. Die mediierende Person sieht alle Inhalte ihres Falls. Firmen-Admins sehen Status und Fortschritt ihrer Fälle — aber NICHT die inhaltlichen Eingaben der Beteiligten. Inhalte werden nicht für Personalentscheidungen bereitgestellt.

> **hinweis:** Freiwilligkeit im Arbeitskontext: Die Teilnahme an einer Mediation kann empfohlen, aber nicht angeordnet werden. Eine erzwungene Mediation scheitert fast immer — und beschädigt das Vertrauen in das Angebot.
> — *variant:* warnung

> **auswahl:** Für welche Konfliktfelder soll Mediation bei Ihnen zur Verfügung stehen?
> — *options:* ["Konflikte im Team", "Führungskraft ↔ Mitarbeitende", "Zwischen Abteilungen / Bereichen", "Gesellschafter / Geschäftsführung", "Mit Kunden oder Lieferanten"]
> — *multi:* true

> **auswahl:** Was ist der Standard-Weg, wenn ein Konflikt gemeldet wird?
> — *options:* ["Direkt Fall anlegen und Mediator zuordnen", "Erst ein Vorgespräch (HR / Ansprechperson), dann Fall", "Entscheiden wir je nach Fall"]
> — *multi:* false

> **Frage:** Was gilt, wenn eine Mediation scheitert oder abgebrochen wird — wer übernimmt dann, und welche Schritte folgen (z. B. Führungsentscheid, HR-Verfahren, externe Beratung)?

> **Frage:** Wer ist die interne Ansprechperson für Mediationsanliegen (Name und Rolle)? An sie wenden sich Mitarbeitende zuerst.

> **zustimmung:** Diese Grundkonfiguration gilt als verbindlicher Rahmen für alle Mediationen unseres Unternehmens. Ich bin berechtigt, sie für das Unternehmen festzulegen, und akzeptiere sie — insbesondere die Regeln zu Vertraulichkeit, Datenzugriff und Freiwilligkeit.
