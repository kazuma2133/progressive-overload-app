// Firebase Storage を使用した画像アップロード機能

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

// 画像をアップロードしてURLを取得
export async function uploadPhoto(
  file: File,
  path: string
): Promise<string> {
  try {
    // Storage参照を作成
    const storageRef = ref(storage, `images/${path}`);
    
    // ファイルをアップロード
    await uploadBytes(storageRef, file);
    
    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("画像のアップロード中にエラーが発生しました:", error);
    throw error;
  }
}

// 画像を削除
export async function deletePhoto(url: string): Promise<void> {
  try {
    // URLからStorage参照を作成
    const storageRef = ref(storage, url);
    
    // 画像を削除
    await deleteObject(storageRef);
  } catch (error) {
    console.error("画像の削除中にエラーが発生しました:", error);
    throw error;
  }
}

// ファイルをBase64に変換（プレビュー用、Firebaseでは使用しない）
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("ファイルの読み込みに失敗しました"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

