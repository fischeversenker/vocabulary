import { Signal } from "@preact/signals";
import { WordWithNormalizedUrgency } from "../utils/words.ts";

interface WordListProps {
  knownWords: Signal<WordWithNormalizedUrgency[]>;
}

export function WordList({ knownWords }: WordListProps) {
  return (
    <table class="table is-striped is-fullwidth is-narrow block">
      <thead>
        <tr>
          <th>
            Original
          </th>
          <th>
            Translation
          </th>
          <th>
            Urgency
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
                <progress
                  class="progress is-small"
                  value={word.normalizedUrgency}
                  max="1"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
