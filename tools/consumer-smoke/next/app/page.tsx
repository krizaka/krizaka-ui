import { ChatIcon, SearchIcon } from "@krizaka/icons";
import { Rich } from "@krizaka/i18n/rich";
import { tokens } from "@krizaka/tokens";
import { KrizakaLogo } from "@krizaka/ui";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { i18n, t } from "@/lib/i18n";
import { Lead } from "./components/Lead";

// The documented entry points, rendered on the server: the marks, primitives, icons, tokens and the i18n engine.
export default function Home() {
  const fr = i18n.translator("fr");
  return (
    <main style={{ color: tokens.textPrimary }}>
      <KrizakaLogo />
      <h1>{t("home.title")}</h1>
      <Lead />
      <p>
        <Rich text={fr("home.lead")} />
      </p>
      <p>{t("home.count", { count: 2 })}</p>
      <Badge tone="danger" dot pulse>
        Live
      </Badge>
      <Button variant="primary">
        <ChatIcon /> Chat
      </Button>
      <SearchIcon title="Search" size={20} nodeColor="var(--kz-accent)" />
      <ul>
        <li><a href="/ui">@krizaka/ui examples</a></li>
        <li><a href="/charts">@krizaka/charts examples</a></li>
      </ul>
    </main>
  );
}
