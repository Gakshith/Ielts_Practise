import { papers } from "@/data/papers";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StartButtons } from "@/components/StartButtons";
import { AttemptHistory } from "@/components/AttemptHistory";

export default function TestsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold">Full mock tests</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-muted">
        All four modules, in the order the real test runs them: Listening, Reading,
        Writing, then Speaking. Two hours forty-five minutes in exam mode.
      </p>

      <ul className="mt-10 flex flex-col gap-5">
        {papers.map((paper) => (
          <Card key={paper.id} as="li" className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge tone="info">
                    {paper.kind === "academic" ? "Academic" : "General Training"}
                  </Badge>
                  {paper.placeholder && <Badge tone="neutral">Placeholder content</Badge>}
                </div>

                <h2 className="font-serif text-2xl font-bold">{paper.title}</h2>

                <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <Stat label="Listening" value={`${count(paper.listening.parts)} questions`} />
                  <Stat label="Reading" value={`${count(paper.reading.passages)} questions`} />
                  <Stat label="Writing" value={`${paper.writing.tasks.length} tasks`} />
                  <Stat label="Speaking" value={`${paper.speaking.parts.length} parts`} />
                </dl>

                {paper.placeholder && (
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
                    The passages are original stand-ins and no audio files are loaded yet.
                    Everything else — timing, marking, band conversion, the review — works
                    exactly as it will with real content.
                  </p>
                )}
              </div>

              <div className="shrink-0">
                <StartButtons paper={paper} scope="full" examLabel="Take the full mock" />
              </div>
            </div>

            <AttemptHistory paperId={paper.id} scope="full" />
          </Card>
        ))}
      </ul>
    </div>
  );
}

function count(sections: { groups: { items: unknown[] }[] }[]) {
  return sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0), 0);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-text-subtle">{label}</dt>
      <dd className="mt-0.5 font-bold">{value}</dd>
    </div>
  );
}
