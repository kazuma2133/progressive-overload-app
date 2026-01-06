// Firebase初期化設定

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase設定（環境変数から取得）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseアプリを初期化（既に初期化されている場合は再利用）
let app: FirebaseApp;
if (getApps().length === 0) {
  // 環境変数の検証
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Firebase設定が不完全です。環境変数を確認してください。");
    throw new Error("Firebase設定エラー: 環境変数が正しく設定されていません。");
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Firebaseサービスを初期化
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
