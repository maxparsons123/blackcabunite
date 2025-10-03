// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq1aN-KRtRW7S243ef7lz7fnZmlBcuN1s",
  authDomain: "cabunite.firebaseapp.com",
  projectId: "cabunite",
  storageBucket: "cabunite.firebasestorage.app",
  messagingSenderId: "997924656033",
  appId: "1:997924656033:web:1552b9f26a1af0878eb1e0",
  measurementId: "G-7CQ2H4YM12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);