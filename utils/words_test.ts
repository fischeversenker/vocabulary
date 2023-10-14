import { assert } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { getWordUrgency } from "./words.ts";

Deno.test('getWordUrgency', async (t) => {
  await t.step('should make old uncertain words more urgent than new uncertain words', () => {
    const urgencyUncertainOldWord = getWordUrgency({
      original: 'test',
      translation: 'test',
      createdAt: Date.now()-10000,
      history: [
        {
          date: Date.now()-100000,
          certainty: 1,
        },
      ],
    });
    const urgencyUncertainNewWord = getWordUrgency({
      original: 'test',
      translation: 'test',
      createdAt: Date.now()-10000,
      history: [
        {
          date: Date.now()-10000,
          certainty: 1,
        },
      ],
    });

    assert(urgencyUncertainOldWord > urgencyUncertainNewWord, "urgency should be greater than 1");
  });

  await t.step('should make old certain words more urgent than new certain words', () => {
    const urgencyUncertainOldWord = getWordUrgency({
      original: 'test',
      translation: 'test',
      createdAt: Date.now()-10000,
      history: [
        {
          date: Date.now()-100000,
          certainty: 3,
        },
      ],
    });
    const urgencyUncertainNewWord = getWordUrgency({
      original: 'test',
      translation: 'test',
      createdAt: Date.now()-10000,
      history: [
        {
          date: Date.now()-10000,
          certainty: 3,
        },
      ],
    });

    assert(urgencyUncertainOldWord > urgencyUncertainNewWord, "urgency should be greater than 1");
  });

  await t.step('should make new uncertain words more urgent than old certain words', () => {
    const urgencyUncertainOldWord = getWordUrgency({
      original: 'test',
      translation: 'test',
      createdAt: Date.now()-10000,
      history: [
        {
          date: Date.now()-100000,
          certainty: 1,
        },
      ],
    });
    const urgencyCertainNewWord = getWordUrgency({
      original: 'test',
      translation: 'test',
      createdAt: Date.now()-10000,
      history: [
        {
          date: Date.now()-10000,
          certainty: 3,
        },
      ],
    });

    assert(urgencyUncertainOldWord > urgencyCertainNewWord, "urgency should be greater than 1");
  });
});
