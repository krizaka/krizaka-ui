// The native frame: the chart's title, its readout (the active point, written), a plot measured with onLayout, and
// the accessibility the web gets from its table — the plot is one `adjustable` element whose label is the title and
// the written summary, and whose increment / decrement (swipe up / down with VoiceOver and TalkBack) walk the points,
// each one read as its value. A tap selects the nearest point. StyleSheet and the token roles only.
import { themes as tokenThemes } from "@krizaka/tokens/native";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { type LayoutChangeEvent, Pressable, StyleSheet, Text, useColorScheme, View, type ViewStyle } from "react-native";

import { type ChartLabels, type ChartLabelsInput, mergeLabels } from "../core/labels";
import { type Mode, palette } from "../core/palette";
import type { BrandId, Locale, SeriesColor, Tone } from "../core/types";

/** The colour roles a chart reads (a subset of @krizaka/tokens/native's `Theme`; `useTheme().theme` of @krizaka/ui/native fits). */
export type ChartTheme = {
  readonly surface1: string;
  readonly surface2: string;
  readonly surface3: string;
  readonly borderSubtle: string;
  readonly borderDefault: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly accent: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly info: string;
};

const THEMES: Readonly<Record<Mode, ChartTheme>> = tokenThemes;

export interface NativeChartsSettings {
  /** The locale of every figure and date. Default `"en-US"`. */
  locale?: Locale;
  /** The brand whose palette leads. Default Krizaka. */
  brand?: BrandId;
  /** The words: the readout, the summary. */
  labels?: ChartLabelsInput;
  /** Dark or light. Default: the device's (pass `useTheme().scheme` of @krizaka/ui/native to follow the app). */
  scheme?: Mode;
  /** The app's colour roles (`useTheme().theme` of @krizaka/ui/native): a product's brand overrides apply. */
  theme?: Partial<ChartTheme>;
}

const Context = createContext<NativeChartsSettings>({});

