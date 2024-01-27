import { Signal } from "@preact/signals";
import { createRef } from "preact";
import { WordClasses } from "../utils/client.ts";
import { WordWithNormalizedUrgency } from "../utils/words.ts";

type Props = {
  knownWords: WordWithNormalizedUrgency[];
  filteredWords: Signal<WordWithNormalizedUrgency[]>;
};

export function Search({ knownWords, filteredWords }: Props) {
  filteredWords.value = knownWords;
  const searchRef = createRef();
  let searchString = "";
  let selectedClass = "all";

  function onTextSearchChanged(event: Event) {
    searchString = (event.target as HTMLInputElement).value.trim();
    filter();
  }

  function onClassChanged(event: Event) {
    selectedClass = (event.target as HTMLSelectElement).value;
    filter();
  }

  function filter() {
    filteredWords.value = knownWords.filter((word) => {
      const matchesSearchString = searchString.length > 0
        ? word.original.includes(searchString) ||
          word.translation.includes(searchString)
        : true;
      const matchesSelectedClass = selectedClass !== "all"
        // TODO: remove workaround for "unknown" when all words have a class
        ? selectedClass === "unknown"
          ? word.class === undefined
          : word.class === selectedClass
        : true;
      return matchesSearchString && matchesSelectedClass;
    });
  }

  return (
    <div class="block is-flex is-align-items-center">
      <input
        class="input"
        ref={searchRef}
        onInput={(event) => onTextSearchChanged(event)}
        type="search"
      >
      </input>

      <select class="select ml-2" onChange={(event) => onClassChanged(event)}>
        <option value="all" selected={selectedClass === "all"}>All</option>
        {WordClasses.map((wordClass) => (
          <option
            selected={wordClass.value === selectedClass}
            value={wordClass.value}
          >
            {wordClass.label}
          </option>
        ))}
      </select>
    </div>
  );
}
