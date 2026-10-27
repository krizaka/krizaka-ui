// Native — the list and the item open from it. On a phone one pane at a time (the list, or the open item with the way
// back); in a room that holds both (a tablet, a landscape phone, a split view) the two side by side. The room decides,
// not the device: it follows a rotation and a window being resized.
import * as React from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";

import { GRID_GAPS, useFontScale } from "./grid";
import { Header } from "./header";
import { Screen } from "./screen";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type ListDetailProps = {
  /** The list pane's title (`Messages`), the large title of the list. */
  listTitle: string;
  /** Buttons at the right of the list's bar (a new item, a filter). */
  listActions?: React.ReactNode;
  /** The list: a `List`, which scrolls itself. */
  list: React.ReactNode;
  /** The open item's title, in the bar of the detail. */
  detailTitle?: string;
  /** Buttons at the right of the detail's bar. */
  detailActions?: React.ReactNode;
  /** The open item, or nothing when none is open. */
  detail?: React.ReactNode;
  /** What the detail pane says when nothing is open and both panes show (`Select a message`). */
  empty?: string;
  /** The way back to the list, shown when one pane shows at a time (`Messages`). */
  backLabel: string;
  /** Closes the open item: the app clears its selection. */
  onBack: () => void;
  /** The list pane's width when both show (default 340). */
  listWidth?: number;
  /** The least width the detail needs beside the list (default 400): below it, one pane at a time. */
  minDetailWidth?: number;
  /** The text scale to lay out for; by default the system's. */
  fontScale?: number;
  /** For tests. */
  testID?: string;
};

/** The two panes of a list and its item, or one of them, chosen by the width of the room. */
export function ListDetail({ listTitle, listActions, list, detailTitle, detailActions, detail, empty, backLabel, onBack, listWidth = 340, minDetailWidth = 400, fontScale, testID }: ListDetailProps) {
  const { theme } = useTheme();
  const system = useFontScale();
  const [width, setWidth] = React.useState(0);
  const onLayout = React.useCallback((event: LayoutChangeEvent) => setWidth(Math.floor(event.nativeEvent.layout.width)), []);
  // Larger text needs more room for the detail: at 200 % it takes twice the width.
  const both = width > 0 && width >= listWidth + minDetailWidth * Math.max(1, fontScale ?? system);
  const open = detail != null;
  const listPane = (
    <Screen header={<Header title={listTitle} actions={listActions} />} scroll={false} keyboard={false} padding={0}>
      {list}
    </Screen>
  );
  const detailPane = (
    <Screen header={<Header size="inline" title={detailTitle ?? ""} backLabel={both ? undefined : backLabel} onBack={both ? undefined : onBack} actions={detailActions} />} keyboard={false}>
      {open ? (
        detail
      ) : (
        <View style={styles.empty}>
          <Txt tone="secondary">{empty}</Txt>
        </View>
      )}
    </Screen>
  );
  return (
    <View testID={testID} onLayout={onLayout} data-panes={both ? "both" : "one"} style={styles.root}>
      {both ? (
        <View style={styles.row}>
          <View style={[styles.list, { width: listWidth, borderEndColor: theme.borderSubtle, borderEndWidth: StyleSheet.hairlineWidth }]}>{listPane}</View>
          <View style={styles.detail}>{detailPane}</View>
        </View>
      ) : open ? (
        detailPane
      ) : (
        listPane
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignSelf: "stretch" },
  row: { flex: 1, flexDirection: "row", gap: GRID_GAPS.none },
  list: { flexShrink: 0 },
  detail: { flex: 1, minWidth: 0 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 48 },
});
