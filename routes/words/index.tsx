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

  const url = new URL(req.url);
  const sortBy = url.searchParams.get("sortBy") ?? "original";
  const sortOrder = url.searchParams.get("sortOrder") ?? "asc";

  if (!isValidSortByValue(sortBy)) {
    return new Response("invalid sortBy parameter", { status: 400 });
  }

  if (!isValidSortOrderValue(sortOrder)) {
    return new Response("invalid sortOrder parameter", { status: 400 });
  }

  const knownWords = (await getWordList(userSettings.activeVocabularyId)).sort(
    (a, b) => {
      if (sortOrder === "asc") {
        if (sortBy === "original" || sortBy === "translation") {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return a[sortBy] - b[sortBy];
      } else {
        if (sortBy === "original" || sortBy === "translation") {
          return b[sortBy].localeCompare(a[sortBy]);
        }
        return b[sortBy] - a[sortBy];
      }
    },
  );

  return (
    <>
      <Search
        knownWords={knownWords}
        filteredWords={filteredWordList}
      />
      <NewWord vocabularyId={userSettings.activeVocabularyId} />
      <WordList words={filteredWordList} sortBy={sortBy} sortOrder={sortOrder}>
      </WordList>
    </>
  );
}

function isValidSortByValue(
  sortBy: string,
): sortBy is "original" | "translation" | "urgency" {
  return ["original", "translation", "urgency"].includes(sortBy);
}

function isValidSortOrderValue(
  sortBy: string,
): sortBy is "asc" | "desc" {
  return ["asc", "desc"].includes(sortBy);
}
