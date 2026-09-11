/* ===========================================================================
   Academic Practice Test 1 — Reading.

   Three passages, forty questions, numbered 1-40 across the module.
   All prose here is original, written for this app. Passage 1 is the easiest
   and Passage 3 the hardest, matching the real Academic paper's gradient.

   Every item carries `evidence.quote`, and every quote is a VERBATIM substring
   of the paragraph it cites. The review screen highlights it, so a typo here
   is a visible bug.
   =========================================================================== */

import type { ReadingPassage, WordLimit } from "@/types";

const TWO_WORDS_FROM_PASSAGE: WordLimit = {
  maxWords: 2,
  allowNumber: true,
  label: "Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
};

const THREE_WORDS_FROM_PASSAGE: WordLimit = {
  maxWords: 3,
  allowNumber: true,
  label: "Choose NO MORE THAN THREE WORDS from the passage for each answer.",
};

/* ========================================================================= */
/* Passage 1 — The Return of the Night Train                                 */
/* ========================================================================= */

const P1_1 =
  "For most of the twentieth century the sleeper train was the ordinary way to cross a continent. A traveller boarded in the evening, ate in a dining car and woke up in another country. Then the cheap airline arrived. Between 1995 and 2015 European rail operators withdrew night services at a remarkable rate, and Germany's national carrier abandoned its entire sleeper network in 2016, selling or scrapping the carriages. The obituaries were written. Yet within five years the night train was back, and the reason had less to do with nostalgia than with arithmetic.";

const P1_2 =
  "The arithmetic is climatic. A passenger flying from Paris to Vienna is responsible for roughly six times the carbon emissions of the same passenger making the journey by rail. As governments began attaching numbers to their climate commitments, that ratio became politically awkward. France went furthest, banning domestic flights on routes where a train could do the journey in under two and a half hours. Austria took a different path and invested directly in rolling stock: its state operator now runs the Nightjet brand across a dozen countries, and orders for new carriages have been placed through to the end of the decade.";

const P1_3 =
  "Passengers, however, do not buy tickets because of emissions data. They buy them because the night train solves a problem that aviation created. A short flight consumes a working day at both ends — the journey out to the airport, the security queue, the wait, the journey in from the airport at the other end. A sleeper consumes a night that would have been spent in a hotel anyway. Operators have learned to sell this saving explicitly, quoting the price of the ticket against the combined cost of a flight and a night's accommodation.";

const P1_4 =
  "That pitch has attracted operators who are not railways at all. European Sleeper, founded by two enthusiasts in Belgium and funded partly by a crowdfunding campaign, ran its first service from Brussels to Prague in 2023 using second-hand carriages bought from other networks. Its founders have been candid that the venture is marginal: the margins are thin, the carriages are old, and a single mechanical failure can wipe out a month of profit. What they have proved is that the demand exists.";

const P1_5 =
  "The economics remain unforgiving. A sleeping car carries perhaps thirty passengers where a seated carriage carries eighty, and it earns money for one journey a day rather than four or five. Staff must be paid to stay awake while the passengers sleep. Track access charges, which most European networks levy per kilometre, fall due whether the train is full or empty, and night paths are often the ones reserved for freight and maintenance. Industry analysts estimate that a night service needs an occupancy rate above seventy per cent simply to cover its costs, a threshold that daytime intercity trains clear comfortably.";

const P1_6 =
  "Designers have responded by rethinking what a sleeping compartment is. The newest Nightjet carriages contain individual pods — sealed cabins barely larger than the bed inside them, each with a door that locks, a window and a socket. A pod occupies the floor space of a single seat and sells at a price between a couchette and a private cabin. Early figures suggest the pods fill first, which tells operators something they had not expected: the scarce commodity on a night train is not comfort but privacy.";

const P1_7 =
  "The remaining obstacles are administrative rather than technical. A train crossing four borders must satisfy four signalling systems, four sets of safety rules and, in several cases, four different electrical supplies. Ticketing is worse. There is no European equivalent of the airline booking systems that let a traveller buy a single ticket across a dozen carriers, and a passenger assembling a route from Copenhagen to Rome may need to visit three websites and hold three separate contracts, none of which protects them if the first train is late.";

const P1_8 =
  "None of this is insoluble. A European regulation now obliges operators to offer through-tickets on certain routes, and a handful of start-ups have built booking platforms that hide the complexity from the customer. What the night train needs is not a technological breakthrough but the patient, unglamorous work of making a nineteenth-century network behave like a single system. The carriages, at least, are being built again.";

