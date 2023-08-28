import { Word } from "../routes/index.tsx";

export function Word(word: Word) {
  return (
    <div style="display: grid; grid-template-columns: repeat(2, 4fr) 1fr; gap: 1rem;">
      <span>{word.original}</span>
      <i>{word.translation}</i>
      <form method="POST">
        <input type="hidden" name="wordToDelete" value={word.original} />
        <button class="delete" type="submit"></button>
      </form>
    </div>
  );
}
