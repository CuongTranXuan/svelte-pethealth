import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';

export default [
  // Apply to all files
  js.configs.recommended,

  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': ts
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  // Svelte configuration
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.svelte'],
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly'
      }
    },
    plugins: {
      svelte
    },
    rules: {
      'svelte/no-unused-svelte-ignore': 'error',
      'svelte/no-at-debug-tags': 'warn',
      'no-console': ['warn', { allow: ['error'] }]
    }
  },

  // Global configuration
  {
    languageOptions: {
      globals: {
        console: 'readonly'
      }
    },
    rules: {
      'no-console': ['warn', { allow: ['error'] }],
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Handled by TypeScript
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },

  // Scripts configuration
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off' // Allow process and other node globals if not explicitly defined
    }
  },

  // Prettier integration (must be last)
  prettier,

  // Ignore patterns
  {
    ignores: [
      'legacy/**',           // Ignore legacy Vue.js code
      'dist/**',
      'build/**',
      '.svelte-kit/**',
      'node_modules/**',
      '*.config.js',
      'vite.config.ts'
    ]
  }
];