"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { TrainingRecord } from "@/lib/mockStorage";

interface WeightChartProps {
  records: TrainingRecord[];
}

export default function WeightChart({ records }: WeightChartProps) {
  // 体重データを抽出して時系列でソート
  const chartData = useMemo(() => {
    const weightData = records
      .filter((record) => record.weight !== undefined)
      .map((record) => ({
        date: new Date(record.date).toLocaleDateString("ja-JP", {
          month: "short",
          day: "numeric",
        }),
        weight: record.weight!,
        fullDate: record.date,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

    return weightData;
  }, [records]);

  // 体重データがない場合は何も表示しない
  if (chartData.length === 0) {
    return null;
  }

  // 体重の最小値と最大値を計算（グラフの範囲を調整）
  const weights = chartData.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight;
  const padding = weightRange * 0.1; // 10%の余白

  return (
    <div className="mb-12 rounded-2xl border border-orange-200/50 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          体重の推移
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          記録された体重の変化をグラフで確認できます
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            domain={[minWeight - padding, maxWeight + padding]}
            stroke="#666"
            style={{ fontSize: "12px" }}
            label={{
              value: "体重 (kg)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#666" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number | undefined) => {
              if (value === undefined) return ["", "体重"];
              return [`${value} kg`, "体重"];
            }}
            labelStyle={{ fontWeight: "bold", color: "#333" }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="url(#colorWeight)"
            strokeWidth={3}
            dot={{ fill: "#f97316", r: 5 }}
            activeDot={{ r: 7, fill: "#ef4444" }}
          />
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>

      {/* 統計情報 */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center">
          <p className="text-xs font-medium text-orange-700">最小体重</p>
          <p className="mt-1 text-xl font-bold text-orange-900">
            {minWeight.toFixed(1)} kg
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-4 text-center">
          <p className="text-xs font-medium text-red-700">最大体重</p>
          <p className="mt-1 text-xl font-bold text-red-900">
            {maxWeight.toFixed(1)} kg
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-4 text-center">
          <p className="text-xs font-medium text-pink-700">最新体重</p>
          <p className="mt-1 text-xl font-bold text-pink-900">
            {chartData[chartData.length - 1].weight.toFixed(1)} kg
          </p>
        </div>
      </div>
    </div>
  );
}

