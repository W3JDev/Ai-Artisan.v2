
const CACHE_NAME = 'artisan-cache-v2';
const DATA_CACHE_NAME = 'artisan-data-v2';

// 1. App Shell (Core UI)
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 2. Install Event: Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// 3. Activate Event: Cleanup Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 4. Fetch Event: The Core Logic
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy A: Stale-While-Revalidate for CDN assets (esm.sh, fonts, tailwind)
  // This ensures fast load but updates in background.
  if (url.hostname.includes('esm.sh') || 
      url.hostname.includes('cdn.tailwindcss.com') || 
      url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy B: Network First for API calls (Gemini, Google Forms)
  // We don't want to cache AI responses too aggressively as prompts change.
  if (url.hostname.includes('generativelanguage.googleapis.com') || 
      url.hostname.includes('docs.google.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Optional: Return a specific offline JSON error if needed
        return new Response(JSON.stringify({ error: 'Offline' }), {
            headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Strategy C: Cache First, Fallback to Network for App Shell
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback for navigation requests (HTML)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
