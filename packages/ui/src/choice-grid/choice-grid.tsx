// Client. A row of choices shown as tiles — a visual, a name, a line (story.css): pick a plan, a persona, a team, a side.
// Selectable (`onValueChange`), it is a radio group with roving focus; with `href` on its items, a set of links (a
// line-up that leads somewhere); otherwise a showcase of the line-up.
import * as React from "react";

import { BlockLink, type LinkComponent } from "../block-link";
import { cn } from "../cn";
import { brandClass, type StoryVariant, storyVariantClass } from "../story-variant";

export interface ChoiceItem {
  /** The value of the choice (and its React key). */
  id: string;
  /** What represents it: a mark, an avatar, an illustration. Decorative — the name carries the meaning. */
  visual: React.ReactNode;
  /** Its name, short. */
  name: React.ReactNode;
  /** One line under the name: what it is, its role. */
  title?: React.ReactNode;
  /** A small line above the visual (a family, a tier), after its `icon`. */
  eyebrow?: React.ReactNode;
  /** A small glyph before the eyebrow (decorative). */
  icon?: React.ReactNode;
  /** A short tag in the top corner (“P1”, “New”, “Popular”). */
  badge?: React.ReactNode;
  /** Under the line: a gauge (`StatGauge`), facts, a price. */
  extra?: React.ReactNode;
  /** At the bottom: where the tile leads (“Chapter 2 ↓”, “See the plan”). */
  meta?: React.ReactNode;
  /** Makes the tile a link (ignored when the grid is selectable). */
  href?: string;
  /** A brand scope for this tile (`orazaka` → `.brand-orazaka`): its accent becomes that brand's. */
  brand?: string;
  /** Not selectable. */
  disabled?: boolean;
}

export type ChoiceGridProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  /** The accessible name of the group (“Choose your plan”) — passed translated. */
  label: string;
  /** The choices, in reading order. */
  items: readonly ChoiceItem[];
  /** A short mono line above the grid (a step, a tag). */
  tag?: React.ReactNode;
  /** A line beside the tag: what the choice means. */
  caption?: React.ReactNode;
  /** A call above the tiles, larger (“Choose your plan”). */
  prompt?: React.ReactNode;
  /** The chosen id (controlled). */
  value?: string;
  /** The chosen id at first (uncontrolled). */
  defaultValue?: string;
  /** Makes the grid a radio group: called with the id chosen by click, Enter, Space or the arrow keys. */
  onValueChange?: (id: string) => void;
  /** The app's link component for the tiles' internal `href`s (Next's `Link`); an `<a>` otherwise. */
  linkAs?: LinkComponent;
  /**
   * The number of columns (one on a phone).
   * @default min(items, 4)
   */
  columns?: number;
  /**
   * `default`: sober tiles. `arcade`: the select screen — the brand's light on each card, corners that lock, a flash.
   * @default "default"
   */
  variant?: StoryVariant;
  /** A brand scope for the whole grid (`orochia` → `.brand-orochia`). */
  brand?: string;
  /**
   * The tiles' arrival on mount (arcade: the corners locking one by one, the gauges filling). Always off under
   * `prefers-reduced-motion`.
   * @default true
   */
  animated?: boolean;
};

const CORNERS = ["tl", "tr", "bl", "br"] as const;

/**
 * A line-up of choices as tiles. With `onValueChange` (or `value`), a radio group: one tab stop, the arrow keys move
 * and choose, Home/End jump, the chosen tile is marked. With `href` on the items, a list of links. Otherwise a list
 * named by `label` that presents the line-up.
 */
