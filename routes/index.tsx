import { Handlers, PageProps } from "$fresh/server.ts";
import { Word } from "../components/Word.tsx";

interface Data {
  knownWords: Word[];
}

export interface Word {
  original: string;
  translation: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const original = url.searchParams.get("original");
    const translation = url.searchParams.get("translation");
    const wordToDelete = url.searchParams.get("wordToDelete");

    const kv = await Deno.openKv();
    const knownWordsKv = await kv.get<Word[]>(["fischeversenker", "bulgarian", "words"]);
    let knownWords = knownWordsKv.value ?? [];

    if (original && translation || wordToDelete) {
      if (original && translation) {
        knownWords.push({ original, translation });
      } else if (wordToDelete) {
        knownWords = knownWords.filter((word) =>
          word.original !== wordToDelete
        );
        ctx.params.wordToDelete = "";
      }
      await kv.set(["fischeversenker", "bulgarian", "words"], knownWords);

      const url = new URL(req.url);
      url.search = "";

      return new Response(null, {
        status: 302,
        headers: { location: url.toString() },
      });
    }

    return await ctx.render({ knownWords });
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { knownWords } = data;

  return (
    <div class="container is-max-desktop">
      <form class="block" style="display:flex;gap:0.5rem;padding-top:1rem;">
        <input
          class="input"
          type="text"
          name="original"
          placeholder="Original"
          required
        />
        <input
          class="input"
          type="text"
          name="translation"
          placeholder="Translation"
          required
        />
        <button class="button is-primary has-text-weight-bold" type="submit">
          +
        </button>
      </form>
      <div class="block">
        {knownWords.map((word) => <Word {...word}></Word>)}
      </div>
    </div>
  );
}
