// The stage's playgrounds (lib/ui-playgrounds.ts): every control of every playground is a prop of its component in the
// registry — a union of strings or a boolean — and the JSX shown under the stage is what a reader would write.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { literalOptions, playgroundControls, playgroundJsx,PLAYGROUNDS } from "../lib/ui-playgrounds.ts";

const registry = (name) => JSON.parse(readFileSync(new URL(`../node_modules/@krizaka/ui/registry/${name}.json`, import.meta.url), "utf8"));

test("reads the options of a union of strings, and nothing else", () => {
  assert.deepEqual(literalOptions('"sm" | "md" | "lg"'), ["sm", "md", "lg"]);
  assert.equal(literalOptions("number | null"), null);
  assert.equal(literalOptions("boolean"), null);
});

test("every control of every playground is a prop of its component in the registry", () => {
  for (const [name, spec] of Object.entries(PLAYGROUNDS)) {
    const props = registry(name).web.props.find((p) => p.component === spec.component)?.props;
    assert.ok(props, `${name}: no ${spec.component} in the registry`);
    const controls = playgroundControls(spec, props);
    assert.equal(controls.length, spec.controls.length, name);
    for (const control of controls) if (control.kind === "enum") assert.ok(control.options.includes(control.initial), `${name}.${control.prop}`);
  }
});

test("an unknown control fails (the build would too)", () => {
  assert.throws(() => playgroundControls({ component: "X", controls: ["nope"], base: {} }, []), /no prop "nope"/);
  assert.throws(() => playgroundControls({ component: "X", controls: ["n"], base: {} }, [{ name: "n", type: "number", default: null }]), /neither a boolean/);
});

test("the JSX names only what differs from the defaults", () => {
  const spec = PLAYGROUNDS.button;
  const controls = playgroundControls(spec, registry("button").web.props.find((p) => p.component === "Button").props);
  const rest = Object.fromEntries(controls.map((c) => [c.prop, c.initial]));
  assert.equal(playgroundJsx(spec, controls, rest, "Save", 0), "<Button>Save</Button>");
  assert.equal(playgroundJsx(spec, controls, { ...rest, variant: "primary", shape: "cut", shimmer: true }, "Go", 0), '<Button variant="primary" shape="cut" shimmer>Go</Button>');
  const meter = PLAYGROUNDS.meter;
  const mc = playgroundControls(meter, registry("meter").web.props.find((p) => p.component === "Meter").props);
  assert.match(playgroundJsx(meter, mc, Object.fromEntries(mc.map((c) => [c.prop, c.initial])), "", 40), /^<Meter label="Storage" max=\{100\} value=\{40\} \/>$/);
});
