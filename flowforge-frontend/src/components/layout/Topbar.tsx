import { Bell } from "lucide-react";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Premium workspace operations
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f68f9]/10 text-[#1f68f9] transition hover:bg-[#1f68f9] hover:text-white">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
          JR
        </div>
      </div>
    </header>
  );
}