import { WordClassType } from "./words.ts";

export type WordClass = {
  label: string;
  value: WordClassType;
};

export const WordClasses: WordClass[] = [
  {
    label: "None",
    value: "unknown",
  },
  {
    label: "Noun",
    value: "noun",
  },
  {
    label: "Adjective",
    value: "adjective",
  },
  {
    label: "Number",
    value: "number",
  },
  {
    label: "Pronoun",
    value: "pronoun",
  },
  {
    label: "Verb",
    value: "verb",
  },
  {
    label: "Adverb",
    value: "adverb",
  },
  {
    label: "Preposition",
    value: "preposition",
  },
  {
    label: "Conjunction",
    value: "conjunction",
  },
  {
    label: "Particle",
    value: "particle",
  },
  {
    label: "Interjections",
    value: "interjections",
  },
] as const;
