import js from '@eslint/js'
import { globalIgnores } from 'eslint/config'
import configPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // Debe ir al final: apaga las reglas que chocan con Prettier.
      configPrettier,
    ],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },
])
