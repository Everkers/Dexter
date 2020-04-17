module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: ["prettier", "airbnb-base"],
  plugins: ["prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    "prettier/prettier": ["error", { singleQuote: true }],
  },
};
