const path = require('path');

module.exports = {
  root: true,
  plugins: ['prettier', 'import', 'jest'],
  overrides: [
    {
      files: '*.js',
      extends: ['eslint-config-airbnb/base'],
    },
    {
      files: '*.ts',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      settings: {
        'import/external-module-folders': ['./node_modules', './node_modules/@types'],
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
            moduleDirectory: [
              'node_modules',
              'node_modules/@types',
              path.resolve(path.join(__dirname, 'node_modules')),
              path.resolve(path.join(__dirname, 'node_modules', '@types')),
              'src',
            ],
          },
        },
      },
      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest/all',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
      ],
      rules: {
        'no-param-reassign': 'off',
        'arrow-body-style': ['error', 'always'],
        '@typescript-eslint/no-unused-vars': [
          'error',
          { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
      },
    },
  ],
};
