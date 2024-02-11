import { FreshContext, RouteConfig } from "$fresh/server.ts";
import { retrieveToken } from "../utils/server/auth.ts";
import { AppState } from "./_middleware.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
};

// Needs to be async for the Redirect to work.
// Not entirely sure why. Don't question it.
// deno-lint-ignore require-await
export default async function handler(
  req: Request,
  ctx: FreshContext<AppState>,
) {
  const reqUrl = new URL(req.url);
  const code = reqUrl.searchParams.get("code");

  if (!code) {
    return new Response("No code found in request URL", {
      status: 400,
    });
  }

  return retrieveToken(code, req.url).catch((err) => {
    return new Response(err.message, {
      status: 500,
    });
  });
}
