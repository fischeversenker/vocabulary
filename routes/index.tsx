import { useSignal } from '@preact/signals';
import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from '../components/Button.tsx';

interface Data {
  knownWords: Word[]
}

interface Word {
  word: string;
  translation: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const word = url.searchParams.get("word");
    const translation = url.searchParams.get("translation");
    const wordToDelete = url.searchParams.get("wordToDelete");

    const kv = await Deno.openKv();
    const knownWordsKv = await kv.get<Word[]>(['words']);
    const knownWords = knownWordsKv.value ?? [];
    let newKnownWords: Word[] = [...knownWords];

    if (word && translation) {
      if (knownWords.some((knownWord) => knownWord.word === word)) {
        return ctx.render({ knownWords });
      }
      newKnownWords.push({ word, translation });
    } else if (wordToDelete) {
      newKnownWords = knownWords.filter((word) => word.word !== wordToDelete);
    }
    await kv.set(['words'], newKnownWords);

    return ctx.render({ knownWords: newKnownWords });
  }
};

export default function Home({ data }: PageProps<Data>) {
  const { knownWords } = data;

  return (
    <div>
      <form style="display:flex;gap:0.5rem;padding-top:1rem;">
        <input type="text" name="word" required style="min-width:0;" />
        <input type="text" name="translation" required style="min-width:0;" />
        <button type="submit">Add</button>
      </form>
      <div style="padding-block:1rem;">
        <ul>
          {knownWords.reverse().map((word) => (
            <li key={word.word} style="display:flex;gap:0.5rem;"><span>{word.word}</span><i>{word.translation}</i><span><form style="display:inline;"><input type="hidden" name="wordToDelete" value={word.word} /><Button type="submit">X</Button></form></span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
