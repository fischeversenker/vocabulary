import { JwtTokenContent } from "./auth.ts";
import { Word } from "./words.ts";

const kv = await Deno.openKv();

export type User = {
  id: string;
  auth0Id: string;
  profile: {
    name: string;
    givenName: string;
    familyName: string;
    pictureUrl: string;
  };
  languages: string[];
  settings: UserSettings;
};

export type UserSettings = {
  showOriginal: boolean;
};

export type Language = {
  id: string;
  name: string;
  foreignName: string;
  words: Word[];
};

export async function createUser(userData: JwtTokenContent): Promise<User> {
  const newUser = {
    id: crypto.randomUUID(),
    auth0Id: userData.sub,
    profile: {
      name: userData.name,
      givenName: userData.given_name,
      familyName: userData.family_name,
      pictureUrl: userData.picture,
    },
    languages: [],
    settings: { showOriginal: false },
  };

  await kv.set(["users", newUser.id], newUser);
  return newUser;
}

export async function getUser(userId: string) {
  const user = await kv.get<User>([
    "users",
    userId,
  ]);
  if (!user.value) {
    return null;
  }

  return user.value;
}

export async function getUserByAuth0Id(auth0Id: string) {
  const users = await kv.get<User[]>(["users"]);
  if (users.value === null) {
    return null;
  }

  return users.value.find((user) => user.auth0Id === auth0Id);
}

export async function getSettings(userId: string): Promise<UserSettings> {
  const userSettingsKV = await kv.get<UserSettings>(
    ["users", userId, "settings"],
  );

  return userSettingsKV.value ?? { showOriginal: false };
}

export async function saveSettings(userId: string, settings: UserSettings) {
  await kv.set(["users", userId, "settings"], settings);
}
