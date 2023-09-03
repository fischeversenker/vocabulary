import { NewWord } from "../islands/NewWord.tsx";
import { WordList } from "../islands/WordList.tsx";
import { getWordList, wordList } from "../utils/words.ts";

export default async function Home() {
  wordList.value = await getWordList();

  return (
    <div class="container is-max-desktop">
      <NewWord knownWords={wordList}></NewWord>
      <WordList knownWords={wordList}></WordList>
    </div>
  );
}
