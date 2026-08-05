# ProvenExpert für medipact – Einrichtung, Texte, Einbindung

Stand: 02.08.2026. Preise und Feature-Grenzen bitte vor Buchung auf
provenexpert.com gegenprüfen – die ändern sich regelmäßig.

---

## 0. Vorab: die drei Dinge, die bei medipact anders sind

Bevor du loslegst – drei Punkte, die bei einem Mediationsanbieter nicht so
laufen wie beim Handwerker oder Steuerberater:

**a) Vertraulichkeit ist das Produkt.** Wer bei dir eine Trennungs- oder
Erbmediation macht, will nicht, dass irgendwo öffentlich steht, dass er das
getan hat. Eine Bewertungsanfrage ist deshalb heikler als anderswo: Schon die
E-Mail landet potenziell im gemeinsamen Postfach eines Paares, das sich
gerade trennt. Konsequenz: **Bewertungen konsequent anonym**, Anfrage erst
nach Abschluss, und im Anschreiben ausdrücklich sagen, dass anonym geht.
ProvenExpert unterstützt "Anonymes Feedback" in allen Tarifen.

**b) Der B2C- und der B2B-Funnel brauchen unterschiedliche Belege.** Für
Privatpersonen zählt "war fair, hat funktioniert, kein Gericht". Für
Business-Tarife zählt Prozesssicherheit. Ein einziges Profil muss beides
tragen – deshalb unten zwei getrennte Umfragen statt einer.

**c) Google zeigt keine Sterne für Selbstbewertungen.** Wichtig, bevor du für
"Google-Sterne" bezahlst – Details in Abschnitt 5.

---

## 1. Tarif wählen

ProvenExpert hat vier Stufen. Entscheidend sind nicht die Preise, sondern
zwei Feature-Grenzen:

| | Free | Basic | Plus | Premium |
|---|---|---|---|---|
| Sichtbare Bewertungen | 10 | 50 | 250 | unbegrenzt |
| Aktive Umfragen | 5 | 25 | 50 | unbegrenzt |
| Bewertungen bleiben dauerhaft online | – | ✓ | ✓ | ✓ |
| Responsives Bewertungs-Widget | – | ✓ | ✓ | ✓ |
| **Google-Sterne-Code für die eigene Website** | – | – | **✓** | ✓ |
| PRO Seal + Google-Sterne | – | – | ✓ | ✓ |
| API | – | – | ✓ | ✓ |

(Feature-Matrix laut ProvenExpert-Preisseite, US-Version, abgerufen 02.08.2026.
Die €-Preise der DE-Seite bitte direkt prüfen; Drittquellen widersprechen sich.)

**Empfehlung für den Start: Free.**
Grund: Du hast noch keine Bewertungen. Das 10er-Limit ist bei einem jungen
Angebot Monate entfernt, und der teuerste Tarifgrund – der Google-Sterne-Code
– ist wegen Abschnitt 5 ohnehin fraglich. Wechsle auf **Basic**, sobald du an
10 Bewertungen kratzt (dann greift auch "bleiben dauerhaft online" – im Free
rutschen ältere Bewertungen aus der Anzeige). Der 30-Tage-Premium-Test läuft
automatisch aus und fällt auf Free zurück; nutze ihn, um die Umfragen
vollständig anzupassen, das bleibt danach bestehen.

**Nicht buchen, solange du unter ~20 Bewertungen bist:** Plus/Premium. Ein
Siegel mit drei Bewertungen wirkt schwächer als gar keins.

---

## 2. Profil anlegen – Schritt für Schritt

### Schritt 1: Registrierung
provenexpert.com → "Jetzt starten" → **Firmenprofil**, nicht Personenprofil.

> ⚠️ **Der Name lässt sich später nur über den Support ändern.** Schreibweise
> vorher festlegen. Empfehlung: **`medipact`** – klein, wie im Impressum und
> auf der ganzen Website. Nicht "Medipact GmbH" (die gibt es nicht) und nicht
> "medipact – Online-Mediation" (Zusätze im Namen wirken auf Bewertungs-
> plattformen wie Keyword-Stuffing).

### Schritt 2: Stammdaten
Direkt aus dem Impressum, damit NAP-Konsistenz (Name/Adresse/Telefon) für
Local SEO gegeben ist – Google gleicht diese Angaben quellenübergreifend ab:

