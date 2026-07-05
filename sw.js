// sw.js - Service Worker Completo (Soporte Offline + Control de Notificaciones)

const CACHE_NAME = 'habitus-v2';
const ASSETS = [
  'index.html',
  'manifest.json',
  'manifest.webmanifest',
  'icon.svg'
];

// Instalar y cachear archivos para que funcione offline
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => {
      // Fuerza al Service Worker a activarse de inmediato sin esperar
      return self.skipWaiting();
    })
  );
});

// Activar y reclamar clientes inmediatamente
self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim()
  );
});

// Responder desde el caché sin internet o buscar en la red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Manejo inteligente de enfoque al cliquear el Widget superior
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});