import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidReact } from "@void/react/plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  fmt: {
    ignorePatterns: [],
  },
  plugins: [voidPlugin(), voidReact({ react: { compiler: true } }), tailwindcss()],
});
