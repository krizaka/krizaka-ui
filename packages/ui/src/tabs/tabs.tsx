// Client (a context). Radix Tabs does the roles (tablist, tab, tabpanel), the aria-selected / aria-controls wiring,
// the roving focus (arrows, Home, End) and automatic activation: this file only holds the three looks.
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const tabs = tv({
  slots: {
    root: "flex gap-4 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
    list: "flex shrink-0 data-[orientation=vertical]:flex-col",
    trigger:
      "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
    content: "kz-fade min-w-0 flex-1 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  },
  variants: {
    variant: {
      /* The section of a page: a line under the list, the active tab underlined in the accent. */
      underline: {
        list: "gap-1 border-border-default data-[orientation=horizontal]:border-b data-[orientation=vertical]:border-r",
        trigger:
          "relative rounded-md px-3 py-2.5 text-sm text-fg-secondary hover:text-fg data-[state=active]:text-fg " +
          "after:absolute after:rounded-full after:bg-transparent data-[state=active]:after:bg-accent " +
          "data-[orientation=horizontal]:after:inset-x-2 data-[orientation=horizontal]:after:-bottom-px data-[orientation=horizontal]:after:h-0.5 " +
          "data-[orientation=vertical]:justify-start data-[orientation=vertical]:after:inset-y-1.5 data-[orientation=vertical]:after:-right-px data-[orientation=vertical]:after:w-0.5",
      },
      /* A view switch: equal segments in a track, the active one filled. */
      segmented: {
        list: "inline-grid auto-cols-fr grid-flow-col gap-1 self-start rounded-xl border border-border-default bg-surface-1 p-1 data-[orientation=vertical]:grid-flow-row",
        trigger:
          "min-h-8 rounded-lg px-3 py-1.5 text-xs text-fg-secondary hover:bg-surface-2 hover:text-fg " +
          "data-[state=active]:bg-accent data-[state=active]:text-on-accent data-[state=active]:shadow-sm data-[state=active]:hover:bg-accent",
      },
      /* Pills that scroll sideways on a phone: a feed's sections. */
      pills: {
        list: "gap-1.5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] data-[orientation=horizontal]:pb-1",
        trigger:
          "h-9 rounded-full border border-border-default bg-surface-1 px-4 text-xs text-fg-secondary hover:border-border-strong hover:text-fg " +
          "data-[state=active]:border-accent data-[state=active]:bg-accent-soft data-[state=active]:text-fg",
      },
    },
  },
  defaultVariants: { variant: "underline" },
});

export type TabsVariants = VariantProps<typeof tabs>;
type Variant = NonNullable<TabsVariants["variant"]>;

const VariantContext = React.createContext<Variant>("underline");

export type TabsRootProps = React.ComponentProps<typeof TabsPrimitive.Root> & TabsVariants;

/** `value`/`defaultValue` + `onValueChange`, `orientation` (horizontal by default), `variant` for the list. */
export function TabsRoot({ variant = "underline", className, ...props }: TabsRootProps) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.Root data-variant={variant} className={tabs({ variant }).root({ className })} {...props} />
    </VariantContext.Provider>
  );
}

/** The tabs. Name it (`aria-label`) when no heading says what it switches. */
export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const variant = React.useContext(VariantContext);
  return <TabsPrimitive.List data-variant={variant} className={tabs({ variant }).list({ className })} {...props} />;
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(VariantContext);
  return <TabsPrimitive.Trigger className={tabs({ variant }).trigger({ className })} {...props} />;
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={tabs().content({ className })} {...props} />;
}

/** `Tabs.Root/List/Trigger/Content` — `variant` underline · segmented · pills on the root. */
export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent };
