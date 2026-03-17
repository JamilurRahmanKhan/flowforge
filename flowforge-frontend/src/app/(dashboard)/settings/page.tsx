export default function SettingsPage() {
  return (
    <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="max-w-3xl">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Workspace Configuration
        </p>
        <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
          Settings
        </h2>
        <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
          This page is now active in the sidebar. In the next phase, it will be
          used for workspace settings, organization details, and preference management.
        </p>

        <div className="mt-8 rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] p-6">
          <h3 className="text-[18px] font-extrabold text-[#0f172a]">
            Planned settings sections
          </h3>
          <div className="mt-4 grid gap-3 text-[14px] font-medium text-[#475569]">
            <div className="rounded-[16px] bg-white px-4 py-3">
              Workspace information
            </div>
            <div className="rounded-[16px] bg-white px-4 py-3">
              Project defaults
            </div>
            <div className="rounded-[16px] bg-white px-4 py-3">
              Notification and preference controls
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}