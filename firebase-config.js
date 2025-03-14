import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtmKyQvGpWKvGcydGuScsFDGH08ZOa0xs",
  authDomain: "first-project-1fa98.firebaseapp.com",
  projectId: "first-project-1fa98",
  storageBucket: "first-project-1fa98.firebasestorage.app",
  messagingSenderId: "352427913276",
  appId: "1:352427913276:web:f47f562533d241f3dc9339"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc };