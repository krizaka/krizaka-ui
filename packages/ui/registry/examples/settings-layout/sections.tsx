import { Button } from "@krizaka/ui/button";
import { Field, Input } from "@krizaka/ui/field";
import { SettingsLayout, SettingsSection } from "@krizaka/ui/settings-layout";

// One section per page: the navigation's links are pages, the current one is marked.
export default function SettingsLayoutSections() {
  return (
    <SettingsLayout
      className="w-full"
      nav={[
        { id: "workspace", label: "Workspace", href: "#workspace", current: true },
        { id: "models", label: "Models", href: "#models" },
      ]}
      navLabel="Settings sections"
    >
      <SettingsSection title="Workspace" footer={<Button size="sm" variant="primary">Save</Button>}>
        <Field.Root>
          <Field.Label htmlFor="sections-name">Name</Field.Label>
          <Input id="sections-name" defaultValue="Tremblay & associés" />
        </Field.Root>
      </SettingsSection>
    </SettingsLayout>
  );
}
