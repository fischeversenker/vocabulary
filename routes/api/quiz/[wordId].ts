import { HandlerContext } from "$fresh/server.ts";
import { addQuizEntry, Certainty } from "../../../utils/words.ts";

export const handler = {
  async PATCH(req: Request, ctx: HandlerContext) {
    const { certainty } = await req.json() as { certainty: Certainty };

    await addQuizEntry(ctx.params.wordId, certainty);

    return new Response("OK", { status: 200 });
  },
};
