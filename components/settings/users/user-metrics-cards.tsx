import type { UserRole } from "@/types/domain";

import { roleDistribution } from "@/components/settings/users/users.utils";

interface UserMetricsCardsProps {
  users: Array<{
    role: UserRole;
    isActive: boolean;
  }>;
  seatLimit?: number;
}

export function UserMetricsCards({ users, seatLimit = 30 }: UserMetricsCardsProps) {
  const activeSeats = users.filter((user) => user.isActive).length;
  const pendingInvites = users.filter((user) => !user.isActive).length;
  const distribution = roleDistribution(users);
  const usage = Math.min(Math.round((activeSeats / seatLimit) * 100), 100);

  const distributionOrder: UserRole[] = ["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"];

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section className="rounded-xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Seats</h3>
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-100/50">Active Plan</span>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-[18px] font-bold tracking-tight text-slate-800">{activeSeats}</span>
          <span className="text-[11px] font-medium text-slate-400">/ {seatLimit} used</span>
        </div>
        <div className="mt-3.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-slate-900 transition-all duration-500" style={{ width: `${usage}%` }} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-sm">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pending Invites</h3>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-[18px] font-bold tracking-tight text-slate-800">{pendingInvites}</span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">awaiting response</span>
        </div>
        <p className="mt-2.5 text-[10px] font-medium leading-relaxed text-slate-400 italic">Inactive users treated as pending.</p>
      </section>

      <section className="rounded-xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-sm">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Roles Distribution</h3>
        <dl className="mt-2.5 space-y-1.5">
          {distributionOrder.map((role) => (
            <div key={role} className="flex items-center justify-between text-[11.5px]">
              <dt className="font-medium text-slate-500">{role === "HIRING_MANAGER" ? "Hiring Managers" : `${role.charAt(0)}${role.slice(1).toLowerCase()}s`}</dt>
              <dd className="font-bold text-slate-800">{distribution[role]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
