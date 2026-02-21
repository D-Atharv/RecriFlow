"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface CandidateInternalNotesCardProps {
  candidateId: string;
  initialNotes: string | null;
  canEdit: boolean;
}

const MAX_NOTES_LENGTH = 4000;

export function CandidateInternalNotesCard({
  candidateId,
  initialNotes,
  canEdit,
}: CandidateInternalNotesCardProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNotes(initialNotes ?? "");
  }, [initialNotes]);

  const isDirty = useMemo(() => notes !== (initialNotes ?? ""), [initialNotes, notes]);

  const handleSave = async () => {
    if (!canEdit || saving || !isDirty) {
      return;
    }

    setSaving(true);
    setSavedMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notes.slice(0, MAX_NOTES_LENGTH),
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save notes");
      }

      setSavedMessage("Notes saved");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
      <h3 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase">Internal Notes</h3>

      {canEdit ? (
        <div className="mt-2.5">
          <textarea
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={MAX_NOTES_LENGTH}
            placeholder="Write internal context..."
            className="w-full resize-none rounded border border-slate-200 bg-slate-50/50 p-2 text-[11px] leading-relaxed font-semibold text-slate-600 outline-none transition-all focus:border-slate-400 focus:bg-white placeholder:text-slate-300"
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {notes.length} / {MAX_NOTES_LENGTH}
            </p>

            <div className="flex items-center gap-2">
              {savedMessage ? <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">{savedMessage}</p> : null}
              {error ? <p className="text-[9px] font-bold text-rose-600 uppercase tracking-tight">{error}</p> : null}
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="inline-flex h-7 items-center rounded bg-slate-900 px-3 text-[10px] font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50 uppercase tracking-widest"
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          {initialNotes ? (
            <div className="rounded border border-slate-100 bg-slate-50/30 px-2 py-1.5 text-[11px] font-semibold leading-relaxed text-slate-600 italic">
              "{initialNotes}"
            </div>
          ) : (
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No context recorded.</p>
          )}
        </div>
      )}
    </article>
  );
}
