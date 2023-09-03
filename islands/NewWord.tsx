import { Signal } from "@preact/signals";
import { createRef } from "preact";
import { Word } from "../utils/words.ts";

interface NewWordProps {
  knownWords: Signal<Word[]>;
}

export function NewWord({ knownWords }: NewWordProps) {
  const originalRef = createRef();
  const translationRef = createRef();

  async function onSubmit(e: Event) {
    e.preventDefault();
    const original = originalRef.current.value;
    const translation = translationRef.current.value;

    const newWord = {
      original,
      translation,
    };

    await fetch(`/api/words/${original}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWord),
    });
    const words = await fetch("/api/words");
    knownWords.value = await words.json() as Word[];

    originalRef.current.value = "";
    translationRef.current.value = "";
  }

  return (
    <form
      class="block"
      style="display:flex;gap:0.5rem;padding-top:1rem;"
      method="POST"
    >
      <input
        class="input"
        type="text"
        name="original"
        placeholder="Original"
        required
        ref={originalRef}
      />
      <input
        class="input"
        type="text"
        name="translation"
        placeholder="Translation"
        required
        ref={translationRef}
      />
      <button
        class="button is-primary has-text-weight-bold"
        type="submit"
        onClick={(e) => onSubmit(e)}
      >
        +
      </button>
    </form>
  );
}
