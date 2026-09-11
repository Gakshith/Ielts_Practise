"use client";

import { IconClose } from "@/components/ui/icons";
import type { Highlight } from "@/types";

/* Right-hand drawer. In the real player, highlights and notes are one feature driven
   by text selection, and both are private — invisible to the examiner, worth no marks. */
export function NotesDrawer({
  open,
  notes,
  highlights,
  onNotes,
  onClose,
  onRemoveHighlight,
}: {
  open: boolean;
  notes: string;
  highlights: Highlight[];
  onNotes: (v: string) => void;
  onClose: () => void;
  onRemoveHighlight: (createdAt: number) => void;
}) {
  if (!open) return null;

  return (
    <aside
      aria-label="Notes"
      className="flex w-full shrink-0 flex-col border-l border-border bg-bg-sunken sm:w-80"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg-raised px-4">
        <h2 className="font-bold">Notes</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notes"
          className="cursor-pointer rounded-md p-2 text-text-muted hover:bg-bg-sunken hover:text-text"
        >
          <IconClose />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div>
          <label htmlFor="scratch" className="mb-2 block text-xs font-bold uppercase tracking-wide text-text-muted">
            Scratch pad
          </label>
          <textarea
            id="scratch"
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
            placeholder="Jot anything here. It is private and scores nothing."
            className="h-40 w-full resize-none rounded-md border border-border bg-bg-raised p-3 text-sm leading-relaxed outline-none placeholder:text-text-subtle focus-visible:border-border-strong"
          />
        </div>

        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
            Highlights
          </h3>
          {highlights.length === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-center text-sm leading-relaxed text-text-muted">
              Select text in the passage and choose <strong>Highlight</strong> to collect it
              here.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {highlights.map((h) => (
                <li
                  key={h.createdAt}
                  className="group rounded-md border border-border bg-bg-raised p-3 text-sm"
                >
                  <p className="font-serif leading-snug">
                    <mark className="bg-highlight px-0.5">{h.text}</mark>
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemoveHighlight(h.createdAt)}
                    className="mt-2 cursor-pointer text-xs font-bold text-text-muted opacity-0 transition-opacity hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    Clear
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
