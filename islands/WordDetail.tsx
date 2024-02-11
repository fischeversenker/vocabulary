import { computed, signal } from "@preact/signals";
import { createRef } from "preact";
import { WordClasses } from "../utils/client/word-classes.ts";
import { Word, WordClassType } from "../utils/server/words.ts";

interface WordDetailProps {
  word: Word;
  vocabularyId: string;
}

export function WordDetail({ word, vocabularyId }: WordDetailProps) {
  const translationRef = createRef();
  const wordClassRef = createRef();
  const hasChanges = signal(false);
  const saveIsDisabled = computed(() => !hasChanges.value);

  async function onSaveChanges(e: Event) {
    e.preventDefault();

    const translation = translationRef.current.textContent;
    const wordClass = wordClassRef.current.value as WordClassType;

    const response = await fetch(
      `/api/vocabularies/${vocabularyId}/words/${word.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...word,
          translation,
          class: wordClass,
        }),
      },
    );

    word = await response.json();
    hasChanges.value = false;
  }

  function onWordChange() {
    const translationChanged =
      word.translation !== translationRef.current?.textContent;
    const wordClassChanged = word.class !== wordClassRef.current?.value;
    hasChanges.value = translationChanged || wordClassChanged;
  }

  async function onDelete(e: Event) {
    e.preventDefault();

    await fetch(`/api/vocabularies/${vocabularyId}/words/${word.original}`, {
      method: "DELETE",
    });
    window.location.href = "/";
  }

  return (
    <>
      <h1 class="title">{word.original}</h1>
      <div class="block">
        <i
          contentEditable
          ref={translationRef}
          onInput={() => onWordChange()}
        >
          {word.translation}
        </i>
      </div>

      <div class="block has-text-grey">
        Word Class:{" "}
        <select ref={wordClassRef} onChange={() => onWordChange()}>
          {WordClasses.map((wordClass) => (
            <option
              selected={wordClass.value === word.class}
              value={wordClass.value}
            >
              {wordClass.label}
            </option>
          ))}
        </select>
      </div>

      <div class="block has-text-grey">
        <i>Added:</i> {new Date(word.createdAt).toLocaleString("de-DE")}
      </div>

      <div class="field is-grouped">
        <p class="control">
          <button
            class="button is-link"
            onClick={(e) => onSaveChanges(e)}
            disabled={saveIsDisabled}
          >
            Save changes
          </button>
        </p>
        <p class="control">
          <button class="button is-danger" onClick={(e) => onDelete(e)}>
            Delete word
          </button>
        </p>
      </div>
    </>
  );
}
