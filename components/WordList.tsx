import { Word as Word } from "../routes/index.tsx";

interface WordListProps {
  words: Word[];
}

export function WordList(props: WordListProps) {
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
        {props.words.map((word) => (
          <tr>
            <th>
              {word.original}
            </th>
            <td style="word-break:break-all;">
              {word.translation}
            </td>
            <td>
              <div class="has-text-grey-light">
                {word.createdAt.toLocaleDateString(["de"], {
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
                <button class="delete" type="submit"></button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
