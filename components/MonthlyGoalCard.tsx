"use client";

import { useState, useEffect } from "react";
import {
  getMonthlyGoalForCurrentMonth,
  saveMonthlyGoal,
  updateMonthlyGoal,
  deleteMonthlyGoal,
} from "@/lib/firestore";
import { MonthlyGoal, TrainingRecord } from "@/lib/mockStorage";

interface MonthlyGoalCardProps {
  records: TrainingRecord[];
  onGoalUpdated: () => void;
}

export default function MonthlyGoalCard({
  records,
  onGoalUpdated,
}: MonthlyGoalCardProps) {
  const [goal, setGoal] = useState<MonthlyGoal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [description, setDescription] = useState("");

  // 今月の目標を読み込む
  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    try {
      const currentGoal = await getMonthlyGoalForCurrentMonth();
      setGoal(currentGoal);
      if (currentGoal) {
        setTitle(currentGoal.title);
        setTargetValue(currentGoal.targetValue?.toString() || "");
        setDescription(currentGoal.description || "");
      } else {
        setTitle("");
        setTargetValue("");
        setDescription("");
      }
    } catch (error) {
      console.error("目標の読み込みに失敗しました:", error);
    }
  };

  // 目標の進捗を計算
  const calculateProgress = () => {
    if (!goal || goal.targetValue === undefined) return null;

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    
    // 今月の記録を取得
    const thisMonthRecords = records.filter((r) => {
      const recordDate = new Date(r.date);
      const recordYearMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, "0")}`;
      return recordYearMonth === yearMonth;
    });

    // 目標タイプに応じて進捗を計算
    if (goal.title.includes("体重") || goal.title.includes("kg")) {
      // 体重目標の場合、最新の体重を取得
      const weightRecords = thisMonthRecords
        .filter((r) => r.weight !== undefined)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (weightRecords.length > 0) {
        const currentWeight = weightRecords[0].weight!;
        return {
          current: currentWeight,
          target: goal.targetValue,
          progress: Math.min((currentWeight / goal.targetValue) * 100, 100),
        };
      }
    } else if (goal.title.includes("回") || goal.title.includes("記録")) {
      // 記録回数の場合
      return {
        current: thisMonthRecords.length,
        target: goal.targetValue,
        progress: Math.min((thisMonthRecords.length / goal.targetValue) * 100, 100),
      };
    }

    return null;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("目標のタイトルを入力してください");
      return;
    }

    // 入力値の検証（長さ制限）
    if (title.length > 100) {
      alert("目標のタイトルは100文字以内で入力してください");
      return;
    }

    if (description.length > 500) {
      alert("説明は500文字以内で入力してください");
      return;
    }

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    try {
      if (goal) {
        // 更新
        await updateMonthlyGoal(goal.id, {
          title: title.trim(),
          targetValue: targetValue ? parseFloat(targetValue) : undefined,
          description: description.trim() || undefined,
        });
      } else {
        // 新規作成
        await saveMonthlyGoal({
          yearMonth,
          title: title.trim(),
          targetValue: targetValue ? parseFloat(targetValue) : undefined,
          description: description.trim() || undefined,
        });
      }

      await loadGoal();
      setIsEditing(false);
      onGoalUpdated();
      alert("目標を保存しました！");
    } catch (error) {
      console.error("目標の保存に失敗しました:", error);
      alert("目標の保存に失敗しました。もう一度お試しください。");
    }
  };

  const handleDelete = async () => {
    if (goal && confirm("この目標を削除してもよろしいですか？")) {
      try {
        await deleteMonthlyGoal(goal.id);
        await loadGoal();
        onGoalUpdated();
        alert("目標を削除しました");
      } catch (error) {
        console.error("目標の削除に失敗しました:", error);
        alert("目標の削除に失敗しました。もう一度お試しください。");
      }
    }
  };

  const progress = calculateProgress();
  const now = new Date();
  const monthName = now.toLocaleDateString("ja-JP", { month: "long" });

  return (
    <div className="mb-8 rounded-2xl border border-orange-200/50 bg-gradient-to-br from-white to-orange-50/30 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{monthName}の目標</h3>
            <p className="text-sm text-gray-600">今月の目標を設定して達成を目指しましょう</p>
          </div>
        </div>
        {goal && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            編集
          </button>
        )}
      </div>

      {isEditing || !goal ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              目標のタイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 体重を70kgまで減らす、月に20回トレーニングする"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              目標値（任意）
            </label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="例: 70（体重の場合）、20（回数の場合）"
              step="0.1"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              説明（任意）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="目標についての詳細やメモ"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              保存
            </button>
            {goal && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    loadGoal();
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
                >
                  削除
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <h4 className="mb-2 text-lg font-bold text-gray-900">{goal.title}</h4>
            {goal.description && (
              <p className="text-sm text-gray-600">{goal.description}</p>
            )}
          </div>

          {progress && goal.targetValue !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">進捗</span>
                <span className="font-bold text-orange-600">
                  {progress.current.toFixed(1)} / {progress.target} ({Math.round(progress.progress)}%)
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {!progress && goal.targetValue === undefined && (
            <p className="text-sm text-gray-500">目標値を設定すると進捗が表示されます</p>
          )}
        </div>
      )}
    </div>
  );
}

