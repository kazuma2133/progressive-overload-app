"use client";

import { useState, useEffect } from "react";
import { toggleLike, isRecordLiked } from "@/lib/firestore";

interface LikeButtonProps {
  recordId: string;
  initialLikes: number;
  onLikeUpdated: () => void;
}

export default function LikeButton({
  recordId,
  initialLikes,
  onLikeUpdated,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLoading, setIsLoading] = useState(false);

  // 初期状態を読み込む
  useEffect(() => {
    const checkLiked = async () => {
      const isLiked = await isRecordLiked(recordId);
      setLiked(isLiked);
      setLikes(initialLikes || 0);
    };
    checkLiked();
  }, [recordId, initialLikes]);

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const newLikes = await toggleLike(recordId);
      setLiked(!liked);
      setLikes(newLikes);
      onLikeUpdated();
    } catch (error) {
      console.error("いいねの更新に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
        liked
          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
          : "bg-white border-2 border-gray-300 text-gray-700 hover:border-pink-400 hover:bg-pink-50"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <svg
        className={`h-5 w-5 transition-transform ${liked ? "scale-110" : ""}`}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-semibold">{likes}</span>
    </button>
  );
}

