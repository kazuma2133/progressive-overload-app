"use client";

import { useState, useEffect } from "react";
import { getTrainingRecords, TrainingRecord, deleteTrainingRecord } from "@/lib/mockStorage";
import { isAuthenticated } from "@/lib/auth";
import EditRecordModal from "./EditRecordModal";
import PhotoModal from "./PhotoModal";
import CommentSection from "./CommentSection";
import WeightChart from "./WeightChart";
import MotivationBanner from "./MotivationBanner";
import MonthlyGoalCard from "./MonthlyGoalCard";
import LikeButton from "./LikeButton";
import AuthModal from "./AuthModal";

export default function TrainingRecordList() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null);
  const [photoModal, setPhotoModal] = useState<{
    imageUrl: string;
    alt: string;
  } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // 記録を読み込む
  const loadRecords = () => {
    const data = getTrainingRecords();
    setRecords(data);
  };

  // コンポーネントのマウント時と、ストレージが変更された時に読み込む
  useEffect(() => {
    loadRecords();
    // 認証状態を確認
    setAuthenticated(isAuthenticated());
    
    // ストレージの変更を監視（他のタブで変更があった場合など）
    const handleStorageChange = () => {
      loadRecords();
      setAuthenticated(isAuthenticated());
    };
    window.addEventListener("storage", handleStorageChange);
    // カスタムイベントで同じタブ内の変更も検知
    window.addEventListener("trainingRecordUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("trainingRecordUpdated", handleStorageChange);
    };
  }, []);

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 編集ボタンのクリック
  const handleEdit = (record: TrainingRecord) => {
    if (!authenticated) {
      setAuthModalOpen(true);
      return;
    }
    setEditingRecord(record);
  };

  // 削除ボタンのクリック
  const handleDelete = (id: string) => {
    if (!authenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (confirm("この記録を削除してもよろしいですか？")) {
      deleteTrainingRecord(id);
      window.dispatchEvent(new Event("trainingRecordUpdated"));
      loadRecords();
      alert("記録を削除しました");
    }
  };

  // 写真をクリックして拡大表示
  const handlePhotoClick = (imageUrl: string, alt: string) => {
    setPhotoModal({ imageUrl, alt });
  };

  if (records.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            トレーニング記録
          </h2>
          <p className="text-gray-600">これまでの成長を振り返りましょう</p>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-pink-50/50 p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-600">
            まだ記録がありません
          </p>
          <p className="mt-2 text-sm text-gray-500">
            上記のフォームから記録を追加してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* モチベーションバナー */}
      <MotivationBanner records={records} />

      {/* 月間目標 */}
      <MonthlyGoalCard records={records} onGoalUpdated={loadRecords} />

      <div className="mb-10 text-center">
        <h2 className="mb-2 text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          トレーニング記録
        </h2>
        <p className="text-gray-600">これまでの成長を振り返りましょう</p>
      </div>

      {/* 体重グラフ */}
      <WeightChart records={records} />

      <div className="space-y-8">
        {records.map((record) => (
          <div
            key={record.id}
            className="group rounded-2xl border border-orange-200/50 bg-white/90 backdrop-blur-sm p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-[1.01]"
          >
            {/* 日付 */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {formatDate(record.date)}
              </h3>
            </div>

            {/* 写真を横並びで表示 */}
            {(record.menuPhotoUrl || record.bodyPhotoUrl) && (
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* メニュー写真 */}
                {record.menuPhotoUrl ? (
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      トレーニングメニュー
                    </p>
                    <div className="relative overflow-hidden rounded-xl border-2 border-orange-200/50 shadow-md transition-all hover:border-orange-400 hover:shadow-xl">
                      <img
                        src={record.menuPhotoUrl}
                        alt="トレーニングメニュー"
                        onClick={() => handlePhotoClick(record.menuPhotoUrl!, "トレーニングメニュー")}
                        className="w-full cursor-pointer object-cover transition-transform hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity hover:opacity-100"></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      トレーニングメニュー
                    </p>
                    <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                      <p className="text-sm text-gray-400">写真なし</p>
                    </div>
                  </div>
                )}

                {/* 体の写真 */}
                {record.bodyPhotoUrl ? (
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      体の写真
                    </p>
                    <div className="relative overflow-hidden rounded-xl border-2 border-orange-200/50 shadow-md transition-all hover:border-orange-400 hover:shadow-xl">
                      <img
                        src={record.bodyPhotoUrl}
                        alt="体の写真"
                        onClick={() => handlePhotoClick(record.bodyPhotoUrl!, "体の写真")}
                        className="w-full cursor-pointer object-cover transition-transform hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity hover:opacity-100"></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      体の写真
                    </p>
                    <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                      <p className="text-sm text-gray-400">写真なし</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 体重 */}
            {record.weight !== undefined && (
              <div className="mt-6 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-4 border border-orange-200/50">
                <p className="text-sm font-medium text-orange-700">体重</p>
                <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {record.weight} kg
                </p>
              </div>
            )}

            {/* メモ */}
            {record.memo && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">メモ</p>
                <p className="mt-1 whitespace-pre-wrap text-gray-600">
                  {record.memo}
                </p>
              </div>
            )}

            {/* いいねボタンと編集・削除ボタン */}
            <div className="mt-6 flex items-center justify-between">
              <LikeButton
                recordId={record.id}
                initialLikes={record.likes || 0}
                onLikeUpdated={loadRecords}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(record)}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  削除
                </button>
              </div>
            </div>

            {/* コメントセクション */}
            <CommentSection
              recordId={record.id}
              comments={record.comments || []}
              onCommentAdded={loadRecords}
            />
          </div>
        ))}
      </div>

      {/* 編集モーダル */}
      {editingRecord && (
        <EditRecordModal
          record={editingRecord}
          isOpen={true}
          onClose={() => setEditingRecord(null)}
          onUpdate={loadRecords}
        />
      )}

      {/* 写真拡大表示モーダル */}
      {photoModal && (
        <PhotoModal
          imageUrl={photoModal.imageUrl}
          alt={photoModal.alt}
          isOpen={true}
          onClose={() => setPhotoModal(null)}
        />
      )}

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

