import type { Meta, StoryObj } from "@storybook/react-vite";

import ProfileExample from "../../registry/examples/field/native/profile";
import SelectExample from "../../registry/examples/field/native/select";
import { nativeFrame } from "./story-frame";

/**
 * Native — Field. Each story renders a named example of the registry (`registry/examples/field/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Field", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Profile: Story = { render: () => <ProfileExample /> };
export const Select: Story = { render: () => <SelectExample /> };
