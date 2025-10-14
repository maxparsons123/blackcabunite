importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBq1aN-KRtRW7S243ef7lz7fnZmlBcuN1s",
  authDomain: "cabunite.firebaseapp.com",
  projectId: "cabunite",
  storageBucket: "cabunite.appspot.com",
  messagingSenderId: "997924656033",
  appId: "1:997924656033:web:1552b9f26a1af0878eb1e0"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message:', payload);
  const notificationTitle = payload.notification?.title || '🚕 New Job';
  const notificationOptions = {
    body: payload.notification?.body || 'Tap to view job details',
    icon: payload.notification?.icon || '/icon-192.png',
    data: payload.data || {}
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
