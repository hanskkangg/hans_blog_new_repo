// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hansblog-62d5a.firebaseapp.com",
  projectId: "hansblog-62d5a",
  storageBucket: "hansblog-62d5a.appspot.com",
  messagingSenderId: "548567066649",
  appId: "1:548567066649:web:44f3fc04cbcfdb64b2e288",
  measurementId: "G-EZDHS4D188"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

