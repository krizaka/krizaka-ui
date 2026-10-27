import type { Meta, StoryObj } from "@storybook/react-vite";

import AppearanceExample from "../../registry/examples/account-settings/appearance";
import AvatarPickerExample from "../../registry/examples/account-settings/avatar-picker";
import AvatarPickerFolderExample from "../../registry/examples/account-settings/avatar-picker-folder";
import ChoiceCardsExample from "../../registry/examples/account-settings/choice-cards";
import LanguagePickerExample from "../../registry/examples/account-settings/language-picker";
import PatternsExample from "../../registry/examples/account-settings/patterns";
import ProfileExample from "../../registry/examples/account-settings/profile";
import { AvatarPicker } from "./avatar-picker";

/** The blocks of an account page. Each story renders a named example of the registry (`registry/examples/account-settings/*`). */
const meta = { title: "Blocks/AccountSettings", component: AvatarPicker, args: { label: "Photo", options: [] } } satisfies Meta<typeof AvatarPicker>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Profile: Story = { render: () => <ProfileExample />, parameters: { layout: "fullscreen" } };
export const Avatars: Story = { render: () => <AvatarPickerExample /> };
export const AvatarsOfAFolder: Story = { render: () => <AvatarPickerFolderExample /> };
export const Choices: Story = { render: () => <ChoiceCardsExample /> };
export const Language: Story = { render: () => <LanguagePickerExample /> };
export const Patterns: Story = { render: () => <PatternsExample /> };

/** Appearance (#657): theme cards with live miniatures, accent, density, language. */
export const Appearance: Story = { render: () => <AppearanceExample /> };
export const AppearancePhone: Story = { render: () => <AppearanceExample />, parameters: { phone: true } };
