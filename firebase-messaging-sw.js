importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBq1aN-KRtRW7S243ef7lz7fnZmlBcuN1s",
  authDomain: "cabunite.firebaseapp.com",
  projectId: "cabunite",
  storageBucket: "cabunite.appspot.com",
  messagingSenderId: "997924656033",
  appId: "1:997924656033:web:1552b9f26a1af0878eb1e0"
});

const messaging = firebase.messaging();

// Background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message:', payload);

  const title = payload.notification?.title || '🚕 New Job';
  const options = {
    body: payload.notification?.body || 'Tap to view job details',
    icon: payload.notification?.icon || '/icon-192.png',
    badge: '/icon-192.png',
    requireInteraction: true,
    data: payload.data || {} // must include payload.data.url for deep-linking
  };

  return self.registration.showNotification(title, options);
});

// Click handler: bring PWA to front or open job
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Try to focus an existing tab first
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          // If possible, navigate to job inside the app
          if (client.url !== targetUrl) client.navigate(targetUrl);
          return;
        }
      }
      // If no existing tab, open a new window/tab
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// Minimal fetch listener for PWA installability
self.addEventListener('fetch', (event) => {});
