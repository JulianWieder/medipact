# Bezahlung – Go-live-Checkliste (Stand 04.10.2026)

Ablauf: Jede Partei **reserviert** ihren Anteil per PayPal (intent=AUTHORIZE).
Hat die letzte Partei zugesagt, werden **alle** Reservierungen eingezogen, der
Fall wird freigeschaltet, und die Rechnungen entstehen.

Automatisch geprüft: `backend/tests/test_payment_flow.py` (17 Szenarien mit
simuliertem PayPal, keine echten Zahlungen).

---

## 1. Stand auf dem Server prüfen

Alles auf dem Server (`ssh dev@178.104.99.33`), nach dem Deploy (`bash ~/medipact/deploy.sh`):

```bash
# a) Code-Stand = letzter Commit?
cd ~/medipact && git log --oneline -1

# b) Migrationen: "current" muss dem "heads" entsprechen
docker exec medipact-api alembic current
docker exec medipact-api alembic heads

# c) PayPal-Konfiguration im laufenden Container (zeigt nur ja/nein, keine Geheimnisse)
docker exec medipact-api python -c "from app.config import settings as s; print('ENV', s.PAYPAL_ENV, '| ID', bool(s.PAYPAL_CLIENT_ID), '| SECRET', bool(s.PAYPAL_CLIENT_SECRET), '| WEBHOOK', bool(s.PAYPAL_WEBHOOK_ID))"

# d) Frontend kennt die Client-ID? (wird beim Build fest eingebaut!)
grep -c NEXT_PUBLIC_PAYPAL_CLIENT_ID ~/medipact/.env* 

# e) Webhook-Route erreichbar? Erwartet: 400 (= Signatur ungueltig, Route lebt). 404/502 = Problem.
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://medipact.de/api/paypal/webhook -H "Content-Type: application/json" -d '{}'

# f) Cron fuer ablaufende Reservierungen + haengende Einzuege eingerichtet?
crontab -l | grep check_authorizations

# g) Simulation im Container
docker exec medipact-api python -m tests.test_payment_flow
```

Fehlt der Cron (f), einrichten mit `crontab -e` und dieser Zeile:

```
17 * * * * docker exec medipact-api python -m scripts.check_authorizations >> /home/dev/medipact-cron.log 2>&1
```

Probelauf ohne Wirkung: `docker exec medipact-api python -m scripts.check_authorizations --dry-run`

---

## 2. Sandbox-Probelauf (echtes PayPal, Spielgeld)

1. developer.paypal.com → Sandbox → Accounts: zwei **Personal**-Testkonten (Käufer).
2. Sandbox-App → Webhooks → `https://medipact.de/api/paypal/webhook`, Ereignisse:
   `CHECKOUT.ORDER.APPROVED`, `PAYMENT.AUTHORIZATION.CREATED`,
   `PAYMENT.AUTHORIZATION.VOIDED`, `PAYMENT.CAPTURE.DENIED` → Webhook-ID in
   `backend/.env` (`PAYPAL_WEBHOOK_ID`), dann `cd ~/medipact/backend && docker compose up -d --force-recreate`.
3. Trennungsfall mit zwei eigenen medipact-Konten anlegen.
4. Partei A zahlt mit Testkonto 1 → Status „reserviert“, Fall noch zu.
5. Partei B zahlt mit Testkonto 2 → Fall frei, in der Sandbox 2× „Completed“, 2 Rechnungen im Workspace.
6. Gegenprobe Storno: neuer Fall, A zahlt, A zieht zurück → in der Sandbox „Voided“.
7. Gegenprobe Webhook: nach der PayPal-Bestätigung sofort den Tab schließen → Partei steht trotzdem auf „reserviert“ (Log: `docker logs medipact-api | grep Webhook`).

---

## 3. Live schalten

