import type { Meta, StoryObj } from "@storybook/react-vite";

import FirstLaunchExample from "../../registry/examples/onboarding/native/first-launch";
import { nativeFrame } from "./story-frame";

/**
 * Native — Onboarding. Each story renders a named example of the registry (`registry/examples/onboarding/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Onboarding", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const FirstLaunch: Story = { render: () => <FirstLaunchExample /> };
