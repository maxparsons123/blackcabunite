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

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background FCM received:', payload);

  // Handle job alerts (data-only messages from your Cloud Function)
  if (payload.data?.type === "new_job") {
    const jobId = payload.data.jobId;
    const pubName = payload.data.pubName || "New pickup";
    const customerName = payload.data.customerName || "Customer";

    // Check if app is already open
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        const appIsOpen = clientList.some(client => 
          client.url.includes('blackcabunite') && 'focus' in client
        );

        if (appIsOpen) {
          // App is open → forward job via postMessage (optional)
          clientList.forEach(client => {
            if (client.url.includes('blackcabunite')) {
              client.postMessage({ type: 'NEW_JOB', job: payload.data });
            }
          });
          console.log("[SW] App is open — skipped notification");
          return;
        }

        // App is NOT open → show notification
        const notificationTitle = "🚕 New Job Request";
        const notificationOptions = {
          body: `Pickup: ${pubName}\nCustomer: ${customerName}`,
          icon: "/taxi-icon-192.png", // Optional: add icon to your repo
          badge: "/taxi-badge.png",   // Optional
          tag: "job-" + jobId,
          renotify: true,
          data: { jobId: jobId }
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const jobId = event.notification.data?.jobId;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('blackcabunite') && 'focus' in client) {
            client.focus();
            if (jobId) {
              client.postMessage({ type: 'OPEN_JOB', jobId });
            }
            return;
          }
        }
        const url = jobId
          ? `https://maxparsons123.github.io/blackcabunite/?job=${encodeURIComponent(jobId)}`
          : `https://maxparsons123.github.io/blackcabunite/`;
        return self.clients.openWindow(url);
      })
  );
});
