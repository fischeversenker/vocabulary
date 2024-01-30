import { retrieveToken } from "../utils/server/auth.ts";

export default function handler(req: Request) {
  const reqUrl = new URL(req.url);
  const code = reqUrl.searchParams.get("code");

  if (!code) {
    return new Response("No code found in request URL", {
      status: 400,
    });
  }

  return retrieveToken(code, req.url);
}
