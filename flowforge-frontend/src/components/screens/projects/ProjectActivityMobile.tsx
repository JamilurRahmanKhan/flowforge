"use client";

type Activity = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
};

export default function ProjectActivityMobile({
  activities,
}: {
  activities?: Activity[];
}) {
  const safeActivities = activities || [];

  return (
    <div className="space-y-5 lg:hidden">
      <section className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
        <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
          Activity
        </h2>

        <div className="mt-4 space-y-3">
          {safeActivities.length > 0 ? (
            safeActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] p-4"
              >
                <p className="text-[15px] font-extrabold text-[#0f172a]">
                  {activity.title}
                </p>
                <p className="mt-2 text-[13px] leading-6 text-[#64748b]">
                  {activity.description}
                </p>
                <p className="mt-3 text-[12px] font-bold text-[#94a3b8]">
                  {activity.timeLabel}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-4 py-6 text-center text-[13px] font-medium text-[#94a3b8]">
              No activity yet for this project.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}