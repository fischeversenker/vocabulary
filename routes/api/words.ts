import { HandlerContext } from "$fresh/server.ts";
import { WORD_DATA_KV_PATH } from "../index.tsx";

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
};
