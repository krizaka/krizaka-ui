import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { EnvironmentNotice, environmentNotice, isProductionStage } from "./index";

const words = { title: "Development version", message: "Data can be reset at any time. Not a commercial offer." };

describe("environmentNotice (the rule)", () => {
  it("returns null for production and prod, in any case, and the content for every other stage", () => {
    for (const stage of ["production", "prod", " Production ", "PROD"]) expect(environmentNotice({ stage, ...words })).toBeNull();
    for (const stage of ["development", "dev", "staging", "preview"]) expect(environmentNotice({ stage, ...words })).toMatchObject({ stage, ...words });
  });
  it("shows the notice when the stage is missing, so a deployment that forgets to say it is production is seen", () => {
    expect(isProductionStage(undefined)).toBe(false);
    expect(environmentNotice({ stage: undefined, ...words })).toMatchObject({ stage: "unknown" });
    expect(environmentNotice({ stage: null, ...words })).not.toBeNull();
  });
});

describe("EnvironmentNotice", () => {
  it("stage development renders the notice as a region named by its title; stage production renders nothing", async () => {
    const { container, rerender } = render(<EnvironmentNotice stage="development" {...words} />);
    expect(screen.getByRole("region", { name: "Development version" })).toBeTruthy();
    expect(screen.getByText(words.message)).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
    rerender(<EnvironmentNotice stage="production" {...words} />);
    expect(screen.queryByRole("region")).toBeNull();
    expect(container.innerHTML).toBe("");
  });

  it("is in the server markup (no layout shift), and empty in production", () => {
    expect(renderToStaticMarkup(<EnvironmentNotice stage="dev" {...words} />)).toContain("Development version");
    expect(renderToStaticMarkup(<EnvironmentNotice stage="prod" {...words} />)).toBe("");
  });

  it("renders its link, with your router's Link when given", () => {
    const Link = ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
      <a href={href} data-router="yes" {...rest}>
        {children}
      </a>
    );
    render(<EnvironmentNotice stage="development" {...words} link={{ label: "What this means", href: "/meaning" }} linkAs={Link} />);
    const link = screen.getByRole("link", { name: "What this means" });
    expect(link.getAttribute("href")).toBe("/meaning");
    expect(link.getAttribute("data-router")).toBe("yes");
  });

  it("has no dismiss button: the line stays while the stage is not production", () => {
    render(<EnvironmentNotice stage="staging" {...words} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("is tied to the page frame and the warning tokens, with no hard-coded colour", () => {
    const html = renderToStaticMarkup(<EnvironmentNotice stage="development" {...words} />);
    expect(html).toContain("--kz-page-gutter");
    expect(html).toContain("bg-warning/10");
    expect(html).not.toMatch(/#[0-9a-f]{3,6}|rgb\(/i);
  });
});
