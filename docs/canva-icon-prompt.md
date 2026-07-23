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

---

# ERWEITERTE PROMPT-BIBLIOTHEK

## 7. Fünf Stilrichtungen (eine wählen, dann konsequent bleiben)

Jede Richtung ist ein austauschbarer Stil-Baustein. Nimm **einen** und hänge
das Motiv aus Abschnitt 4 an. So bekommst du je nach Geschmack einen anderen
Gesamtlook – aber immer in der medipact-Palette.

**A · Heraldic Line (Standard, empfohlen für UI)**
```
minimalist line icon inspired by a refined heraldic crest, MOTIF,
thin even 2px stroke, petrol-teal #336E7C lines with subtle champagne-gold
#C9B27A accents, flat, geometric, calm law-firm look, transparent background
```

**B · Duotone Flat (kräftiger, gut für Marketing-Kacheln)**
```
modern duotone flat icon, MOTIF, two-tone petrol-teal #336E7C and lighter
teal #4A8A98 fills with a fine champagne-gold #C9B27A rim, no outline noise,
rounded corners, clean vector, transparent background
```

**C · Embossed Crest Badge (3D, ganz nah am Logo)**
```
premium embossed emblem, MOTIF centered inside a heraldic shield, matte
petrol-teal #336E7C relief with a polished champagne-gold #C9B27A beveled
border, soft studio lighting, subtle depth, dark navy #0B1922 backdrop,
luxury law-firm branding, 3D render, high detail
```

**D · Gold-on-Navy Premium (edel, dunkler Modus / Siegel)**
```
elegant thin-line icon, MOTIF, champagne-gold #C9B27A hairline on a deep
navy #0B1922 background, luxurious minimal, engraved feel, generous padding,
crisp vector, symmetrical
```

**E · Soft Rounded (freundlicher, für Onboarding/Empty States)**
```
friendly soft rounded icon, MOTIF, smooth petrol-teal #336E7C shapes,
gentle champagne-gold #C9B27A highlight, plenty of negative space, warm and
approachable yet professional, flat, transparent background
```

---

## 8. Negativ-Prompt (überall anhängen, wo Canva es erlaubt)

```
no text, no letters, no watermark, no photorealism, no drop shadow clutter,
no gradients banding, no busy background, no clipping at edges, no extra
objects, no inconsistent stroke weight, not skewed, not tilted
```

---

## 9. Voll ausformulierte Beispiel-Prompts (Copy-&-Paste)

**Waage / „Meine Fälle" (Heraldic Line):**
```
minimalist line icon inspired by a refined heraldic crest, a perfectly
balanced set of scales of justice, thin even 2px stroke, petrol-teal #336E7C
lines with subtle champagne-gold #C9B27A accents on the beam, flat, geometric,
symmetrical, centered, consistent padding, calm law-firm look, vector,
transparent background — no text, no photorealism, no drop shadow
```

**Taube / „Lösung" (Duotone Flat):**
```
modern duotone flat icon, a stylized dove in flight carrying an olive branch,
two-tone petrol-teal #336E7C and lighter teal #4A8A98, fine champagne-gold
#C9B27A wing accent, rounded, clean vector, centered, transparent background
— no text, no realism, no shadow
```

**Handschlag / „Einigung" (Embossed Crest Badge):**
```
premium embossed emblem, two hands in a firm handshake centered inside a
heraldic shield, matte petrol-teal #336E7C relief with a polished
champagne-gold #C9B27A beveled border, soft studio light, subtle depth,
dark navy #0B1922 backdrop, luxury branding, 3D render — no text
```

**Schild / „Administration" (Gold-on-Navy Premium):**
```
elegant thin-line icon, a heraldic shield with a subtle inner divide,
champagne-gold #C9B27A hairline on deep navy #0B1922, engraved feel,
symmetrical, generous padding, crisp vector — no text, no shadow
```

---

## 10. Mehr Design-Assets (über Icons hinaus)

### Logo-Varianten
```
horizontal logo lockup for "medipact", the existing petrol-teal heraldic
shield with gold border on the left, clean modern serif wordmark in petrol
#336E7C to the right, balanced spacing, on transparent background,
professional law brand
```
```
simplified monochrome favicon of the medipact shield monogram, single-color
petrol-teal #336E7C, bold and legible at 32px, flat, transparent background
```

### Social-/OG-Bild (1200 × 630)
```
elegant social share banner for a mediation platform, deep navy #0B1922
background with faint heraldic line pattern, centered petrol-teal shield with
gold border, calm premium law-firm mood, empty space on the right for a
headline, high contrast, no text
```

### Hero-Hintergrund / Muster
```
subtle seamless background pattern of thin champagne-gold #C9B27A heraldic
line motifs and fine geometric linework on deep navy #0B1922, very low
contrast, elegant, non-distracting, tileable
```

### Sektions-Illustrationen für Konfliktarten
```
minimalist editorial illustration in petrol-teal #336E7C and champagne-gold
#C9B27A line style on transparent background, SCENE, calm and respectful tone,
consistent stroke, no faces in detail, professional mediation brand
```
SCENE-Beispiele: `two neighbors talking over a garden fence` (Nachbarschaft),
`two business partners at a table with documents` (Wirtschaft),
`a family sitting together` (Familie), `an online video call between two
parties` (ODR).

### Empty States (leere Listen / „noch nichts hier")
```
friendly minimalist spot illustration, an open empty folder with a small gold
star, petrol-teal #336E7C soft rounded shapes with champagne-gold #C9B27A
accent, lots of negative space, encouraging calm mood, transparent background
— no text
```

### Vertrauens-Siegel / Badges
```
circular trust seal badge, a heraldic shield with a check mark in the center,
champagne-gold #C9B27A ring and laurel accents on petrol-teal #336E7C, premium
certified look, flat vector, transparent background — no text
```

### Avatar-Platzhalter
```
neutral user avatar placeholder, simple person silhouette in petrol-teal
#336E7C inside a soft rounded square with a thin champagne-gold #C9B27A border,
flat, minimal, transparent background
```

### E-Mail-Header (600 px breit)
```
slim email header banner, deep navy #0B1922 with the medipact shield centered,
thin champagne-gold #C9B27A divider line beneath, minimalist, premium,
plenty of quiet space, no text
```

---

## 11. Canva-Tipps für bessere & konsistentere Ergebnisse

- **Brand Kit anlegen** (Canva Pro): Farben `#336E7C`, `#0B1922`, `#C9B27A`,
  `#4A8A98` speichern → schnelleres Umfärben & einheitliche Serie.
- **Immer 4 Varianten** generieren lassen und die konsistenteste nehmen; Stil-
  Baustein Wort für Wort gleich lassen, nur das Motiv tauschen.
- **Eine Stilrichtung festlegen** (Abschnitt 7) und für ALLE Assets behalten –
  Mischen wirkt schnell unruhig.
- **Quadratisch generieren** (1:1) für Icons, **16:9** für Hero/OG,
  **9:16** für Story/Mobile.
- **Nachschärfen:** Magic-Media-Ergebnis auf ein Blatt ziehen → „Hintergrund
  entfernen" → als PNG (transparent) oder SVG exportieren.
- **Batch-Download:** alle Motive je auf eine eigene Seite, dann „Alle Seiten"
  als ZIP herunterladen = ein Download für das ganze Set.
- **Konsistenz-Check:** die fertigen Icons nebeneinander auf ein Blatt legen –
  passen Strichstärke, Größe und Farbe? Ausreißer neu generieren.
