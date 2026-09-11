import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag className={`bg-bg-raised border border-border rounded-lg shadow-card ${className}`}>
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  hint,
  action,
}: {
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-border">
      <div className="min-w-0">
        <h2 className="font-bold text-[1.05rem] leading-tight">{title}</h2>
        {hint && <p className="text-sm text-text-muted mt-1">{hint}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
