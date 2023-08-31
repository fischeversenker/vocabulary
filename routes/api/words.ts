import { HandlerContext } from "$fresh/server.ts";
import { Word, WORD_DATA_KV_PATH } from "../index.tsx";

export const handler = {
  async GET(_req: Request, _ctx: HandlerContext) {
    const kv = await Deno.openKv();
    const words = kv.list({ prefix: [...WORD_DATA_KV_PATH] });

    const wordValues: string[] = [];
    for await (const word of words) {
      wordValues.push(word.value as string);
    }

    return new Response(JSON.stringify(wordValues));
  },
  async POST(_req: Request, _ctx: HandlerContext) {
    const kv = await Deno.openKv();

    const oldKnownWordsKv = await kv.get<Word[]>(WORD_DATA_KV_PATH);
    const oldKnownWords = oldKnownWordsKv.value ?? [];
    oldKnownWords.forEach(async (word) => {
      await kv.set([...WORD_DATA_KV_PATH, word.original], word);
    });
    return new Response(JSON.stringify(await kv.get(WORD_DATA_KV_PATH)));
  },
};
