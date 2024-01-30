import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  getSession,
  redirectToLogin,
  type UserSession,
} from "../utils/server/auth.ts";

export interface AppState {
  session: UserSession;
}

export async function handler(
  req: Request,
  ctx: FreshContext<AppState>,
) {
  if (ctx.destination !== "route") {
    return ctx.next();
  }

  const requestUrl = new URL(req.url);
  if (requestUrl.pathname === "/auth" && requestUrl.searchParams.has("code")) {
    return ctx.next();
  }

  const cookies = getCookies(req.headers);
  const sessionId = cookies.sessionId;

  const session = await getSession(sessionId);

  if (session === null) {
    const redirectUrl = new URL("/auth", req.url);
    return redirectToLogin(redirectUrl.href);
  }

  ctx.state.session = session;
  return ctx.next();
}
