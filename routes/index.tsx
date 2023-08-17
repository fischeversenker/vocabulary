import { useSignal } from '@preact/signals';
import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from '../components/Button.tsx';

interface Data {
  knownWords: Word[]
}

interface Word {
  id: string;
  word: string;
  translation: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const word = url.searchParams.get("word");
    const translation = url.searchParams.get("translation");
    const idToDelete = url.searchParams.get("idToDelete");

    const kv = await Deno.openKv();
    const knownWordsKv = await kv.get<Word[]>(['words']);
    const knownWords = knownWordsKv.value ?? [];
    let newKnownWords: Word[] = [...knownWords];

    if (word && translation) {
      const id = crypto.randomUUID();
      newKnownWords.push({ id, word, translation });
    } else if (idToDelete) {
      newKnownWords = knownWords.filter((word) => word.id !== idToDelete);
    }
    await kv.set(['words'], newKnownWords);

    return ctx.render({ knownWords: newKnownWords });
  }
};

export default function Home({ data }: PageProps<Data>) {
  const { knownWords } = data;

  return (
    <div>
      <p>Add new word:</p>
      <form>
        <input type="text" name="word" required />
        <input type="text" name="translation" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {knownWords.reverse().map((word) => (
          <li key={word}>{word.word}: {word.translation} <form style="display:inline;"><input type="hidden" name="idToDelete" value={word.id} /><Button type="submit">X</Button></form></li>
        ))}
      </ul>
    </div>
  );
}
