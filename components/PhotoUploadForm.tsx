"use client";

import { useState, useEffect } from "react";
import { fileToBase64, saveTrainingRecord } from "@/lib/mockStorage";
import { isAuthenticated } from "@/lib/auth";
import AuthModal from "./AuthModal";

export default function PhotoUploadForm() {
  const [menuPhoto, setMenuPhoto] = useState<File | null>(null);
  const [bodyPhoto, setBodyPhoto] = useState<File | null>(null);
  const [date, setDate] = useState<string>(() => {
    // 今日の日付を初期値として設定（YYYY-MM-DD形式）
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [memo, setMemo] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // メニュー写真のプレビュー
  const [menuPreview, setMenuPreview] = useState<string | null>(null);
  // 体の写真のプレビュー
  const [bodyPreview, setBodyPreview] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // 認証状態を確認
  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  // メニュー写真の選択
  const handleMenuPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMenuPhoto(file);
      // プレビュー用のURLを作成
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 体の写真の選択
  const handleBodyPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBodyPhoto(file);
      // プレビュー用のURLを作成
      const reader = new FileReader();
      reader.onloadend = () => {
        setBodyPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 認証チェック
    if (!authenticated) {
      setAuthModalOpen(true);
      return;
    }

    // 入力値の検証
    // 写真、メモ、体重のいずれかがあれば保存可能
    if (!menuPhoto && !bodyPhoto && !memo.trim() && !weight) {
      alert("写真、メモ、体重のいずれかを入力してください");
      return;
    }

    if (memo.length > 2000) {
      alert("メモは2000文字以内で入力してください");
      return;
    }

    setIsUploading(true);

    try {
      // 写真をBase64に変換（写真がある場合のみ）
      const photoPromises: Promise<string | undefined>[] = [];
      if (menuPhoto) {
        photoPromises.push(fileToBase64(menuPhoto));
      } else {
        photoPromises.push(Promise.resolve(undefined));
      }
      if (bodyPhoto) {
        photoPromises.push(fileToBase64(bodyPhoto));
      } else {
        photoPromises.push(Promise.resolve(undefined));
      }

      const [menuPhotoUrl, bodyPhotoUrl] = await Promise.all(photoPromises);

      // データをローカルストレージに保存
      await saveTrainingRecord({
        date,
        menuPhotoUrl,
        bodyPhotoUrl,
        memo,
        weight: weight ? parseFloat(weight) : undefined,
      });

      // リストを更新するためのイベントを発火
      window.dispatchEvent(new Event("trainingRecordUpdated"));

      // 成功メッセージ
      alert("記録を保存しました！");

      // フォームをリセット
      setMenuPhoto(null);
      setBodyPhoto(null);
      setMenuPreview(null);
      setBodyPreview(null);
      setMemo("");
      setWeight("");
      // 日付は今日の日付にリセット
      const today = new Date();
      setDate(today.toISOString().split("T")[0]);
      
      // ファイル入力もリセット
      const menuInput = document.getElementById("menuPhoto") as HTMLInputElement;
      const bodyInput = document.getElementById("bodyPhoto") as HTMLInputElement;
      if (menuInput) menuInput.value = "";
      if (bodyInput) bodyInput.value = "";
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          トレーニング記録を追加
        </h2>
        <p className="text-gray-600">今日のトレーニングを記録しましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-orange-200/50 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
        {/* 日付入力 */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            日付
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            required
          />
        </div>

        {/* メニュー写真 */}
        <div>
          <label
            htmlFor="menuPhoto"
            className="block text-sm font-medium text-gray-700"
          >
            トレーニングメニューの写真（任意）
          </label>
          <input
            type="file"
            id="menuPhoto"
            accept="image/*"
            onChange={handleMenuPhotoChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">任意：写真がない場合は空欄のままでも保存できます</p>
          {menuPreview && (
            <div className="mt-4">
              <img
                src={menuPreview}
                alt="メニュー写真のプレビュー"
                className="max-h-64 rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* 体の写真 */}
        <div>
          <label
            htmlFor="bodyPhoto"
            className="block text-sm font-medium text-gray-700"
          >
            体の写真
          </label>
          <input
            type="file"
            id="bodyPhoto"
            accept="image/*"
            onChange={handleBodyPhotoChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">任意：写真がない場合は空欄のままでも保存できます</p>
          {bodyPreview && (
            <div className="mt-4">
              <img
                src={bodyPreview}
                alt="体の写真のプレビュー"
                className="max-h-64 rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* 体重 */}
        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700"
          >
            体重（kg）
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="例: 70.5"
          />
        </div>

        {/* メモ */}
        <div>
          <label
            htmlFor="memo"
            className="block text-sm font-medium text-gray-700"
          >
            メモ
          </label>
          <textarea
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="今日のトレーニングについてメモを残しましょう"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              アップロード中...
            </span>
          ) : (
            "記録を保存"
          )}
        </button>
      </form>

      {/* 認証モーダル */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={() => {
          setAuthenticated(true);
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}

