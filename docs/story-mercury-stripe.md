# Story und Kontext nach Mercury- und Stripe-Muster

Stand: 01.11.2026

Was medipact von den Seiten von Mercury und Stripe übernehmen kann. Übernommen
werden die Muster, nicht der Look: Wer medipact besucht, steckt in einem
Konflikt. Die Seite muss warm und ruhig wirken, nicht wie ein kühles Fintech.

**Grundregel:** Ergänzen, nicht ersetzen. Bilder, Hero-Fotos und bestehende
Sektionen bleiben. Keine erfundenen Zahlen: Solange es keine echten Fälle
gibt, stehen Fall- und Erfolgszahlen nirgends (siehe AGENTS.md zu
`DidYouKnowSection`, gleiche Linie wie `AboutVisionSection`).

## Umgesetzt

- [x] **Seite für Eingeladene** `/eingeladen` (Muster Stripe: eigener Weg je
  Zielgruppe). Die eingeladene Seite ist die größte Hürde, ohne ihr Ja gibt es
  keinen Fall. Inhalt: Entlastung („kein Schritt gegen Sie“), was medipact
  nicht ist, die vier Grundsätze, drei Schritte, Kosten, FAQ mit
  FAQPage-Schema. Verlinkt aus Footer und Startseite (Zeile unter der
  Erste-Hilfe-Box), in der Sitemap.
- [x] **Was medipact nicht ist** (Muster Mercury: „Mercury ist keine Bank“):
  keine Kanzlei, kein Gericht, Rechtsweg bleibt offen. Steht auf
  `/eingeladen`; auf `/about` gab es die Aussagen schon.
- [x] **Offene Kosten** für Eingeladene (Muster Stripe: „2,9 % + 30 ¢“):
  Konto kostenlos, Kosten erst bei Freischaltung durch beide, Festpreis je
  Partei, Anteil kann übernommen werden.
- [x] **Auf die Konflikt-Seiten ausgeweitet** über `EinordnungHinweis`
  (`MarketingPageTemplate`, Prop `einordnung`, vor den FAQ): „Was medipact
  nicht ist", Kosten in einem Satz mit Link auf `/preise`, „Sie wurden
  eingeladen?" mit Link auf `/eingeladen`. An auf Trennung (nur deutsch),
  Nachbarschaft, Erbschaft, Arbeitsplatz, Mietverhältnis, Verbraucher. Nicht
  auf ODR (andere Abrechnung). Die Kosten-Zeile nennt keinen Betrag und kein
  „je Partei", weil Arbeitsplatz pauschal pro Fall kostet.

## Als Nächstes, ohne neue Daten möglich

- [ ] **Link aus der Einladungs-Mail auf `/eingeladen`.** Die Mail baut kerno
  (`backend/app/routers/invites.py`, `send_invite_email`). Nur für den
  Mandanten medipact, z. B. als Zeile „Was ist medipact?“ unter dem Button.
- [ ] **Produkt zeigen** (Muster Mercury: echte Oberfläche im Hero). Ergänzend
  zu den Fotos, nicht statt ihrer: eine Sektion „So sieht es aus“ mit echten
  Ausschnitten aus app.medipact.de (Phasen, Logbuch, Betreuungskalender).
  Braucht Screenshots mit Beispieldaten, keine echten Fälle.
- [ ] **Das Gefühl in den Mittelpunkt** (Muster Mercury: Kontrolle und Ruhe).
  Im Konflikt: Chaos, Ohnmacht, Angst vor Kosten. Versprechen: „Struktur statt
  Eskalation, jede Seite in ihrem Tempo, schriftlich, ohne Schlagabtausch.“
  Als Zwischenzeile oder in `ZweiWelten`, die H1 bleibt.
- [ ] **Mission mit Kontext** (Muster Stripe: „das BIP des Internets
  steigern“). „Konflikte klären, bevor sie vor Gericht landen“, dazu
  belegte Zahlen zu Dauer und Kosten von Gerichtsverfahren
  (Justizstatistik, mit Quelle als Fußnote wie bei `bekanntAusTags`).
- [ ] **Ratgeber als Autorität ausbauen** (Muster Stripe Press und Doku):
  „Mediation oder Anwalt?“, Checklisten. Der Ratgeber-Cluster steht schon,
  hier nur weiter nach Suchsprache (`docs/ratgeber-suchsprache.md`).

## Später, wenn es echte Daten gibt

- [ ] **Gründungsgeschichte** (Muster Mercury): warum es medipact gibt, von
  einer echten Person erzählt. Angaben kommen von Julian, Platz ist
  `FounderSection.tsx` (siehe `docs/offene-punkte-about-und-einstieg.md`).
- [ ] **Angaben zu den Mediator:innen**: Ausbildung, Zahl, Regionen. Erst wenn
  sie feststehen und belegbar sind.
- [ ] **Echte Fallgeschichten** (Muster Stripe: Kundenstories). Vorher,
  Ablauf, Ergebnis; anonymisiert und nur mit Einwilligung. Die bestehenden
  `/cases` sind Beispiele und müssen als solche erkennbar bleiben.
- [ ] **Zahlen auf der Startseite**: Einigungsquote, durchschnittliche Dauer,
  Zufriedenheit. Erst ab einer belastbaren Zahl von Fällen.
- [ ] **Jahresbericht** (Muster Stripe-Jahresbrief): einmal im Jahr, was
  gelernt wurde und wie viele Konflikte ohne Gericht geklärt wurden.

## Bewusst nicht übernommen

- Der dunkle, kühle Fintech-Look und der Entwickler-Ton.
- Größenangaben („Millionen Unternehmen vertrauen …“). Bei medipact wirken
  sie unglaubwürdig, solange es keine Fälle gibt, und auch danach unpersönlich.
