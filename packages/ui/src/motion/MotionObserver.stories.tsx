import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import { MotionObserver } from "./MotionObserver";

/**
 * Mounted once at the root of an app: `[data-reveal]` blocks rise into place as they enter the viewport
 * (`--kz-delay` staggers them) and `.kz-spotlight` cards follow the pointer.
 */
const meta = {
  title: "Motion/MotionObserver",
  component: MotionObserver,
  render: () => (
    <>
      <MotionObserver />
      <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
        {["Enter", "Reveal", "Open"].map((word, index) => (
          <section
            key={word}
            data-reveal
            style={{ "--kz-delay": `${index * 120}ms` } as CSSProperties}
            className="kz-spotlight kz-lift rounded-xl border border-border-default bg-surface-1 p-6"
          >
            <h2 className="font-display text-lg font-semibold text-fg">{word}</h2>
            <p className="mt-2 text-sm text-fg-secondary">One easing, one way to move.</p>
          </section>
        ))}
      </div>
      <a href="#signature" className="kz-sheen mt-6 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent">
        Get started
      </a>
    </>
  ),
} satisfies Meta<typeof MotionObserver>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Three cards revealed in sequence, a primary action with the sheen. */
export const RevealBlocks: Story = {};
