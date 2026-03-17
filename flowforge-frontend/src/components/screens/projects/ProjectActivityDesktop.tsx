"use client";

type Activity = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
};

export default function ProjectActivityDesktop({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="hidden lg:block">
      <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h2 className="text-[28px] font-extrabold tracking-tight text-[#0f172a]">
          Activity
        </h2>

        <div className="mt-6 space-y-5">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-[22px] border border-[#eef2f7] bg-[#f8fafc] px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-extrabold text-[#0f172a]">
                      {activity.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-[#64748b]">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-[12px] font-bold text-[#94a3b8]">
                    {activity.timeLabel}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-8 text-center text-[14px] font-medium text-[#94a3b8]">
              No activity yet for this project.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}