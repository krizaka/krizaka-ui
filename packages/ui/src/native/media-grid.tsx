import * as React from "react";
import { FlatList, Image, Pressable, StyleSheet, View, type ViewProps } from "react-native";

import { Avatar } from "./avatar";
import { Card } from "./card";
import { useTheme } from "./theme";
import { Txt } from "./txt";

/** The frame a card is drawn in: 16:9 (`landscape`) or 9:16 (`portrait`). */
export type VideoCardAspect = "landscape" | "portrait";

export type VideoCardCreator = {
  /** The creator's name. */
  name: string;
  /** Their photo. */
  avatarSrc?: string | null;
};

export type VideoCardProps = {
  /** The title; it names the card (a button for screen readers). */
  title: string;
  /** Opens the video. */
  onPress?: () => void;
  /** The frame: `landscape` (16:9, default) or `portrait` (9:16). */
  aspect?: VideoCardAspect;
  /** `stack` (picture above the words, default) or `row` (picture beside them, a list). */
  layout?: "stack" | "row";
  /** The picture's URI. */
  poster?: string | null;
  /** `cover` (default) or `contain`: a source of the other shape drawn whole over a blurred copy, never cropped. */
  fit?: "cover" | "contain";
  /** The length, already formatted (`3:42`). */
  duration?: string;
  /** Badges at the top-left of the picture (Free, a price, 18+): `Badge tone="scrim"`. */
  badges?: React.ReactNode;
  /** Who made it. */
  creator?: VideoCardCreator;
  /** What is counted (`12.4K views`), already formatted. */
  meta?: string;
  /** One quick action at the end of the footer (a tip, a save): an `IconButton`. */
  action?: React.ReactNode;
  /** A sensitive picture: blurred so nothing shows (put the reveal button in `overlay`). */
  blurred?: boolean;
  /** Over the whole picture (a veil, a reveal button). */
  overlay?: React.ReactNode;
  /** Shown instead of the picture while there is none. */
  fallback?: React.ReactNode;
  /** The card's width (a shelf's cards); by default it fills its column. */
  width?: number;
};

const RATIO: Record<VideoCardAspect, number> = { landscape: 16 / 9, portrait: 9 / 16 };

/** A video card whose frame, body and footer have one height per aspect, so a grid row or a shelf never staggers. */
export function VideoCard({ title, onPress, aspect = "landscape", layout = "stack", poster, fit = "cover", duration, badges, creator, meta, action, blurred = false, overlay, fallback, width }: VideoCardProps) {
  const { theme } = useTheme();
  const row = layout === "row";
  const tall = aspect === "portrait" && !row;
  const name = [title, creator?.name, duration, meta].filter(Boolean).join(", ");
  return (
    <View style={[styles.card, width ? { width } : null, row ? null : styles.fill]}>
      <Card.Root onPress={onPress} aria-label={name} style={[styles.root, row ? styles.row : null]}>
        <View style={[styles.media, { backgroundColor: theme.media, aspectRatio: RATIO[aspect] }, row ? (aspect === "portrait" ? styles.rowPortrait : styles.rowLandscape) : null]}>
          {fit === "contain" && poster ? <Image aria-hidden source={{ uri: poster }} blurRadius={24} resizeMode="cover" style={[StyleSheet.absoluteFill, styles.backdrop]} /> : null}
          <Card.Image src={poster} fallback={fallback} resizeMode={fit} blurRadius={blurred ? 40 : 0} />
          {overlay ? <View style={StyleSheet.absoluteFill}>{overlay}</View> : null}
          {badges ? <Card.Overlay corner="top-left" style={styles.badges}>{badges}</Card.Overlay> : null}
          {duration ? (
            <Card.Overlay corner="bottom-right">
              <View style={[styles.duration, { backgroundColor: theme.scrim }]}>
                <Txt variant="caption" tone="onMedia" style={styles.mono}>
                  {duration}
                </Txt>
              </View>
            </Card.Overlay>
          ) : null}
        </View>
        <View style={[styles.body, row ? styles.rowBody : null]}>
          {/* Two lines kept for every title: the rows of a grid align. */}
          <Txt variant="label" numberOfLines={2} style={styles.title}>
            {title}
          </Txt>
          <View style={tall ? styles.footerTall : styles.footer}>
            {creator ? (
              <View style={styles.creator}>
                <Avatar src={creator.avatarSrc} alt="" fallback={creator.name.charAt(0)} size="xs" />
                <Txt variant="caption" tone="secondary" numberOfLines={1} style={styles.shrink}>
                  {creator.name}
                </Txt>
              </View>
            ) : null}
            {meta || action ? (
              <View style={[styles.metaRow, tall ? styles.metaTall : null]}>
                {meta ? (
                  <Txt variant="caption" tone="muted" numberOfLines={1}>
                    {meta}
                  </Txt>
                ) : null}
                {action}
              </View>
            ) : null}
          </View>
        </View>
      </Card.Root>
    </View>
  );
}

