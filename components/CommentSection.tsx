"use client";

import { useState } from "react";
import { Comment } from "@/lib/mockStorage";
import { addComment, deleteComment } from "@/lib/firestore";

interface CommentSectionProps {
  recordId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export default function CommentSection({
  recordId,
  comments,
  onCommentAdded,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // コメントを送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("コメントを入力してください");
      return;
    }

    // 入力値の検証（長さ制限）
    if (newComment.length > 1000) {
      alert("コメントは1000文字以内で入力してください");
      return;
    }

    if (authorName.length > 50) {
      alert("お名前は50文字以内で入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      addComment(recordId, newComment.trim(), authorName.trim() || "匿名");
      setNewComment("");
      setAuthorName("");
      window.dispatchEvent(new Event("trainingRecordUpdated"));
      onCommentAdded();
    } catch (error) {
      console.error("コメントの追加に失敗しました:", error);
      alert("コメントの追加に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // コメントを削除
  const handleDelete = (commentId: string) => {
    if (confirm("このコメントを削除してもよろしいですか？")) {
      deleteComment(recordId, commentId);
      window.dispatchEvent(new Event("trainingRecordUpdated"));
      onCommentAdded();
    }
  };

  // 日時をフォーマット
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8 border-t border-orange-200/50 pt-6">
      <h4 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        コメント
      </h4>

      {/* コメント一覧 */}
      {comments.length > 0 ? (
        <div className="mb-6 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-orange-200/50 bg-gradient-to-r from-orange-50/50 to-pink-50/50 p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{comment.author}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(comment.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="rounded-md px-2 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  削除
                </button>
              </div>
              <p className="whitespace-pre-wrap text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 text-sm text-gray-500">まだコメントがありません</p>
      )}

      {/* コメント入力フォーム */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-medium text-gray-700"
          >
            お名前（任意）
          </label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="匿名で投稿する場合は空欄のまま"
          />
        </div>
        <div>
          <label
            htmlFor="commentText"
            className="block text-sm font-medium text-gray-700"
          >
            コメント
          </label>
          <textarea
            id="commentText"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="コメントを入力してください"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? "送信中..." : "コメントを投稿"}
        </button>
      </form>
    </div>
  );
}

