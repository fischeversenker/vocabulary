import { useSignal } from "@preact/signals";
import { Certainty, Word } from "../utils/words.ts";

interface NewWordProps {
  word: Word;
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
      <table class="table is-narrow is-narrow block">
        <tbody>
          <tr>
            <th>Original</th>
            <td>
              {(isRevealed.value || showOriginal) ? word.original : "*********"}
            </td>
          </tr>
          <tr>
            <th>Translation</th>
            <td>
              {(isRevealed.value || showTranslation)
                ? word.translation
                : "*********"}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="field is-grouped block">
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
              <button class="button is-danger" onClick={() => answer(1)}>
                What?!
              </button>
            </p>
            <p class="control">
              <button class="button is-warning" onClick={() => answer(2)}>
                Yeah, right.
              </button>
            </p>
            <p class="control">
              <button class="button is-success" onClick={() => answer(3)}>
                Yes!
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
