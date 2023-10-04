import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";

export const wordList = signal<Word[]>([]);

export const WORD_DATA_KV_PATH = [
  "fischeversenker",
  "bulgarian",
  "words",
] as const;

export interface Word {
  original: string;
  translation: string;
  createdAt: string;
  history?: QuizHistoryEntry[];
}

interface QuizHistoryEntry {
  date: number;
  certainty: number;
}

export async function getWordList(): Promise<Word[]> {
  if (IS_BROWSER) {
    throw new Error("getWordList() should not be called in the browser");
  }

  const kv = await Deno.openKv();
  const words = kv.list({ prefix: [...WORD_DATA_KV_PATH] });

  const wordValues: Word[] = [];
  for await (const word of words) {
    wordValues.push(word.value as Word);
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

export async function getNextQuizWord(): Promise<Word> {
  if (IS_BROWSER) {
    throw new Error("getNextQuizWord() should not be called in the browser");
  }

  const wordList = await getWordList();
  return wordList.at(Math.floor(Math.random() * wordList.length))!;
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

export async function addQuizEntry(wordId: string, certainty: number) {
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
