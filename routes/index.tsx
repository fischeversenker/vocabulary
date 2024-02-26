import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { QuizWord } from "../islands/QuizWord.tsx";
import {
  getUserSettings,
  getUserVocabularyIds,
  saveUserSettings,
} from "../utils/server/user.ts";
import { getVocabulary } from "../utils/server/vocabularies.ts";
import { getMostUrgentWord } from "../utils/server/words.ts";
import { AppState } from "./_middleware.ts";

export default async function Vocabularies(
  req: Request,
  ctx: FreshContext<AppState>,
) {
  const user = ctx.state.user;
  if (!user) {
    return Response.redirect("/auth", 302);
  }

  const vocabularyIds = await getUserVocabularyIds(user.id);
  if (vocabularyIds.length === 0) {
    return (
      <div
        class="is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
        style="height: 80vh"
      >
        <a href="/vocabularies/new" class="button is-info is-large">
          Create new vocabulary
        </a>
      </div>
    );
  }

  const userSettings = await getUserSettings(user.id);
  if (!userSettings.activeVocabularyId) {
    await saveUserSettings(user.id, {
      ...userSettings,
      activeVocabularyId: vocabularyIds[0],
    });
  }

  const vocabulary = await getVocabulary(
    userSettings.activeVocabularyId ?? vocabularyIds[0],
  );

  const url = new URL(req.url);
  const cookies = getCookies(req.headers);
  const continueAnyway = cookies.continueAnyway === "true";

  let showOriginal = userSettings.showOriginal ?? false;
  if (url.searchParams.has("original")) {
    showOriginal = url.searchParams.get("original") === "true";
    await saveUserSettings(user.id, { ...userSettings, showOriginal });
  }

  const mostUrgentWord = await getMostUrgentWord(vocabulary.id);
  if (!mostUrgentWord) {
    return <span>no words in this vocabulary</span>;
  }

  return (
    <>
      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between"
        style="height: 100%;"
      >
        <div class="block">
          <div class="buttons has-addons is-centered">
            <a
              href="?original=true"
              class={`button is-flex-grow-1 ${showOriginal ? "is-info" : ""}`}
            >
              <span>{vocabulary.foreignName}</span>
            </a>
            <a
              href="?original=false"
              class={`button is-flex-grow-1 ${showOriginal ? "" : "is-info"}`}
            >
              <span>{vocabulary.nativeName}</span>
            </a>
          </div>
        </div>

        <QuizWord
          vocabularyId={vocabulary.id}
          word={mostUrgentWord}
          showOriginal={showOriginal}
          continueAnyway={continueAnyway}
        />
      </div>
    </>
  );
}
