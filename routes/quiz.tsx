import { QuizWord } from "../islands/QuizWord.tsx";
import { getNextQuizWord } from "../utils/words.ts";

export default async function Quiz() {
  return <QuizWord word={await getNextQuizWord()} />;
}
