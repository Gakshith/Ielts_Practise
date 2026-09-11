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
          accept: ["kilometre", "kilometer", "km"],
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

/* ========================================================================= */
/* Passage 2 — Reading the Rings                                             */
/* ========================================================================= */

const P2_A =
  "Cut through the trunk of an oak and the history of the tree is laid out in front of you. Each year the tree lays down a layer of wood beneath its bark: pale, fast-grown cells in spring, dark and dense ones in late summer. The boundary between the dark ring of one year and the pale ring of the next is sharp enough to count. A tree in a temperate climate produces exactly one such pair a year, which means that counting inwards from the bark gives a date to every ring, and every ring is a sample of the year that made it.";

const P2_B =
  "The technique was formalised in the 1900s by Andrew Ellicott Douglass, an astronomer who was not initially interested in trees at all. Douglass was looking for evidence that sunspot cycles affected the weather on Earth, and he reasoned that trees, growing more in wet years and less in dry ones, might have kept the record he needed. He never found his sunspot signal. What he found instead was that the pattern of wide and narrow rings in one tree matched the pattern in its neighbours, and in trees felled centuries earlier — a discovery that turned a botanical curiosity into a dating method.";

const P2_C =
  "That matching is the heart of the discipline. A living tree gives a sequence of rings running back to its own germination. A beam from an old building gives another sequence, undated but distinctively patterned. Where the two patterns overlap, the beam can be pinned to the calendar, and its innermost rings then extend the record further back than any living tree reaches. Chained together, these overlaps have produced continuous chronologies for parts of Europe that run unbroken for more than eight thousand years.";

const P2_D =
  "A ring is not a thermometer. Its width reflects whatever limited the tree's growth in that year, and the limiting factor depends on where the tree stands. Near the northern treeline growth is constrained by summer temperature, so rings there are read as a temperature record. On a dry slope in the American Southwest water is the constraint, and the same rings record rainfall instead. A tree in the comfortable middle of its range, with enough of both, records very little at all, which is why dendrochronologists deliberately seek out trees growing in difficult places.";

const P2_E =
  "Because the chronologies are regional, a dated timber also reveals where it grew. The oak panels on which Dutch and Flemish painters worked in the seventeenth century match not the forests of the Low Countries but those of the eastern Baltic, confirming a timber trade that documents had only hinted at. The same logic has been applied to violins, ships' timbers and the wooden crates that carried cargo, turning dendrochronology into an instrument of economic history as much as of archaeology.";

const P2_F =
  "Some years announce themselves. A volcanic eruption large enough to load the stratosphere with sulphate cools the summers that follow, and trees across a hemisphere respond together, producing a band of unusually narrow rings that can be identified in samples thousands of kilometres apart. In high latitudes the cold can arrive before the growing season has ended, freezing cells while they are still forming and leaving a damaged layer known as a frost ring. Rings of this kind from the 1450s and the 1600s have been matched to eruptions identified independently in ice cores, and the two records now calibrate each other.";

const P2_G =
  "The most contested application is social. In the 1920s Douglass dated the timbers of the abandoned cliff dwellings at Mesa Verde and showed that their builders had left during a prolonged drought in the late thirteenth century. For decades the drought was presented as the cause of the departure. More recent work by the archaeologist Lena Vosberg argues that the same region had survived comparable droughts earlier without being abandoned, and that the rings date the crisis rather than explain it. Tree rings, on this view, supply a chronology into which historians must fit a human story; they are not a substitute for one.";

const P2_H =
  "The field is now moving beyond width. Measuring the density of the wood formed late in the season gives a cleaner temperature signal than width alone, while measuring the ratio of oxygen isotopes in the cellulose can date rings even in tropical trees that do not form reliable annual boundaries. Blue intensity — literally, how much blue light a polished ring surface reflects — provides much of what density measurement provides at a fraction of the cost. Each refinement pushes the record into places and periods it could not previously reach, which is the only real ambition the discipline has ever had.";

