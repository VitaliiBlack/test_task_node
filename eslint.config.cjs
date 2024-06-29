const { FlatCompat } = require('@eslint/eslintrc');
const pluginPrettier = require('eslint-plugin-prettier');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: ['node_modules/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...require('globals').browser,
        ...require('globals').node,
        ...require('globals').mocha, // Добавлено mocha
        ...require('globals').jest, // Добавлено jest
      },
    },
  },
  ...compat.extends('airbnb-base'),
  ...compat.extends('prettier'),
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'import/no-amd': 'off',
      'import/newline-after-import': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-mutable-exports': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'global-require': 'off',
      'no-unused-expressions': 'off',
      camelcase: 'off',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'always',
          jsx: 'never',
        },
      ],
    },
  },
];