/** Sets the locale, brand, words, scheme and theme of every chart below it. */
export function ChartsProvider({ children, ...settings }: NativeChartsSettings & { children: ReactNode }) {
  const parent = useContext(Context);
  const value = useMemo(() => ({ ...parent, ...Object.fromEntries(Object.entries(settings).filter(([, v]) => v !== undefined)) }), [parent, settings]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export interface Resolved {
  readonly locale: Locale;
  readonly labels: ChartLabels;
  readonly theme: ChartTheme;
  readonly palette: readonly string[];
  readonly color: (color: SeriesColor | undefined, slot: number) => string;
}

export function useNativeSettings(own: NativeChartsSettings): Resolved {
  const shared = useContext(Context);
  const device = useColorScheme();
  const scheme: Mode = own.scheme ?? shared.scheme ?? (device === "light" ? "light" : "dark");
  const brand = own.brand ?? shared.brand ?? "krizaka";
  return useMemo(() => {
    const theme = { ...THEMES[scheme], ...shared.theme, ...own.theme };
    const colors = palette(brand, scheme);
    const tones: Record<Tone, string> = { neutral: theme.textSecondary, accent: theme.accent, success: theme.success, warning: theme.warning, danger: theme.danger, info: theme.info };
    return {
      locale: own.locale ?? shared.locale ?? "en-US",
      labels: mergeLabels(shared.labels, own.labels),
      theme,
      palette: colors,
      color: (color, slot) => (color === undefined ? colors[(slot - 1) % 8]! : typeof color === "number" ? colors[color - 1]! : color in tones ? tones[color as Tone] : color),
    };
  }, [scheme, brand, shared, own.locale, own.labels, own.theme]);
}

export interface NativeFrameProps extends NativeChartsSettings {
  /** What the chart shows: its heading and accessible name. */
  title: string;
  /** Hide the heading (it stays the accessible name). */
  hideTitle?: boolean;
  /** The plot's height. */
  height?: number;
  /** The data is on its way. */
  loading?: boolean;
  /** Shown instead of the plot when there is nothing to draw. Default: the `empty` label. */
  empty?: ReactNode;
  /** The style of the chart's container (layout only: colours come from the theme). */
  style?: ViewStyle;
}

interface FrameInternals {
  readonly frame: NativeFrameProps;
  readonly defaultHeight: number;
  readonly resolved: Resolved;
  readonly summary: string;
  readonly isEmpty: boolean;
  /** The points the screen reader walks, already written. */
  readonly points: readonly string[];
  readonly active: number | null;
  readonly onActive: (index: number | null) => void;
  /** The index nearest to a tap at `x` on a plot `width` wide. */
  readonly indexAt?: (x: number, width: number) => number | null;
  readonly legend?: ReactNode;
  readonly children: (width: number, height: number) => ReactNode;
}

export function NativeFrame({ frame, defaultHeight, resolved, summary, isEmpty, points, active, onActive, indexAt, legend, children }: FrameInternals) {
  const { title, hideTitle, height = defaultHeight, loading, empty, style } = frame;
  const { theme, labels } = resolved;
  const [width, setWidth] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => setWidth(Math.round(event.nativeEvent.layout.width));
  const readout = active !== null ? points[active] : null;
  const n = points.length;

  let body: ReactNode;
  if (loading) body = <View style={[styles.state, { backgroundColor: theme.surface2 }]} role="progressbar" aria-label={labels.loading} />;
  else if (isEmpty)
    body = empty ?? (
      <View style={[styles.state, { borderColor: theme.borderDefault, borderWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" }]}>
        <Text style={[styles.small, { color: theme.textSecondary }]}>{labels.empty}</Text>
      </View>
    );
  else body = width > 0 ? children(width, height) : null;

  return (
    <View style={[styles.root, style]}>
      {!hideTitle && (
        <Text style={[styles.title, { color: theme.textPrimary }]} role="heading">
          {title}
        </Text>
      )}
      {legend}
      <Pressable
        onLayout={onLayout}
        style={{ height }}
        disabled={isEmpty || loading}
        onPress={(event) => indexAt && onActive(indexAt(event.nativeEvent.locationX, width))}
        accessible
        // With points to walk, an adjustable element (a slider on the web): its value is the active point.
        accessibilityRole={n ? "adjustable" : "image"}
        accessibilityLabel={`${title}. ${summary}`}
        accessibilityValue={n ? { min: 0, max: n - 1, now: active ?? 0, ...(readout ? { text: readout } : {}) } : undefined}
        // react-native-web reads the ARIA props (the slider's required value), React Native the accessibility ones.
        aria-valuemin={n ? 0 : undefined}
        aria-valuemax={n ? n - 1 : undefined}
        aria-valuenow={n ? (active ?? 0) : undefined}
        aria-valuetext={readout ?? undefined}
        accessibilityActions={n ? [{ name: "increment" }, { name: "decrement" }] : []}
        onAccessibilityAction={(event) => {
          if (!n) return;
          if (event.nativeEvent.actionName === "increment") onActive(Math.min(n - 1, (active ?? -1) + 1));
          if (event.nativeEvent.actionName === "decrement") onActive(Math.max(0, (active ?? n) - 1));
        }}
      >
        {body}
      </Pressable>
      {readout ? (
        <Text style={[styles.small, { color: theme.textSecondary }]} aria-hidden>
          {readout}
        </Text>
      ) : null}
    </View>
  );
}

/** The legend: a key in the series' colour beside its name in the text colour (two series or more). */
export function NativeLegend({ items, theme }: { items: readonly { label: string; color: string }[]; theme: ChartTheme }) {
  if (items.length < 2) return null;
  return (
    <View style={styles.legend} aria-hidden>
      {items.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.key, { backgroundColor: item.color }]} />
          <Text style={[styles.small, { color: theme.textSecondary }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 8 },
  title: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  small: { fontSize: 12, lineHeight: 16, fontVariant: ["tabular-nums"] },
  state: { flex: 1, borderRadius: 10, alignItems: "center", justifyContent: "center", padding: 16 },
  legend: { flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  key: { width: 10, height: 10, borderRadius: 3 },
});
