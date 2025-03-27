// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuv49AbBuv6Cn3-0v_FgwHrODQxQoq1EQ",
  authDomain: "budget-track-c742d.firebaseapp.com",
  projectId: "budget-track-c742d",
  storageBucket: "budget-track-c742d.firebasestorage.app",
  messagingSenderId: "89342408656",
  appId: "1:89342408656:web:e9e72e4db9f3df640e2bd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
