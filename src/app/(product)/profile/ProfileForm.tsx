"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Attempt, Profile, TestKind } from "@/types";
import { getProfile, saveProfile, listAttempts, deleteAttempt } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const BANDS = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

function daysUntil(iso: string): number | null {
  const t = new Date(`${iso}T00:00:00`).getTime();
  if (Number.isNaN(t)) return null;
  return Math.ceil((t - Date.now()) / 86_400_000);
}

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(
      getProfile() ?? {
        name: "",
        target: 7,
        kind: "academic",
        createdAt: Date.now(),
      },
    );
    setAttempts(listAttempts());
  }, []);

  if (!profile) return null;

  function update(patch: Partial<Profile>) {
    setProfile((p) => (p ? { ...p, ...patch } : p));
    setSaved(false);
  }

  const left = profile.testDate ? daysUntil(profile.testDate) : null;

  return (
    <div className="mt-10 flex flex-col gap-6">
      <Card>
        <CardHeader title="About you" hint="Used for the countdown and the target line on your results." />
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Field label="Name">
            <input
              value={profile.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Your name"
              className="h-11 w-full rounded-md border border-border bg-bg px-3 outline-none focus-visible:border-primary"
            />
          </Field>

          <Field label="Which test">
            <select
              value={profile.kind}
              onChange={(e) => update({ kind: e.target.value as TestKind })}
              className="h-11 w-full cursor-pointer rounded-md border border-border bg-bg px-3 outline-none focus-visible:border-primary"
            >
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </select>
          </Field>

          <Field label="Target band">
            <select
              value={profile.target}
              onChange={(e) => update({ target: Number(e.target.value) })}
              className="h-11 w-full cursor-pointer rounded-md border border-border bg-bg px-3 outline-none focus-visible:border-primary"
            >
              {BANDS.map((b) => (
                <option key={b} value={b}>
                  {b.toFixed(1)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Your test date" hint="Optional. Drives the countdown.">
            <input
              type="date"
              value={profile.testDate ?? ""}
              onChange={(e) => update({ testDate: e.target.value || undefined })}
              className="h-11 w-full rounded-md border border-border bg-bg px-3 outline-none focus-visible:border-primary"
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-border px-6 py-4">
          <Button
            onClick={() => {
              saveProfile(profile);
              setSaved(true);
            }}
          >
            Save
          </Button>
          {saved && <span className="text-sm font-bold text-success">Saved.</span>}
          {left !== null && (
            <span className="ml-auto text-sm text-text-muted">
              {left > 0 ? (
                <>
                  <strong className="tabular text-text">{left}</strong> days until your test
                </>
              ) : left === 0 ? (
                <strong className="text-text">Your test is today.</strong>
              ) : (
                <>That date has passed.</>
              )}
            </span>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Everything you have taken"
          hint={
            attempts.length === 0
              ? "Nothing yet."
              : `${attempts.length} attempt${attempts.length === 1 ? "" : "s"} stored in this browser.`
          }
        />
        {attempts.length > 0 && (
          <ul className="divide-y divide-border">
            {attempts
              .slice()
              .sort((a, b) => (b.finishedAt ?? b.startedAt) - (a.finishedAt ?? a.startedAt))
              .map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 text-sm">
                  <span className="font-bold">
                    {new Date(a.finishedAt ?? a.startedAt).toLocaleDateString()}
                  </span>
                  <Badge tone="neutral">{a.scope === "full" ? "Full mock" : a.scope}</Badge>
                  <Badge tone={a.mode === "exam" ? "info" : "neutral"}>
                    {a.mode === "exam" ? "Exam" : "Coach"}
                  </Badge>
                  {a.status !== "submitted" && <Badge tone="accent">Unfinished</Badge>}
                  <span className="ml-auto flex items-center gap-3">
                    {a.status === "submitted" ? (
                      <Link href={`/results/${a.id}`} className="font-bold text-primary underline">
                        Results
                      </Link>
                    ) : (
                      <Link href={`/test/${a.id}`} className="font-bold text-primary underline">
                        Resume
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setAttempts(deleteAttempt(a.id))}
                      className="cursor-pointer font-bold text-text-muted hover:text-danger"
                    >
                      Delete
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-text-muted">{hint}</span>}
    </label>
  );
}
