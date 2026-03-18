"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { updateProject } from "@/features/projects/api";
import type { Project } from "@/features/projects/types";

type Props = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onUpdated: (project: Project) => void;
  onError?: (message: string) => void;
};

export default function EditProjectModal({
  open,
  project,
  onClose,
  onUpdated,
  onError,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [defaultWorkflow, setDefaultWorkflow] = useState(
    "Standard Agile (Kanban)"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !project) return;

    setName(project.name);
    setDescription(project.description || "");
    setVisibility(project.visibility || "PUBLIC");
    setDefaultWorkflow(project.defaultWorkflow || "Standard Agile (Kanban)");
    setError("");
  }, [open, project]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !project) return null;

  async function handleSubmit() {
    setError("");

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const updated = await updateProject(project.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        status: project.status,
        visibility,
        defaultWorkflow,
      });

      onUpdated(updated);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update project";
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

  return (
    <div className="fixed inset-0 z-[110]">
      <div
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      <div className="absolute inset-x-0 bottom-0 top-auto lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-8">
        <div
          className="relative ml-auto mr-auto flex h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] lg:h-auto lg:max-h-[92vh] lg:rounded-[30px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[#e8edf5] bg-white">
            <div className="flex items-center justify-between px-7 pb-4 pt-7 lg:px-8 lg:pt-8">
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#0f172a] transition hover:bg-[#f8fafc]"
              >
                <X className="h-7 w-7" />
              </button>

              <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a] lg:text-[26px]">
                Edit Project
              </h2>

              <div className="w-11" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-7 lg:px-8">
            <div className="space-y-8">
              <div>
                <label className="mb-3 block text-[17px] font-extrabold text-[#0f172a]">
                  Project Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="FlowForge Dashboard"
                  className="h-[86px] w-full rounded-[18px] border border-[#dbe4ef] bg-[#f9fbfe] px-6 text-[22px] text-[#0f172a] outline-none placeholder:text-[#9aa9c2] focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="mb-3 block text-[17px] font-extrabold text-[#0f172a]">
                  Project Key
                </label>
                <input
                  value={project.key}
                  disabled
                  className="h-[86px] w-full rounded-[18px] border border-[#e2e8f0] bg-slate-100 px-6 text-[22px] uppercase tracking-[0.08em] text-[#64748b] outline-none"
                />
                <p className="mt-3 text-[14px] font-medium text-[#64748b]">
                  Project key cannot be changed after creation.
                </p>
              </div>

              <div>
                <label className="mb-3 block text-[17px] font-extrabold text-[#0f172a]">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the goals of this project..."
                  rows={4}
                  className="w-full resize-none rounded-[18px] border border-[#dbe4ef] bg-[#f9fbfe] px-6 py-5 text-[20px] leading-9 text-[#0f172a] outline-none placeholder:text-[#9aa9c2] focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="mb-4 block text-[17px] font-extrabold text-[#0f172a]">
                  Visibility
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVisibility("PUBLIC")}
                    className={`rounded-[22px] border-2 p-5 text-left transition ${
                      visibility === "PUBLIC"
                        ? "border-[#2563eb] bg-[#f3f7ff]"
                        : "border-[#e2e8f0] bg-white"
                    }`}
                  >
                    <p className="text-[20px] font-extrabold text-[#0f172a]">
                      Public
                    </p>
                    <p className="mt-1 text-[15px] text-[#64748b]">
                      Team access
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility("PRIVATE")}
                    className={`rounded-[22px] border-2 p-5 text-left transition ${
                      visibility === "PRIVATE"
                        ? "border-[#2563eb] bg-[#f3f7ff]"
                        : "border-[#e2e8f0] bg-white"
                    }`}
                  >
                    <p className="text-[20px] font-extrabold text-[#0f172a]">
                      Private
                    </p>
                    <p className="mt-1 text-[15px] text-[#64748b]">
                      Invite only
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[17px] font-extrabold text-[#0f172a]">
                  Default Workflow
                </label>

                <div className="relative">
                  <select
                    value={defaultWorkflow}
                    onChange={(e) => setDefaultWorkflow(e.target.value)}
                    className="h-[86px] w-full appearance-none rounded-[18px] border border-[#dbe4ef] bg-[#f9fbfe] px-6 pr-16 text-[22px] text-[#0f172a] outline-none focus:border-[#2563eb]"
                  >
                    <option>Standard Agile (Kanban)</option>
                    <option>Scrum Sprint Cycle</option>
                    <option>Bug Tracking Only</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-8 w-8 -translate-y-1/2 text-[#94a3b8]" />
                </div>
              </div>

              {error ? (
                <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-5 py-4 text-[14px] font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-[#e8edf5] bg-white px-7 py-5 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="h-[56px] flex-1 rounded-[18px] border border-[#e2e8f0] bg-white text-[15px] font-extrabold text-[#475569] transition hover:bg-[#f8fafc] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex h-[56px] flex-[1.35] items-center justify-center gap-2 rounded-[18px] bg-[#2563eb] text-[15px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}