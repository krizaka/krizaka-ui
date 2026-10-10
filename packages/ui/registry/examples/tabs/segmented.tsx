import { Tabs } from "@krizaka/ui/tabs";

// A view switch: equal segments in a track, the active one filled.
export default function TabsSegmented() {
  return (
    <Tabs.Root variant="segmented" defaultValue="grid">
      <Tabs.List aria-label="View">
        <Tabs.Trigger value="grid">Grid</Tabs.Trigger>
        <Tabs.Trigger value="list">List</Tabs.Trigger>
        <Tabs.Trigger value="cinema">Cinema</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="grid" className="text-sm text-fg-secondary">
        Four columns of cards.
      </Tabs.Content>
      <Tabs.Content value="list" className="text-sm text-fg-secondary">
        One line per video.
      </Tabs.Content>
      <Tabs.Content value="cinema" className="text-sm text-fg-secondary">
        One large player per video.
      </Tabs.Content>
    </Tabs.Root>
  );
}
