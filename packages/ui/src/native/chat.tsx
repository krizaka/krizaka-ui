import * as React from "react";
import { Animated, Easing, Pressable, type StyleProp, StyleSheet, TextInput, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Avatar } from "./avatar";
import { useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

/** Where a sent message stands. */
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type MessageBubbleLabels = {
  /** The words of each status (“Sent”, “Read”…), shown under the last message of yours. */
  status?: Partial<Record<MessageStatus, string>>;
  /** The retry hint of a failed message (“Tap to retry”). */
  retry?: string;
};

export type MessageBubbleProps = {
  /** The text. */
  text: string;
  /** Yours (right, in the accent) or theirs (left). */
  mine?: boolean;
  /** The time, written by the app (“14:02”). */
  time?: string;
  /** Where a message of yours stands; shown when `showStatus`. */
  status?: MessageStatus;
  /** Show the status under the bubble (the last message of yours). */
  showStatus?: boolean;
  /** A line above the text: what it answers (“Replied to your story”). */
  context?: string;
  /** Called when a failed message is pressed: send it again. */
  onRetry?: () => void;
  /** Part of a run of the same sender: the corner towards the next one is tighter. */
  grouped?: "first" | "middle" | "last" | "single";
  /** The words, passed translated. */
  labels?: MessageBubbleLabels;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const STATUS: Record<MessageStatus, string> = { sending: "Sending", sent: "Sent", delivered: "Delivered", read: "Read", failed: "Not sent" };

/** A message: yours in the accent on the right, theirs on the left, the time inside, the receipt under the last of yours. */
export function MessageBubble({ text, mine, time, status, showStatus, context, onRetry, grouped = "single", labels, style }: MessageBubbleProps) {
  const { theme, radius } = useTheme();
  const words = { ...STATUS, ...labels?.status };
  const failed = status === "failed";
  const big = radius.xl;
  const tight = 6;
  const corners = mine
    ? { borderTopRightRadius: grouped === "middle" || grouped === "last" ? tight : big, borderBottomRightRadius: grouped === "first" || grouped === "middle" ? tight : big }
    : { borderTopLeftRadius: grouped === "middle" || grouped === "last" ? tight : big, borderBottomLeftRadius: grouped === "first" || grouped === "middle" ? tight : big };
  const tone = mine ? "onAccent" : "text";
  const bubble = (
    <View
      style={[
        styles.bubble,
        { borderRadius: big, backgroundColor: mine ? theme.accent : theme.surface2, opacity: status === "sending" ? 0.7 : 1 },
        corners,
        failed ? { borderWidth: 2, borderColor: theme.danger } : null,
      ]}
    >
      {context ? (
        <Txt variant="caption" tone={mine ? "onAccent" : "secondary"} style={styles.context}>
          {context}
        </Txt>
      ) : null}
      <Txt tone={tone}>{text}</Txt>
      {time ? (
        <Txt variant="caption" tone={tone} style={styles.time}>
          {time}
        </Txt>
      ) : null}
    </View>
  );
  const name = [text, time, failed ? `${words.failed}. ${labels?.retry ?? ""}` : null].filter(Boolean).join(", ");
  return (
    <View style={[styles.row, mine ? styles.mine : styles.theirs, style]}>
      {failed && onRetry ? (
        <Pressable role="button" aria-label={name} onPress={onRetry} style={styles.max}>
          {bubble}
        </Pressable>
      ) : (
        <View accessible aria-label={name} style={styles.max}>
          {bubble}
        </View>
      )}
      {showStatus && status ? (
        <View style={styles.status}>
          {status === "delivered" || status === "read" || status === "sent" ? (
            <Svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
              <Path d={status === "sent" ? "M5 12.5l4.5 4.5L19 7.5" : "M2 12.5l4.5 4.5L16 7.5M9 15l2 2 9.5-9.5"} fill="none" stroke={status === "read" ? theme.accent : theme.textSecondary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          ) : null}
          <Txt variant="caption" tone={failed ? "danger" : "secondary"}>
            {words[status]}
          </Txt>
        </View>
      ) : null}
    </View>
  );
}

export type TypingIndicatorProps = {
  /** What is said to screen readers and shown beside the dots (“Elena is typing”) — passed translated. */
  label: string;
  /** Show the words beside the dots. Default false. */
  showLabel?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** Three dots that breathe in a bubble while the other person types; still under reduced motion. */
export function TypingIndicator({ label, showLabel, style }: TypingIndicatorProps) {
  const { theme, radius } = useTheme();
  const reduce = useReducedMotion();
  const [t] = React.useState(() => new Animated.Value(0));
  React.useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [reduce, t]);
  return (
    <View accessible role="progressbar" aria-label={label} accessibilityLiveRegion="polite" style={[styles.typingRow, style]}>
      <View style={[styles.typing, { backgroundColor: theme.surface2, borderRadius: radius.xl }]}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: theme.textSecondary },
              reduce ? null : { opacity: t.interpolate({ inputRange: [0, (i + 1) / 4, (i + 2) / 4, 1], outputRange: [0.35, 1, 0.35, 0.35], extrapolate: "clamp" }) },
            ]}
          />
        ))}
      </View>
      {showLabel ? (
        <Txt variant="caption" tone="secondary">
          {label}
        </Txt>
      ) : null}
    </View>
  );
}

