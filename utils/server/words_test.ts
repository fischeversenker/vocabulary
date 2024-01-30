import { assert } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { getWordUrgency } from "./words.ts";

Deno.test("getWordUrgency", async (t) => {
  await t.step(
    "should make old uncertain words more urgent than new uncertain words",
    () => {
      const urgencyUncertainOldWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 10 days
            date: Date.now() - 1000 * 60 * 60 * 24 * 10,
            certainty: 1,
          },
        ],
      });
      const urgencyUncertainNewWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 2 hours
            date: Date.now() - 1000 * 60 * 60 * 2,
            certainty: 1,
          },
          {
            // subtract 1 hour
            date: Date.now() - 1000 * 60 * 60 * 1,
            certainty: 2,
          },
        ],
      });

      assert(
        urgencyUncertainOldWord > urgencyUncertainNewWord,
        `urgency of ${urgencyUncertainOldWord} should be greater than that of ${urgencyUncertainNewWord}`,
      );
    },
  );

  await t.step(
    "should make old certain words more urgent than new certain words",
    () => {
      const urgencyCertainOldWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 14 days
            date: Date.now() - 1000 * 60 * 60 * 24 * 14,
            certainty: 2,
          },
          {
            // subtract 10 days
            date: Date.now() - 1000 * 60 * 60 * 24 * 10,
            certainty: 3,
          },
        ],
      });
      const urgencyCertainNewWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 2 hours
            date: Date.now() - 1000 * 60 * 60 * 2,
            certainty: 3,
          },
        ],
      });

      assert(
        urgencyCertainOldWord > urgencyCertainNewWord,
        `urgency of ${urgencyCertainOldWord} should be greater than that of ${urgencyCertainNewWord}`,
      );
    },
  );

  await t.step(
    "should make new uncertain words more urgent than old certain words",
    () => {
      const urgencyUncertainNewWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 2 days
            date: Date.now() - 1000 * 60 * 60 * 24 * 2,
            certainty: 1,
          },
          {
            // subtract 1 day
            date: Date.now() - 1000 * 60 * 60 * 24,
            certainty: 1,
          },
        ],
      });
      const urgencyCertainOldWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 14 days
            date: Date.now() - 1000 * 60 * 60 * 24 * 14,
            certainty: 2,
          },
          {
            // subtract 10 days
            date: Date.now() - 1000 * 60 * 60 * 24 * 10,
            certainty: 3,
          },
        ],
      });

      assert(
        urgencyUncertainNewWord > urgencyCertainOldWord,
        `urgency of ${urgencyUncertainNewWord} should be greater than that of ${urgencyCertainOldWord}`,
      );
    },
  );

  await t.step(
    "should make new uncertain words more urgent than old certain words",
    () => {
      const urgencyUncertainOldWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 6 hours
            date: Date.now() - 1000 * 60 * 60 * 6,
            certainty: 1,
          },
        ],
      });
      const urgencyCertainNewWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 6 hours
            date: Date.now() - 1000 * 60 * 60 * 6,
            certainty: 3,
          },
          {
            // subtract 4 hours
            date: Date.now() - 1000 * 60 * 60 * 4,
            certainty: 3,
          },
          {
            // subtract 1 hours
            date: Date.now() - 1000 * 60 * 60 * 1,
            certainty: 3,
          },
        ],
      });

      assert(
        urgencyUncertainOldWord > urgencyCertainNewWord,
        `urgency of ${urgencyUncertainOldWord} should be greater than that of ${urgencyCertainNewWord}`,
      );
    },
  );

  await t.step(
    "should make more uncertain words more urgent than uncertain words",
    () => {
      const urgencyMoreUncertainWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 6 hours
            date: Date.now() - 1000 * 60 * 60 * 6,
            certainty: 1,
          },
          {
            // subtract 4 hours
            date: Date.now() - 1000 * 60 * 60 * 4,
            certainty: 1,
          },
        ],
      });
      const urgencyUncertainWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 6 hours
            date: Date.now() - 1000 * 60 * 60 * 6,
            certainty: 1,
          },
          {
            // subtract 4 hours
            date: Date.now() - 1000 * 60 * 60 * 4,
            certainty: 2,
          },
        ],
      });

      assert(
        urgencyMoreUncertainWord > urgencyUncertainWord,
        `urgency of ${urgencyMoreUncertainWord} should be greater than that of ${urgencyUncertainWord}`,
      );
    },
  );

  await t.step(
    "should make new uncertain words more urgent than new certain words",
    () => {
      const urgencyUncertainNewWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 6 hours
            date: Date.now() - 1000 * 60 * 60 * 6,
            certainty: 1,
          },
        ],
      });
      const urgencyCertainNewWord = getWordUrgency({
        original: "test",
        translation: "test",
        createdAt: Date.now() - 10000,
        history: [
          {
            // subtract 6 hours
            date: Date.now() - 1000 * 60 * 60 * 6,
            certainty: 3,
          },
          {
            // subtract 4 hours
            date: Date.now() - 1000 * 60 * 60 * 4,
            certainty: 3,
          },
        ],
      });

      assert(
        urgencyUncertainNewWord > urgencyCertainNewWord,
        `urgency of ${urgencyUncertainNewWord} should be greater than that of ${urgencyCertainNewWord}`,
      );
    },
  );
});
