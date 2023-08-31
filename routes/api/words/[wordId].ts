import { HandlerContext } from "$fresh/server.ts";
import { Word, WORD_DATA_KV_PATH } from "../../index.tsx";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext) {
    const kv = await Deno.openKv();
    const param = ctx.params.wordId;

    if (!param) {
      return new Response("No word given", { status: 404 }); // Not Found
    }

    const word = await kv.get<Word>([...WORD_DATA_KV_PATH, param]);
    if (!word.value) {
      return new Response("Word not found", { status: 404 }); // Not Found
    }

    return new Response(JSON.stringify(word.value));
  },
  async POST(req: Request, ctx: HandlerContext) {
    const kv = await Deno.openKv();
    const body = await req.json();
    const id = ctx.params.wordId;
    const word = {
      original: body.original,
      translation: body.translation,
      createdAt: new Date(),
    };

    kv.atomic().set([...WORD_DATA_KV_PATH, id], word).commit();
    return new Response(JSON.stringify(body));
  },
  async DELETE(_req: Request, ctx: HandlerContext) {
    const kv = await Deno.openKv();
    const id = ctx.params.wordId as string;

    const wordPath = [...WORD_DATA_KV_PATH, id];

    kv.atomic().delete(wordPath).commit();
    return new Response(null, { status: 204 });
  },
};
