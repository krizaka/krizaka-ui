import type { Meta, StoryObj } from "@storybook/react-vite";

import AmountExample from "../../registry/examples/form/amount";
import AudienceExample from "../../registry/examples/form/audience";
import ProfileExample from "../../registry/examples/form/profile";
import ReportExample from "../../registry/examples/form/report";
import SettingsExample from "../../registry/examples/form/settings";
import SignUpExample from "../../registry/examples/form/sign-up";
import UploadExample from "../../registry/examples/form/upload";

/**
 * Form: each story renders a named example of the registry (`registry/examples/form/*`) — the code krizaka.com/docs/ui
 * shows. The typical forms of the products: sign-up, profile, upload, amount, audience, settings, report.
 */
const meta = {
  title: "Primitives/Form",
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

/** Orochia's sign-up: `BirthDateField` (18+, day · month · year) and `UsernameField` (checked as typed, a free one offered). */
export const SignUp: Story = { render: () => <SignUpExample /> };
export const Profile: Story = { render: () => <ProfileExample /> };
export const Upload: Story = { render: () => <UploadExample /> };
export const Amount: Story = { render: () => <AmountExample /> };
export const Audience: Story = { render: () => <AudienceExample /> };
/** Sent by a Server Action (`useFormWithAction`). */
export const Settings: Story = { render: () => <SettingsExample /> };
export const Report: Story = { render: () => <ReportExample /> };
