"use client";

import { Building2, CreditCard, FileBarChart2, Settings2, Users } from "lucide-react";

import type { SettingsTabId } from "@/components/settings/types";

interface SettingsSubnavProps {
  activeTab: SettingsTabId;
  onTabChange: (next: SettingsTabId) => void;
}

const SETTINGS_TABS: Array<{ id: SettingsTabId; label: string; icon: typeof Users }> = [
  { id: "users", label: "User Management", icon: Users },
  { id: "company", label: "Company Profile", icon: Building2 },
  { id: "integrations", label: "Integrations", icon: Settings2 },
  { id: "logs", label: "Logs", icon: FileBarChart2 },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export function SettingsSubnav({ activeTab, onTabChange }: SettingsSubnavProps) {
  return (
    <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden mb-4">
      <div className="flex gap-4 overflow-x-auto px-3.5">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={[
                "inline-flex shrink-0 items-center gap-1.5 border-b-2 px-1 py-1.5 text-[10px] font-bold uppercase tracking-widest",
                active
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              <Icon className="h-3 w-3" strokeWidth={2.5} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
