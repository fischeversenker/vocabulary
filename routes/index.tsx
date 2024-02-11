import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { QuizWord } from "../islands/QuizWord.tsx";
import { getSettings, saveSettings } from "../utils/server/user.ts";
import { getMostUrgentWord } from "../utils/server/words.ts";
import { AppState } from "./_middleware.ts";

export default async function Quiz(req: Request, ctx: FreshContext<AppState>) {
  if (!ctx.state.user) {
    return Response.redirect("/auth", 302);
  }

  const url = new URL(req.url);
  const userSettings = await getSettings(ctx.state.user.id);
  const cookies = getCookies(req.headers);
  const continueAnyway = cookies.continueAnyway === "true";

  let showOriginal = userSettings.showOriginal ?? false;
  if (url.searchParams.has("original")) {
    showOriginal = url.searchParams.get("original") === "true";
    await saveSettings(ctx.state.user.id, { showOriginal });
  }

  return (
    <>
      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between"
        style="height: 100%;"
      >
        <div class="block">
          <div class="buttons has-addons is-centered">
            <a
              href="/?original=true"
              class={`button is-flex-grow-1 ${showOriginal ? "is-info" : ""}`}
            >
              <span>BG</span>
            </a>
            <a
              href="/?original=false"
              class={`button is-flex-grow-1 ${showOriginal ? "" : "is-info"}`}
            >
              <span>DE</span>
            </a>
          </div>
        </div>

        <QuizWord
          word={await getMostUrgentWord()}
          showOriginal={showOriginal}
          continueAnyway={continueAnyway}
        />
      </div>
    </>
  );
}
