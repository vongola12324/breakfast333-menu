import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  // Base configuration for all files
  js.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**']
  },
  // Global configuration for browser environment
  {
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly'
      }
    }
  },
  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'max-len': ['error', { 'code': 120 }]
    }
  },
  // Vue configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: {
          ts: tsParser,
          js: 'espree'
        }
      }
    },
    plugins: {
      vue: vuePlugin
    },
    rules: {
      // Vue rules
      'vue/html-self-closing': ['error', {
        'html': {
          'void': 'always',
          'normal': 'always',
          'component': 'always'
        }
      }],
      'vue/multi-word-component-names': 'off',
      'max-len': ['error', { 'code': 120 }],
      'vue/max-len': ['error', { 'code': 120 }]
    }
  }
];
