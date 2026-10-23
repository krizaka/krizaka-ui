import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { SiteCahier, SiteCahierDoc, SiteCahierHero } from "./index";

const nav = [{ href: "/guides", label: "Guides", current: true }, { href: "/api", label: "API" }];

describe("SiteCahier", () => {
  it("frames a page: the bird and the name home, a named nav with the current page, one main, the family footer", async () => {
    const { container, getByRole } = render(
      <SiteCahier site="ts" name="Krizaka TypeScript" bird="pigeon" hue={200} nav={nav} footer={{ version: "0.8.0" }}>
        <SiteCahierHero bird="pigeon" birdCaption="the pigeon delivers" eyebrow="Open source" title="Typed results" lead="No exceptions." />
      </SiteCahier>,
    );
    expect(getByRole("link", { name: "Krizaka TypeScript" }).getAttribute("href")).toBe("/");
    expect(getByRole("navigation", { name: "Main" }).querySelector("[aria-current='page']")?.textContent).toBe("Guides");
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(getByRole("heading", { level: 1 }).textContent).toBe("Typed results");
    expect(container.querySelector("footer")).toBeTruthy();
    expect((container.firstChild as HTMLElement).dataset.site).toBe("ts");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("tints the blocks with the site's hue, and ignores a hue that is not a number", () => {
    const hue = (value: number) => (render(<SiteCahier site="ui" name="UI" bird="duck" hue={value} nav={nav} footer={false} />).container.firstChild as HTMLElement).style.getPropertyValue("--kz-hue");
    expect(hue(215)).toBe("hsl(215 62% 52%)");
    expect(hue(-30)).toBe("hsl(330 62% 52%)");
    expect(hue(Number.NaN)).toBe("");
  });

  it("takes the site's own bar and no footer", () => {
    const { container } = render(<SiteCahier site="java" name="Java" bird="owl" nav={nav} bar={<header data-bar>the shared bar</header>} footer={false} />);
    expect(container.querySelector("[data-bar]")).toBeTruthy();
    expect(container.querySelector(".kz-cahier-bar")).toBeNull();
    expect(container.querySelector("footer")).toBeNull();
  });

  it("lets a hero hold its own picture in place of the bird's print", () => {
    const { container } = render(<SiteCahierHero title="Hello" aside={<p data-demo>live demo</p>} doodle={<span data-doodle />} />);
    expect(container.querySelector("[data-demo]")).toBeTruthy();
    expect(container.querySelector(".kz-taped")).toBeNull();
    expect(container.querySelector(".kz-cahier-doodle [data-doodle]")).toBeTruthy();
  });

  it("lays a documentation page on ruled paper, its contents beside it in a named aside", async () => {
    const { container, getByRole } = render(
      <SiteCahierDoc title="Typed results" aside={<a href="#why">Why</a>}>
        <h2 id="why">Why</h2>
      </SiteCahierDoc>,
    );
    expect(container.querySelector("[data-paper='lines'][data-margin]")).toBeTruthy();
    expect(getByRole("complementary", { name: "On this page" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
