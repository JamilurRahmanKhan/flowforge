export default function MyTasksPage() {
  return (
    <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="max-w-3xl">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Workspace Tasks
        </p>
        <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
          My Tasks
        </h2>
        <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
          This page is now a real route in the sidebar. In the next phase, this
          screen will show your assigned tasks, filters, due dates, and progress.
        </p>

        <div className="mt-8 rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] p-6">
          <h3 className="text-[18px] font-extrabold text-[#0f172a]">
            Coming next
          </h3>
          <div className="mt-4 grid gap-3 text-[14px] font-medium text-[#475569]">
            <div className="rounded-[16px] bg-white px-4 py-3">
              Assigned task list
            </div>
            <div className="rounded-[16px] bg-white px-4 py-3">
              Status filters and sorting
            </div>
            <div className="rounded-[16px] bg-white px-4 py-3">
              Due date and priority views
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}