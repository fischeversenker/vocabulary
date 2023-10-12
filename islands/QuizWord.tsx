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
              Reveal
            </button>
          </p>
        )}
        {isRevealed.value && (
          <div class="field has-addons">
            <p class="control">
              <button
                class="button is-danger is-light"
                onClick={() => answer(1)}
              >
                What?!
              </button>
            </p>
            <p class="control">
              <button
                class="button is-warning is-light"
                onClick={() => answer(2)}
              >
                Yeah, right.
              </button>
            </p>
            <p class="control">
              <button
                class="button is-success is-light"
                onClick={() => answer(3)}
              >
                Yes!
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
