import { HandlerContext } from "$fresh/server.ts";
import {
  createWord,
  deleteWord,
  getWord,
} from "../../../utils/server/words.ts";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext) {
    try {
      return new Response(JSON.stringify(await getWord(ctx.params.wordId)));
    } catch (e) {
      return new Response(e.message, { status: 404 });
    }
  },
  async POST(req: Request, _ctx: HandlerContext) {
    const newWord = createWord(await req.json());
    return new Response(JSON.stringify(newWord));
  },
  DELETE(_req: Request, ctx: HandlerContext) {
    deleteWord(ctx.params.wordId);
    return new Response(null, { status: 204 });
  },
};
