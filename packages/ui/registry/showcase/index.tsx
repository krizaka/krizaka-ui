"use client";

// The showcase of @krizaka/ui: a living mosaic of real primitives — no screenshot, no mock-up — in the Krizaka material
// (BRAND.md §6) and its griffe, the 45° cut corner (§6.1). krizaka.com/docs/ui shows it first; the brand and the theme
// switch live. The words are the scenes' own (a creator supported on Orochia, inference jobs on Orazaka): examples, not
// product vocabulary in the primitives. Brands need `@krizaka/tokens/brands/scoped.css` on the page.
import { AreaChart } from "@krizaka/charts/line";
import { type BrandId, ProductLogo } from "@krizaka/ui";
import { AudioPlayer } from "@krizaka/ui/audio-player";
import { Avatar } from "@krizaka/ui/avatar";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";
import { Checkbox } from "@krizaka/ui/checkbox";
import { Chip } from "@krizaka/ui/chip";
import { cn } from "@krizaka/ui/cn";
import { Command } from "@krizaka/ui/command";
import { Calendar } from "@krizaka/ui/date-picker";
import { Field, FloatingInput, Input } from "@krizaka/ui/field";
import { Kbd } from "@krizaka/ui/kbd";
import { Progress } from "@krizaka/ui/progress";
import { Slider } from "@krizaka/ui/slider";
import { Switch } from "@krizaka/ui/switch";
import { Tabs } from "@krizaka/ui/tabs";
import { toastClassNames } from "@krizaka/ui/toast";
import * as React from "react";

type Theme = "auto" | "dark" | "light";

export type ShowcaseProps = {
  /** The brand shown first. */
  defaultBrand?: BrandId;
  /** `auto` follows the page; `dark` / `light` set the theme on the showcase only. */
  defaultTheme?: Theme;
  /** A class on the frame (layout). */
  className?: string;
};

const BRANDS: { id: BrandId; label: string }[] = [
  { id: "krizaka", label: "Krizaka" },
  { id: "orazaka", label: "Orazaka" },
  { id: "orochia", label: "Orochia" },
];

// Literal class names (the brands of @krizaka/tokens/brands/scoped.css, the theme islands of tokens.css).
const BRAND_CLASS: Record<BrandId, string> = { krizaka: "brand-krizaka", orazaka: "brand-orazaka", orochia: "brand-orochia" };
const THEME_CLASS: Record<Theme, string | undefined> = { auto: undefined, dark: "theme-dark", light: "theme-light" };

const REVENUE = [
  { day: "2026-09-14", revenue: 1180 },
  { day: "2026-09-17", revenue: 1420 },
  { day: "2026-09-20", revenue: 1310 },
  { day: "2026-09-23", revenue: 1690 },
  { day: "2026-09-26", revenue: 1620 },
  { day: "2026-09-29", revenue: 1980 },
  { day: "2026-10-02", revenue: 2240 },
  { day: "2026-10-05", revenue: 2110 },
  { day: "2026-10-08", revenue: 2560 },
  { day: "2026-10-11", revenue: 2890 },
];

const JOBS = [
  { id: "job-7731", name: "Contract summaries", model: "Llama 3.3 70B", status: "running", progress: 64, time: "1 min 12 s" },
  { id: "job-7732", name: "Product shots, autumn", model: "Flux 1.1", status: "done", progress: 100, time: "42 s" },
  { id: "job-7733", name: "Podcast transcript", model: "Whisper large", status: "queued", progress: null, time: "—" },
  { id: "job-7734", name: "Trailer voice-over", model: "XTTS v2", status: "failed", progress: 18, time: "7 s" },
] as const;
const JOB_TONE = { running: "accent", done: "success", queued: "neutral", failed: "danger" } as const;

const PEAKS = Array.from({ length: 64 }, (_, i) => 0.18 + Math.abs(Math.sin(i * 0.41) * Math.cos(i * 0.11)) * 0.82);

/** A tile of the mosaic: a card with an overline in the mono voice. */
function Tile({ label, className, children, ...props }: React.ComponentProps<typeof Card.Root> & { label: string }) {
  return (
    <Card.Root className={cn("min-w-0", className)} {...props}>
      <Card.Body padding="lg" className="gap-4">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-fg-secondary">{label}</p>
        {children}
      </Card.Body>
    </Card.Root>
  );
}

