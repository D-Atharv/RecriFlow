export function RolePermissionsReference() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-5">
      <h3 className="text-[17px] font-bold tracking-tight text-slate-800">Role Permissions Reference</h3>
      <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article>
          <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-800">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            Admin
          </h4>
          <p className="mt-1.5 text-[12px] leading-5 text-slate-600">
            Full access to all settings, billing, user management, and company profile. Can delete workspace.
          </p>
        </article>

        <article>
          <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-slate-600" />
            Recruiter
          </h4>
          <p className="mt-1.5 text-[12px] leading-5 text-slate-600">
            Can manage jobs and candidates. View-only access to company settings. No billing access.
          </p>
        </article>

        <article>
          <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-gray-600" />
            Hiring Manager
          </h4>
          <p className="mt-1.5 text-[12px] leading-5 text-slate-600">
            Can view candidates and jobs they are assigned to. Can leave feedback and scorecards.
          </p>
        </article>

        <article>
          <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-gray-300" />
            Viewer
          </h4>
          <p className="mt-1.5 text-[12px] leading-5 text-slate-600">
            Read-only access to specific jobs or candidates. Cannot leave feedback or edit data.
          </p>
        </article>
      </div>
    </section>
  );
}
