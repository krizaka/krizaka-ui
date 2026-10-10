import { Tabs } from "@krizaka/ui/tabs";

// `orientation="vertical"`: up and down arrows, the list on the side.
export default function TabsVertical() {
  return (
    <Tabs.Root orientation="vertical" defaultValue="videos">
      <Tabs.List aria-label="Profile">
        <Tabs.Trigger value="videos">Videos</Tabs.Trigger>
        <Tabs.Trigger value="stories">Stories</Tabs.Trigger>
        <Tabs.Trigger value="collections">Collections</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="videos" className="text-sm text-fg-secondary">
        Twelve videos, newest first.
      </Tabs.Content>
      <Tabs.Content value="stories" className="text-sm text-fg-secondary">
        Stories of the last 24 hours.
      </Tabs.Content>
      <Tabs.Content value="collections" className="text-sm text-fg-secondary">
        Three public collections.
      </Tabs.Content>
    </Tabs.Root>
  );
}
