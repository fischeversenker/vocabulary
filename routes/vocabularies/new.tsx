import { FreshContext } from "$fresh/server.ts";
import {
  addUserVocabulary,
  getUserSettings,
  saveUserSettings,
} from "../../utils/server/user.ts";
import { createVocabulary } from "../../utils/server/vocabularies.ts";
import { AppState } from "../_middleware.ts";

export default async function NewVocabulary(
  req: Request,
  ctx: FreshContext<AppState>,
) {
  if (!ctx.state.user) {
    return Response.redirect("/auth", 302);
  }

  const newVocabulary = await createVocabulary({
    foreignName: "Български",
    nativeName: "Deutsch",
  });

  await addUserVocabulary(ctx.state.user.id, newVocabulary);

  const userSettings = await getUserSettings(ctx.state.user.id);
  await saveUserSettings(ctx.state.user.id, {
    ...userSettings,
    activeVocabularyId: newVocabulary.id,
  });

  return Response.redirect(`/vocabularies/${newVocabulary.id}`, 302);
}
