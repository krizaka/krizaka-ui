import * as React from "react";
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

export type ToastTone = "default" | "success" | "warning" | "error" | "info";

export type ToastOptions = {
  /** Replaces a toast with the same id (a notification shown once). */
  id?: string;
  description?: string;
  tone?: ToastTone;
  /** A decorative icon before the text. */
  icon?: React.ReactNode;
  /** Milliseconds on screen; `Infinity` keeps it until dismissed. Default: the Toaster's `duration`. */
  duration?: number;
  /** Pressing the toast (opening what it is about); it is then dismissed. */
  onPress?: () => void;
  /** A button inside the toast; it is then dismissed. */
  action?: { label: string; onPress: () => void };
  /** Called once the toast leaves, whatever the reason. */
  onDismiss?: () => void;
};

export type ToastItem = ToastOptions & { id: string; title: string };

// One queue for the app, outside React: `toast()` can be called from anywhere (a stream handler, a mutation).
let items: readonly ToastItem[] = [];
const listeners = new Set<() => void>();
let counter = 0;
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const snapshot = () => items;

function show(title: string, options: ToastOptions = {}): string {
  const id = options.id ?? `kz-toast-${++counter}`;
  const item: ToastItem = { ...options, id, title };
  items = items.some((t) => t.id === id) ? items.map((t) => (t.id === id ? item : t)) : [...items, item];
  emit();
  return id;
}

function dismiss(id?: string) {
  const gone = items.filter((t) => id === undefined || t.id === id);
  if (gone.length === 0) return;
  items = id === undefined ? [] : items.filter((t) => t.id !== id);
  emit();
  gone.forEach((t) => t.onDismiss?.());
}

const tone = (name: ToastTone) => (title: string, options?: Omit<ToastOptions, "tone">) => show(title, { ...options, tone: name });

/** `toast(title, options)`, `toast.success/warning/error/info(…)`, `toast.dismiss(id?)` — the web `toast`'s names. */
export const toast = Object.assign(show, {
  success: tone("success"),
  warning: tone("warning"),
  error: tone("error"),
  info: tone("info"),
  dismiss,
});

export type ToasterProps = {
  /** The accessible name of each toast's close button — passed translated. */
  closeLabel: string;
  position?: "top" | "bottom";
  /** Distance from the edge, e.g. the safe-area inset + a margin (no safe-area dependency here). */
  offset?: number;
  /** Default milliseconds on screen. */
  duration?: number;
  /** At most this many on screen; the oldest leave first. */
  max?: number;
};

function ToastView({ item, closeLabel, duration }: { item: ToastItem; closeLabel: string; duration: number }) {
  const { theme, radius } = useTheme();
  const reduce = useReducedMotion();
  const [enter] = React.useState(() => new Animated.Value(reduce ? 1 : 0));
  React.useEffect(() => {
    if (reduce) enter.setValue(1);
    else Animated.timing(enter, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [enter, reduce]);
  React.useEffect(() => {
    AccessibilityInfo.announceForAccessibility(item.description ? `${item.title}. ${item.description}` : item.title);
  }, [item.title, item.description]);
  const ms = item.duration ?? duration;
  React.useEffect(() => {
    if (!Number.isFinite(ms)) return;
    const timer = setTimeout(() => dismiss(item.id), ms);
    return () => clearTimeout(timer);
  }, [item.id, ms]);
  const edge = { success: theme.success, warning: theme.warning, error: theme.danger, info: theme.info, default: theme.borderDefault }[item.tone ?? "default"];
  // The text (with its icon) is the pressable part; the action and the close button sit beside it, never inside.
  const text = (
    <>
      {item.icon ? <View aria-hidden>{item.icon}</View> : null}
      <View style={styles.content}>
        <Txt variant="label" numberOfLines={2}>
          {item.title}
        </Txt>
        {item.description ? (
          <Txt variant="caption" tone="secondary" numberOfLines={3}>
            {item.description}
          </Txt>
        ) : null}
      </View>
    </>
  );
  const body = (
    <>
      {item.onPress ? (
        <Pressable
          role="button"
          onPress={() => {
            item.onPress?.();
            dismiss(item.id);
          }}
          style={({ pressed }) => [styles.main, { opacity: pressed ? 0.8 : 1 }]}
        >
          {text}
        </Pressable>
      ) : (
        <View style={styles.main}>{text}</View>
      )}
      {item.action ? (
        <Pressable
          role="button"
          onPress={() => {
            item.action?.onPress();
            dismiss(item.id);
          }}
          style={[styles.action, { backgroundColor: theme.accent, borderRadius: radius.sm }]}
        >
          <Text style={[styles.actionLabel, { color: theme.onAccent }]}>{item.action.label}</Text>
        </Pressable>
      ) : null}
      <Pressable role="button" aria-label={closeLabel} hitSlop={10} onPress={() => dismiss(item.id)} style={styles.close}>
        <Text style={[styles.cross, { color: theme.textSecondary }]}>×</Text>
      </Pressable>
    </>
  );
  const frame = [
    styles.toast,
    { backgroundColor: theme.surface2, borderColor: theme.borderDefault, borderLeftColor: edge, borderRadius: radius.lg, shadowColor: theme.scrimStrong },
  ];
  // A slide only, never a fade: the text is legible (and its contrast measurable) from the first frame.
  const motion = { transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }] };
  return (
    <Animated.View aria-live="polite" style={motion}>
      <View style={frame}>{body}</View>
    </Animated.View>
  );
}

/** Mount once, at the root (inside `ThemeProvider`). Then call `toast()` from anywhere. */
export function Toaster({ closeLabel, position = "top", offset = 12, duration = 6000, max = 3 }: ToasterProps) {
  const all = React.useSyncExternalStore(subscribe, snapshot, snapshot);
  const shown = all.slice(-max);
  if (shown.length === 0) return null;
  return (
    <View pointerEvents="box-none" style={[styles.stack, position === "top" ? { top: offset } : { bottom: offset }]}>
      {(position === "top" ? shown : [...shown].reverse()).map((item) => (
        <ToastView key={item.id} item={item} closeLabel={closeLabel} duration={duration} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { position: "absolute", left: 12, right: 12, gap: 8, zIndex: 100 },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  main: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  content: { flex: 1, gap: 2 },
  action: { paddingHorizontal: 12, paddingVertical: 6 },
  actionLabel: { fontSize: 12, fontWeight: "700" },
  close: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  cross: { fontSize: 18, lineHeight: 20, fontWeight: "700" },
});
