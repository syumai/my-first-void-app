import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

export const DISPLAY_NAME_COOKIE = "display_name";
export const DISPLAY_NAME_MAX_LENGTH = 32;
export const DEFAULT_DISPLAY_NAME = "ゲスト";

export function normalizeDisplayName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim();
  if (name.length === 0 || name.length > DISPLAY_NAME_MAX_LENGTH) return null;
  return name;
}

export function getDisplayName(c: Context): string | null {
  return normalizeDisplayName(getCookie(c, DISPLAY_NAME_COOKIE));
}

export function setDisplayName(c: Context, name: string) {
  setCookie(c, DISPLAY_NAME_COOKIE, name, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: new URL(c.req.url).protocol === "https:",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function getAuthorName(c: Context): string {
  return getDisplayName(c) ?? DEFAULT_DISPLAY_NAME;
}
