import { languagesFor,LanguageSwitch } from "@krizaka/ui/language-switch";

// A globe and the current code; the menu names each language in its own language and keeps the page.
export default function LanguageSwitchMenu({ defaultOpen }: { defaultOpen?: boolean }) {
  return <LanguageSwitch label="Langue" current="fr" languages={languagesFor("/fr/baux?tri=date")} defaultOpen={defaultOpen} />;
}
