importScripts(
  "/public/vu/vu.bundle.js",
)
importScripts("/public/vu/vu.bundle.js")
importScripts("/public/vu/vu.config.js")
importScripts("/public/vu/vu.sw.js")
importScripts("/public/scram/scramjet.config.js");  // Load config FIRST
importScripts("/public/scram/scramjet.all.js");      // Then load scramjet

if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: true,
  })
}

const vu = new UVServiceWorker()
const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

async function handleRequest(event) {
  await scramjet.loadConfig()
  if (scramjet.route(event)) {
    return scramjet.fetch(event)
  }

  if (vu.route(event)) return await vu.fetch(event);
    
  return await fetch(event.request)
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event))
})