const passage2: ReadingPassage = {
  index: 2,
  title: "Reading the Rings",
  subtitle:
    "Dendrochronology began as a way of dating timber. It has become a record of climate, of trade routes and of human disaster.",
  blurb: "You should spend about 20 minutes on Questions 14-26, which are based on the passage below.",
  paragraphs: [
    { label: "A", text: P2_A },
    { label: "B", text: P2_B },
    { label: "C", text: P2_C },
    { label: "D", text: P2_D },
    { label: "E", text: P2_E },
    { label: "F", text: P2_F },
    { label: "G", text: P2_G },
    { label: "H", text: P2_H },
  ],
  groups: [
    {
      id: "r2-headings",
      type: "matching-headings",
      instructions:
        "The passage has eight paragraphs, A-H. Choose the correct heading for each of paragraphs B-H from the list of headings below. Paragraph A has been done for you as an example: Paragraph A — iv.",
      heading: "List of Headings",
      options: [
        { key: "i", text: "A record that shows where the wood grew" },
        { key: "ii", text: "Why the location of a tree matters" },
        { key: "iii", text: "Trees as witnesses to volcanic eruptions" },
        { key: "iv", text: "What a single year leaves behind" },
        { key: "v", text: "New measurements, new reach" },
        { key: "vi", text: "The commercial value of old timber" },
        { key: "vii", text: "Building a long timeline from overlapping samples" },
        { key: "viii", text: "A caution about explaining human history" },
        { key: "ix", text: "An unintended result of a search for something else" },
        { key: "x", text: "The problem of trees that grow too quickly" },
        { key: "xi", text: "Training the next generation of specialists" },
      ],
      items: [
        {
          n: 14,
          prompt: "Paragraph B",
          accept: ["ix"],
          explanation:
            "Douglass set out to find a sunspot signal, failed, and found ring matching instead — an unintended result. The paragraph is not about how the method works, so vii does not fit it.",
          evidence: {
            paragraph: "B",
            quote:
              "He never found his sunspot signal. What he found instead was that the pattern of wide and narrow rings in one tree matched the pattern in its neighbours",
            paraphraseOf: "An unintended result of a search for something else",
          },
        },
        {
          n: 15,
          prompt: "Paragraph C",
          accept: ["vii"],
          explanation:
            "The whole paragraph describes chaining overlapping sequences together until the chronology runs back eight thousand years. Overlap is the key word the heading paraphrases.",
          evidence: {
            paragraph: "C",
            quote:
              "Chained together, these overlaps have produced continuous chronologies for parts of Europe that run unbroken for more than eight thousand years.",
            paraphraseOf: "Building a long timeline from overlapping samples",
          },
        },
        {
          n: 16,
          prompt: "Paragraph D",
          accept: ["ii"],
          explanation:
            "The paragraph says the limiting factor, and therefore what a ring records, depends on where the tree stands. That is location, which is heading ii.",
          evidence: {
            paragraph: "D",
            quote:
              "the limiting factor depends on where the tree stands",
            paraphraseOf: "Why the location of a tree matters",
          },
        },
        {
          n: 17,
          prompt: "Paragraph E",
          accept: ["i"],
          explanation:
            "The Baltic oak panels show that a dated timber betrays its origin. Heading vi is the trap: the paragraph mentions trade, but its point is provenance, not the price of timber.",
          evidence: {
            paragraph: "E",
            quote: "Because the chronologies are regional, a dated timber also reveals where it grew.",
            paraphraseOf: "A record that shows where the wood grew",
          },
        },
        {
          n: 18,
          prompt: "Paragraph F",
          accept: ["iii"],
          explanation:
            "Narrow rings and frost rings across a whole hemisphere are traced to eruptions, which is exactly heading iii.",
          evidence: {
            paragraph: "F",
            quote:
              "A volcanic eruption large enough to load the stratosphere with sulphate cools the summers that follow",
            paraphraseOf: "Trees as witnesses to volcanic eruptions",
          },
        },
        {
          n: 19,
          prompt: "Paragraph G",
          accept: ["viii"],
          explanation:
            "Vosberg's argument is that rings date a crisis without explaining it — a warning against using them to account for what people did.",
          evidence: {
            paragraph: "G",
            quote: "the rings date the crisis rather than explain it",
            paraphraseOf: "A caution about explaining human history",
          },
        },
        {
          n: 20,
          prompt: "Paragraph H",
          accept: ["v"],
          explanation:
            "Density, isotopes and blue intensity are all new measurements, and each one extends the method into new places. Heading v names both halves of the paragraph.",
          evidence: {
            paragraph: "H",
            quote:
              "Each refinement pushes the record into places and periods it could not previously reach",
            paraphraseOf: "New measurements, new reach",
          },
        },
      ],
    },
    {
      id: "r2-info",
      type: "matching-information",
      instructions:
        "Which paragraph contains the following information? Write the correct letter, A-H. You may use any letter more than once.",
      options: [
        { key: "A", text: "Paragraph A" },
        { key: "B", text: "Paragraph B" },
        { key: "C", text: "Paragraph C" },
        { key: "D", text: "Paragraph D" },
        { key: "E", text: "Paragraph E" },
        { key: "F", text: "Paragraph F" },
        { key: "G", text: "Paragraph G" },
        { key: "H", text: "Paragraph H" },
      ],
      items: [
        {
          n: 21,
          prompt: "two separate kinds of evidence that now confirm one another",
          accept: ["f"],
          explanation:
            "Only paragraph F puts two records side by side — tree rings and ice cores — and says they calibrate each other. G also discusses disagreement, but between interpretations, not between records.",
          evidence: {
            paragraph: "F",
            quote:
              "have been matched to eruptions identified independently in ice cores, and the two records now calibrate each other",
            paraphraseOf: "two separate kinds of evidence that now confirm one another",
          },
        },
        {
          n: 22,
          prompt: "why researchers choose trees growing in unfavourable conditions",
          accept: ["d"],
          explanation:
            "Paragraph D explains that a tree with plenty of warmth and water records almost nothing, so specialists go looking for stressed trees.",
          evidence: {
            paragraph: "D",
            quote:
              "which is why dendrochronologists deliberately seek out trees growing in difficult places",
            paraphraseOf: "why researchers choose trees growing in unfavourable conditions",
          },
        },
        {
          n: 23,
          prompt: "a reference to trees whose rings do not mark the years dependably",
          accept: ["h"],
          explanation:
            "Paragraph H is the only place tropical trees appear, and it is precisely their lack of reliable annual boundaries that the isotope method gets round.",
          evidence: {
            paragraph: "H",
            quote: "tropical trees that do not form reliable annual boundaries",
            paraphraseOf: "trees whose rings do not mark the years dependably",
          },
        },
      ],
    },
    {
      id: "r2-diagram",
      type: "diagram-labelling",
      instructions:
        "Label the cross-section of a trunk below. Choose your answers from the passage.",
      heading: "Cross-section of a trunk",
      wordLimit: TWO_WORDS_FROM_PASSAGE,
      items: [
        {
          n: 24,
          prompt: "The outer covering of the trunk: the {{24}}",
          accept: ["bark", "the bark"],
          explanation:
            "The passage says each year's wood is laid down beneath the bark, so the bark is the outermost layer named in the text.",
          evidence: {
            paragraph: "A",
            quote:
              "Each year the tree lays down a layer of wood beneath its bark: pale, fast-grown cells in spring, dark and dense ones in late summer.",
            paraphraseOf: "The outer covering of the trunk",
          },
        },
        {
          n: 25,
          prompt:
            "The line that is counted runs between the dark ring of one year and the {{25}} ring of the next.",
          accept: ["pale", "light"],
          explanation:
            "The countable boundary is dark ring to pale ring. Fast-grown is the tempting answer because it describes the same spring wood, but it is not the word attached to ring in that sentence.",
          evidence: {
            paragraph: "A",
            quote:
              "The boundary between the dark ring of one year and the pale ring of the next is sharp enough to count.",
            paraphraseOf: "The line that is counted runs between",
          },
        },
        {
          n: 26,
          prompt:
            "A damaged layer produced when cells freeze before they have finished forming: a {{26}}",
          accept: ["frost ring", "frost-ring"],
          explanation:
            "The text names this feature directly. Two words are allowed, so frost ring is inside the limit; writing damaged layer would repeat the question rather than answer it.",
          evidence: {
            paragraph: "F",
            quote:
              "freezing cells while they are still forming and leaving a damaged layer known as a frost ring",
            paraphraseOf: "A damaged layer produced when cells freeze before they have finished forming",
          },
        },
      ],
    },
  ],
};

