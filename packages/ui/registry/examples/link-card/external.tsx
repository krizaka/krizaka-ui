import { ProductLogo } from "@krizaka/ui";
import { LinkCard } from "@krizaka/ui/link-card";

// An absolute address opens in a new tab and wears the external mark instead of the arrow.
export default function LinkCardExternal() {
  return (
    <LinkCard
      className="max-w-sm"
      href="https://github.com/krizaka/krizaka-ui"
      icon={<ProductLogo id="krizaka" size={24} animated={false} />}
      title="krizaka-ui on GitHub"
      description="The sources, the issues, the discussions."
      cta="Open the repository"
    />
  );
}
