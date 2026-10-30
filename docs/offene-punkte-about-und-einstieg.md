# Offene Punkte: /about und neue Einstiegs-Section

Stand: 30.10.2026

## 1. /about: Fokus auf medipact, Ziele und Vision

Auf /about soll es darum gehen, was medipact ist, warum es medipact gibt und
wohin es will. Verfahrensdetails, Preise und Einstiegswege sind dort nur
Nebensache und werden verlinkt.

**Erledigt**
- [x] Hero-Buttons waren auf Laptop-Höhe abgeschnitten, weil der Intro-Text zu
  lang war. Intro gekürzt (`app/content/aboutPage.ts`).
- [x] Wording ergänzt: „die persönliche Mediation bleibt offen" (Intro und
  Karte „Der Rechtsweg bleibt offen").

- [x] Die Konfliktarten sind geklärt: Laut `backend/app/pricing.py` und /konflikte
  sind es **sieben**. /about ist korrigiert. `AGENTS.md` (vier) ist veraltet.
- [x] Die volle Preisliste ist raus. Dort stehen jetzt „ab 49 €“, das Starterpaket
  und der Hinweis auf /preise.

- [x] Vision steht direkt unter dem Hero (`AboutVisionSection`, Text in
  `aboutVision`): Gerichtsverfahren vermeiden, effiziente Mediation, sehr hohe
  Quote an außergerichtlichen Einigungen. Bewusst ohne Zahl, bis es echte
  Falldaten gibt.

**Offen**
- [ ] Gründer-Sektion (`app/components/FounderSection.tsx`): nur echte
  Angaben, z. B. Ausbildung, beruflicher Hintergrund, Gründungsanlass, Foto,
  LinkedIn. Angaben kommen von Julian.
- [ ] Hero technisch robuster machen: Der Frame ist auf Bildschirmhöhe fixiert
  (`ScrollPinFrame`, `overflow-hidden`). Langer Text wird auf niedrigen
  Bildschirmen weiter abgeschnitten. Das betrifft alle Seiten mit
  `ImagePinHero`.

## 2. Neue Section: Einstieg „Fallanalyse → Starterpaket → Weg wählen"

Gehört nicht auf /about, sondern in eine eigene Section, z. B. auf der
Startseite, auf /preise oder auf /mediator-finden. Wo genau, ist noch offen.

**Erarbeitetes Verständnis**
- **Erste Fallanalyse:** wird für jeden Fall gleich ausgearbeitet und ist der
  gemeinsame Ausgangspunkt. Bei der Übergabe bekommt die gewählte Mediatorin
  sie mit.
- **Starterpaket** (189 € pro Fall, geteilt) hat drei Zwecke:
  1. Mediation und Online-Mediation verstehen. Viele wissen nicht genau, was
     Mediation ist und wie sie online funktioniert.
  2. Einen passenden Mediator finden. Mediation braucht eine persönliche
     Beziehung, und Vertrauen muss erst erarbeitet werden. Dafür gibt es die
     Kennenlerngespräche.
  3. Einschätzen, ob eine Lösung möglich ist, z. B. über den geklärten
     Sachverhalt und erste Übungen. **Eine Einigung ist im Paket nicht
     möglich**, sie entsteht erst auf dem gewählten Weg danach.
- **Danach Weg wählen:** Online-Verfahren zum Festpreis oder persönliche
  Mediation (über medipact oder direkt mit der Mediatorin), oder pausieren.

**Offen**
- [x] Ort: Startseite, direkt über der Starterpaket-Section. Die Texte stehen unter
  `home.einstieg` in `messages/de.json` und `messages/en.json`.
- [x] Fallanalyse: im Preis enthalten, für beide Wege gleich (Online-Verfahren
  und Starterpaket).
- [x] Benennung: ohne „KI“. Badge, Subline, Intro und JSON-LD der Startseite sind
  angeglichen, „KI“ steht nur noch auf /einigung/gleichbehandlung.
- [x] Starterpaket-Texte (DE und EN): Neu ist die dritte Zweck-Karte „Einschätzen, ob
  eine Lösung möglich ist“ und ein Leistungspunkt „eine Einigung gehört noch
  nicht zum Paket“.
- [ ] Den Einleitungstext des Starterpakets noch einmal lesen. Klingt er
  weiterhin eher nach einem Zusatz zur Vermittlung?
- [ ] Vergleich in `mediatorFindenPage.ts` prüfen: Dort steht noch
  „zusätzlich, nicht stattdessen". Passt das zur Brücken-Rolle des
  Starterpakets?
