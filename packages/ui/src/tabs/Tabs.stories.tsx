import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs } from "./tabs";

/**
 * `Tabs.Root/List/Trigger/Content` on Radix Tabs: roles, roving focus (arrows, Home, End), automatic activation.
 * `variant` underline · segmented · pills on the root; `orientation` horizontal · vertical. A view switch is a tab;
 * a filter that narrows a list is a `Chip.Group`.
 */
const meta = {
  title: "Primitives/Tabs",
  component: Tabs.Root,
  args: { defaultValue: "videos" },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

const Example: Story["render"] = (args) => (
  <Tabs.Root {...args}>
    <Tabs.List aria-label="Profile">
      <Tabs.Trigger value="videos">Videos</Tabs.Trigger>
      <Tabs.Trigger value="stories">Stories</Tabs.Trigger>
      <Tabs.Trigger value="collections">Collections</Tabs.Trigger>
      <Tabs.Trigger value="about" disabled>
        About
      </Tabs.Trigger>
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
    <Tabs.Content value="about" className="text-sm text-fg-secondary">
      About this channel.
    </Tabs.Content>
  </Tabs.Root>
);

/** The sections of a page: a line under the list, the active tab underlined in the accent. A disabled tab is skipped. */
export const Underline: Story = { render: Example };

/** A view switch: equal segments in a track, the active one filled. */
export const Segmented: Story = {
  args: { variant: "segmented", defaultValue: "grid" },
  render: (args) => (
    <Tabs.Root {...args}>
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
  ),
};

/** A feed's sections: pills that scroll sideways on a phone. */
export const Pills: Story = { render: Example, args: { variant: "pills" } };

/** `orientation="vertical"`: up and down arrows, the list on the side. */
export const Vertical: Story = { render: Example, args: { orientation: "vertical" } };
