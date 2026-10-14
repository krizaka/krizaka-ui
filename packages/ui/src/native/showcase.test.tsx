// Showcase on React Native: a named group of pages, the bar's segments as buttons, the counter, the pause button.
import { afterEach, describe, expect, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Showcase } from "./showcase";

afterEach(async () => cleanup());

const items = ["a", "b", "c"];
const show = (props: Partial<React.ComponentProps<typeof Showcase<string>>> = {}) => (
  <Showcase label="How it works" items={items} getId={(i) => i} getTitle={(i) => `Title ${i}`} renderItem={(i) => <Text>{`slide ${i}`}</Text>} {...props} />
);

describe("Showcase (native)", () => {
  test("is a named group with a counter, a title and one button per slide", async () => {
    await render(show());
    expect(screen.getByLabelText("How it works")).toBeTruthy();
    expect(screen.getByText("Title a · Slide 1 of 3")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(3);
  });

  test("goes next, previous and to a segment, and says who moved it", async () => {
    const calls: [number, boolean][] = [];
    await render(show({ onIndexChange: (index, user) => calls.push([index, user]) }));
    await fireEvent.press(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByText("Title b · Slide 2 of 3")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Go to slide 3" }));
    expect(screen.getByText("Title c · Slide 3 of 3")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Previous slide" }));
    expect(calls).toEqual([[1, true], [2, true], [1, true]]);
  });

  test("has a pause button that turns into play, and none without autoplay", async () => {
    await render(show());
    await fireEvent.press(screen.getByRole("button", { name: "Pause the slideshow" }));
    expect(screen.getByRole("button", { name: "Play the slideshow" })).toBeTruthy();
    cleanup();
    await render(show({ autoplay: false }));
    expect(screen.queryByRole("button", { name: "Pause the slideshow" })).toBeNull();
  });
});
