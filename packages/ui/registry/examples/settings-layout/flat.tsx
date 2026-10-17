import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Input } from "@krizaka/ui/field";
import { SettingsLayout, SettingsRow, SettingsSection } from "@krizaka/ui/settings-layout";

const NAV = [
  { id: "account", label: "Account", href: "/settings/account", current: true },
  { id: "appearance", label: "Appearance", href: "/settings/appearance" },
  { id: "integrations", label: "Integrations", href: "/settings/integrations" },
];

// TEMPLATE — calm settings: sections on the left, one column of rows (label and help left, control right) divided by hairlines.
export default function SettingsLayoutFlat() {
  return (
    <SettingsLayout className="w-full" variant="flat" title="Settings" nav={NAV} navLabel="Settings sections">
      <SettingsSection variant="flat" id="account" title="Account" description="Who you are in this workspace.">
        <SettingsRow label="Username" description="Shown to your team." htmlFor="flat-username">
          <Input id="flat-username" defaultValue="oussama" className="w-56" />
        </SettingsRow>
        <SettingsRow label="Email">oussama@krizaka.com</SettingsRow>
        <SettingsRow label="Role"><Badge>Admin</Badge></SettingsRow>
      </SettingsSection>
      <SettingsSection variant="flat" title="Danger zone">
        <SettingsRow label="Sign out everywhere" description="Ends every session on every device.">
          <Button size="sm" variant="secondary">Sign out</Button>
        </SettingsRow>
      </SettingsSection>
    </SettingsLayout>
  );
}
