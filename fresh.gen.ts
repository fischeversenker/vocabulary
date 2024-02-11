// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_quiz_wordId_ from "./routes/api/quiz/[wordId].ts";
import * as $api_words from "./routes/api/words.ts";
import * as $api_words_wordId_ from "./routes/api/words/[wordId].ts";
import * as $api_words_rename from "./routes/api/words/rename.ts";
import * as $auth from "./routes/auth.tsx";
import * as $auth_logout from "./routes/auth/logout.ts";
import * as $index from "./routes/index.tsx";
import * as $words from "./routes/words.tsx";
import * as $words_word_ from "./routes/words/[word].tsx";
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
    "./routes/api/quiz/[wordId].ts": $api_quiz_wordId_,
    "./routes/api/words.ts": $api_words,
    "./routes/api/words/[wordId].ts": $api_words_wordId_,
    "./routes/api/words/rename.ts": $api_words_rename,
    "./routes/auth.tsx": $auth,
    "./routes/auth/logout.ts": $auth_logout,
    "./routes/index.tsx": $index,
    "./routes/words.tsx": $words,
    "./routes/words/[word].tsx": $words_word_,
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
