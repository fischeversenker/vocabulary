import { getCookies } from "$std/http/cookie.ts";
import { deleteSession } from "../../utils/server/auth.ts";

export const handler = {
  async GET(req: Request) {
    const sessionId = getCookies(req.headers).sessionId;
    await deleteSession(sessionId);
    return new Response(null, {
      headers: {
        "set-cookie": "sessionId=; Max-Age=0; Path=/",
        Location: "/",
      },
      status: 302,
    });
  },
};