/* ========================================================================= */
/* Passage 3 — The Uneasy Science of Forecasting                             */
/* ========================================================================= */

const P3_1 =
  "Every field that matters produces experts, and every expert is eventually asked to predict. Economists are asked where interest rates will go, epidemiologists where a virus will go, intelligence analysts where a government will go. The demand is entirely reasonable. The supply is where the trouble starts. Four decades of research into the accuracy of expert judgement have produced a conclusion that the experts themselves have been slow to absorb: on questions involving genuine uncertainty, credentialled specialists forecast only marginally better than well-informed amateurs, and on some questions rather worse.";

const P3_2 =
  "The finding is easy to misread. It does not mean that expertise is worthless. A cardiologist reading an electrocardiogram, a chess grandmaster assessing a position and a firefighter judging whether a floor will hold are all making predictions, and all of them are reliably better at it than a novice. What these tasks share is a structure that forecasting the price of oil does not have: the environment is regular enough to contain learnable patterns, and the feedback is fast and unambiguous. The grandmaster loses the game within the hour. The forecaster who calls a recession for 2027 will wait years for a verdict, and by the time it arrives the world will have moved on.";

const P3_3 =
  "Psychologists call the difference the validity of the environment. Where cause and effect are stable and repeated, experience accumulates into skill. Where they are not, experience accumulates into confidence, which feels identical from the inside and is not the same thing at all. This is why seniority is such a poor predictor of forecasting accuracy: the years that produce authority are the same years that produce conviction.";

