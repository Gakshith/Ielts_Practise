import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-bg-sunken text-text-muted border-border",
  accent: "bg-accent-soft text-amber-700 border-accent",
  success: "bg-success-soft text-success border-success",
  danger: "bg-danger-soft text-danger border-danger",
  info: "bg-navy-100 text-navy-700 border-navy-300",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
