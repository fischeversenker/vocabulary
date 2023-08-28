import { IS_BROWSER } from "$fresh/runtime.ts";
import { createRef } from "preact";
import { useEffect } from "preact/hooks";

export function NewWord() {
  const ref = createRef();

  useEffect(() => {
    if (!IS_BROWSER) {
      return;
    }

    const url = new URL(window.location.href);

    if (url?.searchParams.get("focused")) {
      ref.current?.focus();
    }
  });

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
        ref={ref}
      />
      <input
        class="input"
        type="text"
        name="translation"
        placeholder="Translation"
        required
      />
      <button class="button is-primary has-text-weight-bold" type="submit">
        +
      </button>
    </form>
  );
}
