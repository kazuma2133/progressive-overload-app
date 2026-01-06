"use client";

import { useMemo } from "react";
import { TrainingRecord } from "@/lib/mockStorage";

interface MotivationBannerProps {
  records: TrainingRecord[];
}

const motivationalMessages = [
  "今日も一歩前進！継続は力なり 💪",
  "昨日の自分を超えよう！ 🔥",
  "小さな積み重ねが大きな変化を生む ✨",
  "諦めない心が成功への鍵 🎯",
  "今日の努力が明日の自分を作る 🌟",
  "プログレスは止まらない！ 🚀",
  "あなたの成長は止まらない 📈",
  "一歩ずつ、着実に前進しよう 💯",
  "今日も最高のトレーニングを！ ⚡",
  "努力は必ず報われる 🌈",
];

const achievementMessages = [
  { days: 7, message: "🎉 1週間継続中！素晴らしいスタート！", color: "from-blue-500 to-blue-600" },
  { days: 14, message: "🔥 2週間達成！習慣化が進んでいます！", color: "from-purple-500 to-purple-600" },
  { days: 30, message: "🌟 1ヶ月達成！本格的な変化が始まります！", color: "from-orange-500 to-red-500" },
  { days: 60, message: "💪 2ヶ月達成！素晴らしい継続力！", color: "from-red-500 to-pink-500" },
  { days: 90, message: "🏆 3ヶ月達成！真の習慣化を達成！", color: "from-yellow-500 to-orange-500" },
  { days: 180, message: "👑 半年達成！あなたは本物の戦士です！", color: "from-indigo-500 to-purple-500" },
  { days: 365, message: "🌟 1年達成！伝説の継続者！", color: "from-cyan-500 to-blue-500" },
];

export default function MotivationBanner({ records }: MotivationBannerProps) {
  // 統計情報を計算
  const stats = useMemo(() => {
    if (records.length === 0) {
      return {
        totalRecords: 0,
        consecutiveDays: 0,
        totalDays: 0,
        weightChange: null,
        randomMessage: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
      };
    }

    // 記録日をソート
    const sortedDates = records
      .map((r) => new Date(r.date).toDateString())
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // 連続記録日数を計算
    let consecutiveDays = 1;
    const today = new Date().toDateString();
    const uniqueDates = [...new Set(sortedDates)];
    
    // 今日または昨日から逆算して連続日数を計算
    let checkDate = new Date();
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toDateString();
      if (uniqueDates.includes(dateStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    consecutiveDays = count;

    // 体重の変化を計算
    const weightRecords = records
      .filter((r) => r.weight !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let weightChange = null;
    if (weightRecords.length >= 2) {
      const firstWeight = weightRecords[0].weight!;
      const lastWeight = weightRecords[weightRecords.length - 1].weight!;
      const change = lastWeight - firstWeight;
      weightChange = {
        value: change,
        isPositive: change > 0,
      };
    }

    // 達成メッセージをチェック
    let achievementMessage = null;
    for (const achievement of achievementMessages) {
      if (consecutiveDays >= achievement.days) {
        achievementMessage = achievement;
      }
    }

    // ランダムメッセージまたは達成メッセージ
    const message = achievementMessage
      ? achievementMessage.message
      : motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    return {
      totalRecords: records.length,
      consecutiveDays,
      totalDays: uniqueDates.length,
      weightChange,
      message,
      achievementColor: achievementMessage?.color,
    };
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="mx-auto mb-8 max-w-4xl px-4">
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-center shadow-xl">
          <p className="text-xl font-bold text-white">
            {stats.randomMessage}
          </p>
          <p className="mt-2 text-sm text-white/90">
            最初の記録を追加して、成長の旅を始めましょう！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-8 max-w-4xl px-4">
      {/* メインメッセージ */}
      <div
        className={`rounded-2xl bg-gradient-to-r ${
          stats.achievementColor || "from-orange-500 via-red-500 to-pink-500"
        } p-6 text-center shadow-xl transition-all hover:scale-[1.02]`}
      >
        <p className="text-xl font-bold text-white drop-shadow-lg">
          {stats.message}
        </p>
      </div>

      {/* 統計情報カード */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* 連続記録日数 */}
        <div className="rounded-xl border border-orange-200/50 bg-white/90 backdrop-blur-sm p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">連続記録</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.consecutiveDays}日
              </p>
            </div>
          </div>
        </div>

        {/* 総記録数 */}
        <div className="rounded-xl border border-orange-200/50 bg-white/90 backdrop-blur-sm p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">総記録数</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.totalRecords}回
              </p>
            </div>
          </div>
        </div>

        {/* 記録日数 */}
        <div className="rounded-xl border border-orange-200/50 bg-white/90 backdrop-blur-sm p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">記録日数</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.totalDays}日
              </p>
            </div>
          </div>
        </div>

        {/* 体重の変化 */}
        {stats.weightChange && (
          <div className="rounded-xl border border-orange-200/50 bg-white/90 backdrop-blur-sm p-4 shadow-md">
            <div className="flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${
                stats.weightChange.isPositive ? "from-green-500 to-green-600" : "from-blue-500 to-blue-600"
              }`}>
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {stats.weightChange.isPositive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  )}
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">体重変化</p>
                <p className={`text-lg font-bold ${
                  stats.weightChange.isPositive ? "text-green-600" : "text-blue-600"
                }`}>
                  {stats.weightChange.isPositive ? "+" : ""}
                  {stats.weightChange.value.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

