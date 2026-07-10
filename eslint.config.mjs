import { fixupConfigRules } from '@eslint/compat';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// fixupConfigRules restores context APIs removed in ESLint 10 that
// eslint-config-next's bundled plugins (eslint-plugin-react et al.) still use.
export default defineConfig([
  ...fixupConfigRules(nextCoreWebVitals),
  ...fixupConfigRules(nextTypescript),
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'coverage/**']),
]);
