import { FreshContext } from "$fresh/server.ts";
import { kv } from "../../utils/server/kv.ts";
import { Word } from "../../utils/server/words.ts";

export const handler = {
  async PATCH(req: Request, ctx: FreshContext) {
    const url = new URL(req.url);
    const vocabularyId = url.searchParams.get("id");
    if (!vocabularyId) {
      return new Response(null, { status: 400 });
    }

    const words = kv.list<Word>({
      prefix: ["fischeversenker", "bulgarian", "words"],
    });
    for await (const word of words) {
      const wordId = crypto.randomUUID();
      const migratedWord = {
        ...word.value,
        id: wordId,
      };
      kv.atomic().set(
        ["vocabularies", vocabularyId, "words", wordId],
        migratedWord,
      ).commit();
    }
    return new Response("OK", { status: 200 });
  },
};
