
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkcNAHAdQoOcnlTIDad32qs2WHlC4S1o0",
  authDomain: "journal-7a6ff.firebaseapp.com",
  projectId: "journal-7a6ff",
  storageBucket: "journal-7a6ff.appspot.com",
  messagingSenderId: "656042241658",
  appId: "1:656042241658:web:4c34e1ff0b9617643fd5c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth + Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ✅ Firestore
export const db = getFirestore(app);
