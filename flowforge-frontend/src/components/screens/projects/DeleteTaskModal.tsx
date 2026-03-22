"use client";

import { deleteTask } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";
import { useState } from "react";

type Props = {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onDeleted: () => Promise<void>;
};

export default function DeleteTaskModal({
  open,
  task,
  onClose,
  onDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open || !task) return null;

  async function handleDelete() {
    const currentTask = task;
    if (!currentTask) return;

    try {
      setLoading(true);
      await deleteTask(currentTask.id);
      await onDeleted();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black/30 p-4">
      <div className="mx-auto mt-24 max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-extrabold text-slate-900">Delete Task</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Are you sure you want to delete <span className="font-bold">{task.title}</span>?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-bold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}