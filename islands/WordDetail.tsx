import { signal } from "@preact/signals";
import { createRef } from "preact";
import { Word } from "../utils/words.ts";

interface WordDetailProps {
  word: Word;
}

export function WordDetail({ word }: WordDetailProps) {
  const translationRef = createRef();
  const saveIsDisabled = signal(true);

  async function onSaveChanges(e: Event) {
    e.preventDefault();
    console.log(word.createdAt);

    const translation = translationRef.current.textContent;

    await fetch(`/api/words/${word.original}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...word,
        translation,
      }),
    });

    word.translation = translation;
    saveIsDisabled.value = true;
  }

  function onTranslationChange() {
    saveIsDisabled.value =
      word.translation === translationRef.current?.textContent;
  }

  async function onDelete(e: Event) {
    e.preventDefault();

    await fetch(`/api/words/${word.original}`, {
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
          onInput={() => onTranslationChange()}
        >
          {word.translation}
        </i>
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
