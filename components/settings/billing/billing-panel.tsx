"use client";

import { CreditCard, ShieldCheck, Users } from "lucide-react";

import type { User } from "@/types/domain";

interface BillingPanelProps {
  users: User[];
}

export function BillingPanel({ users }: BillingPanelProps) {
  const activeSeats = users.filter((user) => user.isActive).length;
  const seatLimit = 30;
  const usage = Math.min(Math.round((activeSeats / seatLimit) * 100), 100);

  return (
    <div className="space-y-4">
      <header className="mb-1">
        <h2 className="text-[15px] font-bold tracking-tight text-slate-900 leading-none">Billing</h2>
        <p className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          Seat usage and subscription readiness for operations.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all hover:border-slate-300/60">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Active Seats</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <p className="text-[28px] font-bold tracking-tight text-slate-900 leading-none">{activeSeats}</p>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occupied</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-slate-500 leading-none text-balance">
            {seatLimit - activeSeats} seats remaining in current allocation.
          </p>
          <div className="mt-4 h-1.5 rounded-full bg-slate-100 border border-slate-200/30 overflow-hidden">
            <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${usage}%` }} />
          </div>
        </article>

        <article className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all hover:border-slate-300/60">
          <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">
            <CreditCard className="h-3 w-3" />
            Plan Tier
          </p>
          <p className="mt-3 text-[16px] font-bold text-slate-900 leading-none">Growth (Phase 1)</p>
          <p className="mt-2.5 text-[11px] font-semibold leading-relaxed text-slate-500 italic">
            Base subscription assumptions are kept static until payment integration is activated.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all hover:border-slate-300/60">
          <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">
            <ShieldCheck className="h-3 w-3" />
            Billing Controls
          </p>
          <ul className="mt-3 space-y-2 text-[11px] font-semibold text-slate-500 leading-none">
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-slate-200" />
              Admin-restricted billing access.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-slate-200" />
              Pre-creation seat validation.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-slate-200" />
              Comprehensive log audit trail.
            </li>
          </ul>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all hover:border-slate-300/60">
        <h3 className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">
          <Users className="h-3 w-3 text-slate-400" />
          Subscription Notes
        </h3>
        <p className="mt-2.5 text-[11px] font-semibold leading-relaxed text-slate-500 italic">
          Payment processor wiring is deferred. This panel focuses on operational seat visibility for admin team access management prior to full automation.
        </p>
      </section>
    </div>
  );
}
