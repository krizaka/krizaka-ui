// krizaka-ui#115 — the map's countries are a lazy chunk (~100 kB of JSON, decoded once). On a loaded CI runner its
// first import can take longer than `waitFor`'s second: "map … is drawn in the browser and passes axe" then saw the
// figure still `loading`. This reproduces a slow chunk (1.5 s) on purpose.
import { render, waitFor } from "@testing-library/react";

import Viewers from "../../registry/examples/geo-map/viewers";
import { mockWidth } from "../test/setup";
import { loadWorld } from "./world";

vi.mock("./world-110m.json", async (importOriginal) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return importOriginal();
});

beforeEach(() => mockWidth(640, 320));
// The chunk is loaded before the render, whatever it takes (the hook's timeout, not `waitFor`'s second): `waitFor`
// then only covers React's update.
beforeAll(() => loadWorld(), 30_000);

it("a map whose countries arrive late is drawn once they are loaded", async () => {
  const { container } = render(<Viewers />);
  await waitFor(() => expect(container.querySelector("figure")?.getAttribute("data-state")).not.toBe("loading"));
});
