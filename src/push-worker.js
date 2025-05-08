self.addEventListener('push', function (event) {
  const data = event.data?.json() || {};
  self.registration.showNotification(data.title || 'Info', {
    body: data.body || 'Neue Nachricht',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge.png'
  });
});
