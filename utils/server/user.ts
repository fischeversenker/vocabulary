import { JwtTokenContent } from "./auth.ts";
import { kv } from "./kv.ts";
import { Vocabulary } from "./vocabularies.ts";

export type User = {
  id: string;
  auth0Id: string;
  profile: {
    name: string;
    givenName: string;
    familyName: string;
    pictureUrl: string;
  };
};

export type UserSettings = {
  showOriginal: boolean;
  activeVocabularyId?: string;
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

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const userSettingsKV = await kv.get<UserSettings>(
    ["users", userId, "settings"],
  );

  return userSettingsKV.value ?? { showOriginal: false };
}

export async function saveUserSettings(userId: string, settings: UserSettings) {
  await kv.set(["users", userId, "settings"], settings);
}

export async function getUserVocabularyIds(
  userId: string,
): Promise<string[]> {
  const vocabularyIds = await kv.get<string[]>([
    "users",
    userId,
    "vocabularies",
  ]);
  return vocabularyIds.value ?? [];
}

export async function addUserVocabulary(
  userId: string,
  vocabulary: Vocabulary,
) {
  const vocabularies = await getUserVocabularyIds(userId);
  vocabularies.push(vocabulary.id);
  await kv.set(["users", userId, "vocabularies"], vocabularies);
}
