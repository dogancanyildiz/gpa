import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Coverage files
    "coverage/**",
  ]),
  {
    rules: {
      // Ignore React Compiler warnings for incompatible library APIs
      // These are expected for TanStack Table and React Hook Form
      "react-hooks/incompatible-library": "off",
    },
  },
]);

export default eslintConfig;
