import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default antfu(
  {
    lessOpinionated: true,
    react: true,
    vue: false,
    stylistic: true,
    typescript: true,
    formatters: true,
    ignores: [
      '**/.next/**',
      '**/public/**',
      '**/assets/**',
    ],
  },
  ...compat.config({
    extends: ['plugin:@next/next/recommended'],
  }),
)
