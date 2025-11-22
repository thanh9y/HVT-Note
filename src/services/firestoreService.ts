// src/services/firestoreService.ts
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";


export interface Note {
  id?: string;
  userId: string;
  title: string;
  content: string;
  createdAt?: Date | Timestamp;
}

export const addNote = async (
  userId: string,
  data: Omit<Note, "id" | "userId" | "createdAt">
) => {
  const colRef = collection(db, "notes");
  return await addDoc(colRef, {
    userId,
    ...data,
    createdAt: new Date(),
  });
};

export const listenUserNotes = (
  userId: string,
  cb: (notes: Note[]) => void
) => {
  const colRef = collection(db, "notes");
  const q = query(
    colRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const items: Note[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as any) });
    });
    cb(items);
  });
};
