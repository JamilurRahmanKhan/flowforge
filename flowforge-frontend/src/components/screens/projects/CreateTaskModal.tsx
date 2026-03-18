"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { createTask } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";
import type { ProjectMember } from "@/features/project-members/types";

type Props = {
  open: boolean;
  projectId: string;
  members: ProjectMember[];
  onClose: () => void;
  onCreated: (task: Task) => void | Promise<void>;
  onError?: (message: string) => void;
};

export default function CreateTaskModal({
  open,
  projectId,
  members,
  onClose,
  onCreated,
  onError,
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
    if (!open) return;

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    setAssigneeId("");
    setError("");
  }

  async function handleSubmit() {
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

      const task = await createTask({
        projectId,
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        assigneeId: assigneeId || null,
      });

      await onCreated(task);
      resetForm();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create task";
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-[640px] rounded-[28px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-[#e8edf5] px-6 py-5">
            <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
              Create Task
            </h2>

            <button
              type="button"
              onClick={handleClose}
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
                placeholder="Task title"
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
                placeholder="Task description"
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

            {activeMembers.length === 0 ? (
              <div className="rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                No active members are assigned to this project yet. This task will be created as unassigned.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#e8edf5] px-6 py-5">
            <button
              type="button"
              onClick={handleClose}
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
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}