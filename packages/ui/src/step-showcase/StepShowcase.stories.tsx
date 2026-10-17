import type { Meta, StoryObj } from "@storybook/react-vite";

import DesktopExample from "../../registry/examples/step-showcase/desktop";
import PhoneExample from "../../registry/examples/step-showcase/phone";

/** A guided tour in one device frame: the steps beside it, each recording then the next. The test runner reduces motion: the stills, manual steps. */
const meta = { title: "Blocks/StepShowcase" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Phone: Story = { render: () => <PhoneExample /> };
export const Desktop: Story = { render: () => <DesktopExample /> };
export const PhoneWidth: Story = { render: () => <PhoneExample />, globals: { viewport: { value: "mobile1" } } };
