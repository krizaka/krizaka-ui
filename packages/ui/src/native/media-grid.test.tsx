// MediaGrid on a phone (krizaka-ui#228): the 9:16 clips go to the shelf, the others to rows of one height; a card is a
// button named by what it shows; `uniform` puts everything in one frame and tells the odd one to `contain`.
import { describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { MediaGrid, type MediaGridState, VideoCard } from "./media-grid";

const CLIPS = [
  { id: "a", title: "Tea", tall: false },
  { id: "b", title: "Backstage", tall: true },
  { id: "c", title: "Snow", tall: false },
  { id: "d", title: "Unlock", tall: true },
  { id: "e", title: "Desert", tall: false },
];

describe("native MediaGrid", () => {
  test("split: verticals on a named shelf at its width, the rest in the grid as landscape stacks", async () => {
    const seen: Record<string, MediaGridState> = {};
    await render(
      <MediaGrid
        items={CLIPS}
        getId={(c) => c.id}
        orientationOf={(c) => (c.tall ? "portrait" : "landscape")}
        columns={2}
        shelf={{ label: "Shorts", itemWidth: 120 }}
        renderItem={(c, state) => {
          seen[c.id] = state;
          return <VideoCard title={c.title} aspect={state.aspect} width={state.width} />;
        }}
      />,
    );
    expect(screen.getByLabelText("Shorts")).toBeTruthy();
    expect(seen.b).toEqual({ aspect: "portrait", layout: "stack", mismatch: false, width: 120 });
    expect(seen.a).toEqual({ aspect: "landscape", layout: "stack", mismatch: false });
    for (const title of ["Tea", "Snow", "Desert", "Backstage", "Unlock"]) expect(screen.getByText(title)).toBeTruthy();
  });

  test("uniform + list: one frame for all, the vertical ones told they mismatch, one row per video", async () => {
    const seen: Record<string, MediaGridState> = {};
    await render(
      <MediaGrid
        mode="uniform"
        layout="list"
        items={CLIPS}
        getId={(c) => c.id}
        orientationOf={(c) => (c.tall ? "portrait" : "landscape")}
        shelf={{ label: "Shorts" }}
        renderItem={(c, state) => {
          seen[c.id] = state;
          return <VideoCard title={c.title} aspect={state.aspect} layout={state.layout} />;
        }}
      />,
    );
    expect(screen.queryByLabelText("Shorts")).toBeNull();
    expect(seen.d).toEqual({ aspect: "landscape", layout: "row", mismatch: true });
    expect(Object.keys(seen)).toHaveLength(5);
  });

  test("a VideoCard is one button named by its title, creator, duration and count", async () => {
    const open = jest.fn();
    await render(<VideoCard title="Pouring the tea" creator={{ name: "Camille" }} duration="0:12" meta="12.4K views" onPress={open} />);
    fireEvent.press(screen.getByRole("button", { name: "Pouring the tea, Camille, 0:12, 12.4K views" }));
    expect(open).toHaveBeenCalledTimes(1);
  });
});
