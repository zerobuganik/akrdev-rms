import eslintConfigTurbo from 'eslint-config-turbo/flat'

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**'],
  },
  ...eslintConfigTurbo,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
    },
  },
]
