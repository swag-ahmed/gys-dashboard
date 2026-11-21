// Minimal service worker. Chrome needs one to offer "Install app".
// It deliberately caches nothing: every visit loads the latest dashboard.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
