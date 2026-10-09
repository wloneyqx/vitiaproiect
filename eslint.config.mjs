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
    "export_probe_src/**",
    "svidanie_art_clean_for_new_github/**",
    "svidanie_art_ready_for_handoff/**",
    "svidanie_art_ready_for_handoff_netlify/**",
    "svidanie_art_unpacked_for_github/**",
    "svidanie_art_site_ready_upload_unpacked/**",
    "backend/**",
    "src/vendor/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
