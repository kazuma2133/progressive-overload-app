"use client";

import { useState, useEffect } from "react";
import { likeRecord, isRecordLiked } from "@/lib/mockStorage";

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

  // 初期状態を読み込む
  useEffect(() => {
    setLiked(isRecordLiked(recordId));
    setLikes(initialLikes || 0);
  }, [recordId, initialLikes]);

  const handleLike = () => {
    likeRecord(recordId);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(newLiked ? likes + 1 : Math.max(likes - 1, 0));
    onLikeUpdated();
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
        liked
          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
          : "bg-white border-2 border-gray-300 text-gray-700 hover:border-pink-400 hover:bg-pink-50"
      }`}
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

