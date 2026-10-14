// VerticalVideo and ShortFeed on React Native: the rail's named buttons and their state, compact counts, the caption.
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ShortFeed, VerticalVideo } from "./vertical-video";

afterEach(async () => cleanup());

describe("VerticalVideo (native)", () => {
  const clip = (props: Partial<React.ComponentProps<typeof VerticalVideo>> = {}) => (
    <VerticalVideo title="Video: Night shoot" creator={{ name: "Camille", verifiedLabel: "Verified" }} caption="The rooftop." likes={12400} comments={328} onLike={() => undefined} onFollow={() => undefined} disclosure="AI-generated" {...props} />
  );

  test("is a group named by its title, counts compact, the disclosure said on the picture", async () => {
    await render(clip());
    expect(screen.getByLabelText("Video: Night shoot", { exact: true })).toBeTruthy();
    expect(screen.getByText("12.4K")).toBeTruthy();
    expect(screen.getByText("328")).toBeTruthy();
    expect(screen.getByText("AI-GENERATED")).toBeTruthy();
  });

  test("likes and follows by named buttons that say their state", async () => {
    const onLike = jest.fn();
    const onFollow = jest.fn();
    await render(clip({ onLike, onFollow }));
    await fireEvent.press(screen.getByRole("button", { name: "Like" }));
    expect(onLike).toHaveBeenCalledWith(true);
    await fireEvent.press(screen.getByRole("button", { name: "Follow Camille" }));
    expect(onFollow).toHaveBeenCalledWith(true);
  });

  test("says that it is liked", async () => {
    await render(clip({ liked: true }));
    expect(screen.getByRole("button", { name: "Like" }).props["aria-pressed"]).toBe(true);
  });

  test("takes the product's own action in a slot", async () => {
    await render(clip({ onComment: () => undefined }));
    expect(screen.getByRole("button", { name: "Comments" })).toBeTruthy();
  });
});

describe("ShortFeed (native)", () => {
  test("is a list named by its label with one page per item", async () => {
    await render(<ShortFeed label="Videos" items={["a", "b"]} getId={(i) => i} height={640} renderItem={(i, { active }) => <Text>{active ? `${i} (playing)` : i}</Text>} />);
    expect(screen.getByLabelText("Videos")).toBeTruthy();
    expect(screen.getByText("a (playing)")).toBeTruthy();
  });
});
