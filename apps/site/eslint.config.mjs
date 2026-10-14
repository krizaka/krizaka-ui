// ui.krizaka.com lints with what the platform publishes: @krizaka/config's Next.js config, the stack rules (strict: no
// warning passes) and the locale rule.
import { krizakaNext } from "@krizaka/config/eslint/next";
import { noLocaleTernary } from "@krizaka/config/eslint/no-locale-ternary";
import { krizakaStack } from "@krizaka/config/eslint/stack";

const config = [
  { name: "site/ignores", ignores: [".next/**", "out/**", ".source/**", "next-env.d.ts", "lib/ui-examples.ts", "public/**"] },
  ...krizakaNext,
  ...krizakaStack({ files: ["app/**/*.{ts,tsx}", "lib/**/*.ts"] }),
  ...noLocaleTernary({ files: ["app/**/*.{ts,tsx}", "lib/**/*.ts"], routing: ["**/lib/i18n.ts", "**/lib/urls.ts", "**/I18nProvider.tsx", "**/SiteRoot.tsx"] }),
  {
    // The reference tables of the documentation (props, type scale, icon sizes, the mobile parity) are static, read-only
    // tables written once at build — not the data tables the stack rule is about (no sorting, no paging, no state).
    name: "site/reference-tables",
    files: ["app/components/docs/{ComponentDoc,PropsTable,TypographyDoc,IconsDoc,MobileParityTable}.tsx"],
    rules: { "krizaka/no-local-table-or-form": "off" },
  },
];

export default config;
