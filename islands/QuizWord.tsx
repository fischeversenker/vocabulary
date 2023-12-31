import { useSignal } from "@preact/signals";
import { Certainty, WordWithUrgency } from "../utils/words.ts";

interface NewWordProps {
  word: WordWithUrgency;
  showOriginal: boolean;
}

export function QuizWord({ word, showOriginal }: NewWordProps) {
  const showTranslation = !showOriginal;

  const isRevealed = useSignal(false);

  function onRevealClicked(event: Event) {
    event.preventDefault();
    isRevealed.value = true;
  }

  async function answer(certainty: Certainty) {
    await fetch(`/api/quiz/${word.original}`, {
      method: "PATCH",
      body: JSON.stringify({
        certainty,
      }),
    });
    window.location.href = "/quiz";
  }

  globalThis.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      isRevealed.value = true;
    }
    // if a pressed answer 3
    // if s pressed answer 2
    // if d pressed answer 1
    // if f pressed reveal
    if (event.key === "a") {
      answer(3);
    }
    if (event.key === "s") {
      answer(2);
    }
    if (event.key === "d") {
      answer(1);
    }
    if (event.key === "f") {
      isRevealed.value = true;
    }
  });

  return (
    <>
      <div class="is-flex is-flex-direction-column has-text-centered py-6">
        <div class="is-size-3 has-text-weight-bold">
          {(isRevealed.value || showOriginal) ? word.original : "*********"}
        </div>
        <hr />
        <div class="is-size-3 has-text-weight-semibold">
          {(isRevealed.value || showTranslation)
            ? word.translation
            : "*********"}
        </div>
      </div>

      <div class="field is-grouped block is-justify-content-center">
        {!isRevealed.value && (
          <p class="control">
            <button
              onClick={(event) => onRevealClicked(event)}
              class="button"
            >
              Reveal<span class="is-hidden-mobile">
                &nbsp;(<code>f</code>)
              </span>
            </button>
          </p>
        )}
        {isRevealed.value && (
          <div
            class="field has-addons flex is-flex-direction-column is-align-items-center"
            style="gap: 16px;"
          >
            <p class="control">
              <button
                class="button is-success is-light"
                onClick={() => answer(3)}
              >
                Yes!<span class="is-hidden-mobile">
                  &nbsp;(<code>a</code>)
                </span>
              </button>
            </p>
            <p class="control">
              <button
                class="button is-warning is-light"
                onClick={() => answer(2)}
              >
                Yeah, right.<span class="is-hidden-mobile">
                  &nbsp;(<code>s</code>)
                </span>
              </button>
            </p>
            <p class="control">
              <button
                class="button is-danger is-light"
                onClick={() => answer(1)}
              >
                What?!<span class="is-hidden-mobile">
                  &nbsp;(<code>d</code>)
                </span>
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
