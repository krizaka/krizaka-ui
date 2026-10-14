import type { Meta, StoryObj } from "@storybook/react-vite";

import AppShellExample from "../../registry/examples/screen/native/app-shell";
import AuthExample from "../../registry/examples/screen/native/auth";
import ChatExample from "../../registry/examples/screen/native/chat";
import FeedExample from "../../registry/examples/screen/native/feed";
import MapExample from "../../registry/examples/screen/native/map";
import NotificationsExample from "../../registry/examples/screen/native/notifications";
import ProfileExample from "../../registry/examples/screen/native/profile";
import SettingsExample from "../../registry/examples/screen/native/settings";
import { nativeFrame } from "./story-frame";

/** Native — Screen. Each story renders a named example of the registry (`registry/examples/screen/native/*`). */
const meta = { title: "Native/Screen", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const AppShell: Story = { render: () => <AppShellExample /> };
export const Auth: Story = { render: () => <AuthExample /> };
export const Profile: Story = { render: () => <ProfileExample /> };
// Text over a clip's picture: axe cannot know the pixels; the pair is the invariant `textOnMedia` over `scrim`.
export const Feed: Story = { render: () => <FeedExample />, parameters: { a11y: { test: "off" } } };
export const Chat: Story = { render: () => <ChatExample /> };
export const Settings: Story = { render: () => <SettingsExample /> };
export const Map: Story = { render: () => <MapExample /> };
export const Notifications: Story = { render: () => <NotificationsExample /> };
