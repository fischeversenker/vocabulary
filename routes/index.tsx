import { Handlers, PageProps } from "$fresh/server.ts";
import { NewWord } from "../islands/NewWord.tsx";
import { WordList } from "../islands/WordList.tsx";
import { wordList } from "../utils/words.ts";

interface Data {
  knownWords: Word[];
}

export interface Word {
  original: string;
  translation: string;
  createdAt: Date;
}

export const WORD_DATA_KV_PATH = [
  "fischeversenker",
  "bulgarian",
  "words",
] as const;

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    const kv = await Deno.openKv();

    const words = kv.list({ prefix: [...WORD_DATA_KV_PATH] });

    const wordValues: Word[] = [];
    for await (const word of words) {
      wordValues.push(word.value as Word);
    }

    const knownWords = wordValues;
    wordList.value = knownWords;

    return await ctx.render({ knownWords });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div class="container is-max-desktop">
      <NewWord></NewWord>
      <div class="block">
        <WordList></WordList>
      </div>
    </div>
  );
}
