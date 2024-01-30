import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";

export const filteredWordList = signal<WordWithNormalizedUrgency[]>([]);
export const searchString = signal<string>("");

export const WORD_DATA_KV_PATH = [
  "fischeversenker",
  "bulgarian",
  "words",
] as const;

export type Certainty = 1 | 2 | 3;

export type WordClassType =
  | "unknown"
  | "noun"
  | "adjective"
  | "number"
  | "pronoun"
  | "verb"
  | "adverb"
  | "preposition"
  | "conjunction"
  | "particle"
  | "interjections";

export interface Word {
  original: string;
  translation: string;
  createdAt: number;
  history: QuizHistoryEntry[];
  class: WordClassType;
}

export interface WordWithUrgency extends Word {
  urgency: number;
}

export interface WordWithNormalizedUrgency extends WordWithUrgency {
  normalizedUrgency: number;
}

interface QuizHistoryEntry {
  date: number;
  certainty: Certainty;
}

const kv = await Deno.openKv();

if (IS_BROWSER) {
  throw new Error("this file must not be imported in the browser");
}

export async function getWordList(): Promise<WordWithNormalizedUrgency[]> {
  const words = kv.list<Word>({ prefix: [...WORD_DATA_KV_PATH] });

  const wordValues: WordWithUrgency[] = [];
  let maxUrgency = 0;
  for await (const word of words) {
    const wordUrgency = getWordUrgency(word.value);
    const wordWithUrgency = {
      ...word.value,
      urgency: wordUrgency,
    };
    maxUrgency = Math.max(wordUrgency, maxUrgency);
    wordValues.push(wordWithUrgency);
  }

  const wordValuesWithUrgency = wordValues.map((word) => ({
    ...word,
    normalizedUrgency: word.urgency / maxUrgency,
  }));

  return wordValuesWithUrgency;
}

export async function getWord(wordId: string): Promise<Word> {
  const word = await kv.get<Word>([...WORD_DATA_KV_PATH, wordId]);
  if (!word.value) {
    throw new Error("Word not found");
  }
  return word.value;
}

export function createWord(rawWord: Word): Word {
  const word: Word = {
    original: rawWord.original.trim(),
    translation: rawWord.translation.trim(),
    createdAt: rawWord.createdAt ?? Date.now(),
    history: rawWord.history ?? [],
    class: rawWord.class ?? "unknown",
  };

  kv.atomic().set([...WORD_DATA_KV_PATH, rawWord.original.trim()], word)
    .commit();
  return word;
}

export function deleteWord(wordId: string): boolean {
  const wordPath = [...WORD_DATA_KV_PATH, wordId];

  kv.atomic().delete(wordPath).commit();
  return true;
}

export async function addQuizEntry(wordId: string, certainty: Certainty) {
  const wordPath = [...WORD_DATA_KV_PATH, wordId];

  const word = await kv.get<Word>(wordPath);
  if (!word.value) {
    throw new Error("Word not found");
  }

  const newWord = {
    ...word.value,
    history: [
      ...(word.value.history ?? []),
      {
        date: Date.now(),
        certainty,
      },
    ],
  };

  kv.atomic().set(wordPath, newWord).commit();
}

export async function getMostUrgentWord(): Promise<WordWithUrgency> {
  const wordList = await getWordList();

  const wordsSortedByUrgency = wordList.sort((a, b) => b.urgency - a.urgency);

  return wordsSortedByUrgency.at(0)!;
}

export function getWordUrgency(word: Word): number {
  const lastEntry = word.history.at(-1);

  const relevantHistory = word.history.reverse().slice(0, 5);

  const averageCertainty = getWeightedCertainty(relevantHistory);

  // console.log(word.original);
  // console.log("averageCertainty", averageCertainty);

  // falls back to createdAt if no history is available
  const secondsSinceLastQuiz = Math.floor(
    (Date.now() - (lastEntry?.date ?? word.createdAt)) / (1000),
  );

  const urgency = secondsSinceLastQuiz / (Math.pow(averageCertainty, 4));

  // const urgency = 1 - Math.pow(averageCertainty, 4) /
  //     (Math.pow(secondsSinceLastQuiz / 1000000, -1));

  // console.log("urgency", urgency);
  // console.log(relevantHistory);

  return urgency;
}

// calculate the weighted average certainty for a given history.
// the weight of the certainty should depend on how long ago the entry was.
// the more recent the entry, the more weight it should have.
function getWeightedCertainty(
  history: QuizHistoryEntry[],
): number {
  if (history.length === 0) {
    // the default certainty for unanswered words is 0.8,
    // which is even more urgent than the "What?!" response
    return 0.8;
  }

  const now = Date.now();

  function getWeightFor(entry: QuizHistoryEntry) {
    const timeSinceEntry = now - entry.date;
    const weight = 1 / (Math.pow(timeSinceEntry, 1));
    const result = weight * 1000 * 1000;
    return result;
  }

  const certaintySum = history.reduce((sum, entry) => {
    const weight = getWeightFor(entry);
    return sum + entry.certainty * weight;
  }, 0);

  const weightSum = history.reduce((sum, entry) => {
    return sum + getWeightFor(entry);
  }, 0);

  return certaintySum / weightSum;
}
