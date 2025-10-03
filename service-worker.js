// service-worker.js

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow('./');
      }
    })
  );
});

// Minimal fetch handler to avoid "no-op" warning
self.addEventListener('fetch', (event) => {
  // Let the browser handle all requests normally
  // This silences the warning and is safe for your app
});
