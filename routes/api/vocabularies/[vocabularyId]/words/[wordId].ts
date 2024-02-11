import { HandlerContext } from "$fresh/server.ts";
import {
  deleteWord,
  getWord,
  upsertWord,
} from "../../../../../utils/server/words.ts";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext) {
    try {
      return new Response(
        JSON.stringify(
          await getWord(ctx.params.vocabularyId, ctx.params.wordId),
        ),
      );
    } catch (e) {
      return new Response(e.message, { status: 404 });
    }
  },
  async POST(req: Request, _ctx: HandlerContext) {
    const newWord = upsertWord(_ctx.params.vocabularyId, await req.json());
    return new Response(JSON.stringify(newWord));
  },
  DELETE(_req: Request, ctx: HandlerContext) {
    deleteWord(ctx.params.vocabularyId, ctx.params.wordId);
    return new Response(null, { status: 204 });
  },
};
