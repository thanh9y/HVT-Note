// src/services/storageService.ts
import { storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFileAsync = async (
  uri: string,
  pathInBucket: string
): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const fileRef = ref(storage, pathInBucket);
  await uploadBytes(fileRef, blob);
  const downloadUrl = await getDownloadURL(fileRef);
  return downloadUrl;
};
