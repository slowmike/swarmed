module.exports = {
  extends: 'airbnb',
  env: {
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-undef": "off",
    "func-names": "off",
    "jsx-a11y": "off",
    "no-plusplus": "off",
  }
};