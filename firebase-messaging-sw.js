importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker with your project's config object.
// This is essential for Firebase Cloud Messaging to function correctly.
// The 'storageBucket' has been fixed to '.appspot.com' as previously identified.
firebase.initializeApp({
  apiKey: "AIzaSyBq1aN-KRtRW7S243ef7lz7fnZmlBcuN1s",
  authDomain: "cabunite.firebaseapp.com",
  projectId: "cabunite",
  storageBucket: "cabunite.appspot.com",
  messagingSenderId: "997924656033",
  appId: "1:997924656033:web:1552b9f26a1af0878eb1e0"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages:
// This function is called when a notification message is received while the app
// is not in the foreground (e.g., browser tab is closed or minimized).
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 🔔 Background message received:', payload);

  // Customize how the notification looks and behaves here.
  // Using default values if specific fields are missing from the payload.
  const title = payload.notification?.title || '🚕 New Job';
  const options = {
    body: payload.notification?.body || 'Tap to view job details',
    // Ensure this icon exists in your root directory to be displayed correctly.
    icon: payload.notification?.icon || '/icon-192.png',
    // Badge is an optional icon specifically for Android's notification bar.
    badge: '/icon-192.png',
    // Data payload allows you to pass custom data that can be used on notification click.
    data: payload.data || {},
  };

  // Show the system notification to the user.
  // The service worker's `self.registration` is used to display notifications.
  return self.registration.showNotification(title, options);
});

// Handle notification clicks:
// This function is triggered when the user clicks on a system notification.
self.addEventListener('notificationclick', (event) => {
  // Close the notification immediately after it's clicked.
  event.notification.close();

  // This `waitUntil` ensures the service worker remains active until the promise resolves.
  event.waitUntil(
    // Match all client windows (tabs) that belong to this service worker's scope.
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If there's an existing app window, focus on the first one found.
      for (const client of clientList) {
        if ('focus' in client) { // Check if client has focus method (e.g., a window client)
          return client.focus();
        }
      }
      // If no existing window is found, open a new one to the app's root URL.
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// ADDED: Minimal fetch handler for PWA installability
// This is crucial! A service worker must have a 'fetch' event listener
// to fulfill PWA installability criteria, even if it doesn't perform
// any complex caching or network interception. Its presence tells the
// browser that the service worker is capable of intercepting requests.
self.addEventListener('fetch', (event) => {
  // For this application, we're letting all network requests
  // pass through to the network as usual.
  // This approach is safe and simply ensures the PWA installability flag is met.
});

