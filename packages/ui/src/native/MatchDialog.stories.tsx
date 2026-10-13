import type { Meta, StoryObj } from "@storybook/react-vite";

import ItsAMatchExample from "../../registry/examples/match-dialog/native/its-a-match";
import { nativeFrame } from "./story-frame";

/** Native — MatchDialog. Each story renders a named example of the registry (`registry/examples/match-dialog/native/*`). */
const meta = { title: "Native/MatchDialog", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

/** Captured on the viewport; react-native-web's Modal gets its dialog role only once active (see Dialog.stories). */
const OVERLAY = { capture: "viewport", a11y: { config: { rules: [{ id: "aria-allowed-attr", enabled: false }, { id: "aria-dialog-name", enabled: false }] } } };

export const ItsAMatch: Story = { render: () => <ItsAMatchExample defaultOpen />, parameters: OVERLAY };
