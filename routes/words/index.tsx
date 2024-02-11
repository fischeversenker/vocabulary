import { FreshContext } from "$fresh/server.ts";
import { NewWord } from "../../islands/NewWord.tsx";
import { Search } from "../../islands/Search.tsx";
import { WordList } from "../../islands/WordList.tsx";
import { getUserSettings } from "../../utils/server/user.ts";
import { filteredWordList, getWordList } from "../../utils/server/words.ts";
import { AppState } from "../_middleware.ts";

export default async function Home(req: Request, ctx: FreshContext<AppState>) {
  const user = ctx.state.user;
  if (!user) {
    return Response.redirect("/auth", 302);
  }

  const userSettings = await getUserSettings(user.id);
  if (!userSettings.activeVocabularyId) {
    return Response.redirect(new URL("/", req.url), 302);
  }

  const knownWords = await getWordList(userSettings.activeVocabularyId);
  return (
    <>
      <Search
        knownWords={knownWords}
        filteredWords={filteredWordList}
      />
      <NewWord vocabularyId={userSettings.activeVocabularyId} />
      <WordList words={filteredWordList}></WordList>
    </>
  );
}
