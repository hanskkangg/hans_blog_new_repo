// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "personalblog-ca39a.firebaseapp.com",
  projectId: "personalblog-ca39a",
  storageBucket: "personalblog-ca39a.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "568011967196",
  appId: "1:568011967196:web:285aab875e7be8e0204219",
  measurementId: "G-198440CGJ2",
  clientId: "86754690739-10m8d0imng6qkiblakl4gsh8rjq5gntl.apps.googleusercontent.com" // Added OAuth client ID
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

