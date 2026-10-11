import { Button } from "@krizaka/ui/button";
import { Field, Input, Select } from "@krizaka/ui/field";
import { SettingsLayout, SettingsSection } from "@krizaka/ui/settings-layout";
import { Switch } from "@krizaka/ui/switch";

const NAV = [
  { id: "profile", label: "Profile", href: "#profile", current: true },
  { id: "notifications", label: "Notifications", href: "#notifications" },
  { id: "payouts", label: "Payouts", href: "#payouts" },
  { id: "security", label: "Security", href: "#security" },
];

// TEMPLATE — account settings: the sections on the left (a row of chips that scrolls on a phone), each form a titled
// card with its own save, so a change in one never waits for another.
export default function SettingsLayoutAccount() {
  return (
    <SettingsLayout className="w-full" title="Settings" description="Your profile, what we tell you and how you are paid." nav={NAV} navLabel="Settings sections">
      <SettingsSection
        id="profile"
        title="Profile"
        description="What your fans see."
        footer={<Button size="sm" variant="primary" shape="cut">Save the profile</Button>}
      >
        <Field.Root>
          <Field.Label htmlFor="settings-name">Display name</Field.Label>
          <Input id="settings-name" defaultValue="Elena Varga" />
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor="settings-language">Language</Field.Label>
          <Select id="settings-language" defaultValue="fr">
            <option value="en">English</option>
            <option value="fr">Français</option>
          </Select>
        </Field.Root>
      </SettingsSection>
      <SettingsSection id="notifications" title="Notifications" description="Only what you ask for.">
        {[
          { id: "unlock", label: "A fan unlocks a video", on: true },
          { id: "auction", label: "An auction ends", on: true },
          { id: "weekly", label: "Weekly summary by email", on: false },
        ].map((n) => (
          <div key={n.id} className="flex items-center justify-between gap-4 text-sm text-fg">
            <span id={`notify-${n.id}`}>{n.label}</span>
            <Switch aria-labelledby={`notify-${n.id}`} defaultChecked={n.on} />
          </div>
        ))}
      </SettingsSection>
    </SettingsLayout>
  );
}
