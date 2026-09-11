"use client";

import { useCallback, useRef, useState } from "react";
import type { ReadingParagraph } from "@/types";

/* Highlighting in the real player is driven by text selection and a context menu.
   We use a selection popover instead of hijacking right-click, which is friendlier
   and keyboard-reachable, and we say so in the docs rather than claiming fidelity. */
export function PassageView({
  title,
  subtitle,
  blurb,
  paragraphs,
  highlighted,
  onHighlight,
}: {
  title: string;
  subtitle?: string;
  blurb?: string;
  paragraphs: ReadingParagraph[];
  highlighted: string[];
  onHighlight: (text: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [pop, setPop] = useState<{ x: number; y: number; text: string } | null>(null);

  const onUp = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim() ?? "";
    if (!sel || sel.isCollapsed || text.length < 2 || !host.current) return setPop(null);
    const range = sel.getRangeAt(0);
    if (!host.current.contains(range.commonAncestorContainer)) return setPop(null);
    const r = range.getBoundingClientRect();
    const h = host.current.getBoundingClientRect();
    setPop({ x: r.left + r.width / 2 - h.left, y: r.top - h.top, text });
  }, []);

  return (
    <div
      ref={host}
      className="relative px-6 py-6 lg:px-10"
      onMouseUp={onUp}
      onKeyUp={(e) => {
        if (e.shiftKey) onUp();
      }}
    >
      <h2 className="font-serif text-2xl font-bold leading-tight">{title}</h2>
      {subtitle && <p className="mt-1 font-serif text-lg text-text-muted">{subtitle}</p>}
      {blurb && (
        <p className="mt-4 rounded-md border border-border bg-bg-sunken px-4 py-3 text-sm">
          {blurb}
        </p>
      )}

      <div className="prose-exam mt-6 max-w-[68ch]">
        {paragraphs.map((p, i) => (
          <p key={i}>
            {p.label && <strong className="mr-2 font-sans text-[0.85em]">{p.label}</strong>}
            <Marked text={p.text} marks={highlighted} />
          </p>
        ))}
      </div>

      {pop && (
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-full pb-2"
          style={{ left: pop.x, top: pop.y }}
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onHighlight(pop.text);
              window.getSelection()?.removeAllRanges();
              setPop(null);
            }}
            className="cursor-pointer rounded-md bg-bg-inverse px-3 py-2 text-sm font-bold text-text-inverse shadow-float"
          >
            Highlight
          </button>
        </div>
      )}
    </div>
  );
}

/** Wraps any stored highlight strings found in this paragraph. */
function Marked({ text, marks }: { text: string; marks: string[] }) {
  const hits = marks.filter((m) => m.length > 1 && text.includes(m));
  if (hits.length === 0) return <>{text}</>;

  // Longest first, so a longer highlight is not split by a shorter one inside it.
  const pattern = hits
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  return (
    <>
      {text.split(new RegExp(`(${pattern})`, "g")).map((chunk, i) =>
        hits.includes(chunk) ? (
          <mark key={i} className="bg-highlight" style={{ color: "var(--highlight-text)" }}>
            {chunk}
          </mark>
        ) : (
          <span key={i}>{chunk}</span>
        ),
      )}
    </>
  );
}
