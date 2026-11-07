import { render } from "@testing-library/react";

import { Icon, type IconName } from "../../icon";

describe("Icon", () => {
  it("draws a registered icon", () => {
    const { container } = render(<Icon name="studio" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("draws nothing for a name the registry does not know", () => {
    const { container } = render(<Icon name={"mood-tracking" as IconName} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("draws the fallback for a name that comes from data and is unknown", () => {
    const { container } = render(<Icon name={"mood-tracking" as IconName} fallback="studio" />);
    const fallback = render(<Icon name="studio" />).container.querySelector("svg")?.innerHTML;
    expect(container.querySelector("svg")?.innerHTML).toBe(fallback);
  });
});
