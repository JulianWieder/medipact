# medipact – Kompletter Setup Guide

## 🚀 Phase 1: Lokales Setup (5–10 Min)

### Schritt 1: Neue Next.js App erstellen (falls nicht vorhanden)

```bash
cd ~/projects  # oder wo deine Projekte liegen

# Neue Next.js 14+ App mit TypeScript
npx create-next-app@latest medipact --ts --tailwind --app

# Fragen beantworten:
# - Use TypeScript? → YES
# - Use ESLint? → YES
# - Use Tailwind CSS? → YES
# - Use `src/` directory? → NO (wir nutzen app/ direkt)
# - Use App Router? → YES
# - Use Turbopack? → NO
# - Customize import alias? → NO (@ ist default)
```

Oder falls du **bereits ein Projekt hast**, skip zu Schritt 2.

---

### Schritt 2: Datei-Struktur aufbauen

```bash
cd medipact/frontend  # oder medipact/

# Komponenten-Ordner erstellen
mkdir -p app/components

# Falls noch nicht vorhanden:
mkdir -p public
```

Deine finale Struktur wird so aussehen:

```
frontend/
├── app/
│   ├── page.tsx                    ← medipact-landing-emerald.tsx
│   ├── layout.tsx                  ← Anpassen (see Schritt 3)
│   └── components/
│       ├── Header.tsx              ← Header.tsx
│       ├── Footer.tsx              ← Footer.tsx
│       └── ...
├── public/                         ← Favicon, Images, etc.
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

### Schritt 3: Dateien kopieren

**Von deinem Downloads/Outputs-Ordner:**

```bash
# Geh in den medipact-Ordner
cd ~/projects/medipact  # oder wo dein Projekt ist

# Kopiere die Komponenten
cp ~/Downloads/Header.tsx app/components/
cp ~/Downloads/Footer.tsx app/components/
cp ~/Downloads/medipact-landing-emerald.tsx app/page.tsx
```

**Falls du die Datei anders genannt hast:**
```bash
cp ~/Downloads/medipact-landing-emerald.tsx app/page.tsx
```

---

### Schritt 4: layout.tsx anpassen

Öffne `app/layout.tsx` und aktualisiere es:

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'medipact – KI-Mediation ab €499',
  description: 'Konflikte lösen ohne Gericht. KI-basierte Mediation nach dem Harvard-Prinzip. Schneller, günstiger, menschlicher.',
  openGraph: {
    title: 'medipact',
    description: 'Konflikte lösen, nicht eskalieren',
    url: 'https://medipact.de',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

### Schritt 5: Tailwind Config prüfen

Öffne `tailwind.config.ts` – sollte so aussehen:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

Falls nicht vorhanden → copy-paste, save.

---

### Schritt 6: Dependencies installieren

```bash
cd ~/projects/medipact  # dein Projekt-Root

# Falls noch nicht installiert
npm install

# Falls Fehler: npm cache clean
npm cache clean --force
npm install
```

---

### Schritt 7: Dev-Server starten & testen

```bash
npm run dev
```

**Output:**
```
> medipact@1.0.0 dev
> next dev

  ▲ Next.js 14.2.0
  - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

Öffne im Browser: **http://localhost:3000**

**Checklist:**
- [ ] Landing Page lädt
- [ ] Header mit Logo + Button sichtbar
- [ ] Emerald-Grün richtig
- [ ] Footer sichtbar
- [ ] Keine Console-Fehler (F12 → Console)

---

## 🏗️ Phase 2: Build & Produktion (2 Min)

### Schritt 8: Production Build testen

```bash
npm run build

# Output sollte sein:
# ✓ Building application
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages (5/5)
# ✓ Finalizing page optimization
# Route (kind)                                  Size     First Load JS
# ┌ ○ /                                      127 B         65.2 kB
# ...

# Kein Error? → Prima!
```

Falls Error: Gib mir den Error-Output.

---

### Schritt 9: Production lokal testen

```bash
npm run build
npm run start

# Öffne: http://localhost:3000
```

Sollte **exakt gleich** wie `npm run dev` aussehen.

---

## 🚀 Phase 3: Deploy auf Hetzner (wie Vaterkodex)

### Schritt 10: Git vorbereiten

```bash
cd ~/projects/medipact

# Falls noch nicht initialisiert
git init
git add .
git commit -m "medipact: initial landing page"

# Falls auf GitHub hochladen
git remote add origin https://github.com/dein-name/medipact.git
git branch -M main
git push -u origin main
```

