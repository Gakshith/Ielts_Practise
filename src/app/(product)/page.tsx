import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  IconChart,
  IconClock,
  IconHeadphones,
  IconSpark,
  IconTarget,
} from "@/components/ui/icons";

export default function Landing() {
  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="border-b border-border bg-bg-raised">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <Badge tone="accent" className="mb-5">
              <IconSpark width={13} height={13} />
              Computer-delivered format
            </Badge>

            <h1 className="font-serif text-[2.6rem] font-bold leading-[1.08] tracking-tight sm:text-6xl">
              Practise the test you will actually sit.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted">
              The audio plays once. You cannot rewind it. The writing box has no spellcheck.
              Every practice tool that softens those rules is training you for a test that
              does not exist.
            </p>

            {/* Exactly two actions, one promoted. Isolation only works against a
                uniform background, so the cut comes before the emphasis. */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/tests" variant="accent" size="lg">
                Take a full mock test
              </ButtonLink>
              <ButtonLink href="/practice" variant="outline" size="lg">
                Practise one section
              </ButtonLink>
            </div>

            <p className="mt-5 text-sm text-text-muted">
              Four modules, back to back, under real timing — or a single section when you
              want to drill.
            </p>
          </div>

          <PlayerMock />
        </div>
      </section>

      {/* ------------------------------------------------------------ the why */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:py-24">
        <h2 className="max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-4xl">
          A score out of 40 has never told anyone what to do next.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
          You already know you are weak. What you do not know is <em>at what</em>. So this
          marks the cause, not just the cross.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<IconTarget />}
            title="It names the one mistake costing you a band"
            body="Every wrong answer is tagged with why it was wrong — not just that it was. Nine of your thirteen reading errors being the same NOT GIVEN confusion is a fact you can act on tomorrow."
          />
          <Feature
            icon={<IconChart />}
            title="It tells you which module to study"
            body="Because the overall band is rounded, half a band in one module can move your result and half a band in another can do nothing at all. The results page works out which is which."
          />
          <Feature
            icon={<IconHeadphones />}
            title="It shows you where you lost the audio"
            body="The recording runs once. Plotting when each answer was spoken against when you actually typed it reveals whether your problem is vocabulary or recovery. They need different practice."
          />
        </div>
      </section>

      {/* ----------------------------------------------------------- two modes */}
      <section className="border-y border-border bg-bg-raised">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 lg:py-24">
          <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
            Two modes, because measuring and learning are different jobs.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
            Most platforms blur them, and the result measures nothing.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-border-strong">
                  <th className="py-3 pr-4 font-bold" />
                  <th className="py-3 pr-4 font-bold">
                    <span className="flex items-center gap-2">
                      <IconClock width={16} height={16} /> Exam mode
                    </span>
                  </th>
                  <th className="py-3 font-bold">
                    <span className="flex items-center gap-2">
                      <IconSpark width={16} height={16} /> Coach mode
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-[0.95rem]">
                {[
                  ["Timer", "Real, and enforced", "Visible, not enforced"],
                  ["Listening audio", "Plays once. No pause, no rewind", "Pause, rewind, replay a part"],
                  ["Word-limit slip", "Silently wrong, as on the day", "Warned before you commit"],
                  ["Feedback", "Only at the end", "Instantly, per question"],
                  ["Explanations", "After submission", "On demand, mid-question"],
                ].map(([k, a, b]) => (
                  <tr key={k} className="border-b border-border">
                    <th className="py-3.5 pr-4 text-left font-bold">{k}</th>
                    <td className="py-3.5 pr-4 text-text-muted">{a}</td>
                    <td className="py-3.5 text-text-muted">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- cta */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">Find out where you stand.</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-text-muted">
          One full mock takes 2 hours 45 minutes, the same as the real thing. Or start with
          a single section in thirty.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/tests" variant="accent" size="lg">
            Take a full mock test
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-raised p-6 shadow-card">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-accent-soft text-amber-700">
        {icon}
      </span>
      <h3 className="font-bold leading-snug">{title}</h3>
      <p className="mt-2.5 leading-relaxed text-text-muted">{body}</p>
    </div>
  );
}

/* A static, decorative replica of the player, so the promise on the left is visible
   rather than described. Hidden from assistive tech — it says nothing the copy doesn't. */
function PlayerMock() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-border bg-bg-raised shadow-float"
    >
      <div className="flex h-11 items-center gap-2 border-b border-border px-3">
        <span className="font-serif text-sm font-bold text-primary">
          IELTS<span className="text-accent">·</span>Practise
        </span>
        <span className="ml-auto rounded border border-accent bg-accent-soft px-2 py-0.5 text-[0.7rem] font-bold text-amber-700">
          9 minutes left
        </span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-4">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-text-subtle">
            Passage
          </p>
          <div className="font-serif text-[0.72rem] leading-[1.65] text-text-muted">
            <p className="mb-2">
              There is no theoretical limit to the number of special purposes to which
              language can be put. As society develops new facets, so language is devised to
              express them.
            </p>
            <p>
              Popular anxiety over special uses of language is most markedly seen in{" "}
              <mark className="bg-highlight px-0.5 text-text">the campaigns to promote plain speaking</mark>{" "}
              and writing.
            </p>
          </div>
        </div>

        <div className="p-4">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-text-subtle">
            Questions 27–29
          </p>
          <div className="space-y-2.5">
            {[
              { n: 27, on: true },
              { n: 28, on: false },
              { n: 29, on: false },
            ].map(({ n, on }) => (
              <div key={n} className="flex gap-2">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border text-[0.6rem] font-bold ${
                    on ? "border-primary text-primary" : "border-border text-text-subtle"
                  }`}
                >
                  {n}
                </span>
                <div className="flex-1 space-y-1.5">
                  <div className="h-1.5 w-full rounded bg-bg-sunken" />
                  <div className="h-1.5 w-3/5 rounded bg-bg-sunken" />
                  <div className="flex gap-2 pt-0.5">
                    {["TRUE", "FALSE", "NOT GIVEN"].map((t, i) => (
                      <span
                        key={t}
                        className={`flex items-center gap-1 text-[0.58rem] font-bold ${
                          on && i === 0 ? "text-text" : "text-text-subtle"
                        }`}
                      >
                        <i
                          className={`block h-2 w-2 rounded-full border ${
                            on && i === 0 ? "border-primary bg-primary" : "border-border"
                          }`}
                        />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-border px-3 py-2">
        <span className="mr-1 text-[0.65rem] font-bold">Part 3</span>
        {[27, 28, 29, 30, 31, 32, 33].map((n) => (
          <span
            key={n}
            className={`flex h-5 min-w-5 items-center justify-center px-1 text-[0.6rem] font-bold ${
              n === 30
                ? "rounded-full border border-accent bg-accent-soft text-amber-700"
                : n < 29
                  ? "rounded-sm border border-primary bg-primary text-primary-text"
                  : "rounded-sm border border-border text-text-subtle"
            }`}
          >
            {n}
          </span>
        ))}
        <span className="ml-auto text-[0.6rem] font-bold text-text-subtle">Part 1 · 13 of 13</span>
      </div>
    </div>
  );
}
