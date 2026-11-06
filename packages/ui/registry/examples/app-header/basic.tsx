import { ProductLogo } from "@krizaka/ui";
import { AppHeader } from "@krizaka/ui/app-header";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";

// The name is text; the mark shows below `md` only (a desktop's rail carries it). Chips say a state.
export default function AppHeaderBasic() {
  return (
    <AppHeader
      name="Sovkora"
      mark={<ProductLogo id="sovkora" size={22} animated={false} />}
      href="#home"
      chips={<Badge tone="success" dot>Local · Sovereign</Badge>}
      actions={<Button size="sm" variant="secondary">Account</Button>}
    />
  );
}
