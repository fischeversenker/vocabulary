import { encodeHex } from "https://deno.land/std@0.213.0/encoding/hex.ts";
import { kv } from "./kv.ts";
import { createUser, getUserByAuth0Id } from "./user.ts";

export type UserSession = {
  sessionId: string;
  userId: string;
  expiresAt: number;
  accessToken: string;
  scope: string;
};

export type JwtTokenContent = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  middle_name: string;
  profile: string;
  picture: string;
  email: string;
};

export async function getSession(
  sessionId: string | undefined,
): Promise<UserSession | null> {
  if (sessionId === undefined) {
    return null;
  }

  const session = await kv.get<UserSession>(["sessions", sessionId]);
  if (session.value === null) {
    return null;
  }

  if (session.value.expiresAt < Date.now()) {
    deleteSession(sessionId);
    return null;
  }

  return session.value;
}

export async function deleteSession(sessionId: string) {
  await kv.delete(["sessions", sessionId]);
}

export function redirectToLogin(redirectUrl: string) {
  const auth0Domain = Deno.env.get("AUTH0_DOMAIN");
  const oauthConfig = {
    authorizationUrl: `${auth0Domain}/authorize`,
    clientId: Deno.env.get("AUTH0_CLIENT_ID") ?? "CLIENT ID MISSING",
    scope: "openid profile",
  };

  const authorizeURL = new URL(oauthConfig.authorizationUrl);

  authorizeURL.searchParams.set("response_type", "code");
  authorizeURL.searchParams.set("client_id", oauthConfig.clientId);
  authorizeURL.searchParams.set("redirect_uri", redirectUrl);
  authorizeURL.searchParams.set("scope", oauthConfig.scope);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeURL.toString(),
    },
  });
}

export async function retrieveToken(code: string, redirectUrl: string) {
  const data = new URLSearchParams({
    "grant_type": "authorization_code",
    "client_id": Deno.env.get("AUTH0_CLIENT_ID") ?? "CLIENT ID MISSING",
    "client_secret": Deno.env.get("AUTH0_CLIENT_SECRET") ??
      "CLIENT SECRET MISSING",
    "code": code,
    "redirect_uri": redirectUrl,
  });

  const tokenResponse = await fetch(
    `${Deno.env.get("AUTH0_DOMAIN")}/oauth/token`,
    {
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
  const token = await tokenResponse.json();

  if (!tokenResponse.ok) {
    throw new Error(token.error_description);
  }

  const userData = parseJwt(token.id_token);
  const user = await getUserByAuth0Id(userData.sub) ??
    await createUser(userData);
  const userId: string = user.id;

  const sessionHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token.access_token),
  );
  const sessionId = encodeHex(sessionHash);
  await kv.set(["sessions", sessionId], {
    sessionId,
    accessToken: token.access_token,
    userId: userId,
    scope: token.scope,
    expiresAt: Date.now() + (token.expires_in * 1000),
  }, { expireIn: token.expires_in * 1000 });

  return new Response(null, {
    status: 302,
    headers: {
      "Location": "/",
      "Set-Cookie": `sessionId=${sessionId}; path=/; secure; HttpOnly;`,
    },
  });
}

function parseJwt(token: string): JwtTokenContent {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64).split("").map(function (c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""),
  );

  return JSON.parse(jsonPayload);
}
