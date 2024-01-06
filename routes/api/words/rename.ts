import { HandlerContext } from "$fresh/server.ts";
import { createWord, deleteWord, getWord } from "../../../utils/words.ts";

export const handler = {
  async GET(req: Request, _ctx: HandlerContext) {
    const url = new URL(req.url);
    const oldWordOriginal = url.searchParams.get("oldWord");
    const newWordOriginal = url.searchParams.get("newWord");
    if (!oldWordOriginal || !newWordOriginal) {
      return new Response(null, { status: 400 });
    }

    const oldWord = await getWord(oldWordOriginal);
    const newWord = createWord({
      ...oldWord,
      original: newWordOriginal,
    });

    if (newWord) {
      deleteWord(oldWord.original);
    }
    return new Response(JSON.stringify(newWord));
  },
};
