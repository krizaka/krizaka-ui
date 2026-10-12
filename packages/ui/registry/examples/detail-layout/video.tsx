"use client";

import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { DetailLayout } from "@krizaka/ui/detail-layout";
import { Facts } from "@krizaka/ui/page";
import { Stat } from "@krizaka/ui/stat";
import { Tabs } from "@krizaka/ui/tabs";

// TEMPLATE — one video in Orochia's studio: the way back to the list, its thumbnail, title and status, its facts, the
// actions; the tabs (overview · sales · comments); the side panel with the price and the audience — under the content on
// a phone, where the actions wrap under the title.
export default function DetailLayoutVideo() {
  return (
    <div className="brand-orochia w-full">
      <Tabs.Root defaultValue="overview">
        <DetailLayout
          back={<a href="#videos">← Videos</a>}
          media={<div className="aspect-video w-40 bg-linear-to-br from-accent to-accent-2" />}
          eyebrow="Video · v-2087"
          title="Night shoot, part 2"
          status={<Badge tone="success" dot>Published</Badge>}
          meta={<Facts items={[{ label: "12:48" }, { label: "Unlock €4.99" }, { label: "18+ checked", tone: "ok" }]} />}
          actions={
            <>
              <Button size="sm" variant="secondary" shape="cut">Edit</Button>
              <Button size="sm" variant="primary" shape="cut">Share</Button>
            </>
          }
          tabs={
            <Tabs.List aria-label="Video">
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="sales">Sales</Tabs.Trigger>
              <Tabs.Trigger value="comments">Comments</Tabs.Trigger>
            </Tabs.List>
          }
          aside={
            <div className="flex flex-col gap-4 rounded-xl border border-border-default bg-surface-1 p-4">
              <Stat label="Unlocks" value="146" trend="up" trendLabel="+12" hint="7 days" />
              <Stat label="Earned" value="€653" hint="after the 10 % fee" />
            </div>
          }
        >
          <Tabs.Content value="overview" className="text-sm leading-relaxed text-fg-secondary">
            The second half of the night shoot in Old Montréal: the rooftop, the rain, the last take at dawn.
          </Tabs.Content>
          <Tabs.Content value="sales" className="text-sm text-fg-secondary">146 unlocks, 3 tips.</Tabs.Content>
          <Tabs.Content value="comments" className="text-sm text-fg-secondary">28 comments, 2 waiting for moderation.</Tabs.Content>
        </DetailLayout>
      </Tabs.Root>
    </div>
  );
}
