"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { updateTask } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";
import type { ProjectMember } from "@/features/project-members/types";

type Props = {
  open: boolean;
  task: Task | null;
  members: ProjectMember[];
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
};

export default function EditTaskModal({
  open,
  task,
  members,
  onClose,
  onUpdated,
}: Props) {
  const activeMembers = useMemo(
    () => members.filter((member) => member.active),
    [members]
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!task) return;
    setTitle(task.title || "");
    setDescription(task.description || "");
    setPriority(task.priority || "MEDIUM");
    setDueDate(task.dueDate || "");
    setAssigneeId(task.assigneeId || "");
    setError("");
  }, [task]);

  useEffect(() => {
    if (!open) return;

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  async function handleSubmit() {
    if (!task) return;

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (
      assigneeId &&
      !activeMembers.some((member) => member.userId === assigneeId)
    ) {
      setError("Please choose a valid active project member as assignee");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        assigneeId: assigneeId || null,
      });

      await onUpdated();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update task";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-[640px] rounded-[28px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-[#e8edf5] px-6 py-5">
            <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
              Edit Task
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f8fafc]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-[16px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-[16px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#334155]">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-[16px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#334155]">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-[16px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#334155]">
                  Assignee
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full rounded-[16px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
                >
                  <option value="">Unassigned</option>
                  {activeMembers.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
              <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#e8edf5] px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full border border-[#dbe4f0] px-5 py-2.5 text-sm font-extrabold text-[#334155]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}