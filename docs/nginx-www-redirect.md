# www → non-www: 301 einrichten

Stand 12.08.2026. Hintergrund und Belege: `docs/gsc-analyse-2026-08-12.md`, Abschnitt 1.

`https://www.medipact.de/...` liefert derzeit **200 OK** und rendert die vollständige
Seite, inklusive interner Links, die alle wieder auf `www` zeigen. Damit existiert
die Site für Google zweimal. Das Canonical zeigt zwar korrekt auf non-www, wird
aber nachweislich nicht durchgängig befolgt.

Ziel-Host ist **`medipact.de` ohne www** — so stehen bereits Canonical
(`lib/seo.ts` → `SITE_URL`), `app/sitemap.ts` und `app/robots.ts`.

---

## Schritt 1: bestehenden Server-Block finden

```bash
ssh dev@178.104.99.33
grep -rn "server_name" /etc/nginx/sites-enabled/
```

Zu erwarten ist eine Zeile der Form:

```nginx
server_name medipact.de www.medipact.de;
```

Genau die ist die Ursache: Ein Block bedient beide Hosts, und nginx antwortet
unter beiden mit 200.

## Schritt 2: www aus dem Haupt-Block entfernen

Im bestehenden `server`-Block (der auf den Next.js-Prozess proxyt):

```nginx
server_name medipact.de;          # www hier streichen
```

## Schritt 3: eigenen Redirect-Block ergänzen

Vor oder nach dem Haupt-Block in dieselbe Datei:

```nginx
# www.medipact.de → medipact.de (301, dauerhaft)
#
# Muss ein EIGENER server-Block sein. Ein `if ($host = www...)` im Haupt-Block
# funktioniert zwar, gilt in nginx aber aus gutem Grund als fehleranfällig
# ("if is evil") — bei Location-Blöcken mit try_files verhält es sich
# überraschend. Ein separater Block ist eindeutig und kostet nichts.
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;

    server_name www.medipact.de;

    # Diese Pfade müssen mit denen im Haupt-Block übereinstimmen.
    # Wichtig: Das Zertifikat MUSS www.medipact.de mit abdecken, sonst
    # scheitert der TLS-Handshake, bevor die Weiterleitung überhaupt greift.
    # (Aktuell ist das der Fall — https://www.medipact.de/ liefert gültig aus.)
    ssl_certificate     /etc/letsencrypt/live/medipact.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/medipact.de/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # $request_uri enthält Pfad UND Query-String und ist bereits so kodiert,
    # wie der Client ihn geschickt hat. Deshalb hier KEIN $uri verwenden und
    # nichts anhängen — sonst gehen Parameter verloren oder werden doppelt
    # kodiert. Die Weiterleitung muss den Pfad 1:1 erhalten, sonst landet
    # jede Unterseite auf der Startseite und die 301 vererbt nichts.
    return 301 https://medipact.de$request_uri;
}
```

Die `include`- und `ssl_dhparam`-Zeilen nur übernehmen, wenn sie auch im
Haupt-Block stehen — Certbot legt sie standardmäßig an, aber nicht in jeder
Installation.

## Schritt 4: prüfen und aktivieren

```bash
sudo nginx -t          # muss "syntax is ok" und "test is successful" melden
sudo systemctl reload nginx
```

`reload` statt `restart`: reload übernimmt die Konfiguration ohne offene
Verbindungen zu kappen. Bei einem Syntaxfehler bricht `nginx -t` vorher ab und
die alte Konfiguration bleibt aktiv.

## Schritt 5: Ergebnis kontrollieren

```bash
curl -sI https://www.medipact.de/ratgeber/mediation-kosten | head -5
```

Erwartet:

```
HTTP/2 301
location: https://medipact.de/ratgeber/mediation-kosten
```

Wichtig ist der **Pfad in der `location`-Zeile**. Steht dort nur
`https://medipact.de/`, ist `$request_uri` verlorengegangen — dann leitet jede
Unterseite auf die Startseite um, und Google wertet das als Soft-404 statt als
Umzug. Das wäre schlimmer als der jetzige Zustand.

Zweiter Test, weil HTTP und HTTPS getrennte Listener sind:

```bash
curl -sI http://www.medipact.de/preise | head -5
```

---

## Danach in der Search Console

1. **Property prüfen.** Dass www-URLs im Export auftauchen, spricht für eine
   Domain-Property (`medipact.de` ohne Präfix). Falls stattdessen nur eine
   URL-Präfix-Property auf `https://medipact.de/` existiert, sieht sie die
   www-Daten gar nicht — dann zusätzlich eine Domain-Property anlegen.
2. **Nicht per URL-Entfernung nachhelfen.** Die www-URLs sollen von Google
   *gecrawlt* werden, damit die 301 gelesen und die Bewertung übertragen wird.
   Ein Entfernungsantrag verhindert genau das.
3. **Geduld.** Die Zusammenführung braucht mehrere Wochen. Aussagekräftig wird
   erst der Export Anfang Oktober.

## Erwartung

Keine Wunder. Der Effekt ist eine Konsolidierung: Seiten, deren Signale bisher
auf zwei Hosts verteilt lagen, sollten anschließend besser stehen als die jeweils
bessere der beiden Varianten. Bei `/ratgeber/nachbarschaftsstreit-mediation`
waren das Position 28 (www) und 52 (non-www) — dort ist am ehesten eine
sichtbare Verbesserung zu erwarten.

Was der Redirect **nicht** löst: die Ø-Position von 51 über alle Queries. Die
hängt am Alter der Domain und an fehlenden externen Links, nicht an der
Konfiguration.
