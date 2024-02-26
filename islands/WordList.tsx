import { Signal } from "@preact/signals";
import { WordWithNormalizedUrgency } from "../utils/server/words.ts";

interface WordListProps {
  words: Signal<WordWithNormalizedUrgency[]>;
  sortBy: "original" | "translation" | "urgency";
  sortOrder: "asc" | "desc";
}

export function WordList({ words, sortBy, sortOrder }: WordListProps) {
  function getSearchString(
    clicked: "original" | "translation" | "urgency",
    sortBy: "original" | "translation" | "urgency",
    sortOrder: "asc" | "desc",
  ): string {
    const isClickedSortBy = sortBy === clicked;
    const newSortOrder = isClickedSortBy
      ? (sortOrder === "asc" ? "desc" : "asc")
      : "asc";
    return `?sortBy=${clicked}&sortOrder=${newSortOrder}`;
  }

  function getSortLinkClass(column: string) {
    const isSortedColumn = sortBy === column;
    if (!isSortedColumn) {
      return "";
    }
    return `sorted ${sortOrder}`;
  }

  return (
    <table class="table is-striped is-fullwidth is-narrow block">
      <thead>
        <tr>
          <th>
            <a
              href={getSearchString("original", sortBy, sortOrder)}
              class={`${sortOrder} ${sortBy === "original" ? "sorted" : ""}`}
            >
              Original
            </a>
          </th>
          <th>
            <a
              href={getSearchString("translation", sortBy, sortOrder)}
              class={`${sortOrder} ${sortBy === "translation" ? "sorted" : ""}`}
            >
              Translation
            </a>
          </th>
          <th>
            <a
              href={getSearchString("urgency", sortBy, sortOrder)}
              class={`${sortOrder} ${sortBy === "urgency" ? "sorted" : ""}`}
            >
              Urgency
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        {words.value.map((word) => (
          <tr>
            <th>
              <a href={`/words/${word.id}`}>{word.original}</a>
            </th>
            <td style="word-break:break-all;">
              <a href={`/words/${word.id}`}>{word.translation}</a>
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
