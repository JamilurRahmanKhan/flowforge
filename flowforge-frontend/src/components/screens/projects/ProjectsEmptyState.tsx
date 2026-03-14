"use client";

type Props = {
  onCreate: () => void;
};

export default function ProjectsEmptyState({ onCreate }: Props) {
  return (
    <div className="rounded-[28px] border border-[#e6ebf3] bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)] lg:px-10 lg:py-16">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef4ff] text-[#2563eb]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v9A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-11Z" />
        </svg>
      </div>

      <h3 className="mt-6 text-[22px] font-extrabold tracking-tight text-[#0f172a] lg:text-[26px]">
        No projects yet
      </h3>

      <p className="mx-auto mt-3 max-w-[520px] text-[14px] leading-7 text-[#64748b] lg:text-[15px]">
        Create your first project to start organizing tasks, tracking progress,
        and collaborating with your team inside FlowForge.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 rounded-full bg-[#2563eb] px-6 py-3 text-[14px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition hover:bg-[#1d4ed8]"
      >
        Create Project
      </button>
    </div>
  );
}