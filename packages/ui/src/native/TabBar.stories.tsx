import type { Meta, StoryObj } from "@storybook/react-vite";

import MainSectionsExample from "../../registry/examples/tab-bar/native/main-sections";
import { nativeFrame } from "./story-frame";

/**
 * Native — TabBar. Each story renders a named example of the registry (`registry/examples/tab-bar/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/TabBar", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const MainSections: Story = { render: () => <MainSectionsExample /> };
