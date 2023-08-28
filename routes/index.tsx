import { Handlers, PageProps } from "$fresh/server.ts";
import { Word } from "../components/Word.tsx";
import { NewWord } from "../islands/NewWord.tsx";
import { WordList } from "../components/WordList.tsx";

interface Data {
  knownWords: Word[];
}

export interface Word {
  original: string;
  translation: string;
  createdAt: Date;
}

const KV_PATH = ["fischeversenker", "bulgarian", "words"] as const;

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    const kv = await Deno.openKv();
    const knownWordsKv = await kv.get<Word[]>(KV_PATH);
    const knownWords = (knownWordsKv.value ?? []).map((word) => {
      if (!word.createdAt) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        word.createdAt = yesterday;
      }
      return word;
    });

    return await ctx.render({ knownWords });
  },
  async POST(req) {
    const form = await req.formData();
    const original = form.get("original") as string;
    const translation = form.get("translation") as string;
    const wordToDelete = form.get("wordToDelete") as string;

    const kv = await Deno.openKv();
    const knownWordsKv = await kv.get<Word[]>(KV_PATH);
    let knownWords = knownWordsKv.value ?? [];
    let focusNewWord = false;

    if (wordToDelete) {
      knownWords = knownWords.filter((word) => word.original !== wordToDelete);
    } else if (original && translation) {
      knownWords.push({ original, translation, createdAt: new Date() });
      focusNewWord = true;
    } else {
      throw new Error("Invalid POST request");
    }

    await kv.set(KV_PATH, knownWords);

    return new Response(null, {
      status: 302,
      headers: { location: `/${focusNewWord ? "?focused=true" : ""}` },
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div class="container is-max-desktop">
      <NewWord></NewWord>
      <div class="block">
        <WordList words={data.knownWords}></WordList>
      </div>
    </div>
  );
}
