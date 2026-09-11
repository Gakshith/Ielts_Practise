/* ===========================================================================
   Academic Practice Test 1 — Listening.

   Four parts, forty questions, ten per part, numbered 1-40 across the module.

   `audioSrc` is null on every part: no recordings exist yet and inventing a
   path would make the player fail silently. The transcripts are real, timed
   scripts, so the review screen can replay the moment an answer was spoken as
   soon as audio is dropped in.

   Deliberate distractors are marked in the item explanations. A distractor
   here means a speaker giving one value and then correcting it, which is what
   the real test does and what candidates lose marks to.
   =========================================================================== */

import type { ListeningPart, WordLimit } from "@/types";

const ONE_WORD_OR_NUMBER: WordLimit = {
  maxWords: 1,
  allowNumber: true,
  label: "Write ONE WORD AND/OR A NUMBER for each answer.",
};

const TWO_WORDS: WordLimit = {
  maxWords: 2,
  allowNumber: true,
  label: "Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
};

const THREE_WORDS: WordLimit = {
  maxWords: 3,
  allowNumber: true,
  label: "Write NO MORE THAN THREE WORDS for each answer.",
};

/* ========================================================================= */
/* Part 1 — a phone call to a letting agency (two speakers, transactional)   */
/* ========================================================================= */

