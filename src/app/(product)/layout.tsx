import Link from "next/link";
import type { ReactNode } from "react";
import { IconUser } from "@/components/ui/icons";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tests", label: "Tests" },
  { href: "/practice", label: "Practice" },
];

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <header className="sticky top-0 z-30 border-b border-border bg-bg-raised/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary">
            IELTS<span className="text-accent">·</span>Practise
          </Link>
          <nav className="hidden flex-1 items-center gap-1 sm:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-2 text-[0.95rem] font-bold text-text-muted transition-colors hover:bg-bg-sunken hover:text-text"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-1 justify-end sm:flex-none">
            <Link
              href="/profile"
              className="flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-bold transition-colors hover:bg-bg-sunken"
            >
              <IconUser width={18} height={18} />
              Profile
            </Link>
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-1.5 sm:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="shrink-0 rounded-md px-3 py-1.5 text-sm font-bold text-text-muted"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-bg-raised">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-text-muted">
          <p className="mb-2">
            An independent practice tool. Not affiliated with, endorsed by, or connected to
            IELTS, the British Council, IDP or Cambridge Assessment English.
          </p>
          <p>
            Band conversions are <strong>indicative</strong>. IELTS does not publish an
            official raw-score table, and real tests are equated version by version.
          </p>
        </div>
      </footer>
    </div>
  );
}
