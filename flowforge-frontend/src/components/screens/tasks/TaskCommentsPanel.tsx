"use client";

import { useEffect, useState } from "react";
import { createComment, getCommentsByTask } from "@/features/comments/api";
import type { Comment } from "@/features/comments/types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

export default function TaskCommentsPanel({
  taskId,
}: {
  taskId: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadComments() {
    try {
      setLoading(true);
      setError("");
      const data = await getCommentsByTask(taskId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [taskId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    try {
      setSubmitting(true);
      setError("");
      const created = await createComment(taskId, body.trim());
      setComments((prev) => [...prev, created]);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
      <h3 className="text-[18px] font-extrabold tracking-tight text-[#0f172a]">
        Comments
      </h3>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[96px] w-full rounded-[18px] border border-[#dbe4f0] px-4 py-3 text-[14px] text-[#0f172a] outline-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="rounded-full bg-[#2563eb] px-4 py-2 text-[13px] font-extrabold text-white disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Add Comment"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-4 rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="text-[13px] font-medium text-[#94a3b8]">Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] p-4"
            >
              <p className="text-[14px] leading-6 text-[#334155]">{comment.body}</p>
              <p className="mt-2 text-[11px] font-bold text-[#94a3b8]">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-[18px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-4 py-6 text-center text-[13px] font-medium text-[#94a3b8]">
            No comments yet.
          </div>
        )}
      </div>
    </div>
  );
}