const part1: ListeningPart = {
  index: 1,
  context: "A telephone enquiry to a letting agency about renting a flat",
  audioSrc: null,
  durationSec: 300,
  transcript: [
    { t: 0, speaker: "Agent", text: "Good morning, Rowan Lettings — Ellie speaking. How can I help?" },
    {
      t: 7,
      speaker: "Caller",
      text: "Hello. I am ringing about a flat I saw on your website, the one on Mill Court.",
    },
    {
      t: 16,
      speaker: "Agent",
      text: "Of course. Let me take a few details first and then I can tell you what else we have. Could I start with your name?",
    },
    { t: 27, speaker: "Caller", text: "Yes — Marcus Delaney." },
    { t: 32, speaker: "Agent", text: "Marcus. And how do you spell the surname?" },
    { t: 38, speaker: "Caller", text: "D-E-L-A-N-E-Y. Delaney, with one L.", answers: [1] },
    {
      t: 47,
      speaker: "Agent",
      text: "Thank you. And what do you do for a living? The landlords always want to know.",
    },
    {
      t: 56,
      speaker: "Caller",
      text: "I trained as a nurse originally, but I have been a physiotherapist for six years now. I start at the new sports clinic in September.",
      answers: [2],
    },
    { t: 70, speaker: "Agent", text: "That is fine. And which part of town are you looking in?" },
    {
      t: 77,
      speaker: "Caller",
      text: "I assumed near the station, because of the trains — but the clinic is down by the water, so anything near the harbour would be ideal.",
      answers: [3],
    },
    { t: 91, speaker: "Agent", text: "Right. And what is your ceiling, per month?" },
    {
      t: 97,
      speaker: "Caller",
      text: "I had been saying eight hundred, but once I did the sums properly, seven hundred and eighty is the absolute maximum.",
      answers: [4],
    },
    { t: 110, speaker: "Agent", text: "Understood. Is there anything the property has to have?" },
    {
      t: 117,
      speaker: "Caller",
      text: "Parking does not matter — I do not drive. But there has to be a shed for my bicycle. I have had two stolen off the street.",
      answers: [5],
    },
    { t: 131, speaker: "Agent", text: "Noted. And when would you want to move in?" },
    {
      t: 138,
      speaker: "Caller",
      text: "The fourteenth of September — no, sorry, the twenty-fourth. The fourteenth is when the job starts.",
      answers: [6],
    },
    { t: 152, speaker: "Agent", text: "Lovely. Now, I have two properties that should suit you." },
    {
      t: 160,
      speaker: "Agent",
      text: "The first is the Mill Court flat you mentioned. One bedroom, and the rent is seven hundred and sixty a month.",
      answers: [7],
    },
    { t: 174, speaker: "Caller", text: "That is comfortably inside my budget. What is it actually like?" },
    {
      t: 182,
      speaker: "Agent",
      text: "It is small, but it has a balcony, which you almost never get at that price. South-facing, too.",
      answers: [8],
    },
    { t: 194, speaker: "Caller", text: "And when could I see it?" },
    {
      t: 199,
      speaker: "Agent",
      text: "The current tenant is there until the end of the month, so viewings are Thursday evenings only.",
    },
    {
      t: 210,
      speaker: "Agent",
      text: "The second one is on Ashby Road. That is seven hundred and ninety-five, so right at the top of your range.",
    },
    { t: 223, speaker: "Caller", text: "And viewings for that one?" },
    {
      t: 228,
      speaker: "Agent",
      text: "It is empty, so we are flexible, but the owner would rather it was a weekend. Usually Saturday.",
      answers: [9],
    },
    {
      t: 240,
      speaker: "Agent",
      text: "Oh — and Ashby Road is above a launderette. No, sorry, that is the Preston Street flat. Ashby Road is next to a bakery.",
      answers: [10],
    },
    { t: 256, speaker: "Caller", text: "Wonderful in the morning, I imagine." },
    { t: 261, speaker: "Agent", text: "Wonderful at eight. Rather less wonderful at four, when the ovens go on." },
    { t: 270, speaker: "Caller", text: "I will take both viewings, please." },
    { t: 275, speaker: "Agent", text: "I will email the confirmations this afternoon." },
  ],
  groups: [
    {
      id: "l1-form",
      type: "form-completion",
      instructions: "Complete the form below.",
      wordLimit: ONE_WORD_OR_NUMBER,
      layout: {
        kind: "form",
        title: "ROWAN LETTINGS — enquiry record",
        lines: [
          "First name: Marcus",
          "Surname: {{1}}",
          "Occupation: {{2}}",
          "Preferred area: near the {{3}}",
          "Maximum rent per month: £{{4}}",
          "Must have: a {{5}} for a bicycle",
          "Wants to move in on: {{6}} September",
        ],
      },
      items: [
        {
          n: 1,
          accept: ["delaney"],
          explanation:
            "The surname is spelled out letter by letter, so there is no excuse for a misspelling. Note the caller adds with one L — Dellaney would score zero.",
          evidence: {
            audioAt: 38,
            quote: "D-E-L-A-N-E-Y. Delaney, with one L.",
            paraphraseOf: "Surname",
          },
        },
        {
          n: 2,
          accept: ["physiotherapist", "physio"],
          explanation:
            "A distractor: the caller mentions training as a nurse before giving his current job. The form asks what he does now, so nurse is wrong. Listen for the change of tense — trained as versus have been.",
          evidence: {
            audioAt: 56,
            quote: "I trained as a nurse originally, but I have been a physiotherapist for six years now.",
            paraphraseOf: "Occupation",
          },
        },
        {
          n: 3,
          accept: ["harbour", "harbor"],
          explanation:
            "Another correction. The caller says near the station first, then rejects it because the clinic is by the water. The answer is always the value that survives the but.",
          evidence: {
            audioAt: 77,
            quote: "I assumed near the station, because of the trains — but the clinic is down by the water, so anything near the harbour would be ideal.",
            paraphraseOf: "Preferred area",
          },
        },
        {
          n: 4,
          accept: ["780", "£780"],
          explanation:
            "Eight hundred is said first and then withdrawn. The pound sign is already printed on the form, so writing £780 or 780 are both fine, but writing 800 is the trap.",
          evidence: {
            audioAt: 97,
            quote: "seven hundred and eighty is the absolute maximum",
            paraphraseOf: "Maximum rent per month",
          },
        },
        {
          n: 5,
          accept: ["shed"],
          explanation:
            "Parking is mentioned only to be dismissed, so garage or parking space would be wrong. The must-have is the shed.",
          evidence: {
            audioAt: 117,
            quote: "But there has to be a shed for my bicycle.",
            paraphraseOf: "Must have: a ... for a bicycle",
          },
        },
        {
          n: 6,
          accept: ["24", "24th", "twenty-fourth", "the 24th"],
          explanation:
            "The clearest distractor in the part: the fourteenth is said, corrected to the twenty-fourth, and then the fourteenth is given a different meaning — it is the start date of the job, not the move-in date.",
          evidence: {
            audioAt: 138,
            quote: "The fourteenth of September — no, sorry, the twenty-fourth.",
            paraphraseOf: "Wants to move in on",
          },
        },
      ],
    },
    {
      id: "l1-table",
      type: "table-completion",
      instructions: "Complete the table below.",
      wordLimit: ONE_WORD_OR_NUMBER,
      layout: {
        kind: "table",
        title: "Properties to view",
        headers: ["Property", "Rent per month", "Viewings", "Note"],
        rows: [
          ["Mill Court", "£{{7}}", "Thursday evenings", "has a {{8}}"],
          ["Ashby Road", "£795", "usually {{9}}", "next to a {{10}}"],
        ],
      },
      items: [
        {
          n: 7,
          accept: ["760", "£760"],
          explanation:
            "Seven hundred and sixty is the Mill Court rent. Seven hundred and ninety-five belongs to Ashby Road and is already printed in the table, which is the check that you are on the right row.",
          evidence: {
            audioAt: 160,
            quote: "One bedroom, and the rent is seven hundred and sixty a month.",
            paraphraseOf: "Rent per month",
          },
        },
        {
          n: 8,
          accept: ["balcony"],
          explanation:
            "The balcony is the feature singled out as unusual. South-facing describes the balcony rather than answering the question, and would not fit the grammar of has a ...",
          evidence: {
            audioAt: 182,
            quote: "It is small, but it has a balcony, which you almost never get at that price.",
            paraphraseOf: "Note: has a ...",
          },
        },
        {
          n: 9,
          accept: ["saturday", "saturdays"],
          explanation:
            "Weekend is said first, then narrowed to Saturday. The table wants the specific day, so weekend would be marked wrong.",
          evidence: {
            audioAt: 228,
            quote: "but the owner would rather it was a weekend. Usually Saturday",
            paraphraseOf: "Viewings: usually ...",
          },
        },
        {
          n: 10,
          accept: ["bakery", "baker's"],
          explanation:
            "A self-correction distractor. The agent starts with launderette, realises she is describing the Preston Street flat and corrects to bakery. Candidates who write down the first noun they hear lose this mark.",
          evidence: {
            audioAt: 240,
            quote: "No, sorry, that is the Preston Street flat. Ashby Road is next to a bakery.",
            paraphraseOf: "Note: next to a ...",
          },
        },
      ],
    },
  ],
};

