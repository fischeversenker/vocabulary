import { getNextQuizWord, getWord, Word } from "../utils/words.ts";

export default async function Quiz(req: Request) {
  const requestUrl = new URL(req.url);
  const reveal = requestUrl.searchParams.has("reveal");
  const showOriginal = reveal || Math.random() > 0.5;
  const showTranslation = reveal || !showOriginal;

  let quizWord: Word;
  if (requestUrl.searchParams.has("word")) {
    quizWord = await getWord(requestUrl.searchParams.get("word") as string);
  } else {
    quizWord = await getNextQuizWord();
  }

  return (
    <>
      <table class="table is-narrow is-narrow block">
        <tbody>
          <tr>
            <th>Original</th>
            <td>
              <a href={`/words/${quizWord.original}`}>
                {showOriginal ? quizWord.original : "*********"}
              </a>
            </td>
          </tr>
          <tr>
            <th>Translation</th>
            <td>
              <a href={`/words/${quizWord.original}`}>
                {showTranslation ? quizWord.translation : "*********"}
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="field is-grouped block">
        {!reveal && (
          <p class="control">
            <a
              href={`?word=${quizWord.original}&reveal`}
              class="button is-link"
            >
              Reveal
            </a>
          </p>
        )}
        <p class="control">
          <a href="/quiz" class="button is-link">Next Word</a>
        </p>
      </div>
    </>
  );
}
