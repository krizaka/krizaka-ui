import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "./avatar";

// A self-contained portrait (no network in the screenshot tests).
const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#3b82f6"/>' +
      '<circle cx="40" cy="31" r="14" fill="#dbeafe"/><path d="M12 80a28 24 0 0 1 56 0z" fill="#dbeafe"/></svg>',
  );

/** A person: their image, or a `fallback` (initials) while it loads, when it fails or when there is none. */
const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  args: { fallback: "OA" },
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WithImage: Story = { args: { src: PORTRAIT, alt: "Oussama" } };

/** No image: the fallback. */
export const Fallback: Story = {};

/** xs · sm · md · lg · xl. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** `Avatar.Group` with `max={3}`: the rest becomes `+n`. */
export const Group: Story = {
  render: () => (
    <Avatar.Group max={3} size="sm">
      <Avatar size="sm" src={PORTRAIT} alt="Oussama" />
      <Avatar size="sm" fallback="LM" />
      <Avatar size="sm" fallback="SK" />
      <Avatar size="sm" fallback="JD" />
      <Avatar size="sm" fallback="AR" />
    </Avatar.Group>
  ),
};
