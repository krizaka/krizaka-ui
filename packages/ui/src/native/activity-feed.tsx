import * as React from "react";
import { AccessibilityInfo, SectionList, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { type ActivityEvent, type ActivityTone, groupActivity, timeAgo } from "../activity-feed/group";
import { type Theme, useTheme } from "./theme";
import { Txt } from "./txt";

export type { ActivityEvent, ActivityTone } from "../activity-feed/group";

export type ActivityFeedLabels = {
  /** The heading of today's events. */
  today: string;
  /** The heading of yesterday's. */
  yesterday: string;
  /** A folded run: `(n) => "×" + n`. */
  times: (count: number) => string;
  /** Announced when new events arrive in a live feed. */
  newEvents: (count: number) => string;
};

const LABELS: ActivityFeedLabels = { today: "Today", yesterday: "Yesterday", times: (n) => `×${n}`, newEvents: (n) => (n === 1 ? "1 new event" : `${n} new events`) };

export type ActivityFeedProps<T extends ActivityEvent> = {
  /** The events, in any order. */
  events: readonly T[];
  /** The feed's accessible name. */
  "aria-label"?: string;
  /** The locale of the dates and the “… ago”. Default `en-US`. */
  locale?: string;
  /** Now, for the “… ago” and the headings. Default: now, refreshed every minute. */
  now?: Date;
  /** Fold the runs of the same actor and kind. Default true. */
  fold?: boolean;
  /** Announce new events (a stream). */
  live?: boolean;
  /** Before an event's text: its actor's `Avatar`. */
  leading?: (event: T) => React.ReactNode;
  /** Shown when there is no event (an `EmptyState`). */
  empty?: React.ReactNode;
  /** The words, passed translated. */
  labels?: Partial<ActivityFeedLabels>;
  /** Styles of the list. */
  style?: StyleProp<ViewStyle>;
};

const tone = (t: Theme, name: ActivityTone | undefined) => ({ neutral: t.borderStrong, accent: t.accent, success: t.success, warning: t.warning, danger: t.danger, info: t.info })[name ?? "neutral"];

/** What happened, newest first — the web `ActivityFeed`: by day under sticky headings, runs folded, “2 min ago”, new events announced. */
export function ActivityFeed<T extends ActivityEvent>({ events, "aria-label": label, locale = "en-US", now: given, fold = true, live, leading, empty, labels: words, style }: ActivityFeedProps<T>) {
  const { theme } = useTheme();
  const labels = { ...LABELS, ...words };
  const [tick, setTick] = React.useState(() => given ?? new Date());
  React.useEffect(() => {
    if (given) return;
    const timer = setInterval(() => setTick(new Date()), 60_000);
    return () => clearInterval(timer);
  }, [given]);
  const now = given ?? tick;
  const seen = React.useRef(events.length);
  React.useEffect(() => {
    const added = events.length - seen.current;
    seen.current = events.length;
    if (live && added > 0) AccessibilityInfo.announceForAccessibility(labels.newEvents(added));
  }, [events.length, live]); // eslint-disable-line react-hooks/exhaustive-deps -- announce on a new count only
  const sections = groupActivity(events, { now, locale, today: labels.today, yesterday: labels.yesterday, fold }).map((g) => ({ title: g.label, data: g.events }));
  return (
    <SectionList
      aria-label={label}
      style={style}
      sections={sections}
      keyExtractor={(item) => item.event.id}
      stickySectionHeadersEnabled
      ListEmptyComponent={empty ? <>{empty}</> : null}
      renderSectionHeader={({ section }) => (
        <View style={[styles.heading, { backgroundColor: theme.surface0 }]}>
          <Txt variant="caption" tone="secondary" role="heading" style={styles.headingText}>
            {section.title}
          </Txt>
        </View>
      )}
      renderItem={({ item: { event, count } }) => (
        <View style={styles.row} accessible>
          {leading ? leading(event) : <View aria-hidden style={[styles.marker, { backgroundColor: tone(theme, event.tone) }]} />}
          <View style={styles.body}>
            <Txt>
              {event.title}
              {count > 1 ? <Txt variant="caption" tone="secondary">{`  ${labels.times(count)}`}</Txt> : null}
            </Txt>
            {event.description ? (
              <Txt variant="caption" tone="secondary">
                {event.description}
              </Txt>
            ) : null}
          </View>
          <Txt variant="caption" tone="secondary">
            {timeAgo(event.at, { now, locale })}
          </Txt>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  heading: { paddingVertical: 6 },
  headingText: { fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 10 },
  marker: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  body: { flex: 1, gap: 2 },
});
