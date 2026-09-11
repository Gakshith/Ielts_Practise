/* ===========================================================================
   Academic Practice Test 1 — Writing and Speaking.

   Task 1 has no chart image yet, so the data is stated in full inside the
   prompt. `image` is deliberately left undefined rather than pointed at a file
   that does not exist: a broken <img> in the exam player is worse than prose.
   =========================================================================== */

import type { SpeakingPart, WritingTask } from "@/types";

const task1: WritingTask = {
  index: 1,
  minWords: 150,
  suggestedMinutes: 20,
  prompt: [
    "The table below shows the number of overnight rail passengers carried on four European routes in 2015 and in 2023, together with the scheduled journey time in each year.",
    "",
    "Brussels to Vienna — 2015: 41,000 passengers, 14 hours 30 minutes. 2023: 96,000 passengers, 13 hours 50 minutes.",
    "Paris to Berlin — 2015: no service. 2023: 112,000 passengers, 13 hours 10 minutes.",
    "Stockholm to Hamburg — 2015: 88,000 passengers, 13 hours 05 minutes. 2023: 64,000 passengers, 13 hours 40 minutes.",
    "Rome to Munich — 2015: 57,000 passengers, 11 hours 50 minutes. 2023: 59,000 passengers, 11 hours 45 minutes.",
    "",
    "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    "",
    "Write at least 150 words.",
  ].join("\n"),
  criteriaHints: [
    "Open with one sentence that says what the table shows, in your own words. Do not copy the rubric.",
    "Give an overview paragraph: the clearest pattern is that three routes grew or held steady while Stockholm to Hamburg fell, and that journey times barely moved anywhere.",
    "Group the routes rather than listing all four in turn — the growing ones together, the declining one separately.",
    "Quote figures selectively to support each point. Every number you use must be accurate; inventing a total or a percentage costs marks.",
    "Handle the missing 2015 figure for Paris to Berlin explicitly: the service did not exist, so it cannot be described as an increase.",
    "Use varied comparison language: more than doubled, fell by roughly a quarter, remained almost unchanged.",
    "Do not explain why the numbers moved or argue that night trains are good. Task 1 reports; it does not interpret or recommend.",
  ],
};

const task2: WritingTask = {
  index: 2,
  minWords: 250,
  suggestedMinutes: 40,
  prompt: [
    "Some people believe that universities should offer only those subjects that are useful in the future job market, such as science and technology.",
    "",
    "Others think that universities should continue to offer a wide range of subjects, including those with no obvious career value.",
    "",
    "Discuss both these views and give your own opinion.",
    "",
    "Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
    "",
    "Write at least 250 words.",
  ].join("\n"),
  criteriaHints: [
    "Answer both halves of the question. A discuss-both-views essay that covers only one side is capped on Task Response however good the English is.",
    "State your own position in the introduction and keep it consistent to the end. An opinion that appears only in the conclusion reads as an afterthought.",
    "Give each view its own body paragraph with a clear topic sentence, then develop the idea rather than listing several undeveloped ones.",
    "Support each point with a specific example — a named field, a concrete outcome, a plausible situation. Examples beat adjectives.",
    "Use range in vocabulary and structure without straining: a relative clause, a conditional, a concession clause such as although this is true of.",
    "Avoid memorised opening formulas and absolute claims. Nowadays it is a well-known fact adds nothing and is easy to spot.",
    "Leave two minutes to check articles, subject-verb agreement, plurals and spelling; these are the errors that most often pull Grammatical Range and Accuracy down.",
  ],
};

const speakingPart1: SpeakingPart = {
  index: 1,
  durationSec: 270,
  questions: [
    "Let's talk about where you live. Do you live in a house or an apartment?",
    "What do you like most about the place where you live?",
    "Is there anything you would like to change about your home?",
    "Would you prefer to live in a city or in the countryside? Why?",
    "Now let's move on to food. Do you enjoy cooking?",
    "Who usually prepares the meals in your home?",
    "Has the kind of food you eat changed since you were a child?",
    "Do you prefer eating at home or eating out? Why?",
    "Let's talk about staying in touch with people. How do you usually keep in contact with your friends?",
    "Do you prefer to phone people or to send messages?",
    "Is it easy to stay in touch with people who live far away?",
    "How often do you meet your friends face to face?",
  ],
};

const speakingPart2: SpeakingPart = {
  index: 2,
  durationSec: 210,
  prepSec: 60,
  speakSec: 120,
  cueCard: {
    topic: "Describe a place in your town or city that has changed a lot.",
    bullets: [
      "where this place is",
      "what it was like before",
      "how it has changed",
      "and explain how you feel about the change.",
    ],
    followUp: "Do most people in your town think the change was a good thing?",
  },
};

const speakingPart3: SpeakingPart = {
  index: 3,
  durationSec: 300,
  questions: [
    "We have been talking about a place that has changed. I would like to discuss change in towns and cities more generally. Why do you think some parts of a city change much faster than others?",
    "Who should decide what happens to an old building that is no longer used — the owner, the local council, or the people who live nearby?",
    "Some people say that preserving old buildings holds a city back. How far would you agree?",
    "What are the effects on a community when the shops and businesses in an area change completely?",
    "Do you think people generally resist change, or do they adapt to it more easily than they expect?",
    "How might the cities in your country look different in fifty years' time?",
  ],
};

export const writing: { tasks: WritingTask[] } = { tasks: [task1, task2] };

export const speaking: { parts: SpeakingPart[] } = {
  parts: [speakingPart1, speakingPart2, speakingPart3],
};
