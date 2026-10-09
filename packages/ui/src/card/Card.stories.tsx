import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "../badge/badge";
import { MotionObserver } from "../motion/MotionObserver";
import { Card } from "./card";

// A self-contained cover (no network in the screenshot tests).
const COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>' +
      '<rect width="160" height="90" fill="url(#g)"/><circle cx="118" cy="30" r="14" fill="#fde68a"/>' +
      '<path d="M0 90 50 44l30 28 22-18 58 36z" fill="#0f172a" opacity=".55"/></svg>',
  );

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

/**
 * `Card.Root/Media/Image/Overlay/Body/Title/Description/Stat/Footer` — one `tv` definition with slots, server-safe.
 * `asChild` turns the card into a link, `interactive` adds the spotlight and the lift, `reveal` the entrance on scroll.
 */
const meta = {
  title: "Primitives/Card",
  component: Card.Root,
  decorators: [
    (Story, { parameters }) => (
      <div className={parameters.wide ? "w-[44rem] max-w-full" : "w-72"}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

/** A media card: the image, badges on the media (invariant scrim), the title, a description, a footer. */
export const MediaCard: Story = {
  render: (args) => (
    <Card.Root {...args}>
      <Card.Media>
        <Card.Image src={COVER} />
        <Card.Overlay>
          <Badge tone="scrim">4K</Badge>
        </Card.Overlay>
        <Card.Overlay corner="bottom-right">
          <Badge tone="scrim">12:04</Badge>
        </Card.Overlay>
      </Card.Media>
      <Card.Body>
        <Card.Title>Night ride across the city</Card.Title>
        <Card.Description>Ten minutes of neon, rain and empty avenues, filmed in one take.</Card.Description>
        <Card.Footer>
          <span>1.2k views</span>
          <span aria-hidden>·</span>
          <span>2 days ago</span>
        </Card.Footer>
      </Card.Body>
    </Card.Root>
  ),
};

/** No image: the `fallback` (an icon on the accent gradient), hidden from assistive technology. */
export const MediaFallback: Story = {
  render: (args) => (
    <Card.Root {...args}>
      <Card.Media aspect="square">
        <Card.Image src={null} fallback={<PlayIcon />} />
      </Card.Media>
      <Card.Body padding="sm">
        <Card.Title>Untitled draft</Card.Title>
        <Card.Description>Processing — the cover arrives with the first frame.</Card.Description>
      </Card.Body>
    </Card.Root>
  ),
};

/** `asChild` + `<a>`: the whole card is one link, with the spotlight and the lift (`interactive`). */
export const InteractiveLink: Story = {
  render: (args) => (
    <Card.Root {...args} asChild interactive>
      <a href="#guide">
        <Card.Body>
          <Card.Title as="h2">Getting started</Card.Title>
          <Card.Description>Install the preset, import the primitives, ship both themes.</Card.Description>
          <Card.Footer>Read the guide →</Card.Footer>
        </Card.Body>
      </a>
    </Card.Root>
  ),
};

/** Figures put forward: `Card.Stat` (label in capitals, value in tabular digits), `tone="elevated"`. */
export const StatCard: Story = {
  render: (args) => (
    <Card.Root {...args} tone="elevated">
      <Card.Body>
        <Card.Title>This month</Card.Title>
        <div className="grid grid-cols-2 gap-4">
          <Card.Stat label="Revenue">€4,812</Card.Stat>
          <Card.Stat label="Supporters">318</Card.Stat>
        </div>
        <Card.Footer>Updated 5 minutes ago</Card.Footer>
      </Card.Body>
    </Card.Root>
  ),
};

/** Six cards entering in cascade (`reveal={index}` + `MotionObserver`); shown at once under reduced motion. */
export const RevealGrid: Story = {
  parameters: { wide: true },
  render: (args) => (
    <>
      <MotionObserver />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {["Enter", "Reveal", "Open", "Lift", "Glow", "Roll"].map((word, index) => (
          <Card.Root key={word} {...args} reveal={index} interactive radius="lg">
            <Card.Media aspect="video">
              <Card.Image src={index % 2 ? null : COVER} fallback={<PlayIcon />} />
            </Card.Media>
            <Card.Body padding="sm">
              <Card.Title>{word}</Card.Title>
              <Card.Description>Step {index + 1} of the signature.</Card.Description>
            </Card.Body>
          </Card.Root>
        ))}
      </div>
    </>
  ),
};
