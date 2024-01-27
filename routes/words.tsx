import { WordList } from "../components/WordList.tsx";
import { NewWord } from "../islands/NewWord.tsx";
import { getWordList, wordList } from "../utils/words.ts";

export default async function Home() {
  wordList.value = await getWordList();

  return (
    <>
      <NewWord knownWords={wordList}></NewWord>
      <WordList knownWords={wordList}></WordList>
    </>
  );
}
