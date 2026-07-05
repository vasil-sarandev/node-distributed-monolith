import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import type { Linter } from 'eslint';

const importOrderRule: Linter.RuleEntry = [
  'error',
  {
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
    pathGroups: [
      { pattern: '@shared', group: 'internal', position: 'before' },
      { pattern: '@shared/**', group: 'internal', position: 'before' },
      { pattern: '@api/**', group: 'internal' },
      { pattern: '@consumers/**', group: 'internal', position: 'after' },
    ],
    pathGroupsExcludedImportTypes: ['builtin', 'external'],
    alphabetize: {
      order: 'asc',
      caseInsensitive: true,
    },
  },
];

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.node,
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'import-x/order': importOrderRule,
      'no-empty-object-type': 'warn',
    },
  },
  prettier
);
