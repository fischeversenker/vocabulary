import { Head } from "$fresh/runtime.ts";
import { FreshContext } from "$fresh/server.ts";
import { WordDetail } from "../../islands/WordDetail.tsx";
import { getUserSettings } from "../../utils/server/user.ts";
import { getWord } from "../../utils/server/words.ts";
import { AppState } from "../_middleware.ts";

export default async function Word(req: Request, ctx: FreshContext<AppState>) {
  const user = ctx.state.user;
  if (!user) {
    return Response.redirect("/auth", 302);
  }

  const userSettings = await getUserSettings(user.id);
  if (!userSettings.activeVocabularyId) {
    return Response.redirect(new URL("/", req.url), 302);
  }

  const wordData = await getWord(
    userSettings.activeVocabularyId,
    ctx.params.word,
  );

  return (
    <>
      <Head>
        <title>{wordData.original}</title>
      </Head>
      <WordDetail
        vocabularyId={userSettings.activeVocabularyId}
        word={wordData}
      >
      </WordDetail>
    </>
  );
}
