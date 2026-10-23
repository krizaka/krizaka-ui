// Client (state, an observer). A control for the look of one text role — font, size, weight, spacing, alignment, case,
// italic, tone — over the primitives: the font as a radio group whose options are drawn in their own face, the size as
// a step slider, the choices as segmented radio groups, italic as a switch, the tone as swatches. It is controlled, shows
// a live preview, and warns (never clamps) when the tone lacks contrast on the surface or body text is too small.
import { Button } from "@krizaka/ui/button";
import { RadioGroup } from "@krizaka/ui/radio-group";
import { Slider } from "@krizaka/ui/slider";
import { Switch } from "@krizaka/ui/switch";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cx } from "../cx";
import { StyledText } from "./styled-text";
import {
  type Align,
  aligns,
  type Case,
  cases,
  contrastRatio,
  type FontId,
  fontIds,
  fontVariable,
  fontWeights,
  isUnderMinimumSize,
  type Leading,
  leadings,
  parseColor,
  parseTextStyle,
  requiredContrast,
  type SizeStep,
  sizeSteps,
  type TextStyle,
  type TextWeight,
  textWeights,
  type ToneId,
  toneIds,
  toneVariable,
  type Tracking,
  trackings,
} from "./text-style";

/** The controls of the picker, in the order they are drawn. */
export const textStyleFields = ["font", "size", "weight", "leading", "tracking", "align", "case", "italic", "tone"] as const;
export type TextStyleField = (typeof textStyleFields)[number];

export type TextStyleLabels = {
  /** The name of the whole control. */
  picker: string;
  font: string;
  size: string;
  weight: string;
  leading: string;
  tracking: string;
  align: string;
  case: string;
  italic: string;
  tone: string;
  presets: string;
  preview: string;
  fonts: Record<FontId, string>;
  weights: Record<TextWeight, string>;
  leadings: Record<Leading, string>;
  trackings: Record<Tracking, string>;
  aligns: Record<Align, string>;
  cases: Record<Case, string>;
  tones: Record<ToneId, string>;
  /** The contrast warning: `{ratio}` is what the tone reaches, `{min}` what it must. */
  contrastWarning: string;
  /** The small-text warning: `{size}` is the smallest step advised for body text. */
  minSizeWarning: string;
};

/** The English words. */
export const textStyleLabels: TextStyleLabels = {
  picker: "Text style",
  font: "Font",
  size: "Size",
  weight: "Weight",
  leading: "Line height",
  tracking: "Letter spacing",
  align: "Alignment",
  case: "Case",
  italic: "Italic",
  tone: "Colour",
  presets: "Presets",
  preview: "Preview",
  fonts: { display: "Display", text: "Text", mono: "Typewriter", cahier: "Pen" },
  weights: { 400: "Regular", 500: "Medium", 600: "Semibold", 700: "Bold" },
  leadings: { tight: "Tight", normal: "Normal", relaxed: "Relaxed" },
  trackings: { tight: "Tight", normal: "Normal", wide: "Wide" },
  aligns: { start: "Start", center: "Centre", end: "End" },
  cases: { none: "Aa", upper: "AA", "small-caps": "Small caps" },
  tones: { primary: "Primary", secondary: "Secondary", muted: "Muted", accent: "Accent" },
  contrastWarning: "This colour reaches only {ratio}:1 on the background; {min}:1 is needed to read it comfortably.",
  minSizeWarning: "Body text under “{size}” is hard to read.",
};

/** The French words. */
export const textStyleLabelsFr: TextStyleLabels = {
  picker: "Style du texte",
  font: "Police",
  size: "Taille",
  weight: "Graisse",
  leading: "Interligne",
  tracking: "Espacement des lettres",
  align: "Alignement",
  case: "Casse",
  italic: "Italique",
  tone: "Couleur",
  presets: "Préréglages",
  preview: "Aperçu",
  fonts: { display: "Titre", text: "Texte", mono: "Machine à écrire", cahier: "Stylo" },
  weights: { 400: "Normal", 500: "Moyen", 600: "Demi-gras", 700: "Gras" },
  leadings: { tight: "Serré", normal: "Normal", relaxed: "Aéré" },
  trackings: { tight: "Serré", normal: "Normal", wide: "Large" },
  aligns: { start: "Début", center: "Centré", end: "Fin" },
  cases: { none: "Aa", upper: "AA", "small-caps": "Petites capitales" },
  tones: { primary: "Principale", secondary: "Secondaire", muted: "Discrète", accent: "Accent" },
  contrastWarning: "Cette couleur n’atteint que {ratio}:1 sur le fond ; {min}:1 est nécessaire pour la lire confortablement.",
  minSizeWarning: "Un texte courant sous « {size} » se lit mal.",
};

