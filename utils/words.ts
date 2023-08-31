import { signal } from "@preact/signals";
import { Word } from "../routes/index.tsx";

export const wordList = signal<Word[]>([]);
