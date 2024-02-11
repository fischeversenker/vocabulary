import { FreshContext } from "$fresh/server.ts";
import { getWordList } from "../../../../utils/server/words.ts";

export const handler = {
  async GET(_req: Request, ctx: FreshContext) {
    return new Response(
      JSON.stringify(await getWordList(ctx.params.vocabularyId)),
    );
  },
};