```
Firma:     medipact
Inhaber:   Julian Wieder
Straße:    Ernst-Ludwig-Allee 14
PLZ/Ort:   63303 Dreieich
Land:      Deutschland
Telefon:   +49 1520 9942351
E-Mail:    hallo@medipact.de
Website:   https://medipact.de
```

Genau diese Schreibweise auch bei Google Business Profile, LinkedIn usw.
verwenden – Abweichungen (z. B. "Ernst-Ludwig-Allee 14a" oder "0152 …")
schwächen das Signal.

### Schritt 3: Branche/Kategorie
ProvenExpert gibt eine feste Branchenliste vor. Passendste Wahl:
**„Beratung"** bzw. **„Rechtsberatung/Recht"**, sofern vorhanden auch
**„Mediation"**. Die Branche steuert die Umfragevorlage – wähle die, deren
Standardfragen am ehesten zu einem Mediationsverfahren passen (Fragen zu
Erreichbarkeit, Verständlichkeit, Ergebnis). Die Vorlage lässt sich danach
anpassen.

### Schritt 4: Profil-URL
Wunsch-URL festlegen: `provenexpert.com/de-de/medipact/`

### Schritt 5: Texte einpflegen
→ Fertige Texte in Abschnitt 3.

### Schritt 6: Bilder
- **Profilbild/Logo:** dasselbe Logo wie `public/logo.png` (quadratisch,
  512×512). Konsistenz mit dem `logo`-Feld im Organization-JSON-LD.
- **Titelbild:** ein Foto aus `fotos/` – nicht das og-Banner (falsches
  Format). Kein Stockfoto mit Handschlag; nimm eins der bereits auf der Site
  verwendeten Motive, dann erkennt der Besucher die Marke wieder.

### Schritt 7: Umfragen anlegen
→ Abschnitt 4.

### Schritt 8: Veröffentlichen
Das Profil ist erst nach ausdrücklicher Veröffentlichung öffentlich und
indexierbar. Vorher: Rechtschreibung prüfen, Links testen.

### Schritt 9: Datenschutzerklärung ergänzen
**Pflicht, sobald du das Widget einbindest** (Abschnitt 5) – nicht erst
danach nachziehen. Der Abschnitt gehört in `app/datenschutz/page.tsx`:
Anbieter (Expert Systems AG, Berlin), Zweck, Rechtsgrundlage (Art. 6 Abs. 1
lit. f DSGVO), Datenübertragung beim Laden des Widgets, Link zur
ProvenExpert-Datenschutzerklärung. Formulierung vorab anwaltlich prüfen
lassen oder ein geprüftes Muster verwenden.

---

## 3. Profiltexte (copy-paste-fertig)

### Profil-Slogan / Kurzbeschreibung (1 Satz)

```
Online-Mediation für Trennung, Erbe, Nachbarschaft und Unternehmen –
strukturiert, vertraulich, ohne Gericht.
```

### Kurzprofil (ca. 300 Zeichen, erscheint im Suchergebnis der Plattform)

```
medipact ist eine Plattform für strukturierte Online-Mediation. Zwei
Parteien lösen ihren Konflikt in einem klar geführten Verfahren – bei
Trennung und Scheidung, Erbstreit, Nachbarschaft, Verbraucherfragen oder im
Unternehmen. Transparente Festpreise, jede Partei zahlt ihren eigenen
Anteil.
```

### Über uns / Langbeschreibung