const P3_4 =
  "Rosalind Achebe, who has spent much of her career running forecasting tournaments, argues that the deficiency is less about knowledge than about calibration. A well-calibrated forecaster is one whose confidence tracks reality: of the events to which she gives a probability of seventy per cent, roughly seventy per cent should actually happen. Achebe's tournaments consistently show that the participants who score best are not those with the deepest knowledge of the subject but those who revise their estimates most often and by the smallest amounts. Certainty, in her data, is almost always a warning sign.";

const P3_5 =
  "Piotr Nadas is unconvinced that the problem is psychological at all. In his account, public forecasters are not trying to be accurate; they are responding rationally to the incentives they face. A commentator who predicts a crash every year is remembered vividly in the year the crash arrives and forgotten in the nine years it does not. Vagueness is rewarded, because a prediction that cannot be scored cannot be shown to be wrong, and boldness is rewarded, because attention accrues to the dramatic. Nadas's prescription is institutional rather than cognitive: publish forecasters' track records, and the behaviour will change without anybody becoming wiser.";

const P3_6 =
  "A third position, associated with Mei-Ling Faro, holds that the argument about human judgement is increasingly beside the point. Faro compares expert predictions with those of simple statistical models built from the same information, and finds that the models usually win — not because they are sophisticated, but because they apply their rules consistently and do not become tired, bored or attached to a favoured hypothesis. Where the model is allowed to make the call and the expert is restricted to supplying the inputs, accuracy improves further still.";

const P3_7 =
  "Douglas Hearn has pressed the obvious objection. Statistical models are built from the past, and the questions that matter most are exactly those in which the past is a poor guide: a pandemic, a war, a technology that did not exist five years ago. Hearn does not dispute Faro's results so much as their scope. In his view the value of the expert lies not in the point estimate but in the ability to notice that the question has changed — that a variable which held steady for thirty years has stopped holding steady — and no model built on that variable can raise the alarm about itself.";

const P3_8 =
  "This is, I think, the more useful framing, though it is not a comfortable one. It suggests that the right use of an expert is not to ask what will happen but to ask what would have to be true for each outcome, and then to go and look. That is a slower and far less quotable service than a number, and the institutions that commission forecasts rarely want it.";

const P3_9 =
  "There is one reform on which all four of these researchers would agree, and it costs almost nothing. A forecast should be recorded in a form that can be scored: a specific outcome, a date and a probability. The discipline of writing that sentence does more than make evaluation possible. It forces the forecaster to notice how much of what they were about to say was not a prediction at all.";

const P3_10 =
  "Whether any of this changes how predictions are consumed is a separate question. The appetite for confident narration about the future appears to be a stable feature of human societies, and a well-calibrated forecast is, by design, a disappointing thing to read. The best that can be hoped for is a division of labour in which the people who make forecasts are kept honest by a public record, and the people who use them learn to distrust anyone who is never surprised.";

