import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["eslint.config.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es6,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        },
        typescript: {
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        }
      }
    },
    env: {
      browser: true, // For browser globals like window, document
      node: true,    // For Node.js globals like NodeJS, process
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: pluginImport,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,
      ...pluginImport.configs.typescript.rules,

      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
  },
];
