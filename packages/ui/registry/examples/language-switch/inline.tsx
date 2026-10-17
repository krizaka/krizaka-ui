import { languagesFor,LanguageSwitch } from "@krizaka/ui/language-switch";

// The same languages as a row, for a phone's panel or a settings page.
export default function LanguageSwitchInline() {
  return <LanguageSwitch variant="inline" label="Langue" current="fr" languages={languagesFor("/fr/baux")} />;
}
