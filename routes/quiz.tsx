import { getCookies } from "$std/http/cookie.ts";
import { QuizWord } from "../islands/QuizWord.tsx";
import { getSettings, saveSettings } from "../utils/settings.ts";
import { getMostUrgentWord } from "../utils/words.ts";

export default async function Quiz(req: Request) {
  const url = new URL(req.url);

  const userSettings = await getSettings();
  const cookies = getCookies(req.headers);
  const continueAnyway = cookies.continueAnyway === "true";

  let showOriginal = userSettings.showOriginal ?? false;
  if (url.searchParams.has("original")) {
    showOriginal = url.searchParams.get("original") === "true";
    await saveSettings({ showOriginal });
  }

  return (
    <QuizWord
      word={await getMostUrgentWord()}
      showOriginal={showOriginal}
      continueAnyway={continueAnyway}
    />
  );
}