const passage1: ReadingPassage = {
  index: 1,
  title: "The Return of the Night Train",
  subtitle: "Written off twenty years ago, the European sleeper is being ordered by the trainload",
  blurb: "You should spend about 20 minutes on Questions 1-13, which are based on the passage below.",
  paragraphs: [
    { text: P1_1 },
    { text: P1_2 },
    { text: P1_3 },
    { text: P1_4 },
    { text: P1_5 },
    { text: P1_6 },
    { text: P1_7 },
    { text: P1_8 },
  ],
  groups: [
    {
      id: "r1-tfng",
      type: "true-false-notgiven",
      instructions:
        "Do the following statements agree with the information given in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.",
      items: [
        {
          n: 1,
          prompt: "Germany's national rail operator had given up its sleeper services before 2016.",
          accept: ["false"],
          explanation:
            "The passage dates the withdrawal to 2016 itself, not to an earlier year, so the statement contradicts the text. This is FALSE rather than NOT GIVEN because the passage does supply a date — it simply is not the one in the statement.",
          evidence: {
            paragraph: "1",
            quote: "Germany's national carrier abandoned its entire sleeper network in 2016",
            paraphraseOf: "had given up its sleeper services before 2016",
          },
        },
        {
          n: 2,
          prompt:
            "Flying from Paris to Vienna produces about six times as much carbon as travelling by train.",
          accept: ["true"],
          explanation:
            "The passage gives exactly this ratio for exactly this city pair. Nothing in the statement goes beyond what the text says, so it is TRUE.",
          evidence: {
            paragraph: "2",
            quote:
              "A passenger flying from Paris to Vienna is responsible for roughly six times the carbon emissions of the same passenger making the journey by rail.",
            paraphraseOf: "produces about six times as much carbon as travelling by train",
          },
        },
        {
          n: 3,
          prompt: "France has prohibited all flights within its own borders.",
          accept: ["false"],
          explanation:
            "The ban is limited to routes where the train takes under two and a half hours, so a blanket prohibition is contradicted. The word that decides the item is all.",
          evidence: {
            paragraph: "2",
            quote:
              "banning domestic flights on routes where a train could do the journey in under two and a half hours",
            paraphraseOf: "prohibited all flights within its own borders",
          },
        },
        {
          n: 4,
          prompt: "Austria's spending on new sleeper carriages has been criticised by its auditors.",
          accept: ["not given", "notgiven", "ng"],
          explanation:
            "The passage confirms that Austria has ordered new carriages, but says nothing at all about auditors or criticism. Because the text is silent rather than contradicting, the answer is NOT GIVEN — the classic trap is to choose FALSE simply because the criticism is not mentioned.",
          evidence: {
            paragraph: "2",
            quote:
              "orders for new carriages have been placed through to the end of the decade",
            paraphraseOf: "Austria's spending on new sleeper carriages",
          },
        },
        {
          n: 5,
          prompt: "A night train has to fill more than seventy per cent of its places to break even.",
          accept: ["true"],
          explanation:
            "Above seventy per cent and more than seventy per cent say the same thing, and cover its costs is break even. A straight paraphrase, so TRUE.",
          evidence: {
            paragraph: "5",
            quote:
              "a night service needs an occupancy rate above seventy per cent simply to cover its costs",
            paraphraseOf: "fill more than seventy per cent of its places to break even",
          },
        },
      ],
    },
    {
      id: "r1-mc",
      type: "multiple-choice",
      instructions: "Choose the correct letter, A, B, C or D.",
      items: [
        {
          n: 6,
          prompt: "According to the passage, why do travellers actually choose the night train?",
          options: [
            { key: "A", text: "It costs less than any other way of making the journey." },
            { key: "B", text: "It does not use up hours of the working day at either end." },
            { key: "C", text: "It produces far lower emissions than flying does." },
            { key: "D", text: "It is more comfortable than staying in a hotel." },
          ],
          accept: ["b"],
          explanation:
            "The passage lists the airport journey, the queue and the wait as the cost of flying, and says the sleeper uses a night instead. C is true of night trains but is ruled out by the first sentence of the same paragraph, which says passengers do not buy tickets because of emissions data.",
          evidence: {
            paragraph: "3",
            quote:
              "A short flight consumes a working day at both ends — the journey out to the airport, the security queue, the wait, the journey in from the airport at the other end.",
            paraphraseOf: "does not use up hours of the working day at either end",
          },
        },
        {
          n: 7,
          prompt: "What does the writer report about European Sleeper?",
          options: [
            { key: "A", text: "It was established by an existing national railway." },
            { key: "B", text: "It runs entirely new rolling stock." },
            { key: "C", text: "Its founders accept that it makes very little money." },
            { key: "D", text: "It has grown quickly since it began operating." },
          ],
          accept: ["c"],
          explanation:
            "The founders are described as candid that the margins are thin. B is contradicted by second-hand carriages and A by founded by two enthusiasts, while D is never claimed.",
          evidence: {
            paragraph: "4",
            quote:
              "Its founders have been candid that the venture is marginal: the margins are thin, the carriages are old, and a single mechanical failure can wipe out a month of profit.",
            paraphraseOf: "accept that it makes very little money",
          },
        },
        {
          n: 8,
          prompt: "What do the early sales figures for sleeping pods suggest to operators?",
          options: [
            { key: "A", text: "Passengers will pay extra for more space." },
            { key: "B", text: "Passengers want to be alone more than they want comfort." },
            { key: "C", text: "Pods are cheaper to build than ordinary couchettes." },
            { key: "D", text: "Pods do not appeal to people travelling by themselves." },
          ],
          accept: ["b"],
          explanation:
            "The passage says the scarce commodity is not comfort but privacy, which is B. A is the tempting answer because pods are sold at a premium, but the pod is explicitly smaller, not larger.",
          evidence: {
            paragraph: "6",
            quote:
              "the scarce commodity on a night train is not comfort but privacy",
            paraphraseOf: "want to be alone more than they want comfort",
          },
        },
      ],
    },
    {
      id: "r1-sentence",
      type: "sentence-completion",
      instructions: "Complete the sentences below.",
      wordLimit: TWO_WORDS_FROM_PASSAGE,
      items: [
        {
          n: 9,
          prompt: "On most European networks the charge for using the track is worked out per",
          accept: ["kilometre", "kilometer", "kilometer", "km"],
          explanation:
            "The passage says networks levy track access charges per kilometre. The answer is the unit, not the amount — no figure is given anywhere in the text.",
          evidence: {
            paragraph: "5",
            quote:
              "Track access charges, which most European networks levy per kilometre, fall due whether the train is full or empty",
            paraphraseOf: "the charge for using the track is worked out per",
          },
        },
        {
          n: 10,
          prompt: "The train paths available at night are often kept for maintenance and",
          accept: ["freight", "freight trains", "goods"],
          explanation:
            "The passage pairs freight and maintenance; the question reverses the order, so the missing half is freight. Reversal like this is the whole difficulty of the item.",
          evidence: {
            paragraph: "5",
            quote: "night paths are often the ones reserved for freight and maintenance",
            paraphraseOf: "kept for maintenance and",
          },
        },
        {
          n: 11,
          prompt: "A sleeping car holds roughly",
          accept: ["thirty", "30", "thirty passengers", "30 passengers"],
          explanation:
            "Thirty is the number given for a sleeping car. Eighty appears in the same sentence but belongs to a seated carriage, which is the trap.",
          evidence: {
            paragraph: "5",
            quote: "A sleeping car carries perhaps thirty passengers where a seated carriage carries eighty",
            paraphraseOf: "A sleeping car holds roughly",
          },
        },
      ],
    },
    {
      id: "r1-short",
      type: "short-answer",
      instructions: "Answer the questions below using words from the passage.",
      wordLimit: THREE_WORDS_FROM_PASSAGE,
      items: [
        {
          n: 12,
          prompt: "What kind of campaign provided part of European Sleeper's funding?",
          accept: ["crowdfunding", "a crowdfunding campaign", "crowdfunding campaign"],
          explanation:
            "The passage says the company was funded partly by a crowdfunding campaign. Partly matters: the question asks only what provided part of the money.",
          evidence: {
            paragraph: "4",
            quote: "funded partly by a crowdfunding campaign",
            paraphraseOf: "provided part of European Sleeper's funding",
          },
        },
        {
          n: 13,
          prompt:
            "Besides signalling systems and safety rules, what else can differ between countries on a cross-border route?",
          accept: [
            "electrical supplies",
            "electrical supply",
            "the electrical supplies",
            "four different electrical supplies",
            "electricity supplies",
          ],
          explanation:
            "The sentence lists three things a cross-border train must satisfy; the question names two of them, so the answer is the third. Copying four different electrical supplies would also be inside the three-word limit only if the number is dropped, so electrical supplies is the safe form.",
          evidence: {
            paragraph: "7",
            quote:
              "must satisfy four signalling systems, four sets of safety rules and, in several cases, four different electrical supplies",
            paraphraseOf: "Besides signalling systems and safety rules, what else can differ",
          },
        },
      ],
    },
  ],
};
