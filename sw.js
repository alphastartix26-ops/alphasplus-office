// ALPHA S+ 사무실 서비스워커 — 아이콘만 캐시(오프라인 아이콘), HTML/데이터는 항상 네트워크(최신).
const CACHE = "office-static-v6";
const ASSETS = ["icon-192.png", "icon-512.png", "manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(a => "./" + a))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // 정적 아이콘/매니페스트만 캐시-우선. 그 외(HTML·Supabase)는 손대지 않음 = 항상 최신 네트워크.
  if (ASSETS.some(a => url.pathname.endsWith(a))) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
