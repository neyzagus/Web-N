// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALjq-PU46elRRY1J-K4lJXEO2fKd-vr4g",
  authDomain: "maximizatuempresa-web.firebaseapp.com",
  projectId: "maximizatuempresa-web",
  storageBucket: "maximizatuempresa-web.firebasestorage.app",
  messagingSenderId: "1036544972868",
  appId: "1:1036544972868:web:c814f6752af4727a914411",
  measurementId: "G-KY4Q0VKPH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
