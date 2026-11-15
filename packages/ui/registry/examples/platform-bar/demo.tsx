import { FoliovivLogo } from "@krizaka/ui";
import { languagesFor, LanguageSwitch } from "@krizaka/ui/language-switch";
import { PlatformBar } from "@krizaka/ui/platform-bar";

// A demonstration shop hosted by the platform: the mark, one line that says what the page is, the language switch.
export default function PlatformBarDemo() {
  return (
    <PlatformBar
      label="Folioviv"
      brand={
        <a href="#home" className="inline-flex items-center gap-2 rounded-sm no-underline text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
          <FoliovivLogo size={20} animated={false} />
          Folioviv
        </a>
      }
      notice={{ title: "Boutique de démonstration.", message: "Les données sont fictives, aucune réservation n'est réelle.", link: { label: "En savoir plus", href: "#demo" } }}
      end={<LanguageSwitch label="Langue" current="fr" languages={languagesFor("/fr", ["fr", "en"])} />}
    />
  );
}