export function ChoiceGrid({
  label,
  items,
  tag,
  caption,
  prompt,
  value,
  defaultValue,
  onValueChange,
  linkAs,
  columns,
  variant,
  brand,
  animated = true,
  className,
  style,
  ...props
}: ChoiceGridProps) {
  const selectable = onValueChange !== undefined || value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const current = value ?? inner;
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((item, i) => (item.disabled ? -1 : i)).filter((i) => i >= 0);
  const chosenIndex = items.findIndex((item) => item.id === current && !item.disabled);
  const focusIndex = chosenIndex >= 0 ? chosenIndex : (enabled[0] ?? 0);

  const choose = (i: number) => {
    const item = items[i];
    if (!item || item.disabled) return;
    if (value === undefined) setInner(item.id);
    onValueChange?.(item.id);
  };
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const at = enabled.indexOf(i);
    let next: number | undefined;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = enabled[(at + 1) % enabled.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = enabled[(at - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    refs.current[next]?.focus();
    choose(next);
  };

  // A radio group holds radios, not list items; a showcase or a set of links is a list named by `label`.
  const Grid = selectable ? "div" : "ul";
  const Item = selectable ? "div" : "li";
  const vars = { "--kzs-cols": columns ?? Math.min(items.length, 4), ...style } as React.CSSProperties;
  return (
    <div data-kzs-scene="" data-animated={animated ? "" : undefined} className={cn("kzs-choice", storyVariantClass(variant), brandClass(brand), className)} style={vars} {...props}>
      <span className="kzs-texture" aria-hidden />
      <span className="kzs-scan kzs-loop" aria-hidden />
      {(tag || caption) && (
        <p className="kzs-choice-head">
          {tag && <span className="kzs-choice-tag">{tag}</span>}
          {tag && caption && <span className="kzs-choice-sep" aria-hidden />}
          {caption && <span className="kzs-choice-caption">{caption}</span>}
        </p>
      )}
      {prompt && <p className="kzs-choice-prompt">{prompt}</p>}
      <Grid className="kzs-choice-grid" role={selectable ? "radiogroup" : undefined} aria-label={label}>
        {items.map((item, i) => {
          const body = (
            <>
              <span className="kzs-choice-aura" aria-hidden />
              <span className="kzs-choice-flash" aria-hidden />
              {CORNERS.map((at) => (
                <span key={at} className="kzs-corner" data-at={at} aria-hidden />
              ))}
              {(item.badge || item.eyebrow || item.icon) && (
                <span className="kzs-choice-top">
                  {item.badge ? <span className="kzs-choice-badge">{item.badge}</span> : <span />}
                  {(item.eyebrow || item.icon) && (
                    <span className="kzs-choice-eyebrow">
                      {item.icon && <span aria-hidden>{item.icon}</span>}
                      {item.eyebrow}
                    </span>
                  )}
                </span>
              )}
              <span className="kzs-choice-frame" aria-hidden>
                <span className="kzs-choice-floor" />
                <span className="kzs-choice-visual">{item.visual}</span>
              </span>
              <span className="kzs-choice-name">{item.name}</span>
              {item.title && <span className="kzs-choice-title">{item.title}</span>}
              {item.extra && <span className="kzs-choice-extra">{item.extra}</span>}
              {item.meta && <span className="kzs-choice-meta">{item.meta}</span>}
              <span className="kzs-choice-check" aria-hidden>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5 9-10" />
                </svg>
              </span>
            </>
          );
          const itemStyle = { "--i": i } as React.CSSProperties;
          let tile: React.ReactNode;
          if (selectable)
            tile = (
              <button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={current === item.id}
                tabIndex={i === focusIndex ? 0 : -1}
                disabled={item.disabled}
                data-selectable=""
                className="kzs-choice-item"
                style={itemStyle}
                onClick={() => choose(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                {body}
              </button>
            );
          else if (item.href)
            tile = (
              <BlockLink href={item.href} linkAs={linkAs} className="kzs-choice-item" data-link="" style={itemStyle}>
                {body}
              </BlockLink>
            );
          else
            tile = (
              <div className="kzs-choice-item" style={itemStyle}>
                {body}
              </div>
            );
          return (
            <Item key={item.id} className={cn("kzs-choice-slot", brandClass(item.brand))} style={itemStyle}>
              {tile}
            </Item>
          );
        })}
      </Grid>
    </div>
  );
}
