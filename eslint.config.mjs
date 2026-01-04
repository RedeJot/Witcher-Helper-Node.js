import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node, // ✅ mówi ESLint: to jest Node.js
      },
    },
  },
  js.configs.recommended,
];
