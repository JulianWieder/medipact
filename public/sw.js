// ── Service Worker für den installierbaren Kalender ────────────────────────
//
// Bewusst so wenig wie möglich. Ein Service Worker ist hier kein Cache-Layer,
// sondern eine Eintrittskarte: Chrome feuert `beforeinstallprompt` – und zeigt
// damit den Installieren-Knopf – nur, wenn ein Worker mit einem fetch-Handler
// registriert ist. Ohne ihn bliebe nur der versteckte Browser-Menüpunkt.
//
// Deshalb die Regel: NICHTS wird gecacht außer der Offline-Seite. Jede Anfrage
// geht ans Netz. Ein Worker, der HTML oder JS-Chunks zwischenspeichert, liefert
// nach dem nächsten Deploy alte Bundles zu neuem Server-Code aus – und das
// merkt niemand, bis Nutzer weiße Seiten melden. Der Preis dafür ist, dass die
// App offline nichts anzeigen kann. Das ist bei einem Kalender, dessen Inhalt
// die Gegenseite jederzeit ändert, ohnehin die ehrlichere Antwort.
//
// Wer später echtes Offline-Verhalten will: nicht hier ausbauen, sondern
// Serwist o. ä. einziehen, das die Build-Hashes kennt.

const CACHE = "medipact-shell-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, "/icon-192.png"]))
      // Die Installation darf nicht daran scheitern, dass eine der beiden
      // Dateien gerade nicht erreichbar ist – sonst ist die App nicht
      // installierbar, weil ein Icon 404 war.
      .catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Nur Seitenaufrufe anfassen. Alles andere (JS, Bilder, API-Calls) läuft
  // ohne `respondWith` durch – der Worker ist dafür schlicht nicht zuständig.
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request).catch(async () => {
      const cached = await caches.match(OFFLINE_URL);
      return (
        cached ??
        new Response("Offline", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      );
    }),
  );
});
