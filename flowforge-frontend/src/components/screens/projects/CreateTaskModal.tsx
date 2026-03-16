"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Flag, FileText, Plus, X } from "lucide-react";
import { createTask } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";

type Props = {
  open: boolean;
  projectId: string;
  onClose: () => void;
  onCreated: (task: Task) => void;
  onError: (message: string) => void;
};

export default function CreateTaskModal({
  open,
  projectId,
  onClose,
  onCreated,
  onError,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      onError("Task title is required");
      return;
    }

    try {
      setLoading(true);

      const created = await createTask({
        projectId,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      });

      onCreated(created);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create task";
      onError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[140]">
      <div
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
        onClick={() => !loading && onClose()}
      />

      <div className="absolute inset-x-0 bottom-0 top-auto lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-8">
        <div
          className="relative ml-auto mr-auto w-full max-w-[720px] overflow-hidden rounded-t-[32px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] lg:rounded-[30px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[#e8edf5] px-7 pb-4 pt-7 lg:px-8 lg:pt-8">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => !loading && onClose()}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#0f172a] transition hover:bg-[#f8fafc]"
              >
                <X className="h-7 w-7" />
              </button>

              <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a] lg:text-[26px]">
                Create Task
              </h2>

              <div className="w-11" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-7 py-7 lg:px-8">
            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Task Title
                </label>
                <div className="flex items-center gap-3 rounded-[18px] border border-[#dbe3ef] bg-white px-4 py-4">
                  <Plus className="h-5 w-5 text-[#2563eb]" />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full bg-transparent text-[15px] font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Description
                </label>
                <div className="flex items-start gap-3 rounded-[18px] border border-[#dbe3ef] bg-white px-4 py-4">
                  <FileText className="mt-0.5 h-5 w-5 text-slate-400" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add task description"
                    rows={4}
                    className="w-full resize-none bg-transparent text-[15px] font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Priority
                  </label>
                  <div className="flex items-center gap-3 rounded-[18px] border border-[#dbe3ef] bg-white px-4 py-4">
                    <Flag className="h-5 w-5 text-amber-500" />
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-transparent text-[15px] font-semibold text-slate-900 outline-none"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="URGENT">URGENT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Due Date
                  </label>
                  <div className="flex items-center gap-3 rounded-[18px] border border-[#dbe3ef] bg-white px-4 py-4">
                    <CalendarDays className="h-5 w-5 text-slate-400" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-transparent text-[15px] font-semibold text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => !loading && onClose()}
                className="h-[56px] flex-1 rounded-[18px] border border-[#e2e8f0] bg-white text-[15px] font-extrabold text-[#475569] transition hover:bg-[#f8fafc]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex h-[56px] flex-[1.2] items-center justify-center gap-2 rounded-[18px] bg-[#2563eb] text-[15px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Task"}
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}