export type ShortsShelfProps<T> = Omit<ViewProps, "children"> & {
  /** The shelf's name (“Shorts”), passed translated: its heading and the name of its list. */
  label: string;
  /** The clips, in order. */
  items: readonly T[];
  /** A stable key for an item. */
  getId: (item: T) => string;
  /** One card: `VideoCard aspect="portrait"` with the shelf's `width`. */
  renderItem: (item: T, index: number, width: number) => React.ReactNode;
  /** Opens the vertical feed: its words and what it does. */
  seeAll?: { label: string; onPress: () => void };
  /** A card's width in points (default 140): every card of the shelf has it, so one height. */
  itemWidth?: number;
};

/** A Shorts shelf on a phone: equal-height 9:16 cards in a row that snaps card by card, “See all” beside the heading. */
export function ShortsShelf<T>({ label, items, getId, renderItem, seeAll, itemWidth = 140, style, ...props }: ShortsShelfProps<T>) {
  const gap = 12;
  return (
    <View role="region" aria-label={label} {...props} style={[styles.shelf, style]}>
      <View style={styles.shelfHead}>
        <Txt variant="title" style={styles.shrink}>
          {label}
        </Txt>
        {seeAll ? (
          <Pressable role="link" onPress={seeAll.onPress} hitSlop={12}>
            <Txt variant="caption" tone="accent" style={styles.seeAll}>
              {seeAll.label}
            </Txt>
          </Pressable>
        ) : null}
      </View>
      <FlatList
        horizontal
        data={items as T[]}
        keyExtractor={getId}
        renderItem={({ item, index }) => <View style={{ width: itemWidth }}>{renderItem(item, index, itemWidth)}</View>}
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + gap}
        decelerationRate="fast"
        contentContainerStyle={styles.shelfRow}
        role="list"
      />
    </View>
  );
}

/** What the grid tells a card: its frame, its layout, and whether its source is of the other shape (`fit="contain"`). */
export type MediaGridState = {
  /** The frame the card is drawn in (`aspect` of `VideoCard`). */
  aspect: VideoCardAspect;
  /** The card's `layout`. */
  layout: "stack" | "row";
  /** The source's orientation differs from the frame: pass `fit="contain"`. */
  mismatch: boolean;
  /** The card's width on the shelf; undefined in the grid (the card fills its column). */
  width?: number;
};

export type MediaGridProps<T> = Omit<ViewProps, "children"> & {
  /** The videos, in order. */
  items: readonly T[];
  /** A stable key for an item. */
  getId: (item: T) => string;
  /** The source's orientation (from its width and height). */
  orientationOf: (item: T) => VideoCardAspect;
  /** One card, drawn in the frame the grid gives (`state`): use `VideoCard`. */
  renderItem: (item: T, state: MediaGridState) => React.ReactNode;
  /** `split` (default): verticals on the shelf, the others in the grid · `uniform`: all in one frame (`frame`). */
  mode?: "split" | "uniform";
  /** The frame of `uniform` (default `landscape`). */
  frame?: VideoCardAspect;
  /** `grid` (default) or `list` (one row per video). */
  layout?: "grid" | "list";
  /** Cards per row of the grid; default 1 for 16:9 (a phone is narrow), 2 for 9:16. */
  columns?: number;
  /** The shelf of `split`: its name and “See all”, passed translated. */
  shelf: Pick<ShortsShelfProps<T>, "label" | "seeAll" | "itemWidth">;
};

