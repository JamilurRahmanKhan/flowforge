import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Topbar title={title} />
          {children}
        </main>
      </div>
    </div>
  );
}