export type TextStylePreset = {
  /** A stable key. */
  id: string;
  /** The name on the button, passed translated (« Titre », « Prix »…). */
  label: string;
  /** The style it applies; what it does not say takes the default. Validated when applied. */
  value: Partial<TextStyle>;
};

export type TextStylePickerProps = {
  /** The text style, controlled. Validated by `parseTextStyle`: anything invalid shows the default. */
  value: TextStyle;
  /** Called with the whole new text style at each change. */
  onChange: (value: TextStyle) => void;
  /** The sample the preview shows, passed translated ("Boulangerie Martin"). */
  previewText: string;
  /** Styles the person can start from, as data. */
  presets?: readonly TextStylePreset[];
  /** The controls to show, in the order of `textStyleFields` (just `["font", "size"]`). A preset then changes only these. */
  fields?: readonly TextStyleField[];
  /** A denser form for a popover from a toolbar. */
  compact?: boolean;
  /** The words, passed translated: `textStyleLabels` (EN) or `textStyleLabelsFr`, or the host's own. */
  labels?: Partial<TextStyleLabels>;
  /** The colour the text will sit on, for the preview and the contrast check (a CSS colour). By default the page's own surface. */
  surface?: string;
  /**
   * What the text is for: `body` (reading text, which `minBodySize` guards) or `title` (a heading, which may be small).
   * @default "body"
   */
  role?: "body" | "title";
  /**
   * The smallest step advised for body text: under it, a warning shows — the size is never forced.
   * @default "sm"
   */
  minBodySize?: SizeStep;
  /** Merged last on the root. */
  className?: string;
};

type Rgb = [number, number, number];

const transparent = (text: string) => text === "transparent" || /^rgba?\([^)]*[,/]\s*0(\.0+)?%?\s*\)$/.test(text.trim());

/** The colour behind an element: the first opaque background up its ancestors. */
function surfaceOf(element: HTMLElement): Rgb | null {
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const color = window.getComputedStyle(node).backgroundColor;
    if (color && !transparent(color)) return parseColor(color);
  }
  return null;
}

/** What the tone reaches on its surface, measured on the preview as it is drawn (the theme and the product's tokens included). */
function useContrast(ref: React.RefObject<HTMLElement | null>, key: string): number | null {
  const [ratio, setRatio] = React.useState<number | null>(null);
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const foreground = parseColor(window.getComputedStyle(element).color);
      const background = surfaceOf(element);
      setRatio(foreground && background ? contrastRatio(foreground, background) : null);
    };
    measure();
    if (typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(measure);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    return () => observer.disconnect();
  }, [ref, key]);
  return ratio;
}

const nearest = (weights: readonly TextWeight[], weight: TextWeight): TextWeight =>
  weights.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), weights[0]!);

