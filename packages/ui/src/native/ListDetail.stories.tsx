import type { Meta, StoryObj } from "@storybook/react-vite";
import { View } from "react-native";

import InboxExample from "../../registry/examples/list-detail/native/inbox";
import { ListDetail } from "./list-detail";
import { nativeFrame } from "./story-frame";
import { Txt } from "./txt";

/** Native — ListDetail: one pane on a phone, both on a tablet (the room decides). */
const meta = { title: "Native/ListDetail", decorators: [nativeFrame], parameters: { contain: true } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Inbox: Story = { render: () => <InboxExample /> };

const rows = ["Camille — Lease for 12 rue Fleury", "Noor — Payslips, March to May", "Ada — Thanks"];
const pane = (width: number, open: boolean) => (
  <View style={{ width, height: 560 }}>
    <ListDetail
      listTitle="Messages"
      list={rows.map((row) => (
        <Txt key={row} style={{ padding: 16 }}>{row}</Txt>
      ))}
      detailTitle="Camille"
      detail={open ? <Txt>I attached the signed lease. Can you check the page 4 stamp?</Txt> : undefined}
      empty="Select a message"
      backLabel="Messages"
      onBack={() => undefined}
    />
  </View>
);
/** A regular room (820 pt) holds both panes: the list and the empty detail side by side. */
export const InboxRegular: Story = { render: () => pane(820, false) };
/** The same with a message open: the way back is gone, the list stays. */
export const InboxRegularOpen: Story = { render: () => pane(820, true) };
