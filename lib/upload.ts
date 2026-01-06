import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "./firebase";

// 写真をアップロードしてURLを取得
export async function uploadPhoto(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

// トレーニング記録を保存
export async function saveTrainingRecord(data: {
  date: string;
  menuPhotoUrl: string;
  bodyPhotoUrl: string;
  memo: string;
}) {
  const docRef = await addDoc(collection(db, "trainingRecords"), {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
}

