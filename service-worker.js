// service-worker.js
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        const client = clientList[0];
        client.focus();
        // Optional: send message to app
        if (event.notification.data) {
          client.postMessage({
            type: 'fcm-notification-click',
            data: event.notification.data
          });
        }
      } else {
        clients.openWindow('./');
      }
    })
  );
});
