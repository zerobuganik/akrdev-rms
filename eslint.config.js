import eslintConfigTurbo from 'eslint-config-turbo/flat'

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**', '**/.next/**'],
  },
  ...eslintConfigTurbo,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
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
