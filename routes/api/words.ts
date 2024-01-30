import { HandlerContext } from "$fresh/server.ts";
import { getWordList } from "../../utils/server/words.ts";

export const handler = {
  async GET(_req: Request, _ctx: HandlerContext) {
    return new Response(JSON.stringify(await getWordList()));
  },
};
