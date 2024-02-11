import { kv } from "./kv.ts";

export type Vocabulary = {
  id: string;
  foreignName: string;
  nativeName: string;
};

export async function getVocabulary(vocabularyId: string): Promise<Vocabulary> {
  const vocabulary = await kv.get<Vocabulary>(["vocabularies", vocabularyId]);
  if (!vocabulary.value) {
    throw new Error("Vocabulary not found");
  }

  return vocabulary.value;
}

export async function createVocabulary(
  rawVocabulary: Omit<Vocabulary, "id">,
): Promise<Vocabulary> {
  const vocabulary: Vocabulary = {
    foreignName: rawVocabulary.foreignName.trim(),
    nativeName: rawVocabulary.nativeName.trim(),
    id: crypto.randomUUID(),
  };

  await kv.set(["vocabularies", vocabulary.id], vocabulary);
  return vocabulary;
}
