import { RouteContext } from "$fresh/server.ts";
import { getWord } from "../../utils/words.ts";

export default async function Word(_req: Request, ctx: RouteContext) {
  const wordData = await getWord(ctx.params.word);

  return <div>{wordData.original}: {wordData.translation}</div>;
}
