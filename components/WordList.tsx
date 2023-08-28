import { Word } from "../components/Word.tsx";
import { Word as IWord } from "../routes/index.tsx";

interface WordListProps {
  words: IWord[];
}

export function WordList(props: WordListProps) {
  return [props.words.map((word) => <Word {...word}></Word>)];
}
