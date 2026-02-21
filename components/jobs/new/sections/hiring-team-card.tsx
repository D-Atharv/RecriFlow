"use client";

import { MoreVertical, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import type { CreateJobOpeningValues } from "@/components/jobs/new/create-job.schema";
import type { User } from "@/types/domain";

interface HiringTeamCardProps {
  actorUserId: string;
  members: User[];
}

function formatRole(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

function initials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function HiringTeamCard({ actorUserId, members }: HiringTeamCardProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateJobOpeningValues>();
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [members],
  );
  const selectedIds = watch("hiringTeamIds");
  const selectedMembers = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return sortedMembers.filter((member) => selectedSet.has(member.id));
  }, [selectedIds, sortedMembers]);
  const availableMembers = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return sortedMembers.filter((member) => !selectedSet.has(member.id));
  }, [selectedIds, sortedMembers]);

  const addMember = (): void => {
    if (!selectedMemberId) {
      return;
    }

    setValue("hiringTeamIds", [...selectedIds, selectedMemberId], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSelectedMemberId("");
  };

  const removeMember = (memberId: string): void => {
    if (memberId === actorUserId) {
      return;
    }

    setValue(
      "hiringTeamIds",
      selectedIds.filter((id) => id !== memberId),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">Hiring Team</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{selectedMembers.length}</span>
      </header>

      <div className="space-y-4 px-4 py-4">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <label className="sr-only" htmlFor="hiring-team-member">
            Add hiring team member
          </label>
          <select
            id="hiring-team-member"
            value={selectedMemberId}
            onChange={(event) => setSelectedMemberId(event.target.value)}
            className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none transition-colors focus:border-slate-500"
          >
            <option value="">Add team member...</option>
            {availableMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName} ({formatRole(member.role)})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addMember}
            disabled={!selectedMemberId}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-gray-200 px-3 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {selectedMembers.map((member) => (
            <article key={member.id} className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-800">
                  {initials(member.fullName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.fullName}</p>
                  <p className="text-xs text-gray-500">{formatRole(member.role)}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={member.id === actorUserId}
                onClick={() => removeMember(member.id)}
                className="text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Team member actions"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        {errors.hiringTeamIds ? (
          <p className="text-xs font-medium text-rose-600">{errors.hiringTeamIds.message}</p>
        ) : null}
        {selectedMembers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 px-3 py-3 text-sm text-gray-500">No team members selected yet.</p>
        ) : null}
      </div>
    </section>
  );
}
