importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Firebase config (same as in index.html)
firebase.initializeApp({
  apiKey: "AIzaSyBq1aN-KRtRW7S243ef7lz7fnZmlBcuN1s",
  authDomain: "cabunite.firebaseapp.com",
  projectId: "cabunite",
  storageBucket: "cabunite.firebasestorage.app",
  messagingSenderId: "997924656033",
  appId: "1:997924656033:web:1552b9f26a1af0878eb1e0"
});

const messaging = firebase.messaging();

// ===== BACKGROUND HANDLER =====
messaging.onBackgroundMessage((payload) => {
  console.log('📩 Background message received: ', payload);

  const notificationTitle = payload.notification?.title || '🚕 New Job';
  const notificationOptions = {
    body: payload.notification?.body || 'Tap to view job details',
    icon: '/icon-192.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
