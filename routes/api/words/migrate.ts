import { HandlerContext } from "$fresh/server.ts";
import { WORD_DATA_KV_PATH, Word } from "../../../utils/words.ts";

export const handler = {
  async POST(_req: Request, _ctx: HandlerContext) {

    const kv = await Deno.openKv();
    const words = kv.list<Word>({ prefix: [...WORD_DATA_KV_PATH] } );

    for await (const word of words) {
      // convert iso date string from word.value.createdAt to UNIX timestamp
      const wordTimeStamp = new Date(word.value.createdAt).getTime();
      await kv.set([...WORD_DATA_KV_PATH, word.value.original], {
        ...word.value,
        createdAt: wordTimeStamp
      });
    }

    return new Response('ok');
  },
};