---

### Schritt 11: SSH auf Hetzner

```bash
ssh root@deine-hetzner-ip

# Beispiel
ssh root@123.45.67.89
```

**Falls nicht erledigt:**
- [ ] SSH-Keys generiert? (`ssh-keygen -t ed25519`)
- [ ] Public Key zu Hetzner hinzugefügt?

---

### Schritt 12: Projekt auf Hetzner clonen

```bash
cd /var/www  # oder dein Standard-Ordner

git clone https://github.com/dein-name/medipact.git
cd medipact

# Oder falls lokal (ohne GitHub):
# scp -r ~/projects/medipact/frontend root@hetzner-ip:/var/www/medipact
```

---

### Schritt 13: Dependencies & Build auf Hetzner

```bash
cd /var/www/medipact

# Node installieren (falls noch nicht)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Dependencies
npm install

# Build
npm run build
```

---

### Schritt 14: PM2 konfigurieren (wie bei Vaterkodex)

```bash
# PM2 installieren (falls noch nicht global)
sudo npm install -g pm2

# Starte App
pm2 start npm --name "medipact" -- start

# Startup Script generieren
pm2 startup
pm2 save

# Prüfe Status
pm2 status
pm2 logs medipact
```

---

### Schritt 15: Nginx reverse proxy (wie Vaterkodex)

```bash
# Falls Nginx nicht installiert
sudo apt update
sudo apt install -y nginx

# Neue Config-Datei
sudo nano /etc/nginx/sites-available/medipact.de
```

Paste:

```nginx
server {
    listen 80;
    server_name medipact.de www.medipact.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable Config
sudo ln -s /etc/nginx/sites-available/medipact.de /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL mit Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d medipact.de -d www.medipact.de
```

---

### Schritt 16: Domain-DNS (bei deinem Registrar)

Zeige auf Hetzner-IP:

```
A Record: medipact.de → 123.45.67.89
A Record: www.medipact.de → 123.45.67.89
```

Propagation dauert 1–24h.

---

## ✅ Checkliste

**Lokal:**
- [ ] `npm install` erfolgreich
- [ ] `npm run dev` läuft auf :3000
- [ ] Landing Page sichtbar & Emerald-Design OK
- [ ] `npm run build` ohne Error
- [ ] `npm run start` funktioniert

**Hetzner:**
- [ ] SSH Zugang funktioniert
- [ ] Git clone erfolgreich
- [ ] `npm install` auf Hetzner erfolgreich
- [ ] `npm run build` auf Hetzner erfolgreich
- [ ] PM2 läuft (`pm2 status`)
- [ ] Nginx reverse proxy aktiv
- [ ] SSL mit Certbot aktiviert
- [ ] Domain DNS zeigt auf Hetzner

**Final:**
- [ ] medipact.de öffnet die Landing Page
- [ ] HTTPS lädt
- [ ] Mobile-Responsive OK
- [ ] Keine 404-Fehler

---

## 🐛 Troubleshooting

### Fehler: "Cannot find module 'Header'"

**Ursache:** Falsche Import-Pfade

**Fix:** In `app/page.tsx` prüfe:
```typescript
import Header from './components/Header';  // ✓ Korrekt
import Header from '../components/Header'; // ✗ Falsch
```

---

### Fehler: "Tailwind CSS not compiling"

**Fix:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### PM2 zeigt "error" Status

```bash
# Logs anschauen
pm2 logs medipact

# Restart
pm2 restart medipact

# Delete & re-start
pm2 delete medipact
pm2 start npm --name "medipact" -- start
```

---

### Domain zeigt alte Seite

```bash
# Nginx Cache clearen
sudo systemctl restart nginx

# Browser Cache
# CTRL+SHIFT+R (Hard Refresh)

# DNS propagation prüfen
nslookup medipact.de
```

---

## 🚀 Nach dem Deploy

1. **Google Analytics**
   - ID in `layout.tsx` eintragen
   - GTM-Script hinzufügen

2. **Email-Funktion**
   - CTA-Buttons: `mailto:` → echte Form bauen
   - Nodemailer oder SendGrid integrieren

3. **Monitoring**
   ```bash
   pm2 start app.config.js  # mit Alerts
   ```

4. **Updates deployen**
   ```bash
   git pull
   npm run build
   pm2 restart medipact
   ```

---

Brauchst du Hilfe bei einem spezifischen Schritt?
