import { RouteContext } from "$fresh/server.ts";
import { QuizWord } from "../islands/QuizWord.tsx";
import { getNextQuizWord } from "../utils/words.ts";

export default async function Quiz(_req: Request, ctx: RouteContext) {
  const url = new URL(_req.url);
  let showOriginal = window.localStorage.getItem('showOriginal') === 'true';
  if (url.searchParams.has('original')) {
    showOriginal = url.searchParams.get('original') === 'true';
    // TODO: might want to turn this into KV for consistency
    localStorage.setItem('showOriginal', showOriginal.toString());
  }

  return <QuizWord word={await getNextQuizWord()} showOriginal={showOriginal} />;
}
