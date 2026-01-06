// Firebase Authentication を使用した認証機能

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

// メールアドレスとパスワードでログイン
export async function login(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error("ログインエラー:", error);
    return false;
  }
}

// ログアウト
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("ログアウトエラー:", error);
    throw error;
  }
}

// 現在のユーザーを取得
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// 認証状態を確認（認証済みかどうか）
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

// 認証状態の変更を監視
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

