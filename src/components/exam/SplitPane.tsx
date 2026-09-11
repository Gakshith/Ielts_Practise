"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/* Reading and Writing are split panes in the real player. The official sources do not
   confirm whether the real divider can be dragged, so this is our enhancement rather
   than a fidelity claim: it defaults to 50/50 and is keyboard-operable. */
export function SplitPane({
  left,
  right,
  initial = 50,
  min = 25,
  max = 75,
  label = "Resize panels",
}: {
  left: ReactNode;
  right: ReactNode;
  initial?: number;
  min?: number;
  max?: number;
  label?: string;
}) {
  const [pct, setPct] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  const apply = useCallback(
    (clientX: number) => {
      const el = host.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      const next = ((clientX - r.left) / r.width) * 100;
      setPct(Math.min(max, Math.max(min, next)));
    },
    [min, max],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => apply(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    // While dragging, stop the panes' text from being selected under the cursor.
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.body.style.userSelect = prev;
    };
  }, [dragging, apply]);

  return (
    <div ref={host} className="flex min-h-0 flex-1 flex-col md:flex-row">
      <div className="min-h-0 overflow-y-auto md:h-full" style={{ flexBasis: `${pct}%` }}>
        {left}
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        onPointerDown={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPct((v) => Math.max(min, v - 2));
          if (e.key === "ArrowRight") setPct((v) => Math.min(max, v + 2));
          if (e.key === "Home") setPct(50);
        }}
        className="group relative hidden w-3 shrink-0 cursor-col-resize items-center justify-center md:flex"
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
        <span className="relative z-10 flex h-8 w-4 items-center justify-center rounded-sm border border-border bg-bg-raised text-text-muted shadow-card transition-colors group-hover:border-border-strong group-hover:text-text">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 7 4 12l4 5M16 7l4 5-4 5" />
          </svg>
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-border md:h-full md:border-t-0">
        {right}
      </div>
    </div>
  );
}