1. PayPal-**Business**-Konto (verifiziert, Bankkonto hinterlegt).
2. developer.paypal.com → **Live** → App anlegen → Client-ID + Secret.
3. Live-App → Webhook wie oben anlegen (**eigene** Webhook-ID, die Sandbox-ID gilt nicht).
4. `backend/.env`: `PAYPAL_ENV=live`, Live-`PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET`, Live-`PAYPAL_WEBHOOK_ID`
   → `cd ~/medipact/backend && docker compose up -d --force-recreate`
   (ein einfaches `docker restart` liest die .env **nicht** neu ein).
5. Frontend-`.env`: `NEXT_PUBLIC_PAYPAL_CLIENT_ID` = Live-Client-ID → `npm run build && pm2 restart medipact --update-env`
   (die ID wird beim Build eingebaut – ohne neuen Build zeigt der Button weiter die Sandbox).
6. Echtgeld-Test mit 1 €: Rabattcode `kind=fixed`, Wert 48, `restrict_type=nachbarschaft`
   → zwei eigene Konten zahlen je 1 € → Fall frei, 2 Rechnungen.
   Danach im PayPal-Konto erstatten und den Code deaktivieren.
7. Schritt 1 c) + e) wiederholen.

---

## 4. Offen – Entscheidung bei Julian (nicht technisch)

- **Umsatzsteuer:** Rechnungen laufen mit `tax_rate=0` und dem Hinweis § 19 UStG
  (Kleinunternehmer). Gilt das nicht, wird die USt **auf** den Preis aufgeschlagen
  (`invoice_pdf.py`) – dann passt die Rechnung nicht zum eingezogenen Betrag.
  Vorher klären, ob die Preise brutto gemeint sind.
- **Checkout-Recht (B2C):** Im Bezahl-Block gibt es weder Widerrufsbelehrung noch
  die Zustimmung zum vorzeitigen Beginn noch einen AGB-Haken. Ein Button
  „zahlungspflichtig bestellen“ fehlt ebenfalls (der PayPal-Button heißt nur „PayPal“).
  Vor dem Live-Schalten rechtlich prüfen lassen.
- **Erstattung nach dem Einzug:** gibt es im System nicht, nur manuell im
  PayPal-Konto (und die Rechnung von Hand auf „erstattet“ setzen).

---

## Was am 04.10.2026 behoben wurde

| Problem | Folge vorher | Jetzt |
|---|---|---|
| capture-order akzeptierte jede Order-ID | billige Order aus fremdem Fall „bezahlt“ teuren Fall, Einzug scheitert, Fall hängt | nur die Order, die create-order für diese Partei angelegt hat (sonst 409) |
| Betrag nach Order-Erstellung geändert (Add-ons) | Reservierung zu niedrig, Einzug scheitert | Betrag wird geprüft, Reservierung bei Abweichung freigegeben (409, neu zahlen) |
| PayPal-Störung beim Einzug | Fehler 500 für die letzte Partei, niemand holt nach | Reservierung bleibt, Hinweis an den Nutzer, Cron holt den Einzug stündlich nach |
| Webhook schneller als Browser | „Zahlung fehlgeschlagen“, obwohl reserviert; kein Ablaufdatum | idempotent, Ablaufdatum wird gespeichert |
| Doppelklick/Retry | Fehlermeldung, Gefahr doppelter Einzug | PayPal-Request-Id + Wiederholung liefert nur den Status |
| Einzug „DECLINED“ (HTTP 201) | als bezahlt gewertet | Partei wird zurückgesetzt und muss neu zahlen |
| Gleichzeitiger Einzug (Browser, Webhook, Cron) | doppelte Verarbeitung möglich | Zeilensperre auf dem Fall (Postgres) |
| Rechnungsbetrag neu berechnet | konnte vom eingezogenen Betrag abweichen | Rechnung = tatsächlich eingezogener Betrag |
| Rechnungsnummer = Anzahl+1 | nach gelöschter Rechnung doppelte Nummer (Absturz) | höchste Nummer + 1 |
| Webhook-URL `/backend/...` | über den mailcow-nginx nicht erreichbar | `https://medipact.de/api/paypal/webhook` (Next.js leitet weiter) |
| Fehler aus create-order (z.B. Rechnungsdaten fehlen) | nur „PayPal hat einen Fehler gemeldet“ | die echte Meldung wird angezeigt |