```
Konflikte kosten Zeit, Geld und Nerven – vor Gericht am meisten. medipact
führt Sie stattdessen durch ein strukturiertes Mediationsverfahren, das Sie
online und in Ihrem eigenen Tempo durchlaufen.

So läuft es ab:
Sie schildern Ihren Konflikt, laden die Gegenseite ein und arbeiten sich
gemeinsam durch die fünf Phasen der Mediation – von der Sortierung der
Themen über die dahinterliegenden Interessen bis zur Abschlussvereinbarung.
Ein Mediator begleitet das Verfahren; wo es hilft, buchen Sie gezielt eine
anwaltliche Einschätzung oder eine Live-Videositzung dazu.

Wofür medipact gedacht ist:
• Trennung und Scheidung – Betreuung, Unterhalt, Hausrat, Wohnung
• Erbstreit – Nachlass, Pflichtteil, Immobilie in der Erbengemeinschaft
• Nachbarschaft – Lärm, Grenze, Bäume, Hausgemeinschaft
• Verbraucher und Handwerk – Mängel, Rechnungen, gescheiterte Aufträge
• Unternehmen – Team, Führung, Gesellschafter, Nachfolge
• B2B und E-Commerce – Lieferanten, IT-Projekte, Online-Streitbeilegung

Was medipact anders macht:
Transparente Preise ab 49 € pro Partei statt offener Anwaltsrechnungen. Jede
Partei zahlt nur ihren eigenen Anteil. Und wenn Sie noch nicht bereit für
eine Mediation sind: Das Konflikt-Logbuch ist dauerhaft kostenlos – Sie
dokumentieren Vorkommnisse, Gespräche und Nachrichten vertraulich und können
den Fall später jederzeit in eine Mediation überführen.

Wichtig zu wissen: Eine Mediation ersetzt kein Gerichtsverfahren, wo eines
zwingend vorgeschrieben ist – eine Scheidung etwa muss weiterhin gerichtlich
ausgesprochen werden (§ 114 FamFG). Sie klärt aber alles, worüber Sie sich
sonst vor Gericht streiten würden, und macht das Verfahren dadurch kürzer,
günstiger und erheblich weniger belastend.
```

> Prüfen: Die Aufzählung der Konfliktarten muss mit `/konflikte` und
> `lib/pricing-matrix.ts` übereinstimmen. Die 49 € gelten für den
> Einstiegstarif (Nachbarschaft, Verbraucher/Handwerker) – falls sich das
> ändert, hier nachziehen.

### Leistungen / Angebote (einzeln anlegbar)

| Titel | Beschreibung |
|---|---|
| Trennungs- und Scheidungsmediation | Betreuung, Unterhalt, Hausrat, Wohnung – strukturiert klären statt vor dem Familiengericht streiten. Ab 399 € pro Partei online; mit 2 Stunden persönlicher Mediation 499 €, als Vollservice mit anwaltlicher Einschätzung 899 €. |
| Erbschaftsmediation | Nachlass, Pflichtteil, Immobilie in der Erbengemeinschaft – einigen, bevor die Familie zerbricht. |
| Nachbarschaftsmediation | Lärm, Grenzbepflanzung, Hausgemeinschaft. Einstiegstarif ab 49 € pro Partei. |
| Verbraucher- und Handwerkerstreit | Mängel, Rechnungen, nicht erbrachte Leistungen – ohne Klage klären. |
| Wirtschaftsmediation | Team, Führung, Gesellschafter, Nachfolge. Einzelfall ab 399 € pro Partei. |
| Business-Tarife für Unternehmen | Mediationskontingent für Unternehmen ab 1.000 €/Monat (bis zu 10 Verfahren). |
| Konflikt-Logbuch | Dauerhaft kostenlos: Konflikt vertraulich dokumentieren und später in eine Mediation überführen. |

### Keywords/Schlagwörter

```
Mediation, Online-Mediation, Konfliktlösung, Trennungsmediation,
Scheidungsmediation, Erbschaftsmediation, Nachbarschaftsstreit,
Wirtschaftsmediation, Online Dispute Resolution, ODR, Streitbeilegung,
Mediator, Konfliktberatung, außergerichtliche Einigung
```

### Website-Verlinkung

Setz die Backlinks aufs Ziel, nicht pauschal auf die Startseite:
`https://medipact.de` als Hauptlink, zusätzlich `/preise` und `/methode`,
wo das Profil Detaillinks erlaubt.

---

## 4. Bewertungen einsammeln

### Zwei Umfragen statt einer

| Umfrage | Zielgruppe | Fragen (Vorlage anpassen) |
|---|---|---|
| **Mediation (privat)** | Trennung, Erbe, Nachbarschaft, Verbraucher | Verständlichkeit des Verfahrens, Fairness, Umgang mit Emotionen, Ergebnis, Weiterempfehlung |
| **Wirtschaftsmediation** | Unternehmen, B2B | Professionalität, Struktur, Zeitaufwand, Ergebnisqualität, Weiterempfehlung |

