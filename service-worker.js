self.addEventListener('push', function (event) {
  const options = event.data ? event.data.json() : {};

  event.waitUntil(
    self.registration.showNotification(options.title, {
      body: options.body,
      icon: options.icon || '/assets/icons/icon-192x192.png',
      badge: options.badge || '/assets/icons/badge.png'
    })
  );
});

// public/service-worker.js
self.addEventListener('push', function (event) {
  const options = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(options.title || 'Hallo!', {
      body: options.body || 'Dies ist eine Testbenachrichtigung.',
      icon: options.icon || '/assets/icons/icon-192x192.png',
      badge: options.badge || '/assets/icons/badge.png',
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});


