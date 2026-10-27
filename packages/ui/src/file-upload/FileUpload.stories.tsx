import type { Meta, StoryObj } from "@storybook/react-vite";

import ImagesExample from "../../registry/examples/file-upload/images";
import StatesExample from "../../registry/examples/file-upload/states";
import TusExample from "../../registry/examples/file-upload/tus";
import VideoExample from "../../registry/examples/file-upload/video";
import { Dropzone } from "./index";

/**
 * FileUpload: each story renders a named example of the registry (`registry/examples/file-upload/*`) — the code
 * ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/FileUpload",
  decorators: [
    (Story) => (
      <div className="w-[32rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Video: Story = { render: () => <VideoExample /> };
export const States: Story = { render: () => <StatesExample /> };
export const Images: Story = { render: () => <ImagesExample /> };
export const Tus: Story = { render: () => <TusExample /> };

/** The hidden file input carries its own accessible name (`inputLabel`, the title by default). */
export const Labelled: Story = {
  render: () => <Dropzone title="Add your lease" browseLabel="Choose a file" inputLabel="Lease file (PDF)" hint="PDF, up to 20 MB" onFiles={() => undefined} />,
};
