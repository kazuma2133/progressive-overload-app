// シンプルなパスワード認証（ローカルストレージベース）

const AUTH_STORAGE_KEY = "isAuthenticated";

// 環境変数からパスワードを取得（デフォルト値あり）
const AUTH_PASSWORD =
  process.env.NEXT_PUBLIC_AUTH_PASSWORD || "progressive2024";

// パスワードを検証して認証状態を保存
export function authenticate(password: string): boolean {
  if (password === AUTH_PASSWORD) {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    return true;
  }
  return false;
}

// 認証状態を確認
export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

// ログアウト
export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

