const CACHE_NAME = "fuel-tracker-v1"
const urlsToCache = ["/", "/reports", "/batch-submission", "/manifest.json", "/icon-192.jpg", "/icon-512.jpg"]

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Opened cache")
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error("[SW] Cache installation failed:", error)
      }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      // Clone the request
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache the fetched response for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return a custom offline page if available
          return caches.match("/")
        })
    }),
  )
})

// Background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-fuel-records") {
    event.waitUntil(syncFuelRecords())
  }
})

async function syncFuelRecords() {
  // This would sync any pending fuel records when back online
  console.log("[SW] Syncing fuel records...")
  // Implementation would depend on backend API
}
