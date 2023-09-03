import { Head } from "$fresh/runtime.ts";
import { RouteContext } from "$fresh/server.ts";
import { WordDetail } from "../../islands/WordDetail.tsx";
import { getWord } from "../../utils/words.ts";

export default async function Word(_req: Request, ctx: RouteContext) {
  const wordData = await getWord(ctx.params.word);

  return (
    <>
      <Head>
        <title>{wordData.original}</title>
      </Head>
      <WordDetail word={wordData}></WordDetail>
    </>
  );
}
