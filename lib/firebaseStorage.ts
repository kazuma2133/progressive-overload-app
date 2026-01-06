// Firebase Storage を使用した画像アップロード機能

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

// 画像をアップロードしてURLを取得
export async function uploadPhoto(
  file: File,
  path: string
): Promise<string> {
  try {
    // ファイルサイズのチェック（10MB制限）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("画像ファイルが大きすぎます。10MB以下のファイルを選択してください。");
    }
    
    // Storage参照を作成
    const storageRef = ref(storage, `images/${path}`);
    
    // ファイルをアップロード
    await uploadBytes(storageRef, file);
    
    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("画像のアップロード中にエラーが発生しました:", error);
    
    // エラーメッセージを改善
    if (error instanceof Error) {
      // Firebase Storageのエラーの場合
      if ((error as any).code) {
        const code = (error as any).code;
        if (code === "storage/unauthorized") {
          throw new Error("認証が必要です。ログインしてください。");
        } else if (code === "storage/canceled") {
          throw new Error("アップロードがキャンセルされました。");
        } else if (code === "storage/unknown") {
          throw new Error("ネットワークエラーが発生しました。接続を確認してください。");
        }
      }
    }
    
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

