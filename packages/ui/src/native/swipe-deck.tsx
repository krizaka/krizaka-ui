import * as React from "react";
import { AccessibilityInfo, Animated, Image, PanResponder, Platform, Pressable, type StyleProp, StyleSheet, useWindowDimensions, View, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

import { useReducedMotion, useSvgId, useTheme } from "./theme";
import { Txt } from "./txt";

export type PersonCardProps = {
  /** The person's photos (URIs), the first shown first; tap the left or right side to move between them. */
  photos: readonly { uri: string; alt?: string }[];
  /** The name. */
  name: string;
  /** The age, written after the name. */
  age?: number;
  /** Beside the name: a `VerifiedBadge`. */
  badge?: React.ReactNode;
  /** A line under the name: a `DistanceChip`, a job. */
  meta?: React.ReactNode;
  /** A sentence about the person. */
  bio?: string;
  /** At the bottom: the interests as chips. */
  footer?: React.ReactNode;
  /** The photo position, read: `(n, total) => "Photo " + n + " of " + total`. */
  photoLabel?: (position: number, total: number) => string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** A person on a card: the photos full bleed (tap a side to change), the name and age over a scrim, a line, a bio, chips. */
export function PersonCard({ photos, name, age, badge, meta, bio, footer, photoLabel = (n, t) => `Photo ${n} of ${t}`, style }: PersonCardProps) {
  const { theme, radius } = useTheme();
  const [index, setIndex] = React.useState(0);
  const gradient = useSvgId("kz-profile-");
  const [box, setBox] = React.useState<{ width: number; height: number } | null>(null);
  const photo = photos[index];
  return (
    <View
      // One element for VoiceOver and TalkBack (name, age, bio, the photo position); on the web a named group, so its
      // own buttons and chips stay reachable.
      accessible={Platform.OS !== "web"}
      accessibilityActions={photos.length > 1 ? [{ name: "increment" }, { name: "decrement" }] : []}
      onAccessibilityAction={(e) => setIndex((i) => Math.max(0, Math.min(photos.length - 1, i + (e.nativeEvent.actionName === "increment" ? 1 : -1))))}
      role={Platform.OS === "web" ? "group" : "img"}
      aria-label={[`${name}${age !== undefined ? `, ${age}` : ""}`, bio, photos.length > 1 ? photoLabel(index + 1, photos.length) : null].filter(Boolean).join(". ")}
      style={[styles.card, { borderRadius: radius.xl, backgroundColor: theme.media }, style]}
    >
      {photo ? <Image testID="person-card-photo" source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
      {photos.length > 1 ? (
        <>
          <View style={styles.bars} aria-hidden>
            {photos.map((_, i) => (
              <View key={i} style={[styles.bar, { backgroundColor: theme.textOnMedia, opacity: i === index ? 1 : 0.4 }]} />
            ))}
          </View>
          <Pressable aria-hidden accessible={false} focusable={false} tabIndex={-1} style={[styles.half, { left: 0 }]} onPress={() => setIndex((i) => Math.max(0, i - 1))} />
          <Pressable aria-hidden accessible={false} focusable={false} tabIndex={-1} style={[styles.half, { right: 0 }]} onPress={() => setIndex((i) => Math.min(photos.length - 1, i + 1))} />
        </>
      ) : null}
      <View
        testID="person-card-overlay"
        pointerEvents="box-none"
        style={styles.bottom}
        onLayout={(e) => setBox({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      >
        {/* The scrim over the same photo, sized in points from the overlay's own layout: a percentage-sized Svg can be
            placed above its parent on iOS, which cut the photo in two (a dark band over the face, none under the name). */}
        {box ? (
          <Svg testID="person-card-scrim" style={styles.scrim} width={box.width} height={box.height} aria-hidden>
            <Defs>
              <LinearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={theme.scrimStrong} stopOpacity={0} />
                <Stop offset="0.5" stopColor={theme.scrimStrong} stopOpacity={0.8} />
                <Stop offset="1" stopColor={theme.scrimStrong} stopOpacity={1} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={box.width} height={box.height} fill={`url(#${gradient})`} />
          </Svg>
        ) : null}
        <View style={styles.text}>
          <View style={styles.nameRow}>
            <Txt variant="display" tone="onMedia" style={styles.name} numberOfLines={1}>
              {name}
              {age !== undefined ? <Txt variant="display" tone="onMedia" style={styles.age}>{`  ${age}`}</Txt> : null}
            </Txt>
            {badge}
          </View>
          {meta}
          {bio ? (
            <Txt tone="onMedia" numberOfLines={2}>
              {bio}
            </Txt>
          ) : null}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </View>
    </View>
  );
}

export type SwipeDirection = "like" | "pass";

export type SwipeDeckLabels = {
  /** The like button and action (“Like”). */
  like: string;
  /** The pass button and action (“Pass”). */
  pass: string;
  /** The stamp shown while dragging right (“LIKE”). */
  likeStamp?: string;
  /** The stamp shown while dragging left (“NOPE”). */
  passStamp?: string;
  /** Announced when the deck is empty. */
  empty?: string;
};

export type SwipeDeckProps<T> = {
  /** The cards still to decide, the first on top. */
  items: readonly T[];
  /** A card's id. */
  getId: (item: T) => string;
  /** A card (usually a `PersonCard`). */
  renderCard: (item: T) => React.ReactNode;
  /** Called with the card decided and the decision; remove it from `items`. */
  onSwipe: (item: T, direction: SwipeDirection) => void;
  /** Shown when there is no card left (an `EmptyState`). */
  empty?: React.ReactNode;
  /** The words, passed translated. */
  labels: SwipeDeckLabels;
  /** Hide the like and pass buttons (the app draws its own). */
  hideButtons?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A deck of cards to decide one by one: drag the top card right to like, left to pass (it tilts, a stamp says what it
 * will do, past a third of the screen it flies off), or press the buttons; a tick marks the decision. Screen readers
 * get “Like” and “Pass” as actions of the card. Under reduced motion the card leaves without flying.
 */
export function SwipeDeck<T>({ items, getId, renderCard, onSwipe, empty, labels, hideButtons, style }: SwipeDeckProps<T>) {
  const { theme, haptic } = useTheme();
  const reduce = useReducedMotion();
  const { width } = useWindowDimensions();
  const [x] = React.useState(() => new Animated.Value(0));
  const top = items[0];
  const decide = React.useCallback(
    (direction: SwipeDirection) => {
      if (!top) return;
      haptic("impact");
      const done = () => {
        x.setValue(0);
        onSwipe(top, direction);
        if (items.length === 1 && labels.empty) AccessibilityInfo.announceForAccessibility(labels.empty);
      };
      if (reduce) return done();
      Animated.timing(x, { toValue: (direction === "like" ? 1.4 : -1.4) * width, duration: 220, useNativeDriver: true }).start(done);
    },
    [top, haptic, reduce, x, width, onSwipe, items.length, labels.empty],
  );
   
  const pan = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => x.setValue(g.dx),
        onPanResponderRelease: (_, g) => {
          if (g.dx > width / 3 || g.vx > 1) decide("like");
          else if (g.dx < -width / 3 || g.vx < -1) decide("pass");
          else Animated.spring(x, { toValue: 0, useNativeDriver: true, friction: 6 }).start();
        },
      }),
    [x, width, decide],
  );
   
  const rotate = x.interpolate({ inputRange: [-width, 0, width], outputRange: ["-14deg", "0deg", "14deg"] });
  const likeOpacity = x.interpolate({ inputRange: [0, width / 4], outputRange: [0, 1], extrapolate: "clamp" });
  const passOpacity = x.interpolate({ inputRange: [-width / 4, 0], outputRange: [1, 0], extrapolate: "clamp" });
  const button = (direction: SwipeDirection) => (
    <Pressable
      role="button"
      aria-label={direction === "like" ? labels.like : labels.pass}
      disabled={!top}
      onPress={() => decide(direction)}
      style={({ pressed }) => [
        styles.button,
        { borderColor: direction === "like" ? theme.success : theme.danger, backgroundColor: theme.surface1, transform: [{ scale: pressed ? 0.92 : 1 }], opacity: top ? 1 : 0.4 },
      ]}
    >
      <Svg width={28} height={28} viewBox="0 0 24 24" aria-hidden>
        {direction === "like" ? (
          <Path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={theme.success} />
        ) : (
          <Path d="M6 6l12 12M18 6 6 18" stroke={theme.danger} strokeWidth={3} strokeLinecap="round" />
        )}
      </Svg>
    </Pressable>
  );
  return (
    <View style={[styles.deck, style]}>
      <View style={styles.stack}>
        {!top ? (empty ?? null) : null}
        {items
          .slice(0, 2)
          .reverse()
          .map((item) => {
            const isTop = item === top;
            return (
              <Animated.View
                key={getId(item)}
                {...(isTop ? pan.panHandlers : {})}
                accessibilityActions={isTop ? [{ name: "like", label: labels.like }, { name: "pass", label: labels.pass }] : []}
                onAccessibilityAction={(e) => isTop && decide(e.nativeEvent.actionName as SwipeDirection)}
                aria-hidden={!isTop}
                importantForAccessibility={isTop ? "auto" : "no-hide-descendants"}
                pointerEvents={isTop ? "auto" : "none"}
                style={[StyleSheet.absoluteFill, isTop ? { transform: [{ translateX: x }, { rotate }] } : { transform: [{ scale: 0.96 }], opacity: 0.9 }]}
              >
                {renderCard(item)}
                {isTop ? (
                  <>
                    <Animated.View pointerEvents="none" style={[styles.stamp, styles.stampLike, { borderColor: theme.success, opacity: likeOpacity }]} aria-hidden>
                      <Txt variant="title" style={{ color: theme.success }}>
                        {labels.likeStamp ?? labels.like.toUpperCase()}
                      </Txt>
                    </Animated.View>
                    <Animated.View pointerEvents="none" style={[styles.stamp, styles.stampPass, { borderColor: theme.danger, opacity: passOpacity }]} aria-hidden>
                      <Txt variant="title" style={{ color: theme.danger }}>
                        {labels.passStamp ?? labels.pass.toUpperCase()}
                      </Txt>
                    </Animated.View>
                  </>
                ) : null}
              </Animated.View>
            );
          })}
      </View>
      {hideButtons ? null : (
        <View style={styles.buttons}>
          {button("pass")}
          {button("like")}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, overflow: "hidden" },
  bars: { position: "absolute", top: 8, left: 8, right: 8, flexDirection: "row", gap: 4 },
  bar: { flex: 1, height: 3, borderRadius: 2 },
  half: { position: "absolute", top: 0, bottom: "40%", width: "40%" },
  bottom: { position: "absolute", left: 0, right: 0, bottom: 0, paddingTop: 80 },
  scrim: { position: "absolute", top: 0, left: 0 },
  text: { padding: 16, gap: 6 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { flexShrink: 1, fontSize: 28, lineHeight: 34 },
  age: { fontWeight: "400", fontSize: 26 },
  footer: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  deck: { flex: 1, gap: 16 },
  stack: { flex: 1 },
  stamp: { position: "absolute", top: 40, borderWidth: 3, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 },
  stampLike: { left: 24, transform: [{ rotate: "-14deg" }] },
  stampPass: { right: 24, transform: [{ rotate: "14deg" }] },
  buttons: { flexDirection: "row", justifyContent: "center", gap: 28 },
  button: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});
