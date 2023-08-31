import { useEffect } from "preact/hooks";
import { Word } from "../routes/index.tsx";
import { wordList } from "../utils/words.ts";

export function WordList() {
  useEffect(() => {
    fetch("/api/words").then(async (words) => {
      wordList.value = await words.json() as Word[];
    });
  }, []);

  async function onDelete(e: Event, word: string) {
    e.preventDefault();

    await fetch(`/api/words/${word}`, {
      method: "DELETE",
    });
    const words = await fetch("/api/words");
    wordList.value = await words.json() as Word[];
  }

  return (
    <table class="table is-striped is-fullwidth is-narrow">
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
        {wordList.value.map((word) => (
          <tr>
            <th>
              {word.original}
            </th>
            <td style="word-break:break-all;">
              {word.translation}
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