const passage3: ReadingPassage = {
  index: 3,
  title: "The Uneasy Science of Forecasting",
  subtitle: "Why the people we ask about the future are not the people who know it",
  blurb: "You should spend about 20 minutes on Questions 27-40, which are based on the passage below.",
  paragraphs: [
    { text: P3_1 },
    { text: P3_2 },
    { text: P3_3 },
    { text: P3_4 },
    { text: P3_5 },
    { text: P3_6 },
    { text: P3_7 },
    { text: P3_8 },
    { text: P3_9 },
    { text: P3_10 },
  ],
  groups: [
    {
      id: "r3-ynng",
      type: "yes-no-notgiven",
      instructions:
        "Do the following statements agree with the claims of the writer? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.",
      items: [
        {
          n: 27,
          prompt: "Expert knowledge is of little use in any task that involves prediction.",
          accept: ["no"],
          explanation:
            "The writer explicitly rejects this reading, giving the cardiologist, the grandmaster and the firefighter as experts who predict reliably well. The statement contradicts a claim the writer makes, so it is NO rather than NOT GIVEN.",
          evidence: {
            paragraph: "2",
            quote:
              "It does not mean that expertise is worthless.",
            paraphraseOf: "Expert knowledge is of little use in any task that involves prediction",
          },
        },
        {
          n: 28,
          prompt: "Quick and unambiguous feedback is necessary if experience is to become skill.",
          accept: ["yes"],
          explanation:
            "The writer names fast, unambiguous feedback as one of the two conditions that separate learnable tasks from forecasting, and paragraph 3 repeats the point in other words.",
          evidence: {
            paragraph: "2",
            quote:
              "the environment is regular enough to contain learnable patterns, and the feedback is fast and unambiguous",
            paraphraseOf: "Quick and unambiguous feedback is necessary if experience is to become skill",
          },
        },
        {
          n: 29,
          prompt: "Forecasting tournaments now attract more entrants than they once did.",
          accept: ["not given", "notgiven", "ng"],
          explanation:
            "Achebe's tournaments are described, and so are their results, but the number of participants over time is never mentioned. The text is silent, not contradictory, so the answer is NOT GIVEN.",
          evidence: {
            paragraph: "4",
            quote:
              "Achebe's tournaments consistently show that the participants who score best are not those with the deepest knowledge of the subject",
            paraphraseOf: "Forecasting tournaments now attract more entrants",
          },
        },
        {
          n: 30,
          prompt:
            "It is more valuable to ask an expert what would make each outcome likely than to ask for a prediction.",
          accept: ["yes"],
          explanation:
            "In paragraph 8 the writer states this directly and endorses it as the more useful framing. This is a claim about the writer's own view, which is what YES/NO/NOT GIVEN asks about.",
          evidence: {
            paragraph: "8",
            quote:
              "the right use of an expert is not to ask what will happen but to ask what would have to be true for each outcome",
            paraphraseOf: "more valuable to ask an expert what would make each outcome likely",
          },
        },
        {
          n: 31,
          prompt: "The public appetite for confident predictions is likely to fade.",
          accept: ["no"],
          explanation:
            "The writer calls that appetite a stable feature of human societies, which contradicts the idea that it will fade.",
          evidence: {
            paragraph: "10",
            quote:
              "The appetite for confident narration about the future appears to be a stable feature of human societies",
            paraphraseOf: "is likely to fade",
          },
        },
      ],
    },
    {
      id: "r3-features",
      type: "matching-features",
      instructions:
        "Look at the following statements and the list of researchers below. Match each statement with the correct researcher, A-D. NB You may use any letter once, more than once or not at all.",
      heading: "List of Researchers",
      options: [
        { key: "A", text: "Rosalind Achebe" },
        { key: "B", text: "Piotr Nadas" },
        { key: "C", text: "Mei-Ling Faro" },
        { key: "D", text: "Douglas Hearn" },
      ],
      items: [
        {
          n: 32,
          prompt: "Accuracy would improve if forecasters' past performance were made public.",
          accept: ["b"],
          explanation:
            "Nadas's prescription is to publish track records. He is the only one of the four whose remedy is institutional rather than about how people think.",
          evidence: {
            paragraph: "5",
            quote:
              "publish forecasters' track records, and the behaviour will change without anybody becoming wiser",
            paraphraseOf: "if forecasters' past performance were made public",
          },
        },
        {
          n: 33,
          prompt:
            "A simple method outperforms people because it applies itself in the same way every time.",
          accept: ["c"],
          explanation:
            "Faro attributes the models' advantage to consistency, not sophistication. The trap is to pick D, because Hearn also discusses models — but he is arguing against their scope, not explaining their success.",
          evidence: {
            paragraph: "6",
            quote:
              "not because they are sophisticated, but because they apply their rules consistently and do not become tired, bored or attached to a favoured hypothesis",
            paraphraseOf: "applies itself in the same way every time",
          },
        },
        {
          n: 34,
          prompt:
            "The real contribution of a specialist is spotting that a long-standing relationship has broken down.",
          accept: ["d"],
          explanation:
            "Hearn locates the expert's value in noticing that the question has changed, and points out that a model cannot warn about its own assumptions.",
          evidence: {
            paragraph: "7",
            quote:
              "the ability to notice that the question has changed — that a variable which held steady for thirty years has stopped holding steady",
            paraphraseOf: "spotting that a long-standing relationship has broken down",
          },
        },
      ],
    },
    {
      id: "r3-endings",
      type: "sentence-endings",
      instructions:
        "Complete each sentence with the correct ending, A-F, below.",
      heading: "List of Endings",
      options: [
        { key: "A", text: "because attention rewards drama rather than accuracy." },
        { key: "B", text: "because it cannot give warning about the assumption it rests on." },
        { key: "C", text: "they adjust their judgements frequently and in small steps." },
        { key: "D", text: "they know more about the subject than the other entrants." },
        { key: "E", text: "it becomes possible to judge afterwards whether it was right." },
        { key: "F", text: "forecasters lose interest in long-term questions." },
      ],
      items: [
        {
          n: 35,
          prompt: "The highest scorers in Achebe's tournaments do well because",
          accept: ["c"],
          explanation:
            "Achebe's finding is that frequent, small revisions beat depth of knowledge. Ending D is the trap: it states the very thing her data contradicts.",
          evidence: {
            paragraph: "4",
            quote:
              "those who revise their estimates most often and by the smallest amounts",
            paraphraseOf: "they adjust their judgements frequently and in small steps",
          },
        },
        {
          n: 36,
          prompt: "A model built from historical data is limited",
          accept: ["b"],
          explanation:
            "Hearn's point is that a model resting on a stable variable has no way of signalling that the variable has stopped being stable.",
          evidence: {
            paragraph: "7",
            quote: "no model built on that variable can raise the alarm about itself",
            paraphraseOf: "it cannot give warning about the assumption it rests on",
          },
        },
        {
          n: 37,
          prompt: "Once a forecast names an outcome, a date and a probability,",
          accept: ["e"],
          explanation:
            "The passage says recording a forecast in that form is what makes evaluation possible. Ending A belongs to Nadas's account of vague forecasts, not to this sentence.",
          evidence: {
            paragraph: "9",
            quote:
              "A forecast should be recorded in a form that can be scored: a specific outcome, a date and a probability.",
            paraphraseOf: "Once a forecast names an outcome, a date and a probability",
          },
        },
      ],
    },
    {
      id: "r3-summary",
      type: "summary-completion",
      instructions:
        "Complete the summary below using words from the passage.",
      wordLimit: TWO_WORDS_FROM_PASSAGE,
      layout: {
        kind: "note",
        title: "Why public forecasts go wrong",
        lines: [
          "In Nadas's account, the behaviour of public forecasters is a rational response to the {{38}} that they face.",
          "Imprecise predictions are rewarded, because a forecast that cannot be scored can never be shown to be {{39}}.",
          "Achebe judges forecasters by something different: their {{40}}, meaning the degree to which their stated confidence matches what actually happens.",
        ],
      },
      items: [
        {
          n: 38,
          prompt: "Summary blank 38",
          accept: ["incentives", "the incentives"],
          explanation:
            "Nadas argues forecasters respond rationally to the incentives they face, so the word is incentives. Track records is the tempting nearby phrase, but that is his remedy, not the pressure they are under.",
          evidence: {
            paragraph: "5",
            quote: "they are responding rationally to the incentives they face",
            paraphraseOf: "a rational response to the ... that they face",
          },
        },
        {
          n: 39,
          prompt: "Summary blank 39",
          accept: ["wrong", "shown to be wrong"],
          explanation:
            "The passage says a prediction that cannot be scored cannot be shown to be wrong. The blank sits after be, so only the single word wrong fits grammatically.",
          evidence: {
            paragraph: "5",
            quote: "a prediction that cannot be scored cannot be shown to be wrong",
            paraphraseOf: "a forecast that cannot be scored can never be shown to be",
          },
        },
        {
          n: 40,
          prompt: "Summary blank 40",
          accept: ["calibration", "their calibration"],
          explanation:
            "Calibration is the term the passage defines as confidence tracking reality, which is exactly what the summary sentence goes on to describe.",
          evidence: {
            paragraph: "4",
            quote: "the deficiency is less about knowledge than about calibration",
            paraphraseOf: "the degree to which their stated confidence matches what actually happens",
          },
        },
      ],
    },
  ],
};

export const reading: { passages: ReadingPassage[] } = {
  passages: [passage1, passage2, passage3],
};
