import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtoCdPExYhMxx6gMdID5ZPa3IcEaQkqGw",
  authDomain: "dyp-hackathon-shubham.firebaseapp.com",
  projectId: "dyp-hackathon-shubham",
  storageBucket: "dyp-hackathon-shubham.firebasestorage.app",
  messagingSenderId: "880862460777",
  appId: "1:880862460777:web:d0be66e8f3af367537dbf8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
