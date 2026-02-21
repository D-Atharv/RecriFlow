"use client";

import { Building2, Globe2, ShieldCheck, Users } from "lucide-react";

export function CompanyProfilePanel() {
  return (
    <div className="space-y-4">
      <header className="mb-1">
        <h2 className="text-[15px] font-bold tracking-tight text-slate-900 leading-none">Company Profile</h2>
        <p className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          Workspace identity and operational governance context.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 leading-none">Workspace Identity</h3>

          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Company Name</span>
              <input
                type="text"
                value="TalentLens / RecriFlow"
                readOnly
                className="h-8 w-full rounded border border-slate-200 bg-slate-50/50 px-2.5 text-[11px] font-semibold text-slate-600 focus:ring-1 focus:ring-slate-900 transition-all cursor-default"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Registry Domain</span>
              <input
                type="text"
                value="recriflow.local"
                readOnly
                className="h-8 w-full rounded border border-slate-200 bg-slate-50/50 px-2.5 text-[11px] font-semibold text-slate-600 focus:ring-1 focus:ring-slate-900 transition-all cursor-default"
              />
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Careers Gateway</span>
              <input
                type="text"
                value="https://recriflow.example/careers"
                readOnly
                className="h-8 w-full rounded border border-slate-200 bg-slate-50/50 px-2.5 text-[11px] font-semibold text-slate-600 focus:ring-1 focus:ring-slate-900 transition-all cursor-default"
              />
            </label>
          </div>

          <p className="mt-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest italic leading-relaxed">
            Persistence layer deferred for Phase 1. Registry reflects target configuration state.
          </p>
        </section>

        <section className="space-y-4">
          <article className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Security Guardrails
            </h3>
            <ul className="mt-3 space-y-2 text-[11px] font-semibold text-slate-500 leading-none">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-200" />
                Mandatory active admin requirement.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-200" />
                Role downgrade protection active.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-200" />
                Authenticated mutation enforcement.
              </li>
            </ul>
          </article>

          <article className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">
              <Building2 className="h-3 w-3 text-slate-400" />
              Tenant Context
            </h3>
            <dl className="mt-3 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <dt className="font-bold text-slate-400 uppercase tracking-tight">Workspace Mode</dt>
                <dd className="font-bold text-slate-800">Single Tenant</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-bold text-slate-400 uppercase tracking-tight">Data Plane</dt>
                <dd className="font-bold text-slate-800">PostgreSQL</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-bold text-slate-400 uppercase tracking-tight">Object Storage</dt>
                <dd className="font-bold text-slate-800">AWS S3</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">
              <Globe2 className="h-3 w-3 text-slate-400" />
              Operational Scope
            </h3>
            <p className="mt-2.5 text-[11px] font-semibold text-slate-500 leading-relaxed italic">
              Phase 1 scope focused on core recruiter workflows and sync mechanics.
            </p>
          </article>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
        <h3 className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">
          <Users className="h-3 w-3 text-slate-400" />
          Access Visibility
        </h3>
        <p className="mt-2 text-[11px] font-semibold text-slate-500 leading-relaxed italic">
          Recruiters and hiring managers operate within business context tabs. Settings layer restricted to admin roles for infrastructure governance.
        </p>
      </section>
    </div>
  );
}
