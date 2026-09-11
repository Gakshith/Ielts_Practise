"use client";

import type { ReadingPassage } from "@/types";
import { QuestionGroupView, type AnswerApi } from "@/components/questions/QuestionGroupView";
import { PassageView } from "./PassageView";
import { SplitPane } from "./SplitPane";

export function ReadingView({
  passage,
  api,
  highlights,
  onHighlight,
}: {
  passage: ReadingPassage;
  api: AnswerApi;
  highlights: string[];
  onHighlight: (text: string) => void;
}) {
  return (
    <SplitPane
      left={
        <PassageView
          title={passage.title}
          subtitle={passage.subtitle}
          blurb={passage.blurb}
          paragraphs={passage.paragraphs}
          highlighted={highlights}
          onHighlight={onHighlight}
        />
      }
      right={
        <div className="px-6 py-6 lg:px-8">
          {passage.groups.map((g) => (
            <QuestionGroupView key={g.id} group={g} api={api} />
          ))}
        </div>
      }
    />
  );
}
