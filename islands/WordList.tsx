import { Signal } from "@preact/signals";
import { Word } from "../utils/words.ts";

interface WordListProps {
  knownWords: Signal<Word[]>;
}

export function WordList({ knownWords }: WordListProps) {
  async function onDelete(e: Event, word: string) {
    e.preventDefault();

    await fetch(`/api/words/${word}`, {
      method: "DELETE",
    });
    const words = await fetch("/api/words");
    knownWords.value = await words.json() as Word[];
  }

  return (
    <table class="table is-striped is-fullwidth is-narrow block">
      <thead>
        <tr>
          <th>
            <abbr title="Original">Orig</abbr>
          </th>
          <th>
            <abbr title="Translation">Trans</abbr>
          </th>
          <th>
            Added
          </th>
          <th>
          </th>
        </tr>
      </thead>
      <tbody>
        {knownWords.value.map((word) => (
          <tr>
            <th>
              <a href={`/words/${word.original}`}>{word.original}</a>
            </th>
            <td style="word-break:break-all;">
              <a href={`/words/${word.original}`}>{word.translation}</a>
            </td>
            <td>
              <div class="has-text-grey-light">
                {new Date(word.createdAt).toLocaleDateString(["de"], {
                  dateStyle: "short",
                })}
              </div>
            </td>
            <td>
              <form method="POST">
                <input
                  type="hidden"
                  name="wordToDelete"
                  value={word.original}
                />
                <button
                  class="delete"
                  type="submit"
                  onClick={(e) => onDelete(e, word.original)}
                >
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