/** The control of a text style: font, size, weight, spacing, alignment, case, italic and tone, with a live preview. */
export function TextStylePicker({
  value,
  onChange,
  previewText,
  presets,
  fields = textStyleFields,
  compact,
  labels: given,
  surface,
  role = "body",
  minBodySize = "sm",
  className,
}: TextStylePickerProps) {
  const labels = { ...textStyleLabels, ...given };
  const style = parseTextStyle(value);
  const shown = (field: TextStyleField) => fields.includes(field);
  const id = React.useId();
  const previewRef = React.useRef<HTMLDivElement>(null);
  const ratio = useContrast(previewRef, `${style.tone}|${surface ?? ""}`);

  const set = (patch: Partial<TextStyle>) => onChange(parseTextStyle({ ...style, ...patch }));
  const setFont = (font: FontId) => set({ font, weight: nearest(fontWeights[font], style.weight) });
  const applyPreset = (preset: TextStylePreset) => {
    const next = parseTextStyle(preset.value);
    const patch = Object.fromEntries(textStyleFields.filter(shown).map((f) => [f, next[f]])) as Partial<TextStyle>;
    set(patch.font ? { ...patch, weight: fields.includes("weight") ? patch.weight : nearest(fontWeights[patch.font], style.weight) } : patch);
  };

  const required = requiredContrast(style);
  const warnings: string[] = [];
  if (ratio !== null && ratio < required) warnings.push(labels.contrastWarning.replace("{ratio}", ratio.toFixed(1)).replace("{min}", String(required)));
  if (role === "body" && isUnderMinimumSize(style.size, minBodySize)) warnings.push(labels.minSizeWarning.replace("{size}", minBodySize));

  const group = (field: TextStyleField, title: string, control: React.ReactNode) => (
    <div key={field} className="flex min-w-0 flex-col gap-2" data-field={field}>
      <span id={`${id}-${field}`} className="text-xs font-semibold text-fg-secondary">
        {title}
      </span>
      {control}
    </div>
  );
  const segmented = <T extends string | number>(field: TextStyleField, title: string, items: readonly T[], current: T, text: (item: T) => string, choose: (item: T) => void, disabled?: (item: T) => boolean) =>
    group(
      field,
      title,
      <RadioGroup.Root variant="segmented" aria-labelledby={`${id}-${field}`} value={String(current)} onValueChange={(next) => choose(items.find((item) => String(item) === next)!)} className="max-w-full">
        {items.map((item) => (
          <RadioGroup.Segment key={item} value={String(item)} disabled={disabled?.(item)}>
            {text(item)}
          </RadioGroup.Segment>
        ))}
      </RadioGroup.Root>,
    );

  const controls: Record<TextStyleField, () => React.ReactNode> = {
    font: () =>
      group(
        "font",
        labels.font,
        <RadioGroup.Root variant="cards" aria-labelledby={`${id}-font`} value={style.font} onValueChange={(next) => setFont(next as FontId)} className="grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
          {fontIds.map((font) => (
            <RadioGroup.Card key={font} value={font} style={{ fontFamily: fontVariable[font] }}>
              {labels.fonts[font]}
            </RadioGroup.Card>
          ))}
        </RadioGroup.Root>,
      ),
    size: () =>
      group(
        "size",
        labels.size,
        <Slider
          label={labels.size}
          min={0}
          max={sizeSteps.length - 1}
          step={1}
          ticks
          value={sizeSteps.indexOf(style.size)}
          onValueChange={(index) => set({ size: sizeSteps[index]! })}
          formatValue={(index) => sizeSteps[index]!}
          floatingValue
        />,
      ),
    weight: () => segmented("weight", labels.weight, textWeights, style.weight, (w) => labels.weights[w], (weight) => set({ weight }), (w) => !fontWeights[style.font].includes(w)),
    leading: () => segmented("leading", labels.leading, leadings, style.leading, (l) => labels.leadings[l], (leading) => set({ leading })),
    tracking: () => segmented("tracking", labels.tracking, trackings, style.tracking, (t) => labels.trackings[t], (tracking) => set({ tracking })),
    align: () => segmented("align", labels.align, aligns, style.align, (a) => labels.aligns[a], (align) => set({ align })),
    case: () => segmented("case", labels.case, cases, style.case, (c) => labels.cases[c], (next) => set({ case: next })),
    italic: () => (
      <div key="italic" className="flex min-w-0 items-center justify-between gap-3" data-field="italic">
        <span id={`${id}-italic`} className="text-xs font-semibold text-fg-secondary">
          {labels.italic}
        </span>
        <Switch aria-labelledby={`${id}-italic`} checked={style.italic} onCheckedChange={(italic) => set({ italic })} />
      </div>
    ),
    tone: () =>
      group(
        "tone",
        labels.tone,
        <RadioGroupPrimitive.Root aria-labelledby={`${id}-tone`} value={style.tone} onValueChange={(next) => set({ tone: next as ToneId })} orientation="horizontal" className="flex flex-wrap gap-3">
          {toneIds.map((tone) => (
            <RadioGroupPrimitive.Item
              key={tone}
              value={tone}
              aria-label={labels.tones[tone]}
              title={labels.tones[tone]}
              style={{ backgroundColor: toneVariable(tone) }}
              className="h-8 w-8 rounded-full border border-border-strong focus-visible:outline-hidden focus-visible:focus-ring data-[state=checked]:ring-2 data-[state=checked]:ring-accent data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-surface-0"
            />
          ))}
        </RadioGroupPrimitive.Root>,
      ),
  };

  return (
    <div role="group" aria-label={labels.picker} data-compact={compact ? "" : undefined} className={cx("flex min-w-0 flex-col", compact ? "gap-3" : "gap-5", className)}>
      <div
        ref={previewRef}
        data-preview=""
        aria-label={labels.preview}
        role="group"
        style={surface ? { backgroundColor: surface } : undefined}
        className={cx("min-w-0 overflow-hidden rounded-xl border border-border-default", surface ? "" : "bg-surface-1", compact ? "p-3" : "p-5")}
      >
        <StyledText as="p" value={style} className="break-words">
          {previewText}
        </StyledText>
      </div>
      <div role="status" aria-live="polite" data-warnings="">
        {warnings.map((warning) => (
          <p key={warning} className="text-xs font-medium text-fg-warning">
            {warning}
          </p>
        ))}
      </div>
      {presets?.length ? (
        <div role="group" aria-label={labels.presets} className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button key={preset.id} type="button" size="sm" variant="outline" onClick={() => applyPreset(preset)}>
              {preset.label}
            </Button>
          ))}
        </div>
      ) : null}
      <div className={cx("grid grid-cols-1 gap-x-6", compact ? "gap-y-3" : "gap-y-5 sm:grid-cols-2")}>
        {textStyleFields.filter(shown).map((field) => (
          <React.Fragment key={field}>{controls[field]()}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
