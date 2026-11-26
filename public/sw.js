const CACHE = "mitsitsy-v2";
const PRECACHE = [
  "/",
  "/tutorial",
  "/settings",
  "/manifest.webmanifest",
  "/icon.svg",
  "/pwa-icon/192",
  "/pwa-icon/512",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.allSettled(PRECACHE.map((url) => cache.add(url))),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// The page sends the files it already loaded, so the very first visit is cached too.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS") return;
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.allSettled(
          event.data.urls
            .filter(
              (u) =>
                new URL(u).origin === self.location.origin &&
                !u.includes("/_vercel/"),
            )
            .map((u) => cache.add(u)),
        ),
      ),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/_vercel/")
  )
    return;

  if (req.mode === "navigate") event.respondWith(networkFirst(url));
  else if (url.pathname.startsWith("/_next/static/"))
    event.respondWith(cacheFirst(req));
  else event.respondWith(staleWhileRevalidate(req));
});

// Pages: fresh when online (4 s timeout), cached copy when offline or slow.
async function networkFirst(url) {
  const cache = await caches.open(CACHE);
  const key = new Request(url.origin + url.pathname);
  try {
    const res = await Promise.race([
      fetch(url.href),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 4000),
      ),
    ]);
    if (res.ok) cache.put(key, res.clone());
    return res;
  } catch {
    return (
      (await cache.match(key)) ||
      (await cache.match("/")) ||
      new Response("Offline", { status: 503 })
    );
  }
}

// Hashed build files never change, so the cache wins.
async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => undefined);
  return hit || (await network) || new Response("Offline", { status: 503 });
}
