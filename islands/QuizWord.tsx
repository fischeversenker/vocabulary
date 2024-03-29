import { useSignal } from "@preact/signals";
import { Certainty, WordWithUrgency } from "../utils/server/words.ts";

interface NewWordProps {
  vocabularyId: string;
  word: WordWithUrgency;
  showOriginal: boolean;
  continueAnyway: boolean;
}

export function QuizWord(
  { vocabularyId, word, showOriginal, continueAnyway }: NewWordProps,
) {
  const showTranslation = !showOriginal;

  const isRevealed = useSignal(false);

  function onRevealClicked(event: Event) {
    event.preventDefault();
    isRevealed.value = true;
  }

  function onContinueAnywayClicked(event: Event) {
    event.preventDefault();
    const now = new Date();
    const nextDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getUTCHours() + 2,
      now.getUTCMinutes(),
    );
    document.cookie =
      `continueAnyway=true; expires=${nextDay.toUTCString()}; path=/; secure;`;
    window.location.reload();
  }

  async function answer(certainty: Certainty) {
    await fetch(`/api/vocabularies/${vocabularyId}/quiz/${word.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        certainty,
      }),
    });
    window.location.reload();
  }

  globalThis.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      isRevealed.value = true;
    }
    // if a pressed answer 3 (Yes!)
    // if s pressed answer 2 (Yeah, right.)
    // if d pressed answer 1 (What?!)
    // if f pressed reveal
    if (event.key === "d") {
      answer(3);
    }
    if (event.key === "s") {
      answer(2);
    }
    if (event.key === "a") {
      answer(1);
    }
    if (event.key === "f") {
      isRevealed.value = true;
    }
  });

  // TODO: refine the threshold
  if (word.urgency < 15000 && !continueAnyway) {
    return (
      <>
        <div class="is-flex is-flex-direction-column has-text-centered py-6">
          <div class="is-size-4 has-text-weight-bold">
            That's all for now 🎉
          </div>
          <div class="is-size-5 pt-1">
            The next word would have been{" "}
            "{showOriginal ? word.original : word.translation}"
          </div>
        </div>

        <div class="field block is-grouped is-justify-content-center">
          <button
            onClick={(event) => onContinueAnywayClicked(event)}
            class="button is-info is-light"
          >
            Continue anyways
          </button>
        </div>
      </>
    );
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
              Reveal<span class="is-hidden-mobile">
                &nbsp;(<code>f</code>)
              </span>
            </button>
          </p>
        )}
        {isRevealed.value && (
          <div class="buttons has-addons is-centered">
            <button
              class="button is-danger is-light"
              onClick={() => answer(1)}
            >
              What?!<span class="is-hidden-mobile">
                &nbsp;(<code>a</code>)
              </span>
            </button>
            <button
              class="button is-warning is-light"
              onClick={() => answer(2)}
            >
              Yeah, right.<span class="is-hidden-mobile">
                &nbsp;(<code>s</code>)
              </span>
            </button>
            <button
              class="button is-success is-light"
              onClick={() => answer(3)}
            >
              Yes!<span class="is-hidden-mobile">
                &nbsp;(<code>d</code>)
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
