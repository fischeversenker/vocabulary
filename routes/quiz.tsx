import { QuizWord } from "../islands/QuizWord.tsx";
import { getSettings, saveSettings } from "../utils/settings.ts";
import { getNextQuizWord } from "../utils/words.ts";

export default async function Quiz(req: Request) {
  const url = new URL(req.url);

  const userSettings = await getSettings();

  let showOriginal = userSettings.showOriginal ?? false;
  if (url.searchParams.has('original')) {
    showOriginal = url.searchParams.get('original') === 'true';
    await saveSettings({ showOriginal });
  }

  return <QuizWord word={await getNextQuizWord()} showOriginal={showOriginal} />;
}
