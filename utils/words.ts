import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";

export const wordList = signal<Word[]>([]);

export const WORD_DATA_KV_PATH = [
  "fischeversenker",
  "bulgarian",
  "words",
] as const;

export type Certainty = 1 | 2 | 3;

export interface Word {
  original: string;
  translation: string;
  createdAt: string;
  history?: QuizHistoryEntry[];
}

export interface WordWithUrgency extends Word {
  urgency: number;
}

interface QuizHistoryEntry {
  date: number;
  certainty: Certainty;
}

export async function getWordList(): Promise<WordWithUrgency[]> {
  if (IS_BROWSER) {
    throw new Error("getWordList() should not be called in the browser");
  }

  const kv = await Deno.openKv();
  const words = kv.list<Word>({ prefix: [...WORD_DATA_KV_PATH] });

  const wordValues: WordWithUrgency[] = [];
  const maxUrgency = wordList.value.reduce(
    (max, word) => Math.max(getWordUrgency(word), max),
    0,
  );
  console.log({ maxUrgency });
  for await (const word of words) {
    const wordWithUrgency = {
      ...word.value,
      urgency: getWordUrgency(word.value) / maxUrgency,
    };
    wordValues.push(wordWithUrgency);
  }

  return wordValues;
}

export async function getWord(wordId: string): Promise<Word> {
  if (IS_BROWSER) {
    throw new Error("getWord() should not be called in the browser");
  }

  const kv = await Deno.openKv();
  const word = await kv.get<Word>([...WORD_DATA_KV_PATH, wordId]);
  if (!word.value) {
    throw new Error("Word not found");
  }
  return word.value;
}

export async function createWord(rawWord: Word): Promise<Word> {
  if (IS_BROWSER) {
    throw new Error("createWord() should not be called in the browser");
  }

  const kv = await Deno.openKv();
  const word: Word = {
    original: rawWord.original,
    translation: rawWord.translation,
    createdAt: rawWord.createdAt ?? new Date().toISOString(),
    history: [],
  };

  kv.atomic().set([...WORD_DATA_KV_PATH, rawWord.original], word).commit();
  return word;
}

export async function deleteWord(wordId: string): Promise<boolean> {
  if (IS_BROWSER) {
    throw new Error("deleteWord() should not be called in the browser");
  }

  const kv = await Deno.openKv();
  const wordPath = [...WORD_DATA_KV_PATH, wordId];

  kv.atomic().delete(wordPath).commit();
  return true;
}

export async function addQuizEntry(wordId: string, certainty: Certainty) {
  if (IS_BROWSER) {
    throw new Error("addQuizEntry() should not be called in the browser");
  }

  const kv = await Deno.openKv();
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
  if (IS_BROWSER) {
    throw new Error("getNextQuizWord() should not be called in the browser");
  }

  const wordList = await getWordList();

  const wordUrgency = wordList.map((word) => ({
    word,
    urgency: getWordUrgency(word),
  })).sort((a, b) => b.urgency - a.urgency);

  return wordUrgency.at(0)!.word;
}

function getWordUrgency(word: Word): number {
  const lastEntry = word.history?.at(-1);

  if (!lastEntry) {
    return Infinity;
  }

  const secondsSinceLastQuiz = Math.floor(
    (Date.now() - lastEntry.date) / (1000),
  );

  return Math.floor(secondsSinceLastQuiz / lastEntry.certainty);
}
