"use client";

/* The home's scene: one Krizaka product on the web and on a phone, both screens composed from @krizaka/ui and
   @krizaka/charts — AppShell, Stat, LineChart, DataTable in the window; Chat, VerticalVideo or DocumentViewer on the
   phone. The identity comes from the dock (HomeStudio); every word is a message, the figures are lib/home-scene.ts. */

import { LineChart } from "@krizaka/charts/line";
import { format } from "@krizaka/i18n";
import { ProductLogo } from "@krizaka/ui";
import { AppHeader } from "@krizaka/ui/app-header";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { MessageBubble, MessageComposer, TypingIndicator } from "@krizaka/ui/chat";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";
import { RailNav } from "@krizaka/ui/rail-nav";
import { Stat, StatGrid } from "@krizaka/ui/stat";
import { VerticalVideo } from "@krizaka/ui/vertical-video";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { SCENE, type SceneId } from "@/lib/home-scene";
import orazakaNav from "@/lib/orazaka-nav.json";
import { examplePropsOf } from "@/lib/ui-example-props";

import { useI18n } from "../I18nProvider";
import { useIdentity } from "./HomeStudio";
import { SCENE_ICONS } from "./scene-icons";

/** The document viewer brings pdf.js: loaded only when Yomizaka is worn. */
const DocumentPhone = dynamic(() => import("./DocumentPhone").then((m) => m.DocumentPhone), { ssr: false, loading: () => <div className="kz-phone-wait" /> });

/** The width, in pixels, the window is laid out at when the page is narrower (then scaled to fit). */
const LAPTOP = 720;
const NAMES: Record<SceneId, string> = { orazaka: "Orazaka", orochia: "Orochia", yomizaka: "Yomizaka", krizaka: "Krizaka" };
type RailItem = { id: string; icon: string; label: string };

type Row = { id: string; name: string; detail: string; state: string; tone: "accent" | "success" | "warning" | "danger" };

/** The rail's items. Orazaka's are the app's own (lib/orazaka-nav.json, copied from its source): its sections, icons and
    words. The other products' words are messages and their icons are lib/home-scene.ts; the last item (Settings) is the foot. */
function railOf(id: SceneId, locale: "en" | "fr", nav: readonly string[], icons: readonly string[]): { main: RailItem[]; foot: RailItem[] } {
  if (id === "orazaka") {
    const word = (s: { id: string; icon: string; label: Record<"en" | "fr", string> }) => ({ id: s.id, icon: s.icon, label: s.label[locale] });
    return { main: orazakaNav.main.map(word), foot: orazakaNav.foot.map(word) };
  }
  const items = nav.map((label, i) => ({ id: `${id}-${i}`, icon: icons[i] ?? "", label }));
  return { main: items.filter((item) => item.icon !== "SettingsIcon"), foot: items.filter((item) => item.icon === "SettingsIcon") };
}

