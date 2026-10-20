/* The components a reader can play with at the top of their page (the stage): which props get a control, the props
   they start from, the text and the number one may change. Pure data, shared by the server (which reads each control's
   options and default from the registry — the code of the package — and fails the build on a control it does not know)
   and the client (app/components/docs/Playground.tsx, which renders the component itself). */

export interface PlaygroundSpec {
  /** The exported component the controls drive (its props are read from the registry by this name). */
  component: string;
  /** The props that get a control: a union of strings (a segmented choice) or a boolean (a switch). */
  controls: string[];
  /** Values a control may not offer here (a page-sized loader in a small stage). */
  exclude?: Record<string, string[]>;
  /** Where the controls start when it is not the component's default (the JSX still names what differs from the default). */
  start?: Record<string, string | boolean>;
  /** The props it is rendered with, beside the controls'. */
  base: Record<string, string | number | boolean>;
  /** A text the reader may change (the label, the children). */
  text?: { prop: string; value: string };
  /** A number the reader may change. */
  number?: { prop: string; value: number; min: number; max: number };
}

export const PLAYGROUNDS = {
  button: { component: "Button", controls: ["variant", "size", "shape", "loading"], exclude: { size: ["icon"] }, start: { variant: "primary", size: "lg" }, base: {}, text: { prop: "children", value: "Save changes" } },
  badge: { component: "Badge", controls: ["tone", "size", "dot", "pulse"], start: { tone: "success", dot: true, pulse: true }, base: {}, text: { prop: "children", value: "Live" } },
  progress: { component: "Progress", controls: ["variant", "size", "status", "showLabel"], start: { showLabel: true }, base: { label: "Upload", eta: "About 1 min left" }, number: { prop: "value", value: 64, min: 0, max: 100 } },
  meter: { component: "Meter", controls: ["variant", "size", "optimum", "showLabel"], start: { variant: "ring", size: "lg", showLabel: true }, base: { label: "Storage", max: 100 }, number: { prop: "value", value: 72, min: 0, max: 100 } },
  switch: { component: "Switch", controls: ["size", "invalid"], base: { defaultChecked: true }, text: { prop: "label", value: "Notifications" } },
  chip: { component: "Chip", controls: ["size", "selected", "removable"], base: { removeLabel: "Remove" }, text: { prop: "children", value: "Subtitles" } },
  "verified-badge": { component: "VerifiedBadge", controls: ["size", "showLabel"], start: { size: "lg", showLabel: true }, base: {}, text: { prop: "label", value: "Verified" } },
  loader: { component: "Loader", controls: ["variant", "status"], exclude: { variant: ["page", "overlay"] }, base: { eta: "About 30 s left" }, text: { prop: "label", value: "Rendering your video" } },
} satisfies Record<string, PlaygroundSpec>;

export type PlaygroundName = keyof typeof PLAYGROUNDS;
export const hasPlayground = (name: string): name is PlaygroundName => name in PLAYGROUNDS;

/** A control as the client draws it: its options and its default, read from the registry. */
export type PlaygroundControl = { prop: string; kind: "enum"; options: string[]; initial: string } | { prop: string; kind: "boolean"; initial: boolean };

/** `"a" | "b"` → ["a", "b"]; null when the type is not a union of string literals. */
export function literalOptions(type: string): string[] | null {
  const parts = type.split("|").map((part) => part.trim());
  return parts.every((part) => /^"[^"]*"$/.test(part)) ? parts.map((part) => part.slice(1, -1)) : null;
}

/** The controls of a playground from the props of its component in the registry; an unknown or untypable control throws. */
export function playgroundControls(spec: PlaygroundSpec, props: { name: string; type: string; default: string | null }[]): PlaygroundControl[] {
  return spec.controls.map((name) => {
    const prop = props.find((p) => p.name === name);
    if (!prop) throw new Error(`playground ${spec.component}: no prop "${name}" in the registry`);
    if (prop.type === "boolean") return { prop: name, kind: "boolean", initial: prop.default === "true" };
    const options = literalOptions(prop.type)?.filter((option) => !spec.exclude?.[name]?.includes(option));
    if (!options?.length) throw new Error(`playground ${spec.component}: "${name}" is neither a boolean nor a union of strings (${prop.type})`);
    const fallback = prop.default?.replace(/^"|"$/g, "");
    return { prop: name, kind: "enum", options, initial: fallback && options.includes(fallback) ? fallback : options[0]! };
  });
}

/** The JSX of what is on the stage, as a reader would write it: only the props that differ from their default. */
export function playgroundJsx(spec: PlaygroundSpec, controls: PlaygroundControl[], values: Record<string, string | boolean>, text: string, number: number): string {
  const attrs: string[] = [];
  const attr = (name: string, value: unknown) => {
    if (value === true) attrs.push(name);
    else if (typeof value === "number") attrs.push(`${name}={${value}}`);
    else if (typeof value === "string") attrs.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
  };
  for (const [name, value] of Object.entries(spec.base)) attr(name, value);
  for (const control of controls) {
    const value = values[control.prop];
    if (value === control.initial) continue;
    if (value === false) attrs.push(`${control.prop}={false}`);
    else attr(control.prop, value);
  }
  if (spec.number) attr(spec.number.prop, number);
  if (spec.text && spec.text.prop !== "children") attr(spec.text.prop, text);
  const open = `<${spec.component}${attrs.length ? ` ${attrs.join(" ")}` : ""}`;
  return spec.text?.prop === "children" ? `${open}>${text}</${spec.component}>` : `${open} />`;
}
