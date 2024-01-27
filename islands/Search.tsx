import { Signal } from "@preact/signals";
import { createRef } from "preact";
import { WordWithNormalizedUrgency } from "../utils/words.ts";

type Props = {
  knownWords: WordWithNormalizedUrgency[];
  filteredWords: Signal<WordWithNormalizedUrgency[]>;
};

export function Search({ knownWords, filteredWords }: Props) {
  filteredWords.value = knownWords;
  const searchRef = createRef();

  function searchChanged(event: Event) {
    filteredWords.value = knownWords.filter((word) =>
      JSON.stringify(word).includes((event.target as HTMLInputElement).value)
    );
  }

  return (
    <>
      <div class="block">
        <input
          class="input"
          ref={searchRef}
          onInput={(event) => searchChanged(event)}
          type="search"
        >
        </input>
      </div>
    </>
  );
}
