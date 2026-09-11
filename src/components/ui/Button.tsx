import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-bold rounded-md " +
  "transition-[background-color,border-color,color,box-shadow] duration-200 " +
  "cursor-pointer select-none disabled:opacity-45 disabled:cursor-not-allowed " +
  "disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-text hover:bg-primary-hover shadow-card",
  accent: "bg-accent text-text-on-accent hover:bg-accent-strong shadow-card",
  outline: "bg-bg-raised text-text border border-border-strong hover:bg-bg-sunken",
  ghost: "bg-transparent text-text hover:bg-bg-sunken",
  danger: "bg-danger text-white hover:opacity-90",
};

/* 44px is the minimum comfortable target. `md` and `lg` clear it; `sm` is only for
   dense controls that already sit inside a large hit area. */
const sizes: Record<Size, string> = {
  sm: "text-sm px-3 h-9",
  md: "text-[0.95rem] px-5 h-11",
  lg: "text-base px-7 h-14",
};

interface Common {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
}

function cls({ variant = "primary", size = "md", full, className = "" }: Common) {
  return [base, variants[variant], sizes[size], full ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant,
  size,
  full,
  className,
  children,
  ...rest
}: Common & { children: ReactNode } & Omit<ComponentProps<"button">, "className" | "children"> ) {
  return (
    <button className={cls({ variant, size, full, className })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  full,
  className,
  children,
  href,
  ...rest
}: Common & { href: string; children: ReactNode } & Omit<
    ComponentProps<typeof Link>,
    "className" | "children" | "href"
  >) {
  return (
    <Link href={href} className={cls({ variant, size, full, className })} {...rest}>
      {children}
    </Link>
  );
}
