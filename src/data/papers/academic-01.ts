/* ===========================================================================
   Academic Practice Test 1.

   `placeholder` is true: the Reading passages and Listening transcripts are
   original prose written for this app, and no audio exists yet. The UI must
   label the paper honestly until real material replaces it.
   =========================================================================== */

import type { TestPaper } from "@/types";
import { listening } from "./academic-01.listening";
import { reading } from "./academic-01.reading";
import { speaking, writing } from "./academic-01.productive";

export const academic01: TestPaper = {
  id: "academic-01",
  title: "Academic Practice Test 1",
  kind: "academic",
  placeholder: true,
  listening,
  reading,
  writing,
  speaking,
};
