/* ===========================================================================
   The paper registry. Adding a test means adding a file here and one entry in
   `papers` — no component ever changes.
   =========================================================================== */

import type { TestPaper } from "@/types";
import { academic01 } from "./academic-01";

export { academic01 };

export const papers: TestPaper[] = [academic01];

export function getPaper(id: string): TestPaper | undefined {
  return papers.find((paper) => paper.id === id);
}
