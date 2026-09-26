import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'node_modules', 'skills-lock.json'] },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // NOT reactHooks.configs.recommended — in 5.x that is still aliased to
      // the legacy .eslintrc shape. 'recommended-latest' is the flat config;
      // v6 re-aliases 'recommended'. Flat config has no `extends`, so the
      // plugin is registered above and only the rules are spread in.
      ...reactHooks.configs['recommended-latest'].rules,
      ...reactRefresh.configs.recommended.rules,
      // The single most useful signal in a codebase that grew by copy-paste.
      // This is what surfaces dead imports and unused props.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },
  {
    // Config files are Node ESM, not browser modules.
    files: ['**/*.config.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
]
