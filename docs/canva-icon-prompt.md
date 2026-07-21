# medipact – Icon-Set mit Canva individualisieren

Fertige Prompts, um alle App-Icons einheitlich im Stil des medipact-Wappens
(`fotos/medi logo.png`) zu generieren, in **einem** Download zu ziehen und ins
Projekt zu importieren.

---

## 1. Markensteckbrief (aus dem Logo abgeleitet)

| Element | Wert | Verwendung |
|---|---|---|
| Petrolblau (primär) | `#336E7C` | Hauptfarbe / Flächen & Linien |
| Tiefes Navy | `#0B1922` | Hintergrund / Outline |
| Champagner-Gold | `#C9B27A` | dünne Akzent-/Konturlinie (wie Wappenkante) |
| helleres Teal (optional) | `#4A8A98` | Sekundärfläche |

**Stimmung:** heraldisch, seriös, vertrauenswürdig, juristisch-modern, ruhig.
Klare geometrische Linien, gleichmäßige Strichstärke, dünne Gold-Hairlines,
wirkt leicht eingraviert/embossed wie das Wappen – aber vereinfacht, damit es
bei 24 px lesbar bleibt.

---

## 2. Master-Stil-Baustein (vor JEDES Icon setzen)

> Dieser Block sorgt für einen einheitlichen Look. Hänge nur das **Motiv** an.
> AI-Bildmodelle arbeiten oft präziser auf Englisch – darum beide Versionen.

**Deutsch:**
```
Minimalistisches App-Icon im Stil eines edlen Wappens, MOTIV,
klare geometrische Linienführung, gleichmäßige Strichstärke,
Petrolblau #336E7C als Hauptfarbe mit dünner champagnergoldener
Kontur #C9B27A, flat design, zentriert, gleichmäßiger Rand,
seriös und ruhig, professionelle Kanzlei-Ästhetik, Vektor-Look,
transparenter Hintergrund, keine Schatten, keine Fotorealistik,
einheitliche Serie
```

**English (empfohlen für Magic Media):**
```
minimalist app icon in the style of a refined heraldic crest, MOTIF,
clean geometric line work, even stroke weight, petrol-teal #336E7C as
main color with a thin champagne-gold outline #C9B27A, flat design,
centered, consistent padding, calm and professional law-firm aesthetic,
vector look, transparent background, no drop shadows, no photorealism,
part of one consistent icon set
```

---

## 3. Empfohlener Weg: EIN Icon-Sheet (bester Download-in-einem-Rutsch)

Damit alle Icons wirklich gleich aussehen, in Canva **Magic Media** einmal ein
komplettes Blatt generieren lassen:

```
A cohesive set of 12 minimalist heraldic-style line icons arranged in a
clean 4x3 grid on a transparent background. Petrol-teal #336E7C fills with
thin champagne-gold #C9B27A outlines, even stroke weight, flat vector look,
professional law-firm aesthetic. The icons: balance scales, calendar, group
of people, receipt/invoice, compass, shield, gear, dove, handshake, document
with paragraph symbol, video camera, checklist. Identical style, spacing and
line weight across all icons.
```

Danach pro Kategorie ein zweites/drittes Sheet mit den restlichen Motiven aus
Abschnitt 4 (gleicher Sheet-Prompt, nur Motivliste tauschen).

---

## 4. Icon-für-Icon-Liste (Motiv an den Stil-Baustein hängen)

### Navigation / Workspace  ·  `app/workspace/types.ts`
| Bisher | Bedeutung | Motiv (MOTIF) |
|---|---|---|
| ⊞ | Übersicht | dashboard grid of four rounded squares |
| ⚖ | Meine Fälle | balance scales |
| 👥 | Benutzer | two overlapping person silhouettes |
| 📅 | Kalender | calendar page |
| 🧾 | Rechnungen | invoice / receipt sheet |
| 🧭 | Workflow Manager | compass |
| 🛡 | Administration | shield |
| ⚙ | Einstellungen | gear |

