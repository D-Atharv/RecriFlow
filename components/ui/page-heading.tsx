import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeading({ title, description, actions }: PageHeadingProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl font-semibold text-[color:var(--color-ink)]">{title}</h2>
        <p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">{description}</p>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