export type MessageComposerProps = {
  /** The draft (controlled). */
  value: string;
  /** Called on every key (send the typing signal from here). */
  onValueChange: (text: string) => void;
  /** Sends the draft; the composer does not clear it — the app does once sent. */
  onSend: () => void;
  /** The input's name and placeholder (“Message”) — passed translated. */
  placeholder: string;
  /** The send button's name (“Send”). */
  sendLabel: string;
  /** Before the input: an attach button. */
  leading?: React.ReactNode;
  /** Cannot write (blocked, read-only): the reason in its place. */
  disabledReason?: string;
  /** The longest message. Default 4000. */
  maxLength?: number;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** Where a message is written: a growing input, an attach slot, a send button that wakes when there is something to send. */
export function MessageComposer({ value, onValueChange, onSend, placeholder, sendLabel, leading, disabledReason, maxLength = 4000, style }: MessageComposerProps) {
  const { theme, radius, insets, haptic } = useTheme();
  const ready = value.trim().length > 0;
  return (
    <View style={[styles.composer, { borderTopColor: theme.borderSubtle, backgroundColor: theme.surface0, paddingBottom: 8 + insets.bottom }, style]}>
      {disabledReason ? (
        <Txt tone="secondary" style={styles.flex}>
          {disabledReason}
        </Txt>
      ) : (
        <>
          {leading}
          <TextInput
            aria-label={placeholder}
            value={value}
            onChangeText={onValueChange}
            placeholder={placeholder}
            placeholderTextColor={theme.textMuted}
            multiline
            maxLength={maxLength}
            style={[styles.input, { borderRadius: radius.xl, borderColor: theme.borderDefault, backgroundColor: theme.surface1, color: theme.textPrimary }]}
          />
          <Pressable
            role="button"
            aria-label={sendLabel}
            aria-disabled={!ready}
            disabled={!ready}
            onPress={() => {
              haptic("impact");
              onSend();
            }}
            style={({ pressed }) => [styles.send, { backgroundColor: ready ? (pressed ? theme.accentHover : theme.accent) : theme.surface3 }]}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
              <Path d="M4 12l16-8-6 16-2.5-6.5L4 12z" fill={ready ? theme.onAccent : theme.textMuted} />
            </Svg>
          </Pressable>
        </>
      )}
    </View>
  );
}

export type ConversationItemProps = {
  /** The other person's name. */
  name: string;
  /** Their avatar's URI. */
  avatar?: string | null;
  /** Their presence (a dot on the avatar). */
  presence?: "online" | "away" | "busy" | "offline";
  /** The presence in words (“online”). */
  presenceLabel?: string;
  /** The last message, or “typing…”. */
  preview: string;
  /** The preview is the typing signal: in the accent. */
  typing?: boolean;
  /** When (“14:02”, “Mon”). */
  time?: string;
  /** Unread messages: a count in the accent, the name in bold. */
  unread?: number;
  /** The unread count in words (“3 unread”). */
  unreadLabel?: string;
  /** Opens the conversation. */
  onPress?: () => void;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** A conversation in the list: avatar and presence, name, the last message or typing, the time, the unread count. */
export function ConversationItem({ name, avatar, presence, presenceLabel, preview, typing, time, unread = 0, unreadLabel, onPress, style }: ConversationItemProps) {
  const { theme, radius } = useTheme();
  return (
    <Pressable
      role="button"
      // The words in the order they are seen (name, time, preview, count), then the presence — the picture is hidden.
      aria-label={[name, time, preview, unread > 0 ? (unreadLabel ?? String(unread)) : null, presence ? presenceLabel : null].filter(Boolean).join(", ")}
      onPress={onPress}
      style={({ pressed }) => [styles.item, { backgroundColor: pressed ? theme.surface2 : theme.surface0 }, style]}
    >
      <View aria-hidden>
        <Avatar src={avatar} alt={name} size="lg" presence={presence} presenceLabel={presenceLabel} />
      </View>
      <View style={styles.flex}>
        <View style={styles.top}>
          <Txt variant="label" numberOfLines={1} style={[styles.flex, unread > 0 ? styles.bold : null]}>
            {name}
          </Txt>
          {time ? (
            <Txt variant="caption" tone={unread > 0 ? "accent" : "secondary"}>
              {time}
            </Txt>
          ) : null}
        </View>
        <View style={styles.top}>
          <Txt variant="caption" tone={typing ? "accent" : unread > 0 ? "text" : "secondary"} numberOfLines={1} style={styles.flex}>
            {preview}
          </Txt>
          {unread > 0 ? (
            <View style={[styles.count, { backgroundColor: theme.accent, borderRadius: radius.full }]}>
              <Txt variant="caption" tone="onAccent" style={styles.bold}>
                {unread > 99 ? "99+" : unread}
              </Txt>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { gap: 2 },
  mine: { alignItems: "flex-end" },
  theirs: { alignItems: "flex-start" },
  max: { maxWidth: "80%" },
  bubble: { paddingHorizontal: 12, paddingVertical: 8, gap: 2 },
  context: { opacity: 0.85 },
  time: { alignSelf: "flex-end", fontSize: 11 },
  status: { flexDirection: "row", alignItems: "center", gap: 4 },
  typingRow: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" },
  typing: { flexDirection: "row", gap: 4, paddingHorizontal: 14, paddingVertical: 12 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: 8, paddingHorizontal: 12, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, maxHeight: 120, minHeight: 40, borderWidth: 1, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 10, fontSize: 16 },
  send: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  top: { flexDirection: "row", alignItems: "center", gap: 8 },
  bold: { fontWeight: "800" },
  count: { minWidth: 20, height: 20, paddingHorizontal: 6, alignItems: "center", justifyContent: "center" },
});
