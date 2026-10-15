import { defineHandler } from "void";
import { DISPLAY_NAME_MAX_LENGTH, normalizeDisplayName, setDisplayName } from "../../src/profile";

export const PUT = defineHandler(async (c) => {
  const body = await c.req.json<{ displayName?: unknown }>().catch(() => ({}) as const);
  const displayName = normalizeDisplayName("displayName" in body ? body.displayName : undefined);
  if (!displayName) {
    return c.json(
      { errors: { displayName: `表示名は1〜${DISPLAY_NAME_MAX_LENGTH}文字で入力してください` } },
      422,
    );
  }
  setDisplayName(c, displayName);
  return c.json({ displayName });
});
