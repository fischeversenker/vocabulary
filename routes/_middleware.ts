import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  deleteSession,
  getSession,
  redirectToLogin,
} from "../utils/server/auth.ts";
import { getUser, User } from "../utils/server/user.ts";

export interface AppState {
  user?: User;
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

  if (requestUrl.pathname === "/api/migrate") {
    return ctx.next();
  }

  const cookies = getCookies(req.headers);
  const sessionId = cookies.sessionId;

  const session = await getSession(sessionId);

  const authRedirectUrl = new URL("/auth", req.url);
  if (session === null) {
    return redirectToLogin(authRedirectUrl.href);
  }

  const user = await getUser(session.userId);
  if (!user) {
    await deleteSession(sessionId);
    return redirectToLogin(authRedirectUrl.href);
  }

  ctx.state.user = user;
  return ctx.next();
}
