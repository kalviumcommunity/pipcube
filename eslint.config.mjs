import next from "eslint-config-next";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  next,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "no-console": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "prettier/prettier": "error",
    },
  },
];
