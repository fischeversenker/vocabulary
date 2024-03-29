// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_migrate from "./routes/api/migrate.ts";
import * as $api_vocabularies_vocabularyId_quiz_wordId_ from "./routes/api/vocabularies/[vocabularyId]/quiz/[wordId].ts";
import * as $api_vocabularies_vocabularyId_words from "./routes/api/vocabularies/[vocabularyId]/words.ts";
import * as $api_vocabularies_vocabularyId_words_wordId_ from "./routes/api/vocabularies/[vocabularyId]/words/[wordId].ts";
import * as $api_vocabularies_vocabularyId_words_rename from "./routes/api/vocabularies/[vocabularyId]/words/rename.ts";
import * as $auth from "./routes/auth.tsx";
import * as $auth_logout from "./routes/auth/logout.ts";
import * as $index from "./routes/index.tsx";
import * as $vocabularies_new from "./routes/vocabularies/new.tsx";
import * as $words_word_ from "./routes/words/[word].tsx";
import * as $words_index from "./routes/words/index.tsx";
import * as $NewWord from "./islands/NewWord.tsx";
import * as $QuizWord from "./islands/QuizWord.tsx";
import * as $Search from "./islands/Search.tsx";
import * as $WordDetail from "./islands/WordDetail.tsx";
import * as $WordList from "./islands/WordList.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/migrate.ts": $api_migrate,
    "./routes/api/vocabularies/[vocabularyId]/quiz/[wordId].ts":
      $api_vocabularies_vocabularyId_quiz_wordId_,
    "./routes/api/vocabularies/[vocabularyId]/words.ts":
      $api_vocabularies_vocabularyId_words,
    "./routes/api/vocabularies/[vocabularyId]/words/[wordId].ts":
      $api_vocabularies_vocabularyId_words_wordId_,
    "./routes/api/vocabularies/[vocabularyId]/words/rename.ts":
      $api_vocabularies_vocabularyId_words_rename,
    "./routes/auth.tsx": $auth,
    "./routes/auth/logout.ts": $auth_logout,
    "./routes/index.tsx": $index,
    "./routes/vocabularies/new.tsx": $vocabularies_new,
    "./routes/words/[word].tsx": $words_word_,
    "./routes/words/index.tsx": $words_index,
  },
  islands: {
    "./islands/NewWord.tsx": $NewWord,
    "./islands/QuizWord.tsx": $QuizWord,
    "./islands/Search.tsx": $Search,
    "./islands/WordDetail.tsx": $WordDetail,
    "./islands/WordList.tsx": $WordList,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
