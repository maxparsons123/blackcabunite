// Import the Firebase SDKs for app and messaging compat versions.
// These are essential for initializing Firebase and handling FCM in the service worker.
// Using version 10.12.0, as it has been consistently used in your main app.
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker context with your project's config object.
// This is crucial for Firebase Cloud Messaging to function correctly.
// The 'storageBucket' has been set to 'cabunite.appspot.com' as per previous discussions.
firebase.initializeApp({
  apiKey: "AIzaSyBq1aN-KRtRW7S243ef7lz7fnZmlBcuN1s",
  authDomain: "cabunite.firebaseapp.com",
  projectId: "cabunite",
  storageBucket: "cabunite.appspot.com",
  messagingSenderId: "997924656033",
  appId: "1:997924656033:web:1552b9f26a1af0878eb1e0"
});

// Get the Firebase Messaging instance to handle messages within the service worker.
const messaging = firebase.messaging();

// --- FCM Background Message Handling ---
// This function is triggered when an FCM notification message arrives
// while your web app is not in the foreground (e.g., closed, minimized, or in another tab).
// This is the primary and recommended way to handle such messages with Firebase.
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 🔔 Background message received:', payload);

  // Define the title and options for the system notification that will be shown to the user.
  // It uses values from the FCM payload or sensible defaults.
  const title = payload.notification?.title || '🚕 New Job';
  const options = {
    body: payload.notification?.body || 'Tap to view job details',
    // The 'icon' and 'badge' paths assume these images are in your app's root directory.
    icon: payload.notification?.icon || '/icon-192.png',
    badge: '/icon-192.png', // Badge is optional but can improve Android notification appearance
    // The 'data' field carries any custom payload you sent from your server.
    // This data can be accessed when the notification is clicked, enabling deep-linking.
    data: payload.data || {},
    // Optional: add a sound for background notifications (support varies by browser/OS).
    // sound: '/notification.mp3' // Ensure this path is correct and the file exists.
  };

  // Show the actual system notification to the user.
  // The service worker's `self.registration` is used to display notifications.
  return self.registration.showNotification(title, options);
});

// --- Notification Click Handling ---
// This event listener fires when a user clicks on a system notification displayed by this service worker.
self.addEventListener('notificationclick', (event) => {
  // Immediately close the notification after it's clicked to keep the notification tray clean.
  event.notification.close();

  // Determine the target URL from the notification's data payload, or default to the app's root.
  // This enables deep-linking within your PWA based on the notification content.
  const targetUrl = event.notification.data?.url || '/';

  // 'event.waitUntil' ensures the service worker remains active until the promise within it resolves.
  event.waitUntil(
    // Look for any existing client windows (browser tabs) that are controlled by this service worker.
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If there are any open client windows, try to focus on one of them (the first one found).
      // If the target URL is provided and matches an existing client, navigate to it.
      for (const client of clientList) {
        if (client.url === targetUrl && client.focus) {
          return client.focus();
        }
      }
      // If no existing window matches the target URL, or if no window is found,
      // open a new window/tab to the target URL.
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// --- PWA Installability: Minimal Fetch Handler ---
// THIS IS CRUCIAL for PWA installability!
// A service worker *must* have an 'fetch' event listener to be recognized as
// a Progressive Web App capable of offline functionality (even if it does nothing).
// Its mere presence satisfies a key PWA criterion for showing the "Add to Home Screen" prompt.
self.addEventListener('fetch', (event) => {
  // In this minimal implementation, we simply let all network requests
  // pass through to the network as they normally would.
  // This means the service worker is not actively caching or intercepting
  // network requests, but its presence signals PWA capabilities to the browser.
  // For more advanced offline capabilities or caching strategies, you would
  // add specific logic here using the Cache API.
});
