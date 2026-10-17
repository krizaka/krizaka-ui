import { format, getDictionary, type Locale } from "@/lib/i18n";
import { getRegistryItems } from "@/lib/ui-registry";
import { componentPath } from "@/lib/urls";

import { MobileParityTable } from "./MobileParityTable";
import { PhoneFrame, shotHeight } from "./PhoneFrame";

/** A story makes the wall when it fills a phone (a screen, a form, a feed): shorter ones are strips, seen on their page. */
const WALL_MIN_HEIGHT = 300;

/* /docs/ui/mobile — what exists in React Native and how it differs from the web: the parity of the registry, one row per
   component that runs on mobile. Generated from the registry (`platforms`, `native.differences`): never written here. */
export function MobileDoc({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs;
  const x = t.ia.mobile;
  const items = getRegistryItems();
  const rows = items.filter((item) => item.platforms !== "web");
  const both = items.filter((item) => item.platforms === "both").length;
  const native = items.filter((item) => item.platforms === "native").length;
  const web = items.filter((item) => item.platforms === "web").length;
  // The wall: every component's richest React Native story that fills a phone, the whole screens first.
  const wall = rows
    .flatMap((item) => {
      const best = [...(item.native?.examples ?? [])].filter((example) => example.screenshots).sort((a, b) => shotHeight(b) - shotHeight(a));
      return item.name === "screen" ? best.map((example) => ({ item, example })) : best.slice(0, 1).map((example) => ({ item, example }));
    })
    .filter(({ example }) => shotHeight(example) >= WALL_MIN_HEIGHT)
    .sort((a, b) => Number(b.item.name === "screen") - Number(a.item.name === "screen"));
  return (
    <div>
      <section className="kz-wall not-prose" aria-labelledby="wall-title">
        <h2 id="wall-title">{x.wall.title}</h2>
        <p className="kz-docs-note">{format(x.wall.lead, { count: wall.length })}</p>
        <ul>
          {wall.map(({ item, example }, index) => (
            <li key={`${item.name}/${example.name}`}>
              <PhoneFrame example={example} os={index % 2 ? "android" : "ios"} alt={format(t.component.nativeShot, { name: `${item.title} — ${example.title}` })} eager={index < 4} inset={item.name === "screen"} />
              <a href={componentPath(locale, item.name)}>
                <strong>{item.name === "screen" ? example.title : item.title}</strong>
                <span>{item.name === "screen" ? item.title : example.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p>{x.intro}</p>
      <p className="kz-docs-note">{format(x.count, { both, native, web })}</p>
      <MobileParityTable
        rows={rows.map((item) => ({
          name: item.name,
          title: item.title,
          href: `${componentPath(locale, item.name)}`,
          web: item.platforms === "both",
          differences: item.platforms === "native" ? null : (item.native?.differences ?? []).join(" "),
        }))}
        labels={{ caption: x.caption, component: x.component, web: x.web, mobile: x.mobile, differences: x.differences, yes: x.yes, no: x.no, onlyMobile: x.onlyMobile, same: x.same }}
      />
    </div>
  );
}