/* ========================================================================= */
/* Part 2 — a talk about a restored lido (one speaker, informational)        */
/* ========================================================================= */

const part2: ListeningPart = {
  index: 2,
  context: "A talk to local residents about the reopening of a restored open-air swimming pool",
  audioSrc: null,
  durationSec: 345,
  transcript: [
    {
      t: 0,
      speaker: "Denise",
      text: "Thanks for coming, everyone. I am Denise, and I have managed the Kilvane Lido site since the restoration began. I will talk for about ten minutes and then we will walk round together.",
    },
    {
      t: 18,
      speaker: "Denise",
      text: "The lido opened in 1935 and it closed, as most of you will remember, in 1996.",
    },
    {
      t: 32,
      speaker: "Denise",
      text: "People assume it closed because nobody came any more. In fact the last full summer was one of the busiest on record. It closed because the filtration plant failed, and the council did not have the two hundred thousand pounds it would have cost to replace it.",
      answers: [11],
    },
    {
      t: 58,
      speaker: "Denise",
      text: "The restoration has cost just under one and a half million. The heritage grant gets all the attention, and it was substantial — four hundred thousand. But the largest single share came from residents, who between them raised five hundred and twenty thousand, mostly in tens and twenties.",
      answers: [12],
    },
    {
      t: 90,
      speaker: "Denise",
      text: "We have changed as little as we could. The pool is still fifty metres, still the original tiles, still the same diving boards, although those are for looking at rather than using. The one real change is that the water is now heated, to twenty-six degrees, which is why we can open from March.",
      answers: [13],
    },
    {
      t: 122,
      speaker: "Denise",
      text: "Which brings me to the thing I must ask you. We would love you to walk or cycle here, and I will come back to the bike racks in a moment. But the essential thing is that you book your slot online before you come. We cannot admit anybody who simply turns up on a Saturday afternoon — the water has a legal capacity and we have to hold to it.",
      answers: [14],
    },
    {
      t: 160,
      speaker: "Denise",
      text: "Now let me take you round the site as it will be on opening day, so that you know where everything is.",
    },
    {
      t: 172,
      speaker: "Denise",
      text: "You come in through the main gate on Fenner Street. Turn right, immediately inside the gate, and that is the changing rooms — the original 1935 block, the one with the clock on it.",
      answers: [15],
    },
    {
      t: 196,
      speaker: "Denise",
      text: "The café is at the far end, behind the diving boards — sorry, that is where the old café was, and it has gone. The new café is up on the eastern terrace, above the pool, so you can watch the swimmers while you eat.",
      answers: [16],
    },
    {
      t: 222,
      speaker: "Denise",
      text: "Directly underneath that terrace is the plant room, where the new filtration equipment lives. It is not open to the public, but we have put a window in so that you can look at it.",
      answers: [17],
    },
    {
      t: 248,
      speaker: "Denise",
      text: "The pool for toddlers is between the main gate and the shallow end — deliberately, so that parents can see it from the moment they arrive.",
      answers: [18],
    },
    {
      t: 270,
      speaker: "Denise",
      text: "First aid is on the left as you come through the gate, directly opposite the changing rooms. There is always a qualified lifeguard in there.",
      answers: [19],
    },
    {
      t: 292,
      speaker: "Denise",
      text: "And the bike racks, as promised. They are outside the gate, on the street side of the wall. We wanted them inside, but the heritage listing would not let us bolt anything to the original paving.",
      answers: [20],
    },
    {
      t: 316,
      speaker: "Denise",
      text: "Season tickets are on sale in the foyer afterwards, and the first hundred come with a very ugly free towel.",
    },
    { t: 330, speaker: "Denise", text: "Right. Shall we walk?" },
  ],
  groups: [
    {
      id: "l2-mc",
      type: "multiple-choice",
      instructions: "Choose the correct letter, A, B or C.",
      items: [
        {
          n: 11,
          prompt: "Why did the lido close in 1996?",
          options: [
            { key: "A", text: "Too few people were using it." },
            { key: "B", text: "The council could not pay for essential equipment." },
            { key: "C", text: "The structure of the pool was unsafe." },
          ],
          accept: ["b"],
          explanation:
            "Denise raises A herself in order to knock it down — the last summer was one of the busiest. The stated cause is the two hundred thousand pounds the council did not have for a new filtration plant.",
          evidence: {
            audioAt: 32,
            quote:
              "It closed because the filtration plant failed, and the council did not have the two hundred thousand pounds it would have cost to replace it.",
            paraphraseOf: "could not pay for essential equipment",
          },
        },
        {
          n: 12,
          prompt: "Where did the largest part of the restoration money come from?",
          options: [
            { key: "A", text: "a heritage grant" },
            { key: "B", text: "people living in the area" },
            { key: "C", text: "a loan from the council" },
          ],
          accept: ["b"],
          explanation:
            "The heritage grant is mentioned first and given a big number, which is the trap. Residents raised five hundred and twenty thousand against the grant's four hundred thousand, and Denise says explicitly that theirs was the largest single share.",
          evidence: {
            audioAt: 58,
            quote:
              "But the largest single share came from residents, who between them raised five hundred and twenty thousand",
            paraphraseOf: "people living in the area",
          },
        },
        {
          n: 13,
          prompt: "What is the one significant change to the pool itself?",
          options: [
            { key: "A", text: "It is longer than it used to be." },
            { key: "B", text: "The water is now warmed." },
            { key: "C", text: "The diving boards have been removed." },
          ],
          accept: ["b"],
          explanation:
            "Fifty metres and the diving boards are both mentioned as things that have not changed, which makes A and C tempting if you hear the nouns without the negatives. The one real change is heating.",
          evidence: {
            audioAt: 90,
            quote: "The one real change is that the water is now heated, to twenty-six degrees",
            paraphraseOf: "The water is now warmed",
          },
        },
        {
          n: 14,
          prompt: "What does Denise say visitors must do?",
          options: [
            { key: "A", text: "reserve a place in advance" },
            { key: "B", text: "bring their own towel" },
            { key: "C", text: "travel to the lido on foot or by bicycle" },
          ],
          accept: ["a"],
          explanation:
            "C is the distractor: she says she would love people to walk or cycle, which is a preference, not a requirement. The words that mark the answer are the essential thing is.",
          evidence: {
            audioAt: 122,
            quote: "But the essential thing is that you book your slot online before you come.",
            paraphraseOf: "reserve a place in advance",
          },
        },
      ],
    },
    {
      id: "l2-map",
      type: "map-labelling",
      instructions:
        "Label the plan of the lido. Write the name of the facility that is in each position described below.",
      heading: "Plan of Kilvane Lido",
      wordLimit: ONE_WORD_OR_NUMBER,
      items: [
        {
          n: 15,
          prompt: "Immediately to the right as you come through the main gate: the {{15}} rooms",
          accept: ["changing"],
          explanation:
            "Right inside the gate is the changing rooms. The first-aid point is on the left of the same gate, so left and right is the only thing separating questions 15 and 19.",
          evidence: {
            audioAt: 172,
            quote: "Turn right, immediately inside the gate, and that is the changing rooms",
            paraphraseOf: "Immediately to the right as you come through the main gate",
          },
        },
        {
          n: 16,
          prompt: "Up on the eastern terrace, above the pool: the {{16}}",
          accept: ["cafe", "café", "new cafe", "new café"],
          explanation:
            "A correction distractor. Denise first places the café at the far end behind the diving boards, then says that was the old one and it has gone. The new café is on the eastern terrace.",
          evidence: {
            audioAt: 196,
            quote: "The new café is up on the eastern terrace, above the pool",
            paraphraseOf: "Up on the eastern terrace, above the pool",
          },
        },
        {
          n: 17,
          prompt: "Directly underneath the eastern terrace: the {{17}} room",
          accept: ["plant", "filtration"],
          explanation:
            "The plant room holds the filtration equipment and sits under the terrace, which makes it the floor below the café.",
          evidence: {
            audioAt: 222,
            quote: "Directly underneath that terrace is the plant room, where the new filtration equipment lives.",
            paraphraseOf: "Directly underneath the eastern terrace",
          },
        },
        {
          n: 18,
          prompt: "Between the main gate and the shallow end of the pool: the pool for {{18}}",
          accept: ["toddlers", "toddler", "children"],
          explanation:
            "The position is given first and the reason second. Between the gate and the shallow end is the only place described that way in the whole talk.",
          evidence: {
            audioAt: 248,
            quote: "The pool for toddlers is between the main gate and the shallow end",
            paraphraseOf: "Between the main gate and the shallow end of the pool",
          },
        },
        {
          n: 19,
          prompt: "On the left as you come through the main gate: the {{19}} aid point",
          accept: ["first"],
          explanation:
            "First aid is opposite the changing rooms, on the left of the gate. If you wrote changing here you have mirrored the site plan.",
          evidence: {
            audioAt: 270,
            quote: "First aid is on the left as you come through the gate, directly opposite the changing rooms.",
            paraphraseOf: "On the left as you come through the main gate",
          },
        },
        {
          n: 20,
          prompt: "Outside the gate, on the street side of the wall: the {{20}} racks",
          accept: ["bike", "bicycle", "cycle"],
          explanation:
            "The racks are the one facility outside the wall, because the heritage listing forbids bolting anything to the original paving inside.",
          evidence: {
            audioAt: 292,
            quote: "They are outside the gate, on the street side of the wall.",
            paraphraseOf: "Outside the gate, on the street side of the wall",
          },
        },
      ],
    },
  ],
};

