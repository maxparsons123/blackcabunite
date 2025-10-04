// Import Firebase SDK scripts for service workers
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase inside service worker
firebase.initializeApp({
apiKey: "AIzaSyBq1aN-KRtRW7S243ef7lz7fnZmlBcuN1s",
authDomain: "cabunite.firebaseapp.com",
projectId: "cabunite",
storageBucket: "cabunite.firebasestorage.app",
messagingSenderId: "997924656033",
appId: "1:997924656033:web:1552b9f26a1af0878eb1e0",
measurementId: "G-7CQ2H4YM12"
});

// Retrieve messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
console.log('[firebase-messaging-sw.js] Received background message ', payload);

const notificationTitle = payload.notification?.title || '🚕 New Job';
const notificationOptions = {
body: payload.notification?.body || 'Tap to view job details',
icon: '/icon-192.png', // Make sure this file exists in root
data: payload.data || {}
};

return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
event.notification.close();
if (event.notification.data?.url) {
event.waitUntil(clients.openWindow(event.notification.data.url));
}
});