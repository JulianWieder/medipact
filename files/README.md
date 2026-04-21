# medipact – KI-Mediation ab €499

Konflikte lösen ohne Gericht. KI-basierte Mediation nach dem Harvard-Prinzip.

## 🚀 Features

- **KI-Pure** – Mediation vollständig automatisiert (€499)
- **Hybrid** – KI + zertifizierter Mediator (€100/h zusätzlich)
- **Harvard-Prinzip** – Interessen statt Positionen
- **6-Phasen Prozess** – Von Interessenanalyse bis bindende Vereinbarung
- **Emerald Design** – Modern, elegant, vertrauenswürdig

## 📋 Stack

- **Frontend**: Next.js 14+ (TypeScript, React 18)
- **Styling**: Tailwind CSS 3+
- **Deployment**: Hetzner (Ubuntu 24.04, PM2, Nginx)

## 🏃 Quick Start (Lokal)

```bash
# Clone / Download
git clone https://github.com/your-repo/medipact.git
cd medipact

# Install
npm install

# Dev Server
npm run dev
# → http://localhost:3000
```

## 🏗️ Build & Deployment

```bash
# Build
npm run build

# Test Production Build
npm run start

# Deploy zu Hetzner
# Siehe SETUP-COMPLETE.md für Details
```

## 📁 Struktur

```
frontend/
├── app/
│   ├── page.tsx           ← Landing Page
│   ├── layout.tsx         ← Root Layout + Metadata
│   └── components/
│       ├── Header.tsx
│       └── Footer.tsx
├── public/                ← Static Assets
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## 🔧 Konfiguration

**Tailwind**: `tailwind.config.ts`
- Emerald Green Palette
- Custom Border Radius

**Next.js**: `next.config.ts`
- Strict Mode
- Security Headers
- Image Optimization

**TypeScript**: `tsconfig.json`
- Strict Mode
- Path Aliasing (@/*)

## 📧 Kontakt

- Email: hallo@medipact.de
- Website: https://medipact.de
- GitHub: [dein-repo]

## 📝 Lizenz

MIT License – siehe LICENSE für Details

---

**Setup Guide**: Siehe [SETUP-COMPLETE.md](./SETUP-COMPLETE.md)