Fragen, die bei einer Mediation nicht funktionieren und deshalb aus der
Branchenvorlage **raus** sollten: alles Richtung "Preis-Leistung im
Vergleich" und "Reaktionszeit" – beides misst nicht, was hier zählt. Und
keine Frage, die eine Partei implizit zwingt, das Ergebnis zu bewerten: In
einer Mediation ist eine Seite fast immer weniger zufrieden mit dem
*Ergebnis* und trotzdem zufrieden mit dem *Verfahren*. Genau diese
Unterscheidung solltest du abfragen.

### Wann fragen

**Nach Abschluss der Abschlussvereinbarung**, nicht früher. Mitten im
Verfahren ist eine Bewertungsanfrage nicht nur taktlos, sondern kann die
Neutralität beschädigen – wer gerade unzufrieden ist, liest sie als
Parteinahme.

**Beide Parteien fragen, nicht nur die zufriedene.** Selektives Anfragen ist
bei ProvenExpert ein Verstoß gegen die Bewertungsrichtlinien und, falls es
auffällt, nach UWG angreifbar.

### Rechtlicher Rahmen (wichtig)

Der BGH stuft Bewertungsanfragen per E-Mail als **Werbung** im Sinne des UWG
ein. Sie sind damit grundsätzlich **einwilligungspflichtig** (§ 7 Abs. 2
UWG). Zwei gangbare Wege:

1. **Opt-in im Produkt** (empfohlen): Checkbox beim Abschluss des Verfahrens
   im Workspace – „Ich möchte nach Abschluss eine Bewertungsanfrage
   erhalten". Freiwillig, ungekoppelt (Art. 7 Abs. 4 DSGVO – die Einwilligung
   darf **keine** Bedingung für die Mediation sein), separat protokolliert.
2. **§ 7 Abs. 3 UWG**: Anfrage ohne Einwilligung nur, wenn die Adresse beim
   Vertragsschluss erhoben wurde, die Werbung eigene ähnliche Leistungen
   betrifft, und bei **jeder** Verwendung sowie bei der Erhebung auf das
   Widerspruchsrecht hingewiesen wurde. Enger und streitanfälliger als Weg 1.

Alternativ komplett ohne E-Mail: **QR-Code oder Zugangscode** auf der
Abschlussvereinbarung bzw. der Abschlussseite im Workspace. Der Kunde
entscheidet selbst, ob er teilnimmt – kein Werbe-Tatbestand, kein
Einwilligungsproblem. Für medipact wahrscheinlich der sauberste Weg.

*Keine Rechtsberatung – ich bin kein Anwalt. Bei der Formulierung der
Einwilligung lohnt eine anwaltliche Prüfung.*

### Anschreiben-Vorlage (privat)

```
Betreff: Ihre Rückmeldung zu Ihrer Mediation

Guten Tag [Name],

Ihre Mediation bei medipact ist abgeschlossen. Wir würden gern wissen, wie
das Verfahren für Sie war – nicht das Ergebnis, sondern der Weg dorthin:
Waren die Schritte verständlich? Haben Sie sich fair behandelt gefühlt?

Die Umfrage dauert etwa zwei Minuten:
[LINK]

Zwei Dinge sind uns wichtig:
Sie können vollständig anonym bewerten – wählen Sie dazu in der Umfrage
einfach die anonyme Veröffentlichung. Es wird nichts sichtbar, woraus sich
Ihr Fall oder Ihre Person ableiten lässt.
Und: Auch kritisches Feedback hilft uns. Wir wünschen uns Ihre ehrliche
Einschätzung, keine gute Note.

Herzliche Grüße
Julian Wieder
medipact

Sie erhalten diese E-Mail, weil Sie beim Abschluss Ihrer Mediation
zugestimmt haben. Sie können der Nutzung Ihrer Adresse zu diesem Zweck
jederzeit formlos widersprechen: hallo@medipact.de
```

### Anschreiben-Vorlage (Unternehmen)

```
Betreff: Kurzes Feedback zu Ihrem Mediationsverfahren

Guten Tag [Name],

das Verfahren [Aktenzeichen/Bezeichnung] ist abgeschlossen. Für andere
Unternehmen, die vor einer ähnlichen Entscheidung stehen, ist Ihre
Einschätzung wertvoll: Wie strukturiert lief das Verfahren, wie hoch war der
Zeitaufwand auf Ihrer Seite, und wie belastbar ist das Ergebnis?

Zwei Minuten, gern auch anonym oder nur mit Branchenangabe statt Firmenname:
[LINK]

Herzliche Grüße
Julian Wieder
medipact
```

