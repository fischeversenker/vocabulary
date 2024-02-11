import { getWordList } from "../../utils/server/words.ts";

export const handler = {
  async GET() {
    return new Response(JSON.stringify(await getWordList()));
  },
};
