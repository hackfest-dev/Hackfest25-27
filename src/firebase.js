import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr27WKRXAAoKxzQ4mfJ4hhAlR4RMFWFqc",
  authDomain: "nittehackathon.firebaseapp.com",
  projectId: "nittehackathon",
  storageBucket: "nittehackathon.firebasestorage.app",
  messagingSenderId: "950943964810",
  appId: "1:950943964810:web:fbe7b46659db62b9b05773",
  measurementId: "G-5KDL1FMKDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 