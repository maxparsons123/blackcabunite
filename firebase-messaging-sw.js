importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// ✅ Initialize Firebase (correct storage bucket)
firebase.initializeApp({
  apiKey: "AIzaSyBq1aN-KRtRW7S243ef7lz7fnZmlBcuN1s",
  authDomain: "cabunite.firebaseapp.com",
  projectId: "cabunite",
  storageBucket: "cabunite.appspot.com", // ✅ fixed: must be .appspot.com
  messagingSenderId: "997924656033",
  appId: "1:997924656033:web:1552b9f26a1af0878eb1e0"
});

// ✅ Get messaging instance
const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 🔔 Background message received:', payload);

  const title = payload.notification?.title || '🚕 New Job';
  const options = {
    body: payload.notification?.body || 'Tap to view job details',
    icon: payload.notification?.icon || '/icon-192.png',
    badge: '/icon-192.png', // optional but helps Android notification icon
    data: payload.data || {},
  };

  // ✅ Show system notification
  return self.registration.showNotification(title, options);
});

// ✅ Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // focus if already open
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // otherwise open the app
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
