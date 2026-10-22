import { Avatar } from "@krizaka/ui/avatar";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { SettingsLayout, SettingsRow, SettingsSection } from "@krizaka/ui/settings-layout";

const NAV = [
  {
    id: "library",
    label: "Library",
    items: [
      { id: "videos", label: "Videos", href: "#videos", current: true, badge: 12 },
      { id: "collections", label: "Collections", href: "#collections", badge: 4 },
      { id: "uploads", label: "Uploads", href: "#uploads" },
    ],
  },
  {
    id: "money",
    label: "Money",
    items: [
      { id: "earnings", label: "Earnings", href: "#earnings" },
      { id: "payouts", label: "Payouts", href: "#payouts" },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      { id: "profile", label: "Profile", href: "#profile" },
      { id: "notifications", label: "Notifications", href: "#notifications" },
      { id: "security", label: "Security", href: "#security" },
    ],
  },
] as const;

// TEMPLATE — a private space with more than five sections: who you are on top, the sections grouped in the sidebar,
// one menu on a phone (a strip of eight chips is a puzzle).
export default function SettingsLayoutGrouped() {
  return (
    <SettingsLayout
      className="w-full"
      navLabel="Your space"
      nav={NAV}
      header={
        <>
          <Avatar alt="" size="lg" fallback="E" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-xl font-extrabold tracking-tight text-fg">Elena Varga</h1>
            <p className="font-mono text-xs text-fg-secondary">
              @elena <Badge tone="accent">Creator</Badge>
            </p>
          </div>
          <Button size="sm" variant="ghost">
            View public page
          </Button>
        </>
      }
    >
      <SettingsSection variant="flat" id="videos" title="Videos" description="What you published and what is still processing.">
        <SettingsRow label="Published">12</SettingsRow>
        <SettingsRow label="Processing" description="They appear here when they are ready.">
          0
        </SettingsRow>
      </SettingsSection>
    </SettingsLayout>
  );
}
