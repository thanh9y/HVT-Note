// src/services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Đăng ký
export async function register(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Đăng nhập
export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Đăng xuất
export async function logout() {
  await signOut(auth);
}

// Lắng nghe thay đổi trạng thái đăng nhập
export function listenAuthChange(callback: (user: User | null) => void) {
  const unsub = onAuthStateChanged(auth, callback);
  return unsub;
}