### Block-Typen  ·  `app/workspace/blockTypes.ts` + `types.ts`
| Bisher | Bedeutung | Motiv |
|---|---|---|
| ✎ | Texteingabe | pencil writing on a line |
| ▶ | Video | play triangle in a rounded frame |
| ? | Frage / Quiz | question mark in a circle |
| 🎥 | Videokonferenz | video camera |
| ★ | Feedback | five-point star |
| 📅 | Termin | calendar with clock |
| § | Vertrag / Dokument | document sheet with paragraph § symbol |
| ✦ / ✨ | Individuell / KI | four-point sparkle |
| ◆ | Ergebnis | rounded diamond / gem |
| 📄 📎 🖼 | Datei / Anhang / Bild | document, paperclip, framed image |
| € | Zahlung | euro coin |
| 🔒 | Freigabe / Sperre | closed padlock |
| ☑ | Checkliste | checklist with ticks |
| ⏺ | Aufnahme | record dot in a ring |
| ↕ | Sortieren | up-down reorder arrows |
| ➕ | Hinzufügen | plus sign |

### Logbuch-Eintragsarten  ·  `app/konflikt-logbuch/page.tsx`, `LogbuchSection.tsx`
| Bisher | Bedeutung | Motiv |
|---|---|---|
| 📌 | Vorkommnis | map pin / thumbtack |
| 🗣️ | Gespräch | speech bubble with a person |
| ✉️ | E-Mail / Brief | envelope |
| 💬 | Nachricht | chat bubble |
| 📞 | Telefonat | telephone handset |
| 💭 | Gedanke / Notiz | thought bubble |

### Ergebnisse / Rollen
| Bisher | Bedeutung | Motiv |
|---|---|---|
| 🕊️ | Frieden / Lösung | dove in flight |
| 🤝 | Einigung | handshake |
| ⚖️ | Recht / Fairness | balance scales |
| 🧑 | Privatperson | single person silhouette |
| 🏢 | Firma / Organisation | office building |

### Karriere-Seite  ·  `app/karriere/page.tsx` (bereits SVG-Pfade)
Impact-Blitz, Haus, Glühbirne, Standort-Pin, Uhr, Aktentasche – gleiches Set,
gleiche Motive im obigen Stil neu erzeugen.

---

## 5. Canva-Workflow → ein Download

1. **Neues Design** → z. B. 1024 × 1024 px (oder Custom).
2. Linke Leiste **Apps → „Magic Media" (Text zu Bild)**. Stil-Baustein +
   Motiv einfügen, generieren, bestes Ergebnis aufs Blatt ziehen.
3. Für Einzel-Icons: **jedes Icon auf eine eigene Seite** legen (Seite
   duplizieren, Motiv im Prompt tauschen). So bleibt Größe/Abstand gleich.
4. Transparenz: falls der Hintergrund nicht transparent ist →
   Element markieren → **Bearbeiten → Hintergrund entfernen** (Canva Pro).
5. **Download (oben rechts):**
   - Format **PNG**, Haken bei **„Transparenter Hintergrund"**.
   - Bei mehreren Seiten **„Alle Seiten auswählen"** → Canva liefert alles als
     **eine ZIP-Datei** (= dein „ein Download").
   - Für scharfe Kanten in jeder Größe zusätzlich **SVG** exportieren
     (Canva Pro), falls du echte Vektor-Icons willst.
6. Dateien einheitlich benennen, passend zur Bedeutung:
   `scales.png`, `calendar.png`, `users.png`, `invoice.png`, `compass.png`,
   `shield.png`, `gear.png`, `dove.png`, `handshake.png`, `document.png`, …

---

## 6. Import ins Projekt

1. ZIP entpacken, Dateien nach **`public/icons/`** kopieren
   (Ordner ggf. neu anlegen). Sie sind dann unter `/icons/<name>.png` erreichbar.
2. Im Code die Emoji-Strings durch das Bild ersetzen, z. B. in
   `app/workspace/types.ts`:
   ```tsx
   // vorher
   { id: "faelle", label: "Meine Fälle", icon: "⚖" }
   // nachher (icon zeigt jetzt auf die Datei)
   { id: "faelle", label: "Meine Fälle", icon: "/icons/scales.png" }
   ```
   und beim Rendern statt `{item.icon}` ein Bild:
   ```tsx
   <img src={item.icon} alt="" className="h-5 w-5" />
   ```
3. Alternativ echte **SVG**-Icons als React-Komponenten einbinden – dann lassen
   sie sich per CSS umfärben (Hover, Aktiv-Zustand).

> Tipp: Erst 2–3 Icons testen, Look absegnen, dann das ganze Set generieren –
> spart Magic-Media-Credits.
