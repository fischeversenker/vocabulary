import { createRef } from "preact";
import { Word } from "../routes/index.tsx";
import { wordList } from "../utils/words.ts";

export function NewWord() {
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
    wordList.value = await words.json() as Word[];

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