### Realistische Erwartung

Rücklaufquoten bei Bewertungsanfragen liegen typischerweise im niedrigen
zweistelligen Prozentbereich – bei einem emotional belasteten Thema wie
Mediation eher darunter. Rechne mit wenigen Bewertungen pro Monat und plane
entsprechend: 10 Bewertungen sind ein realistisches Halbjahresziel, kein
Wochenziel. Das ist auch das Argument gegen einen frühen Plus-Tarif.

---

## 5. Einbindung auf medipact.de

### 5.1 Der Google-Sterne-Punkt – bitte vor dem Tarif-Upgrade lesen

ProvenExpert bewirbt „Google-Sterne" ab dem Plus-Tarif: ein Rich-Snippet-
Code für die eigene Website, der Sterne im Google-Suchergebnis erzeugen
soll.

**Google zeigt seit September 2019 keine Review-Snippets mehr für
selbstbezogene Bewertungen** („self-serving reviews") – also für
`Organization`- und `LocalBusiness`-Markup, mit dem eine Website Bewertungen
über sich selbst auszeichnet. Genau das wäre der Fall, wenn medipact.de das
ProvenExpert-Aggregat in seinem eigenen Organization-Schema ausgibt.

Konkret für uns: **Kein `aggregateRating` in `organizationSchema` in
`app/layout.tsx`.** Google ignoriert es im besten Fall; im schlechteren Fall
ist es ein Policy-Verstoß im Structured-Data-Report der Search Console.

Was stattdessen funktioniert:

- **Das ProvenExpert-Profil selbst rankt** und kann Sterne im Snippet zeigen
  – es ist eine unabhängige Drittseite. Ein gepflegtes Profil bringt dir
  also einen zusätzlichen Treffer für „medipact" mit Sternen, nur eben unter
  provenexpert.com statt medipact.de.
- **Das Widget auf der Website wirkt trotzdem** – aber als
  Conversion-Element für Besucher, die schon da sind, nicht als
  Klickrate-Hebel in der SERP. Das ist ein anderer Nutzen, und für einen
  Vertrauensdienst wie Mediation ein durchaus relevanter.

Meine Empfehlung: Widget ja, Rich-Snippet-Code nein – und den Plus-Tarif
nicht wegen der Google-Sterne buchen.

### 5.2 Was du stattdessen ins Schema einträgst: `sameAs`

Das ist policy-sauber, hilft der Entity-Zuordnung und ist in unserem Code
schon vorbereitet. In `app/content/social.ts`:

```ts
export type SocialNetwork = "Twitter" | "LinkedIn" | "ProvenExpert";
// ↑ Union erweitern, sonst schlägt der Typcheck fehl

export const socialProfiles: SocialProfile[] = [
  { name: "ProvenExpert", url: "https://www.provenexpert.com/de-de/medipact/" },
];
```

Das landet automatisch in `sameAs` des Organization-JSON-LD **und** als
Footer-Icon – so ist die Datei gebaut. Zwei Dinge dabei beachten:

1. **Erst eintragen, wenn das Profil veröffentlicht und erreichbar ist.** Der
   Kommentar in der Datei erklärt, warum die Liste leer ist: ein `sameAs` auf
   ein nicht existierendes Profil ist ein kaputtes Entity-Signal.
2. **`Footer.tsx` muss mit angepasst werden.** Dort steht ein hartes
   Ternary: `profile.name === "Twitter" ? <Twitter-Pfad> : <LinkedIn-Pfad>`.
   Ein ProvenExpert-Eintrag würde also stillschweigend das **LinkedIn-Icon**
   bekommen – kein Typfehler, nur falsch auf dem Bildschirm. Entweder das
   Ternary in ein `switch`/Lookup umbauen und einen ProvenExpert-Pfad
   ergänzen, oder den Eintrag im Footer bewusst als Textlink rendern.

### 5.3 Widget-Platzierung

Nicht überall einbinden – gezielt an den Stellen, wo Vertrauen die
Entscheidung trägt:

| Ort | Element | Warum |
|---|---|---|
| Footer (global) | Kleines Bewertungssiegel | Dauerhaft präsent, stört nirgends |
| `/preise` | Bewertungs-Widget über dem Preis-CTA | Größte Kaufunsicherheit |
| `/kontakt` | Siegel neben dem Formular | Letzter Zweifel vor Absenden |
| `/methode` | Widget nach der Phasenerklärung | „Funktioniert das wirklich?" |
| Startseite | Siegel im Hero-Umfeld | Nur, wenn ≥ 10 Bewertungen vorhanden |

**Nicht** auf `/konflikte/*` und in den Fallbeispielen: Diese Seiten
arbeiten mit Erzählstruktur, ein Bewertungssiegel bricht den Ton.

### 5.4 Technische Umsetzung in Next.js

Das ProvenExpert-Widget lädt ein externes Script. In diesem Setup heißt das:

- Eigene Komponente `app/components/ui/ProvenExpertWidget.tsx`, `"use client"`,
  Script über `next/script` mit `strategy="lazyOnload"` – nicht als roher
  `<script>`-Tag im JSX, sonst wird er beim Hydration-Diff verworfen.
- **Consent beachten:** Das Script überträgt Daten an Expert Systems AG.
  Prüfe, ob es in unserem Cookie-/Consent-Layer (`app/cookies`) gated werden
  muss, bevor es lädt.
- **Layout-Shift:** feste Höhe auf dem Container, sonst springt der Inhalt
  beim Nachladen – die Seite ist auf CLS optimiert, das würde man messen.
- Kein `next build` in der Sandbox möglich; Typprüfung nur über
  `tsconfig.check.json`.

---

## 6. Reihenfolge zum Abarbeiten

1. Free-Account anlegen, Firmenprofil, Name `medipact`
2. Stammdaten aus dem Impressum, Branche wählen, Profil-URL sichern
3. Texte aus Abschnitt 3 einpflegen, Logo + Titelbild hochladen
4. Zwei Umfragen anlegen und Fragen kürzen (im Premium-Testzeitraum)
5. Profil veröffentlichen
6. Datenschutzerklärung ergänzen (vor jeder Einbindung)
7. `social.ts` + Footer-Icon → `sameAs`-Signal setzen
8. QR-Code/Zugangscode in den Abschluss-Flow im Workspace einbauen
9. Erste Bewertungsanfragen an abgeschlossene Verfahren
10. Ab ~10 Bewertungen: Basic buchen, Widget auf `/preise` und `/kontakt`

---

## 7. Offene Punkte für dich

- [ ] USt-ID im Impressum steht noch auf „DE[wird nachgetragen]" – ProvenExpert
      fragt sie bei der Rechnungsstellung ab
- [ ] Entscheidung: Opt-in-Checkbox im Workspace oder QR-Code-Weg (Abschnitt 4)
- [ ] Datenschutz-Passus formulieren lassen
- [ ] ProvenExpert-Icon für `Icon.tsx`, falls Footer-Verlinkung gewünscht
- [ ] Prüfen, ob die 49 €/399 €/499 €-Angaben in den Profiltexten noch zur
      aktuellen `pricing-matrix.ts` passen

---

## Quellen

- [ProvenExpert – Pricing and Features](https://www.provenexpert.com/en-us/features-pricing/)
- [ProvenExpert FAQ – Was ist das Rich Snippet?](https://help.provenexpert.com/de/was-ist-das-rich-snippet)
- [ProvenExpert FAQ – Umfragen & Bewertungen](https://help.provenexpert.com/de/umfragen-bewertungen)
- [ProvenExpert FAQ – Profil & Nutzerkonto](https://help.provenexpert.com/de/profil-nutzerkonto)
- [Google Search Central – Making Review Rich Results more helpful (Sept. 2019)](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful)
- [Google Search Central – Review Snippet Structured Data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [IT-Recht Kanzlei – Bewertungsanfragen per Mail: Was ist erlaubt?](https://www.it-recht-kanzlei.de/anforderungen-bewertungsanfrage-mail.html)
- [Dr. Datenschutz – Sind Bewertungsanfragen Werbung und damit einwilligungspflichtig?](https://www.dr-datenschutz.de/sind-bewertungsanfragen-werbung-und-damit-einwilligungspflichtig/)
