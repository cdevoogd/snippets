// @ts-check
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";

export default defineConfig(
  globalIgnores(["**/.*", "**/*.d.ts", "**/*.test-d.ts", "**/examples/", "**/dist/", "**/build/"]),

  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,

  // Setup typed linting.
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
    },
  },

  // Disabled typed linting in JavaScript files.
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // Disable all formatting rules.
  prettierConfig,

  // Tweak some rules in all files.
  {
    rules: {
      // Allow empty catch blocks.
      "no-empty": ["error", { allowEmptyCatch: true }],

      // Allow unused variables for sibling properties in destructuring (used to omit properties)
      // or starting with `_`.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      // Allow using `any` in rest parameter arrays, e.g. `(...args: any[]) => void`.
      "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
    },
  },
);
