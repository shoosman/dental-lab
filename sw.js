// Network-first: каждое открытие берёт свежую версию с сервера, кэш — только когда нет сети.
// Поэтому правки, выложенные в GitHub, доходят до всех устройств без переустановки.
const CACHE = "lab-shell";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, { cache: "no-cache" })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("./")))
  );
});
