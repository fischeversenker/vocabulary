import { NewWord } from "../islands/NewWord.tsx";
import { Search } from "../islands/Search.tsx";
import { WordList } from "../islands/WordList.tsx";
import { filteredWordList, getWordList } from "../utils/words.ts";

export default async function Home() {
  const knownWords = await getWordList();
  return (
    <>
      <Search
        knownWords={knownWords}
        filteredWords={filteredWordList}
      />
      <NewWord />
      <WordList words={filteredWordList}></WordList>
    </>
  );
}
