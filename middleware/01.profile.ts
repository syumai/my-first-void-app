import { defineMiddleware } from "void";
import { getDisplayName } from "../src/profile";

declare module "void" {
  interface CloudContextVariables {
    shared: { displayName: string | null };
  }
}

export default defineMiddleware(async (c, next) => {
  c.set("shared", { displayName: getDisplayName(c) });
  await next();
});
