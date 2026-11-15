import { FoliovivLogo } from "@krizaka/ui";
import { PlatformBar } from "@krizaka/ui/platform-bar";

// A live page: no notice. The mark on the left, the language on the right; nothing else.
export default function PlatformBarLive() {
  return (
    <PlatformBar
      label="Folioviv"
      brand={
        <a href="#home" className="inline-flex items-center gap-2 rounded-sm no-underline text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
          <FoliovivLogo size={20} animated={false} />
          Folioviv
        </a>
      }
      end={
        <a href="#en" hrefLang="en" lang="en" className="inline-flex min-h-9 items-center rounded-sm px-2.5 text-xs font-semibold text-fg-secondary no-underline hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
          EN
        </a>
      }
    />
  );
}
