import { HandlerContext } from "$fresh/server.ts";
import {
  deleteWord,
  getWord,
  upsertWord,
} from "../../../../../utils/server/words.ts";

export const handler = {
  async GET(req: Request, _ctx: HandlerContext) {
    const url = new URL(req.url);
    const oldWordOriginal = url.searchParams.get("oldWord");
    const newWordOriginal = url.searchParams.get("newWord");
    if (!oldWordOriginal || !newWordOriginal) {
      return new Response(null, { status: 400 });
    }

    const oldWord = await getWord(_ctx.params.vocabularyId, oldWordOriginal);
    const newWord = upsertWord(_ctx.params.vocabularyId, {
      ...oldWord,
      original: newWordOriginal,
    });

    if (newWord) {
      deleteWord(_ctx.params.vocabularyId, oldWord.original);
    }
    return new Response(JSON.stringify(newWord));
  },
};
