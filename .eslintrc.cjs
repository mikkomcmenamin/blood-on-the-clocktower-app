/* eslint-disable */

module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "unused-imports"],
  rules: {
    // allow @ts-ignore
    "@typescript-eslint/ban-ts-comment": "off",
    // allow console.log
    "no-console": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // allow this aliasing
    "@typescript-eslint/no-this-alias": "off",
    // allow empty functions
    "@typescript-eslint/no-empty-function": "off",
    // allow switch-case fallthrough for exhaustive switch statements (i.e. TS unions)
    "no-fallthrough": "off",
    // disallow unused vars and imports (imports auto-fixable with 'npm run lint:fix')
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      // allow unused variables starting with an underscore
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
  ignorePatterns: ["node_modules", "dist", "public"],
};
