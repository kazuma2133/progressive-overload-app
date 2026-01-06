"use client";

import { useState, useEffect } from "react";
import { TrainingRecord } from "@/lib/mockStorage";
import { updateTrainingRecord } from "@/lib/firestore";
import { uploadPhoto } from "@/lib/firebaseStorage";
import PhotoModal from "./PhotoModal";

interface EditRecordModalProps {
  record: TrainingRecord;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditRecordModal({
  record,
  isOpen,
  onClose,
  onUpdate,
}: EditRecordModalProps) {
  const [date, setDate] = useState(record.date);
  const [memo, setMemo] = useState(record.memo);
  const [weight, setWeight] = useState<string>(record.weight?.toString() || "");
  const [menuPhoto, setMenuPhoto] = useState<File | null>(null);
  const [bodyPhoto, setBodyPhoto] = useState<File | null>(null);
  const [menuPreview, setMenuPreview] = useState<string | null>(record.menuPhotoUrl || null);
  const [bodyPreview, setBodyPreview] = useState<string | null>(record.bodyPhotoUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [photoModal, setPhotoModal] = useState<{
    imageUrl: string;
    alt: string;
  } | null>(null);

  // モーダルが開かれた時に初期値を設定
  useEffect(() => {
    if (isOpen) {
      setDate(record.date);
      setMemo(record.memo);
      setWeight(record.weight?.toString() || "");
      setMenuPreview(record.menuPhotoUrl || null);
      setBodyPreview(record.bodyPhotoUrl || null);
      setMenuPhoto(null);
      setBodyPhoto(null);
    }
  }, [isOpen, record]);

  // メニュー写真の選択
  const handleMenuPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMenuPhoto(file);
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
    setIsSaving(true);

    try {
      let menuPhotoUrl: string | undefined = record.menuPhotoUrl;
      let bodyPhotoUrl: string | undefined = record.bodyPhotoUrl;

      // 新しい写真が選択されていたらFirebase Storageにアップロード
      if (menuPhoto) {
        const timestamp = Date.now();
        menuPhotoUrl = await uploadPhoto(menuPhoto, `menu/${timestamp}_${menuPhoto.name}`);
      } else if (!record.menuPhotoUrl) {
        // 写真がなく、既存の写真もない場合はundefined
        menuPhotoUrl = undefined;
      }
      if (bodyPhoto) {
        const timestamp = Date.now();
        bodyPhotoUrl = await uploadPhoto(bodyPhoto, `body/${timestamp}_${bodyPhoto.name}`);
      } else if (!record.bodyPhotoUrl) {
        // 写真がなく、既存の写真もない場合はundefined
        bodyPhotoUrl = undefined;
      }

      // データを更新
      await updateTrainingRecord(record.id, {
        date,
        menuPhotoUrl,
        bodyPhotoUrl,
        memo,
        weight: weight ? parseFloat(weight) : undefined,
      });

      // リストを更新
      window.dispatchEvent(new Event("trainingRecordUpdated"));
      onUpdate();
      onClose();
      alert("記録を更新しました！");
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">記録を編集</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 日付入力 */}
          <div>
            <label
              htmlFor="edit-date"
              className="block text-sm font-medium text-gray-700"
            >
              日付
            </label>
            <input
              type="date"
              id="edit-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>

          {/* メニュー写真 */}
          <div>
            <label
              htmlFor="edit-menuPhoto"
              className="block text-sm font-medium text-gray-700"
            >
              トレーニングメニューの写真
            </label>
            <input
              type="file"
              id="edit-menuPhoto"
              accept="image/*"
              onChange={handleMenuPhotoChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {menuPreview && (
              <div className="mt-4">
                <img
                  src={menuPreview}
                  alt="メニュー写真のプレビュー"
                  onClick={() => setPhotoModal({ imageUrl: menuPreview, alt: "メニュー写真" })}
                  className="max-h-64 cursor-pointer rounded-lg border border-gray-300 transition-transform hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* 体の写真 */}
          <div>
            <label
              htmlFor="edit-bodyPhoto"
              className="block text-sm font-medium text-gray-700"
            >
              体の写真
            </label>
            <input
              type="file"
              id="edit-bodyPhoto"
              accept="image/*"
              onChange={handleBodyPhotoChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {bodyPreview && (
              <div className="mt-4">
                <img
                  src={bodyPreview}
                  alt="体の写真のプレビュー"
                  onClick={() => setPhotoModal({ imageUrl: bodyPreview, alt: "体の写真" })}
                  className="max-h-64 cursor-pointer rounded-lg border border-gray-300 transition-transform hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* 体重 */}
          <div>
            <label
              htmlFor="edit-weight"
              className="block text-sm font-medium text-gray-700"
            >
              体重（kg）
            </label>
            <input
              type="number"
              id="edit-weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="例: 70.5"
            />
          </div>

          {/* メモ */}
          <div>
            <label
              htmlFor="edit-memo"
              className="block text-sm font-medium text-gray-700"
            >
              メモ
            </label>
            <textarea
              id="edit-memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="今日のトレーニングについてメモを残しましょう"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>

      {/* 写真拡大表示モーダル */}
      {photoModal && (
        <PhotoModal
          imageUrl={photoModal.imageUrl}
          alt={photoModal.alt}
          isOpen={true}
          onClose={() => setPhotoModal(null)}
        />
      )}
    </div>
  );
}

