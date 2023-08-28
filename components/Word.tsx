import { Word } from "../routes/index.tsx";

export function Word(word: Word) {
  return (
    <div style="display: grid; grid-template-columns: repeat(2, 4fr) 2fr 1fr; gap: 1rem;">
      <b>{word.original}</b>
      <div>{word.translation}</div>
      <i class="has-text-grey-light">
        ({word.createdAt.toLocaleDateString(["de"], { dateStyle: "short" })})
      </i>
      <form method="POST">
        <input type="hidden" name="wordToDelete" value={word.original} />
        <button class="delete" type="submit"></button>
      </form>
    </div>
  );
}
