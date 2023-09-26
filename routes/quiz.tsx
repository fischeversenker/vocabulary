import { getNextQuizWord, getWord, Word } from "../utils/words.ts";

export default async function Quiz(req: Request) {
  const requestUrl = new URL(req.url);
  const reveal = requestUrl.searchParams.has("reveal");
  const showOriginal = reveal || Math.random() > 0.5;

  let quizWord: Word;
  if (requestUrl.searchParams.has("word")) {
    quizWord = await getWord(requestUrl.searchParams.get("word") as string);
  } else {
    quizWord = await getNextQuizWord();
  }

  return (
    <>
      <p class="block">
        {showOriginal ? "Original:" : "Translation:"}{" "}
        {showOriginal ? quizWord.original : quizWord.translation}
      </p>
      {reveal && (
        <p class="block">
          {showOriginal ? "Translation:" : "Original:"}{" "}
          {showOriginal ? quizWord.translation : quizWord.original}
        </p>
      )}

      <div class="field is-grouped block">
        <p class="control">
          <a href={`?word=${quizWord.original}&reveal`} class="button is-link">
            Reveal
          </a>
        </p>
        <p class="control">
          <a href="/quiz" class="button is-link">Next</a>
        </p>
      </div>
    </>
  );
}
