// @krizaka/ui/native/vertical-video — its own entry (it plays video on expo-video, an optional peer). A 9:16 clip filling
// its frame, the action rail on the right (avatar + follow, like, comments, share, a slot for the product's tip), the
// creator's caption bottom-left, a progress hairline; `ShortFeed` pages them vertically and plays the one in view.
// Over the picture everything reads on the theme's invariant `scrim` / `textOnMedia`.
import { formatCompact } from "@krizaka/intl";
import { Avatar, Txt, useTheme, VerifiedBadge } from "@krizaka/ui/native";
import { VideoPlayer } from "@krizaka/ui/native/video-player";
import * as React from "react";
import { FlatList, Image,Pressable, type StyleProp, StyleSheet, View, type ViewStyle, type ViewToken } from "react-native";
import Svg, { Path } from "react-native-svg";

import { type VerticalVideoLabels, verticalVideoLabels, type VerticalVideoShared } from "../vertical-video/model";

export { type VerticalVideoLabels, verticalVideoLabels };

export type VerticalVideoProps = VerticalVideoShared & {
  /** The clip's address (MP4 or HLS). Absent, the poster alone shows. */
  uri?: string;
  /** The picture until the first frame. */
  posterUri?: string;
  /** Who made it: name, portrait, the seal's words. */
  creator: { name: string; avatarUri?: string; verifiedLabel?: string };
  /** Styles merged last, on the frame. */
  style?: StyleProp<ViewStyle>;
};

const HEART = "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z";
const COMMENT = "M4 5h16v11H9l-5 4z";
const SHARE = "M4 12v7h16v-7M12 3v12M7 8l5-5 5 5";
const MORE = "M5 12h.01M12 12h.01M19 12h.01";

function Glyph({ d, color, filled }: { d: string; color: string; filled?: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <Path d={d} />
    </Svg>
  );
}

function RailButton({ label, count, pressed, onPress, children }: { label: string; count?: string | undefined; pressed?: boolean | undefined; onPress?: (() => void) | undefined; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.railItem}>
      <Pressable role="button" aria-label={label} aria-pressed={pressed} onPress={onPress} hitSlop={4} style={[styles.railButton, { backgroundColor: theme.scrim }]}>
        {children}
      </Pressable>
      {count !== undefined ? (
        <Txt variant="caption" tone="onMedia" style={styles.count}>
          {count}
        </Txt>
      ) : null}
    </View>
  );
}

