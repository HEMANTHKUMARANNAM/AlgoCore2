import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCY915zeWHufwHq9Gj6WTBaP98-YAT7H60",
  authDomain: "temp-5941e.firebaseapp.com",
  databaseURL: "https://temp-5941e-default-rtdb.firebaseio.com",
  projectId: "temp-5941e",
  storageBucket: "temp-5941e.firebasestorage.app",
  messagingSenderId: "796016176089",
  appId: "1:796016176089:web:0f50e4d7fe28e7e988c7c8",
  measurementId: "G-9DKY1GBFMY"
};

// Initialize Firebase app (only if it hasn't been initialized yet)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);  // Use the initialized app for auth
const googleProvider = new GoogleAuthProvider();

const database = getDatabase(app);  // Use the initialized app for database

export {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  database,
};