/* ========================================================================= */
/* Part 3 — two students discuss a field report (educational discussion)     */
/* ========================================================================= */

const part3: ListeningPart = {
  index: 3,
  context: "Two geography students discuss their field report on a restored urban river",
  audioSrc: null,
  durationSec: 380,
  transcript: [
    { t: 0, speaker: "Priya", text: "Sam — have you had a chance to look at the data from the River Lench?" },
    {
      t: 8,
      speaker: "Sam",
      text: "I have been through all of it. Honestly, the thing that surprised me was how far the invertebrate count jumped.",
    },
    {
      t: 18,
      speaker: "Priya",
      text: "That did not surprise me at all — every textbook says colonisation is fast once the concrete comes out. What I could not get over was the chemistry. Nitrates, phosphates, dissolved oxygen: after two years of restoration they have barely moved.",
      answers: [21],
    },
    {
      t: 40,
      speaker: "Sam",
      text: "That is a real finding, though. It says the problem is not in the channel at all, it is upstream.",
    },
    { t: 50, speaker: "Priya", text: "Which is exactly what I want to argue." },
    { t: 55, speaker: "Sam", text: "By the way, those photographs I took have turned out to matter." },
    {
      t: 62,
      speaker: "Priya",
      text: "The ones on your phone? I thought you only took them so you would remember which visit was which.",
    },
    {
      t: 70,
      speaker: "Sam",
      text: "I did. But when we came to write the method up we realised we had no record of exactly which bank each sample came from, and the photographs are the only evidence of that. Pure luck.",
      answers: [22],
    },
    {
      t: 88,
      speaker: "Priya",
      text: "We should say that in the report, rather than pretend it was planned.",
    },
    {
      t: 95,
      speaker: "Sam",
      text: "Agreed. Which brings us to week four. We simply do not have those readings.",
    },
    { t: 104, speaker: "Priya", text: "Could we not use the council's figures for that week?" },
    {
      t: 110,
      speaker: "Sam",
      text: "I looked. They measure a different thing — turbidity, not suspended solids — so putting them in the same series would be dishonest. I think we just state that week four is missing and say why.",
      answers: [23],
    },
    { t: 128, speaker: "Priya", text: "Fine. That is better than a gap nobody explains." },
    { t: 134, speaker: "Sam", text: "And what did Dr Whitlock say about the draft?" },
    {
      t: 140,
      speaker: "Priya",
      text: "She liked the literature review, which I did not expect, and she said the maps were the clearest she had seen this year. Her one criticism was that we never explain why we chose kick sampling rather than any other method. She wants that justification spelled out.",
      answers: [24],
    },
    { t: 162, speaker: "Sam", text: "That is fair. Right — the three sites. Weir Bridge first." },
    {
      t: 170,
      speaker: "Priya",
      text: "Weir Bridge is the odd one. It is the shallowest stretch and it has no shade at all, and the water there was the warmest we recorded anywhere — nearly nineteen degrees in July.",
      answers: [25],
    },
    { t: 188, speaker: "Sam", text: "Then Dalton Reach. That is the one where they rebuilt the bank." },
    {
      t: 196,
      speaker: "Priya",
      text: "And the new bank is already coming apart. You can see where the gravel has been cut away on the outside of the bend. I would call that visible erosion.",
      answers: [26],
    },
    { t: 212, speaker: "Sam", text: "Which we should flag, because it is only eighteen months old." },
    { t: 218, speaker: "Priya", text: "And the culvert outfall?" },
    {
      t: 222,
      speaker: "Sam",
      text: "Nothing. Genuinely nothing. Every reading at the outfall is within noise of the very first survey — no measurable change at all.",
      answers: [27],
    },
    { t: 236, speaker: "Priya", text: "Which is itself worth saying." },
    { t: 241, speaker: "Sam", text: "Now, how are we presenting the flow figures? Not another line graph." },
    {
      t: 250,
      speaker: "Priya",
      text: "No. There is far too much spread. I think a box plot for each site — it shows the range and the outliers in one picture.",
      answers: [28],
    },
    { t: 264, speaker: "Sam", text: "Good. And who writes what?" },
    {
      t: 269,
      speaker: "Priya",
      text: "You have all the fieldwork notes, so you should write the methods section. I will do the results and we can draft the discussion together.",
      answers: [29],
    },
    { t: 283, speaker: "Sam", text: "Fine. Anything to read before Thursday?" },
    {
      t: 289,
      speaker: "Priya",
      text: "Dr Whitlock said to read the Ferris chapter on sediment transport before the next tutorial. Apparently it explains the Dalton Reach erosion.",
      answers: [30],
    },
    { t: 304, speaker: "Sam", text: "I will get it out of the library this afternoon." },
  ],
  groups: [
    {
      id: "l3-mc",
      type: "multiple-choice",
      instructions: "Choose the correct letter, A, B or C.",
      items: [
        {
          n: 21,
          prompt: "What does Priya find most surprising about the results?",
          options: [
            { key: "A", text: "how quickly the invertebrates returned" },
            { key: "B", text: "how little the water chemistry has changed" },
            { key: "C", text: "how much the flow readings vary" },
          ],
          accept: ["b"],
          explanation:
            "A is Sam's reaction, not Priya's — she says it did not surprise her at all. The question names Priya, so the answer has to come from her turn.",
          evidence: {
            audioAt: 18,
            quote:
              "What I could not get over was the chemistry. Nitrates, phosphates, dissolved oxygen: after two years of restoration they have barely moved.",
            paraphraseOf: "how little the water chemistry has changed",
          },
        },
        {
          n: 22,
          prompt: "Why have Sam's photographs turned out to be valuable?",
          options: [
            { key: "A", text: "They show how the site changed between visits." },
            { key: "B", text: "They record which bank each sample came from." },
            { key: "C", text: "They document the weather on each visit." },
          ],
          accept: ["b"],
          explanation:
            "A is why Sam took them, which is a different question from why they matter now. The value is that they are the only record of sample position.",
          evidence: {
            audioAt: 70,
            quote:
              "we had no record of exactly which bank each sample came from, and the photographs are the only evidence of that",
            paraphraseOf: "record which bank each sample came from",
          },
        },
        {
          n: 23,
          prompt: "What do the students decide to do about the missing week four data?",
          options: [
            { key: "A", text: "take the measurements again" },
            { key: "B", text: "substitute figures published by the council" },
            { key: "C", text: "explain the gap in the report" },
          ],
          accept: ["c"],
          explanation:
            "B is raised by Priya and then rejected by Sam, because the council measures turbidity rather than suspended solids. The decision is to state the gap and give the reason.",
          evidence: {
            audioAt: 110,
            quote: "I think we just state that week four is missing and say why.",
            paraphraseOf: "explain the gap in the report",
          },
        },
        {
          n: 24,
          prompt: "What does Dr Whitlock want the students to improve?",
          options: [
            { key: "A", text: "the literature review" },
            { key: "B", text: "the maps" },
            { key: "C", text: "the reason given for their sampling method" },
          ],
          accept: ["c"],
          explanation:
            "The literature review and the maps are both praised, so hearing those nouns is not enough. Her one criticism is the missing justification for kick sampling.",
          evidence: {
            audioAt: 140,
            quote:
              "Her one criticism was that we never explain why we chose kick sampling rather than any other method.",
            paraphraseOf: "the reason given for their sampling method",
          },
        },
      ],
    },
    {
      id: "l3-features",
      type: "matching-features",
      instructions:
        "What does each student say about the three study sites? Choose your answers from the box and write the correct letter, A-E, next to questions 25-27.",
      heading: "Findings",
      options: [
        { key: "A", text: "the widest range of invertebrate species" },
        { key: "B", text: "visible erosion of a rebuilt bank" },
        { key: "C", text: "no measurable change since the first survey" },
        { key: "D", text: "the highest water temperature recorded" },
        { key: "E", text: "signs of illegal dumping" },
      ],
      items: [
        {
          n: 25,
          prompt: "Weir Bridge",
          accept: ["d"],
          explanation:
            "Shallow and unshaded, and the warmest water recorded anywhere on the river. Nothing is said about species range here, so A is a guess rather than an answer.",
          evidence: {
            audioAt: 170,
            quote: "the water there was the warmest we recorded anywhere — nearly nineteen degrees in July",
            paraphraseOf: "the highest water temperature recorded",
          },
        },
        {
          n: 26,
          prompt: "Dalton Reach",
          accept: ["b"],
          explanation:
            "Priya names it herself: visible erosion of the bank that was rebuilt eighteen months ago.",
          evidence: {
            audioAt: 196,
            quote: "I would call that visible erosion.",
            paraphraseOf: "visible erosion of a rebuilt bank",
          },
        },
        {
          n: 27,
          prompt: "the culvert outfall",
          accept: ["c"],
          explanation:
            "Within noise of the very first survey is a paraphrase of no measurable change. Nothing here is a finding, not an absence of one, which is why the students still report it.",
          evidence: {
            audioAt: 222,
            quote: "Every reading at the outfall is within noise of the very first survey — no measurable change at all.",
            paraphraseOf: "no measurable change since the first survey",
          },
        },
      ],
    },
    {
      id: "l3-sentence",
      type: "sentence-completion",
      instructions: "Complete the sentences below.",
      wordLimit: TWO_WORDS,
      items: [
        {
          n: 28,
          prompt: "Priya suggests showing the flow figures for each site as a",
          accept: ["box plot", "boxplot", "box plots", "box-plot"],
          explanation:
            "Sam rules out a line graph before Priya proposes the box plot, so the rejected form is said first. Two words are allowed, which box plot uses exactly.",
          evidence: {
            audioAt: 250,
            quote: "I think a box plot for each site — it shows the range and the outliers in one picture.",
            paraphraseOf: "showing the flow figures for each site as a",
          },
        },
        {
          n: 29,
          prompt: "Sam is going to write the",
          accept: ["methods", "method", "methods section", "method section"],
          explanation:
            "Priya assigns methods to Sam because he holds the fieldwork notes; she takes the results herself. Writing results here means you have attached the section to the wrong student.",
          evidence: {
            audioAt: 269,
            quote: "so you should write the methods section",
            paraphraseOf: "Sam is going to write the",
          },
        },
        {
          n: 30,
          prompt: "Before the next tutorial they must read a chapter on",
          accept: ["sediment transport"],
          explanation:
            "Ferris is the author, not the topic, so Ferris chapter answers a different question. The chapter is on sediment transport.",
          evidence: {
            audioAt: 289,
            quote: "read the Ferris chapter on sediment transport before the next tutorial",
            paraphraseOf: "Before the next tutorial they must read a chapter on",
          },
        },
      ],
    },
  ],
};