function SignUp() {
  return (
    <Tile label="Form · the griffe on the action">
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-fg">Create your workspace</h3>
        <FloatingInput id="kz-show-name" label="Full name" defaultValue="Elena Ben Ali" autoComplete="name" />
        <FloatingInput id="kz-show-email" label="Work email" type="email" autoComplete="email" />
        <Field.Root>
          <Field.Label htmlFor="kz-show-slug">Address</Field.Label>
          <Input id="kz-show-slug" defaultValue="atelier-nord" start="krizaka.app/" end={<Badge tone="success">Free</Badge>} />
        </Field.Root>
        <Checkbox defaultChecked>Send me the release notes</Checkbox>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button variant="primary" type="submit">
            Create workspace
          </Button>
          <Button variant="ghost">Sign in instead</Button>
        </div>
      </form>
    </Tile>
  );
}

function Revenue({ brand }: { brand: BrandId }) {
  return (
    <Tile label="Chart · @krizaka/charts" variant="elevated">
      <div className="flex items-end justify-between gap-3">
        <Card.Stat label="Revenue · 30 days">€48,210</Card.Stat>
        <Badge tone="success" dot>
          +12.4 %
        </Badge>
      </div>
      <AreaChart
        title="Daily revenue, last 30 days"
        hideTitle
        brand={brand}
        height={140}
        data={REVENUE}
        x="day"
        y="revenue"
        xFormat="day"
        format="integer"
        dataTable={false}
        endLabels={false}
      />
    </Tile>
  );
}

function Support() {
  const [amount, setAmount] = React.useState("10");
  return (
    <Tile label="Orochia · support a creator" variant="spotlight">
      <div className="flex items-center gap-3">
        <Avatar ring status="online" size="lg" fallback="EB" />
        <div className="min-w-0">
          <p className="font-semibold text-fg">Elena Ben Ali</p>
          <p className="text-xs text-fg-secondary">Live now · night market, Tunis · 1.2k watching</p>
        </div>
      </div>
      <Chip.Group type="single" label="Amount" value={amount} onValueChange={(v) => v && setAmount(v)} required>
        {["5", "10", "25", "50"].map((v) => (
          <Chip key={v} value={v}>
            €{v}
          </Chip>
        ))}
      </Chip.Group>
      <Button variant="gradient" size="lg" className="w-full">
        Send €{amount}
      </Button>
      <p className="flex items-center gap-2 text-xs text-fg-secondary">
        <span aria-hidden className="node node-lit" />
        Held in escrow until the stream ends — refunded if it is cancelled.
      </p>
    </Tile>
  );
}

function Queue() {
  return (
    <Tile label="Orazaka · inference queue">
      <ul className="grid gap-3">
        {JOBS.map((job) => (
          <li key={job.id} className="grid gap-1.5">
            <div className="flex items-center gap-3">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg">{job.name}</span>
              <Badge tone={JOB_TONE[job.status]} dot={job.status === "running"} pulse>
                {job.status}
              </Badge>
            </div>
            <Progress
              size="sm"
              label={`${job.name}: ${job.status}`}
              value={job.status === "queued" ? null : job.progress}
              status={job.status === "failed" ? "error" : "active"}
            />
            <p className="flex justify-between font-mono text-[11px] text-fg-secondary">
              <span>{job.model}</span>
              <span>{job.time}</span>
            </p>
          </li>
        ))}
      </ul>
    </Tile>
  );
}

function Palette() {
  return (
    <Tile label="Command · ⌘K" variant="glass" className="bg-halo">
      <Command.Root label="Commands" className="rounded-xl border border-border-default">
        <Command.Input placeholder="Search pages, actions, people" />
        <Command.List label="Suggestions" emptyLabel="Nothing matches.">
          <Command.Group heading="Actions">
            <Command.Item>
              Start a live
              <Command.Shortcut>⌘ L</Command.Shortcut>
            </Command.Item>
            <Command.Item>
              Run a model
              <Command.Shortcut>⌘ R</Command.Shortcut>
            </Command.Item>
            <Command.Item>Invite a teammate</Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Tile>
  );
}

