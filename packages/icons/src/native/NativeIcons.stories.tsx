import type { Meta, StoryObj } from "@storybook/react-vite";

import * as native from "./index";

type NativeIcon = typeof native.ChatIcon;
const all = Object.entries(native).filter(([k]) => /^[A-Z]\w*Icon$/.test(k)) as [string, NativeIcon][];

/** Native — the same icons for React Native (react-native-svg), rendered here through react-native-web. */
const meta = {
  title: "Icons/Native",
  component: native.ChatIcon,
  parameters: { layout: "padded" },
} satisfies Meta<typeof native.ChatIcon>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every icon; `color` and `nodeColor` come from the app's theme (`theme.textPrimary`, `theme.accent`). */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 text-fg">
      {all.map(([name, Icon]) => (
        <Icon key={name} size={28} color="currentColor" nodeColor="var(--kz-accent)" />
      ))}
    </div>
  ),
};