/** One short video: 9:16, the rail of actions on the right, the creator's caption bottom-left. */
export function VerticalVideo({
  title,
  uri,
  posterUri,
  active = true,
  creator,
  disclosure,
  caption,
  tags = [],
  credit,
  likes,
  comments,
  shares,
  liked = false,
  following = false,
  onLike,
  onComment,
  onShare,
  onFollow,
  onMore,
  tipSlot,
  topStart,
  aboveCaption,
  locale = "en",
  labels: custom,
  style,
}: VerticalVideoProps) {
  const { theme } = useTheme();
  const labels = { ...verticalVideoLabels, ...custom };
  const [open, setOpen] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const count = (n?: number) => (n === undefined ? undefined : formatCompact(n, { locale }));
  const on = theme.textOnMedia;
  return (
    <View role="group" aria-label={title} style={[styles.frame, { backgroundColor: theme.media }, style]}>
      {uri ? (
        <VideoPlayer source={{ uri }} title={title} aspectRatio={9 / 16} contentFit="cover" nativeControls={false} fullscreen={false} autoPlay loop muted paused={!active || paused} style={StyleSheet.absoluteFill} {...(posterUri ? { poster: { uri: posterUri } } : {})} />
      ) : posterUri ? (
        <Image source={{ uri: posterUri }} aria-hidden resizeMode="cover" style={StyleSheet.absoluteFill} />
      ) : null}
      <Pressable role="button" aria-label={paused ? labels.play : labels.pause} onPress={() => setPaused((p) => !p)} onLongPress={() => onLike?.(!liked)} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[styles.shade, { backgroundColor: theme.scrim }]} />
      {topStart ? <View style={styles.topStart}>{topStart}</View> : null}

      <View role="group" aria-label={labels.actions} style={styles.rail}>
        <View>
          <Avatar alt={creator.name} {...(creator.avatarUri ? { src: creator.avatarUri } : {})} size="md" />
          {onFollow ? (
            <Pressable
              role="button"
              aria-label={(following ? labels.following : labels.follow).replace("{name}", creator.name)}
              aria-pressed={following}
              onPress={() => onFollow(!following)}
              hitSlop={12}
              style={[styles.follow, { backgroundColor: following ? theme.surface2 : theme.accent }]}
            >
              <Glyph d={following ? "M5 12l5 5 9-10" : "M12 5v14M5 12h14"} color={following ? theme.textPrimary : theme.onAccent} />
            </Pressable>
          ) : null}
        </View>
        <RailButton label={labels.like} count={count(likes)} pressed={liked} onPress={() => onLike?.(!liked)}>
          <Glyph d={HEART} color={liked ? theme.accent : on} filled={liked} />
        </RailButton>
        <RailButton label={labels.comment} count={count(comments)} onPress={onComment}>
          <Glyph d={COMMENT} color={on} />
        </RailButton>
        <RailButton label={labels.share} count={count(shares)} onPress={onShare}>
          <Glyph d={SHARE} color={on} />
        </RailButton>
        {tipSlot}
        {onMore ? (
          <RailButton label={labels.more} onPress={onMore}>
            <Glyph d={MORE} color={on} />
          </RailButton>
        ) : null}
      </View>

      <View style={styles.caption}>
        {aboveCaption}
        <View style={styles.nameRow}>
          <Txt variant="label" tone="onMedia">
            {creator.name}
          </Txt>
          {creator.verifiedLabel ? <VerifiedBadge label={creator.verifiedLabel} on="media" size={14} /> : null}
          {disclosure ? (
            <View style={[styles.pill, { backgroundColor: theme.scrim }]}>
              <Txt variant="caption" tone="onMedia" style={styles.pillText}>
                {disclosure.toUpperCase()}
              </Txt>
            </View>
          ) : null}
        </View>
        {caption ? (
          <Txt tone="onMedia" numberOfLines={open ? undefined : 2}>
            {caption}
            {tags.length > 0 ? ` ${tags.map((tag) => `#${tag}`).join(" ")}` : ""}
          </Txt>
        ) : null}
        {caption && caption.length > 90 ? (
          <Pressable role="button" aria-label={open ? labels.collapse : labels.expand} aria-expanded={open} onPress={() => setOpen((v) => !v)} hitSlop={10}>
            <Txt variant="caption" tone="onMedia" style={styles.underline}>
              {open ? labels.collapse : labels.expand}
            </Txt>
          </Pressable>
        ) : null}
        {credit ? (
          <Txt variant="caption" tone="onMedia">
            {credit}
          </Txt>
        ) : null}
      </View>
    </View>
  );
}

export type ShortFeedProps<T> = {
  /** The feed's accessible name ("Videos"). */
  label: string;
  /** The videos, in order. */
  items: readonly T[];
  /** A stable key for an item. */
  getId: (item: T) => string;
  /** One slide: `active` is true for the one in view. */
  renderItem: (item: T, state: { active: boolean; index: number }) => React.ReactElement;
  /** The page's height in points (the feed's own height; one slide per page). */
  height: number;
  /** Called when the slide in view changes. */
  onActiveChange?: (index: number, item: T) => void;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** A vertical paging feed: one video per screen, the one in view plays, the others pause. */
export function ShortFeed<T>({ label, items, getId, renderItem, height, onActiveChange, style }: ShortFeedProps<T>) {
  const [active, setActive] = React.useState(0);
  // FlatList wants one stable callback for its whole life.
  const [onViewable] = React.useState(() => ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find((v) => v.isViewable && typeof v.index === "number");
    if (first && typeof first.index === "number") setActive(first.index);
  });
  React.useEffect(() => {
    const item = items[active];
    if (item !== undefined) onActiveChange?.(active, item);
    // Only a change of the slide in view is an event.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return (
    <View role="list" aria-label={label} style={[{ height }, style]}>
    <FlatList
      data={items as T[]}
      keyExtractor={getId}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
      windowSize={3}
      initialNumToRender={2}
      viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
      onViewableItemsChanged={onViewable}
      extraData={active}
      style={{ height }}
      renderItem={({ item, index }) => <View style={{ height }}>{renderItem(item, { active: index === active, index })}</View>}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: "100%", aspectRatio: 9 / 16, overflow: "hidden" },
  shade: { position: "absolute", left: 0, right: 0, bottom: 0, height: "30%", opacity: 0.55 },
  topStart: { position: "absolute", left: 12, top: 12 },
  rail: { position: "absolute", right: 8, bottom: 20, alignItems: "center", gap: 12 },
  railItem: { alignItems: "center", gap: 2 },
  railButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  count: { fontVariant: ["lining-nums", "tabular-nums"], fontWeight: "600" },
  follow: { position: "absolute", bottom: -10, alignSelf: "center", width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  caption: { position: "absolute", left: 12, right: 76, bottom: 16, gap: 6 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  pillText: { fontWeight: "700", letterSpacing: 0.4 },
  underline: { textDecorationLine: "underline", fontWeight: "600" },
});
