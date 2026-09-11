"use client";

import { useState } from "react";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconContrast,
  IconSend,
  IconTextSize,
} from "@/components/ui/icons";
import type { ContrastTheme, TextSize } from "@/types";

const CONTRASTS: { id: ContrastTheme; label: string; swatch: string; bar: string }[] = [
  { id: "black-on-white", label: "Black on white", swatch: "#FFFFFF", bar: "#1A1A1A" },
  { id: "white-on-black", label: "White on black", swatch: "#000000", bar: "#FFFFFF" },
  { id: "yellow-on-black", label: "Yellow on black", swatch: "#000000", bar: "#FFE800" },
];

const SIZES: { id: TextSize; label: string; px: string }[] = [
  { id: "normal", label: "Normal", px: "16px" },
  { id: "large", label: "Large", px: "18px" },
  { id: "xlarge", label: "Extra large", px: "21px" },
];

/* The real player's Options is a full-page takeover with exactly three rows and
   one promoted red action. We keep the shape and the promotion — one action
   isolated against a uniform set is the only way the isolation actually reads. */
export function OptionsScreen({
  contrast,
  textSize,
  onContrast,
  onTextSize,
  onSubmit,
  onClose,
}: {
  contrast: ContrastTheme;
  textSize: TextSize;
  onContrast: (c: ContrastTheme) => void;
  onTextSize: (s: TextSize) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const [view, setView] = useState<"root" | "contrast" | "text">("root");

  const title = view === "root" ? "Options" : view === "contrast" ? "Contrast" : "Text size";

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-bg">
      <div className="relative flex h-16 items-center justify-center border-b border-border px-4">
        {view !== "root" && (
          <button
            type="button"
            onClick={() => setView("root")}
            className="absolute left-3 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 font-bold hover:bg-bg-sunken"
          >
            <IconChevronLeft /> Options
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close options"
          className="absolute right-3 cursor-pointer rounded-md p-2 hover:bg-bg-sunken"
        >
          <IconClose width={22} height={22} />
        </button>
      </div>

      <div className="mx-auto w-full max-w-xl px-4 py-8">
        {view === "root" && (
          <>
            <button
              type="button"
              onClick={onSubmit}
              className="mb-6 flex w-full cursor-pointer items-center gap-3 rounded-md bg-primary px-5 py-4 text-left font-bold text-primary-text transition-colors hover:bg-primary-hover"
            >
              <IconSend />
              <span className="flex-1">Go to submission page</span>
              <IconChevronRight />
            </button>

            <div className="overflow-hidden rounded-lg border border-border bg-bg-raised">
              <OptionRow
                icon={<IconContrast />}
                label="Contrast"
                value={CONTRASTS.find((c) => c.id === contrast)?.label}
                onClick={() => setView("contrast")}
              />
              <div className="h-px bg-border" />
              <OptionRow
                icon={<IconTextSize />}
                label="Text size"
                value={SIZES.find((s) => s.id === textSize)?.label}
                onClick={() => setView("text")}
              />
            </div>
          </>
        )}

        {view === "contrast" && (
          <div className="overflow-hidden rounded-lg border border-border bg-bg-raised">
            {CONTRASTS.map((c, i) => (
              <div key={c.id}>
                {i > 0 && <div className="h-px bg-border" />}
                <button
                  type="button"
                  onClick={() => onContrast(c.id)}
                  className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left hover:bg-bg-sunken"
                >
                  <span className="w-5 text-primary">{contrast === c.id && <IconCheck />}</span>
                  <span className="flex-1 font-bold">{c.label}</span>
                  <span
                    className="flex h-8 w-12 flex-col justify-center gap-1 rounded-sm border border-border px-1.5"
                    style={{ background: c.swatch }}
                    aria-hidden="true"
                  >
                    <i className="block h-0.5 w-full rounded" style={{ background: c.bar }} />
                    <i className="block h-0.5 w-full rounded" style={{ background: c.bar }} />
                    <i className="block h-0.5 w-2/3 rounded" style={{ background: c.bar }} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {view === "text" && (
          <div className="overflow-hidden rounded-lg border border-border bg-bg-raised">
            {SIZES.map((s, i) => (
              <div key={s.id}>
                {i > 0 && <div className="h-px bg-border" />}
                <button
                  type="button"
                  onClick={() => onTextSize(s.id)}
                  className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left hover:bg-bg-sunken"
                >
                  <span className="w-5 text-primary">{textSize === s.id && <IconCheck />}</span>
                  <span className="flex-1 font-bold">{s.label}</span>
                  <span className="font-serif text-text-muted" style={{ fontSize: s.px }}>
                    Aa
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left hover:bg-bg-sunken"
    >
      <span className="text-text-muted">{icon}</span>
      <span className="flex-1 font-bold">{label}</span>
      {value && <span className="text-sm text-text-muted">{value}</span>}
      <IconChevronRight />
    </button>
  );
}
