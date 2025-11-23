// src/services/firestoreService.ts
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export type Note = {
  id?: string;
  userId: string;
  title: string;
  content: string;
  createdAt?: any;
};

// Thêm 1 note mới
export async function addNote(
  userId: string,
  data: { title: string; content: string }
) {
  const colRef = collection(db, "notes");
  await addDoc(colRef, {
    userId,
    title: data.title,
    content: data.content,
    createdAt: serverTimestamp(),
  });
}

// Lắng nghe danh sách note của 1 user
export function listenUserNotes(
  userId: string,
  callback: (notes: Note[]) => void
) {
  const colRef = collection(db, "notes");

  const q = query(
    colRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const unsub = onSnapshot(q, (snapshot) => {
    const list: Note[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      list.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt,
      });
    });
    callback(list);
  });

  return unsub;
}
