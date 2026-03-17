"use client";

import { useEffect, useState } from "react";
import { updateTask } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";

type Props = {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdated: () => Promise<void>;
};

export default function EditTaskModal({
  open,
  task,
  onClose,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && open) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "MEDIUM");
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    }
  }, [task, open]);

  if (!open || !task) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await updateTask(task.id, {
        title,
        description,
        priority,
        dueDate,
      });
      await onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black/30 p-4">
      <div className="mx-auto mt-20 max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-extrabold text-slate-900">Edit Task</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-[#2563eb] px-4 py-3 font-bold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}