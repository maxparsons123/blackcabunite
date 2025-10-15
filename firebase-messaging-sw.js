// firebase-messaging-sw.js
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

// Optional: log background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message:', payload);
  // Firebase SDK will auto-show notification if payload.notification exists
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const jobId = event.notification.data?.jobId;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes('blackcabunite') && 'focus' in client) {
            client.focus();
            if (jobId) {
              client.postMessage({ type: 'OPEN_JOB', jobId });
            }
            return;
          }
        }
        if (clients.openWindow) {
          const url = jobId 
            ? 'https://maxparsons123.github.io/blackcabunite/?job=' + encodeURIComponent(jobId)
            : 'https://maxparsons123.github.io/blackcabunite/';
          return clients.openWindow(url);
        }
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Keep for PWA compatibility
});