/* ========================================================================= */
/* Part 4 — an academic lecture (one speaker, monologue)                     */
/* ========================================================================= */

const part4: ListeningPart = {
  index: 4,
  context: "A lecture on the acoustics of concert halls",
  audioSrc: null,
  durationSec: 360,
  transcript: [
    {
      t: 0,
      speaker: "Lecturer",
      text: "Good morning. Today I want to look at why some rooms make an orchestra sound magnificent and others make the same orchestra sound as though it is playing inside a cupboard.",
    },
    {
      t: 16,
      speaker: "Lecturer",
      text: "The single number that dominates this field is reverberation time. The definition is precise: reverberation time is the number of seconds a sound takes to fall by sixty decibels — that is, to one millionth of its original energy.",
      answers: [31],
    },
    {
      t: 40,
      speaker: "Lecturer",
      text: "Different music wants different values. Speech wants something under a second, so that one word does not smear into the next. A symphony orchestra sounds best at about two seconds, and the great nineteenth-century halls all cluster close to that figure.",
      answers: [32],
    },
    {
      t: 64,
      speaker: "Lecturer",
      text: "Too long, and the detail disappears into a wash of sound. Too short, and the hall is what musicians call dry — every note is clear, and the whole thing sounds thin and unforgiving. Players dislike dry halls intensely.",
      answers: [33],
    },
    {
      t: 86,
      speaker: "Lecturer",
      text: "The formula that gives us reverberation time was worked out by Wallace Sabine in the eighteen-nineties. Sabine established, purely by measurement, that reverberation time is proportional to the volume of the room divided by the total absorption of its surfaces.",
      answers: [34],
    },
    {
      t: 114,
      speaker: "Lecturer",
      text: "And this was done without a single electronic instrument. No microphones, no oscilloscope. He used an organ pipe, a stopwatch and his own ears, working at night when the building was quiet, over several years.",
    },
    {
      t: 138,
      speaker: "Lecturer",
      text: "The pay-off came in nineteen hundred, when Sabine was asked to advise on a new hall in the American city of Boston. Symphony Hall was the first auditorium anywhere designed from an acoustic calculation rather than from a guess, and it is still among the three or four best in the world.",
      answers: [35],
    },
    { t: 166, speaker: "Lecturer", text: "So much for time. Now shape, which is where the argument still is." },
    {
      t: 176,
      speaker: "Lecturer",
      text: "The traditional plan is narrow, high and rectangular — what everybody calls the shoebox design. Vienna, Amsterdam, Boston: all shoeboxes, and all built before anyone understood why they worked.",
      answers: [36],
    },
    {
      t: 196,
      speaker: "Lecturer",
      text: "What we now think is that the narrowness is the whole point. In a narrow hall the sound bounces off the side walls and reaches you from the sides, a fraction of a second after the sound that comes straight from the platform. Reflections arriving from the sides are what make a listener feel surrounded by the music rather than looking at it through a window.",
      answers: [37],
    },
    {
      t: 226,
      speaker: "Lecturer",
      text: "This explains the great failure of mid-century design. In the nineteen-fifties architects widened halls into a fan shape so that every seat faced the platform. The sight lines were superb. But a fan-shaped hall has no side walls close enough to be useful, so the lateral reflections are largely lost and the sound is flat.",
      answers: [38],
    },
    {
      t: 258,
      speaker: "Lecturer",
      text: "The alternative, and the one most new halls now follow, is the vineyard. Berlin in nineteen sixty-three was the first of them. The audience is not in one block facing the stage; it sits in terraces stepping down towards the platform from every side.",
    },
    {
      t: 278,
      speaker: "Lecturer",
      text: "And the terraces are separated by low walls. Those walls are not decoration. Each one is a reflecting surface, angled to throw sound sideways into the block behind it — the vineyard's way of manufacturing the side reflections that a shoebox gets free from its side walls.",
      answers: [39],
    },
    {
      t: 306,
      speaker: "Lecturer",
      text: "One last thing, and it is the fact that surprises students most. The largest absorber of sound in any hall is not the carpet and it is not the curtains. It is the audience. A full house can shorten reverberation time by half a second, which is why halls are tuned with the seats assumed occupied, and why an empty rehearsal never sounds like the concert.",
      answers: [40],
    },
    { t: 336, speaker: "Lecturer", text: "Next week: why almost none of this applies to amplified music." },
  ],
  groups: [
    {
      id: "l4-notes",
      type: "note-completion",
      instructions: "Complete the notes below.",
      wordLimit: ONE_WORD_OR_NUMBER,
      layout: {
        kind: "note",
        title: "THE ACOUSTICS OF CONCERT HALLS",
        lines: [
          "Reverberation time (RT)",
          "• RT = the time a sound takes to fall by sixty {{31}}",
          "• best value for a symphony orchestra: about {{32}} seconds",
          "• if the RT is too short, musicians call the hall {{33}}",
          "",
          "Sabine's formula",
          "• RT depends on the volume of the room divided by the total {{34}} of its surfaces",
          "• Sabine's first calculated hall was built in the American city of {{35}}",
          "",
          "Hall shapes",
          "• the traditional narrow rectangular plan is known as the {{36}} design",
          "• a listener feels surrounded when reflections reach the ears from the {{37}}",
        ],
      },
      items: [
        {
          n: 31,
          accept: ["decibels", "decibel", "db"],
          explanation:
            "Sixty is already printed in the notes, so the blank is the unit. One millionth of its original energy is the same fact expressed differently and is not what the gap needs.",
          evidence: {
            audioAt: 16,
            quote: "reverberation time is the number of seconds a sound takes to fall by sixty decibels",
            paraphraseOf: "the time a sound takes to fall by sixty",
          },
        },
        {
          n: 32,
          accept: ["two", "2"],
          explanation:
            "Under a second belongs to speech, which is mentioned first. The orchestral figure is about two seconds.",
          evidence: {
            audioAt: 40,
            quote: "A symphony orchestra sounds best at about two seconds",
            paraphraseOf: "best value for a symphony orchestra",
          },
        },
        {
          n: 33,
          accept: ["dry"],
          explanation:
            "Too long and too short are described in the same breath, so the order matters: the word attached to too short is dry.",
          evidence: {
            audioAt: 64,
            quote: "Too short, and the hall is what musicians call dry",
            paraphraseOf: "if the RT is too short, musicians call the hall",
          },
        },
        {
          n: 34,
          accept: ["absorption"],
          explanation:
            "Volume is already given in the note, so the missing half of the ratio is absorption. Surfaces is the noun immediately after the gap and cannot be the answer.",
          evidence: {
            audioAt: 86,
            quote:
              "reverberation time is proportional to the volume of the room divided by the total absorption of its surfaces",
            paraphraseOf: "the volume of the room divided by the total",
          },
        },
        {
          n: 35,
          accept: ["boston"],
          explanation:
            "The note asks for the city, not the hall, so Symphony Hall is the wrong grain. Boston also appears later in the list of shoeboxes, which confirms it.",
          evidence: {
            audioAt: 138,
            quote: "Sabine was asked to advise on a new hall in the American city of Boston",
            paraphraseOf: "built in the American city of",
          },
        },
        {
          n: 36,
          accept: ["shoebox", "shoe-box"],
          explanation:
            "Shoebox is one word, so it fits the limit. Narrow and rectangular are both already printed in the note, which is the usual signal that they are not the answer.",
          evidence: {
            audioAt: 176,
            quote: "The traditional plan is narrow, high and rectangular — what everybody calls the shoebox design.",
            paraphraseOf: "the traditional narrow rectangular plan is known as the",
          },
        },
        {
          n: 37,
          accept: ["sides", "side"],
          explanation:
            "The lecturer says reflections arriving from the sides create the feeling of being surrounded. Side walls would be two words and would not fit after from the.",
          evidence: {
            audioAt: 196,
            quote:
              "Reflections arriving from the sides are what make a listener feel surrounded by the music rather than looking at it through a window.",
            paraphraseOf: "a listener feels surrounded when reflections reach the ears from the",
          },
        },
      ],
    },
    {
      id: "l4-short",
      type: "short-answer",
      instructions: "Answer the questions below.",
      wordLimit: THREE_WORDS,
      items: [
        {
          n: 38,
          prompt: "In a fan-shaped hall, which kind of reflection is largely lost?",
          accept: ["lateral reflections", "lateral", "side reflections", "the lateral reflections"],
          explanation:
            "A fan shape puts the side walls too far away, so it is the lateral reflections that disappear. Sight lines are what a fan shape improves, not what it loses.",
          evidence: {
            audioAt: 226,
            quote: "so the lateral reflections are largely lost and the sound is flat",
            paraphraseOf: "which kind of reflection is largely lost",
          },
        },
        {
          n: 39,
          prompt: "What separates the seating terraces in a vineyard hall?",
          accept: ["low walls", "walls", "the low walls"],
          explanation:
            "The low walls are not decorative: each is angled to throw sound sideways, doing the job a shoebox gets free from its side walls.",
          evidence: {
            audioAt: 278,
            quote: "And the terraces are separated by low walls.",
            paraphraseOf: "What separates the seating terraces in a vineyard hall",
          },
        },
        {
          n: 40,
          prompt: "What absorbs more sound than anything else in a hall?",
          accept: ["the audience", "audience", "the people"],
          explanation:
            "Carpet and curtains are both named and then dismissed in the same sentence, which is the trap. A full house can cut reverberation time by half a second.",
          evidence: {
            audioAt: 306,
            quote: "The largest absorber of sound in any hall is not the carpet and it is not the curtains. It is the audience.",
            paraphraseOf: "What absorbs more sound than anything else in a hall",
          },
        },
      ],
    },
  ],
};

export const listening: { parts: ListeningPart[] } = {
  parts: [part1, part2, part3, part4],
};
