// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU2sECM5CAtWHlmwXoODOigj0k85jgHp4",
  authDomain: "weharmony-1cfc4.firebaseapp.com",
  projectId: "weharmony-1cfc4",
  storageBucket: "weharmony-1cfc4.appspot.com",
  messagingSenderId: "409164985336",
  appId: "1:409164985336:web:31ae3023bb08220d459c0d",
  measurementId: "G-TQFKT31WGZ",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
