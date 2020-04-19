module.exports = {
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  extends: [
    'airbnb-typescript/base',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'max-len': [2, 120, 2, {'ignoreComments': true}],
    'no-constant-condition': ["error", {"checkLoops": false}],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
  },
};
