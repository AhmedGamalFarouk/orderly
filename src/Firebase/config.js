// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyADgtpM2wpuAe1kXwTUscT10cM6c56OQL8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "orderly-be13f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "orderly-be13f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "orderly-be13f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1062300890523",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1062300890523:web:77021f02306ef076201d3e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GKCY165KLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const DEMO_EMAIL = "ahmedjamal5565@gmail.com";

const isVerifiedUser = (user) => Boolean(
  user && (
    user.email === DEMO_EMAIL ||
    user.emailVerified ||
    !user.providerData?.some(({ providerId }) => providerId === "password")
  )
);

export { auth, provider, db, isVerifiedUser, DEMO_EMAIL };
// const analytics = getAnalytics(app);