/**
 * A media section on a phone that never mixes heights badly: a shelf for the 9:16 clips, a uniform grid for the rest
 * (rows of `columns`, every card of a row one height). A section of a screen's scroll view, not a virtualised feed — a
 * long feed is the native `List` (FlashList) of `VideoCard`s.
 */
export function MediaGrid<T>({ items, getId, orientationOf, renderItem, mode = "split", frame = "landscape", layout = "grid", columns, shelf, style, ...props }: MediaGridProps<T>) {
  const list = layout === "list";
  const split = mode === "split";
  const verticals = split ? items.filter((i) => orientationOf(i) === "portrait") : [];
  const rest = split ? items.filter((i) => orientationOf(i) !== "portrait") : [...items];
  const gridFrame: VideoCardAspect = split ? "landscape" : frame;
  const perRow = list ? 1 : (columns ?? (gridFrame === "portrait" ? 2 : 1));
  const state = (item: T, aspect: VideoCardAspect): MediaGridState => ({ aspect, layout: list ? "row" : "stack", mismatch: orientationOf(item) !== aspect });
  const rows: T[][] = [];
  for (let i = 0; i < rest.length; i += perRow) rows.push(rest.slice(i, i + perRow));
  return (
    <View {...props} style={[styles.grid, style]}>
      {verticals.length > 0 ? (
        <ShortsShelf
          {...shelf}
          items={verticals}
          getId={getId}
          renderItem={(item, _index, width) => renderItem(item, { ...state(item, "portrait"), layout: "stack", width })}
        />
      ) : null}
      {rows.length > 0 ? (
        <View role="list" style={styles.rows}>
          {rows.map((cells) => (
            <View key={cells.map(getId).join("|")} style={styles.cells}>
              {cells.map((item) => (
                <View key={getId(item)} role="listitem" style={styles.cell}>
                  {renderItem(item, state(item, gridFrame))}
                </View>
              ))}
              {/* The last row keeps the others' widths: empty cells, not stretched cards. */}
              {Array.from({ length: perRow - cells.length }, (_, i) => (
                <View key={`empty-${i}`} style={styles.cell} />
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { minWidth: 0 },
  fill: { flex: 1 },
  root: { flex: 1 },
  row: { flexDirection: "row" },
  media: { position: "relative", overflow: "hidden", width: "100%" },
  rowLandscape: { width: 150, aspectRatio: 16 / 9 },
  rowPortrait: { width: 84, aspectRatio: 9 / 16 },
  backdrop: { opacity: 0.7, transform: [{ scale: 1.25 }] },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  duration: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  mono: { fontVariant: ["tabular-nums"] },
  body: { flex: 1, padding: 12, gap: 8, justifyContent: "space-between" },
  rowBody: { minWidth: 0 },
  title: { minHeight: 36 },
  footer: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 28 },
  footerTall: { gap: 4 },
  creator: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1, minWidth: 0 },
  shrink: { flexShrink: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginLeft: "auto" },
  metaTall: { marginLeft: 0, justifyContent: "space-between", minHeight: 28 },
  shelf: { gap: 10 },
  shelfHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  seeAll: { fontWeight: "700" },
  shelfRow: { paddingRight: 16 },
  grid: { gap: 24 },
  rows: { gap: 16 },
  cells: { flexDirection: "row", gap: 12, alignItems: "stretch" },
  cell: { flex: 1, minWidth: 0 },
});
