export const USER_SETTINGS_KV_PATH = ["users", "fischeversenker", "settings"];

export async function getSettings(): Promise<{ showOriginal: boolean }> {
  const kv = await Deno.openKv();
  const userSettingsKV = await kv.get<{ showOriginal: boolean }>(
    USER_SETTINGS_KV_PATH,
  );

  return userSettingsKV.value ?? { showOriginal: false };
}

export async function saveSettings(settings: { showOriginal: boolean }) {
  const kv = await Deno.openKv();
  kv.set(USER_SETTINGS_KV_PATH, settings);
}