/** Two toasts, as the Toaster draws them (its class names), still — the real ones come and go. */
function Toasts() {
  return (
    <Tile label="Toast · frosted glass">
      <div className="grid gap-3">
        <div className={cn(toastClassNames.toast, toastClassNames.success, "pr-4")}>
          <span data-icon="" aria-hidden className={toastClassNames.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div className={toastClassNames.content}>
            <p className={toastClassNames.title}>€10 received</p>
            <p className={toastClassNames.description}>Alex Martin supported your live.</p>
          </div>
        </div>
        <div className={cn(toastClassNames.toast, toastClassNames.info, "pr-4")}>
          <div className={toastClassNames.content}>
            <p className={toastClassNames.title}>Model ready</p>
            <p className={toastClassNames.description}>Llama 3.3 70B is warm on gpu-02.</p>
          </div>
          <span className="ml-auto self-center rounded-lg px-3 py-1.5 text-xs font-semibold text-fg-accent">Open</span>
        </div>
      </div>
    </Tile>
  );
}

function Schedule() {
  const [day, setDay] = React.useState("2026-10-15");
  return (
    <Tile label="Calendar">
      <Calendar locale="en-GB" value={day} onSelect={setDay} today="2026-10-11" min="2026-10-01" className="mx-auto" />
    </Tile>
  );
}

function Media() {
  return (
    <Tile label="Media · audio">
      <AudioPlayer title="Voice note from Eric — 0:42" src="https://www.krizaka.com/assets/orochia/tour/elena-live.mp4" peaks={PEAKS} duration={42} />
    </Tile>
  );
}

function Settings() {
  return (
    <Tile label="Settings · density, focus, spring">
      <Tabs.Root defaultValue="general" variant="segmented">
        <Tabs.List aria-label="Settings">
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="alerts">Alerts</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="general" className="grid gap-4 pt-1">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="kz-show-digest" className="text-sm text-fg">
              Weekly digest
            </label>
            <Switch id="kz-show-digest" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="kz-show-sovereign" className="text-sm text-fg">
              Keep data in the EU
            </label>
            <Switch id="kz-show-sovereign" defaultChecked />
          </div>
          <Slider label="Creativity" showLabel defaultValue={0.7} min={0} max={1} step={0.1} formatValue={(v) => v.toFixed(1)} />
        </Tabs.Content>
        <Tabs.Content value="alerts">Alerts</Tabs.Content>
        <Tabs.Content value="billing">Billing</Tabs.Content>
      </Tabs.Root>
    </Tile>
  );
}

/** The mosaic: real primitives of @krizaka/ui, the brand and the theme switched live. */
export default function Showcase({ defaultBrand = "krizaka", defaultTheme = "auto", className }: ShowcaseProps) {
  const [brand, setBrand] = React.useState<BrandId>(defaultBrand);
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  return (
    <div className={cn(THEME_CLASS[theme], "rounded-3xl", className)}>
      <section
        aria-label="Krizaka UI showcase"
        data-brand={brand}
        className={cn(BRAND_CLASS[brand], "relative isolate overflow-hidden rounded-3xl border border-border-default bg-surface-0 text-fg")}
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-halo" />
        <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border-subtle px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <ProductLogo id={brand} size={36} animated={false} />
            <div>
              <p className="font-display text-base font-bold tracking-[-0.015em] text-fg">Krizaka UI</p>
              <p className="text-xs text-fg-secondary">Light from above · the griffe · one system, three brands</p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Chip.Group type="single" size="sm" label="Brand" value={brand} onValueChange={(v) => v && setBrand(v as BrandId)} required>
              {BRANDS.map((b) => (
                <Chip key={b.id} value={b.id}>
                  {b.label}
                </Chip>
              ))}
            </Chip.Group>
            <Chip.Group type="single" size="sm" label="Theme" value={theme} onValueChange={(v) => v && setTheme(v as Theme)} required>
              <Chip value="auto">Auto</Chip>
              <Chip value="dark">Dark</Chip>
              <Chip value="light">Light</Chip>
            </Chip.Group>
            <span className="hidden items-center gap-1 text-xs text-fg-secondary md:flex">
              <Kbd size="sm">⌘</Kbd>
              <Kbd size="sm">K</Kbd>
            </span>
          </div>
        </header>
        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-12">
          <div className="grid content-start gap-4 lg:col-span-4">
            <SignUp />
            <Schedule />
            <Media />
          </div>
          <div className="grid content-start gap-4 lg:col-span-4">
            <Revenue brand={brand} />
            <Support />
            <Toasts />
          </div>
          <div className="grid content-start gap-4 lg:col-span-4">
            <Queue />
            <Palette />
            <Settings />
          </div>
        </div>
      </section>
    </div>
  );
}

export { Showcase };
