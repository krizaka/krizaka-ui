import type { Meta, StoryObj } from "@storybook/react-vite";

import AmountExample from "../../registry/examples/form/native/amount";
import AudienceExample from "../../registry/examples/form/native/audience";
import ProfileExample from "../../registry/examples/form/native/profile";
import SettingsExample from "../../registry/examples/form/native/settings";
import SignUpExample from "../../registry/examples/form/native/sign-up";
import UploadExample from "../../registry/examples/form/native/upload";
import { nativeFrame } from "./story-frame";

/**
 * Native — Form (`@krizaka/ui/native/form`) through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/form/native/*`): the same schemas as the web, on the native fields.
 */
const meta = {
  title: "Native/Form",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

/** The sign-up of a creator app: the username checked as typed, the 18+ birth date as day · month · year. */
export const SignUp: Story = { render: () => <SignUpExample /> };
export const Profile: Story = { render: () => <ProfileExample /> };
export const Upload: Story = { render: () => <UploadExample /> };
export const Amount: Story = { render: () => <AmountExample /> };
export const Audience: Story = { render: () => <AudienceExample /> };
export const Settings: Story = { render: () => <SettingsExample /> };
