// src/firebase/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Dùng đúng config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyD-iLQz_Ka6yl6l6tqJLFxSG3UzDZfpPZc",
  authDomain: "hvtnote.firebaseapp.com",
  projectId: "hvtnote",
  storageBucket: "hvtnote.firebasestorage.app",
  messagingSenderId: "429575304812",
  appId: "1:429575304812:web:2d9046c6feef34d327ca49",
  measurementId: "G-KKF43SFJED",
};

// Tránh initialize nhiều lần khi Fast Refresh
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