export function ProductScene() {
  const { id } = useIdentity();
  const { t, locale } = useI18n();
  const words = t.landing.scene;
  const p = words.products[id];
  const data = SCENE[id];
  const name = NAMES[id];
  const rail = railOf(id, locale, "nav" in p ? p.nav : [], data.rail);
  const current = id === "orazaka" ? "jobs" : (rail.main.concat(rail.foot)[data.current]?.id ?? "");
  const railItem = (item: RailItem) => {
    const Icon = SCENE_ICONS[item.icon];
    return <RailNav.Item key={item.id} href="#scene" icon={Icon ? <Icon size={20} /> : null} label={item.label} current={item.id === current} onClick={(e) => e.preventDefault()} />;
  };
  const rows: Row[] = data.rows.map((row, i) => ({ id: `${id}-${i}`, name: p.table.rows[i] ?? "", detail: row.detail, state: p.table.states[i] ?? "", tone: row.tone }));
  const columns: DataTableColumn<Row>[] = [
    { id: "name", header: p.table.name, card: "title" },
    { id: "detail", header: p.table.detail },
    { id: "state", header: p.table.status, align: "end", cell: (row) => <Badge tone={row.tone}>{row.state}</Badge> },
  ];

  // Below the width a laptop screen needs, the window is laid out at that width and scaled down to fit: the same
  // components, in miniature, rather than a squeezed layout. Measured, because CSS cannot divide two lengths. A miniature
  // is a picture of the screen: inert (its controls would be too small to touch), the phone beside it stays live.
  const scene = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null);
  useEffect(() => {
    const host = scene.current;
    const frame = win.current;
    if (!host || !frame || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const width = host.clientWidth;
      const next = width < LAPTOP ? { scale: width / LAPTOP, height: Math.round(frame.offsetHeight * (width / LAPTOP)) } : null;
      setFit((now) => (now?.scale === next?.scale && now?.height === next?.height ? now : next));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scene} className="kz-scene" aria-label={format(words.label, { name })} role="group" data-fit={fit ? "" : undefined}>
      <div className="kz-scene-fit" style={fit ? { height: fit.height } : undefined}>
      <figure ref={win} className="kz-scene-window" aria-label={format(words.window, { name })} style={fit ? { width: LAPTOP, transform: `scale(${fit.scale})` } : undefined}
        inert={fit ? true : undefined}>
        <div className="kz-scene-chrome" aria-hidden>
          <i />
          <i />
          <i />
          <span>{data.url}</span>
        </div>
        <RailNav.Shell className="kz-scene-app min-h-0">
          <RailNav.Root className="kz-scene-rail" label={name} mark={<ProductLogo id={id} size={26} animated={false} />} footer={rail.foot.map(railItem)}>
            {rail.main.map(railItem)}
          </RailNav.Root>
          <RailNav.Body>
            <AppHeader
              name={`${name} · ${p.title}`}
              chips={<Badge tone="warning">{words.demo}</Badge>}
              actions={<Button size="sm" variant="primary">{p.action}</Button>}
            />
            <main className="kz-scene-main">
              <p className="kz-scene-sub">{p.sub}</p>
              <StatGrid>
                {p.stats.map((stat, i) => (
                  <Stat key={stat.label} label={stat.label} value={data.stats[i]} hint={stat.hint} />
                ))}
              </StatGrid>
              <LineChart
                key={id}
                title={p.chart.title}
                description={p.chart.description}
                data={data.curve}
                x="x"
                xLabel={p.chart.x}
                series={[{ key: "value", label: p.chart.series }]}
                format={data.format}
                height={170}
                zero={false}
              />
              <DataTable caption={p.table.caption} rows={rows} columns={columns} getRowId={(row) => row.id} />
            </main>
          </RailNav.Body>
        </RailNav.Shell>
      </figure>
      </div>
      <figure className="kz-scene-phone" aria-label={format(words.phone, { name })}>
        <div className="kz-scene-screen">
          <span className="kz-scene-island" aria-hidden />
          {data.phone === "video" && "tip" in p.phone ? (
            <VerticalVideo
              {...(examplePropsOf("vertical-video/rail") as { src?: string; poster?: string })}
              fit="fill"
              active={false}
              title={p.phone.title}
              creator={{ name: "Camille", avatarSrc: "https://krizaka-assets.b-cdn.net/site/people/ui/camille-256.dc2943029a.webp", verifiedLabel: p.phone.verified }}
              caption={p.phone.caption}
              disclosure={p.phone.disclosure}
              credit={p.phone.credit}
              likes={12_400}
              comments={328}
              shares={95}
              onComment={() => undefined}
              onShare={() => undefined}
              tipSlot={<Button size="sm" variant="primary" shape="pill">{p.phone.tip}</Button>}
            />
          ) : data.phone === "document" && "highlights" in p.phone ? (
            <DocumentPhone title={p.phone.title} highlights={p.phone.highlights} />
          ) : "messages" in p.phone ? (
            <ScenePhoneChat key={id} words={p.phone} firstMine={id === "orazaka"} />
          ) : null}
        </div>
      </figure>
    </div>
  );
}

function ScenePhoneChat({ words, firstMine }: { words: { messages: string[]; typing: string; placeholder: string; send: string }; firstMine: boolean }) {
  const [draft, setDraft] = useState("");
  const last = words.messages.length - 1;
  return (
    <div className="kz-scene-chat">
      <div className="kz-scene-thread">
        {words.messages.map((text, i) => {
          const mine = (i % 2 === 0) === firstMine;
          return <MessageBubble key={text} mine={mine} text={text} time={`09:1${2 + Math.floor(i / 2)}`} status={mine && i >= last - 1 ? "read" : undefined} showStatus={mine && i >= last - 1} />;
        })}
        <TypingIndicator label={words.typing} />
      </div>
      <MessageComposer value={draft} onValueChange={setDraft} onSend={() => setDraft("")} placeholder={words.placeholder} sendLabel={words.send} />
    </div>
  );
}
