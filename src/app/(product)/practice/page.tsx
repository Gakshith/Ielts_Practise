import { papers } from "@/data/papers";
import { Card } from "@/components/ui/Card";
import { StartButtons } from "@/components/StartButtons";
import { AttemptHistory } from "@/components/AttemptHistory";
import { IconBook, IconHeadphones, IconMic, IconPen } from "@/components/ui/icons";
import type { ModuleId } from "@/types";

const MODULES: {
  id: ModuleId;
  name: string;
  icon: React.ReactNode;
  time: string;
  blurb: string;
}[] = [
  {
    id: "listening",
    name: "Listening",
    icon: <IconHeadphones />,
    time: "about 30 minutes",
    blurb:
      "Four parts, forty questions. The recording plays once and will not come back — the same rule as the real test, even when you are only drilling.",
  },
  {
    id: "reading",
    name: "Reading",
    icon: <IconBook />,
    time: "60 minutes",
    blurb:
      "Three passages, forty questions, one budget. No extra transfer time, because the real test gives none.",
  },
  {
    id: "writing",
    name: "Writing",
    icon: <IconPen />,
    time: "60 minutes",
    blurb:
      "Task 1 and Task 2 in a single block. No spellcheck, no formatting, no autocorrect — exactly as plain as the real box.",
  },
  {
    id: "speaking",
    name: "Speaking",
    icon: <IconMic />,
    time: "11 to 14 minutes",
    blurb:
      "Three parts with the one-minute preparation on the cue card, and a live transcript so you can see what you actually said.",
  },
];

export default function PracticePage() {
  const paper = papers[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold">Practise one section</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-muted">
        Drill a single module without committing two and three-quarter hours. The rules of
        the module stay exactly as they are on test day.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {MODULES.map((m) => (
          <Card key={m.id} className="flex flex-col p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-navy-100 text-navy-700">
                {m.icon}
              </span>
              <div>
                <h2 className="font-serif text-xl font-bold leading-tight">{m.name}</h2>
                <p className="text-sm text-text-muted">{m.time}</p>
              </div>
            </div>

            <p className="mb-6 flex-1 leading-relaxed text-text-muted">{m.blurb}</p>

            {paper && <StartButtons paper={paper} scope={m.id} examLabel="Exam mode" />}
            {paper && <AttemptHistory paperId={paper.id} scope={m.id} />}
          </Card>
        ))}
      </div>
    </div>
  );
}
