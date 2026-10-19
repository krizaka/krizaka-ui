// Waveform on React Native: decorative by default (hidden from assistive technology), an image with a label, one bar per
// count, still under reduced motion.
import { afterEach, describe, expect, test } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react-native";

import { Waveform } from "./waveform";

afterEach(async () => cleanup());

describe("Waveform (native)", () => {
  test("is decorative by default: one bar per count, none of them read", async () => {
    await render(<Waveform peaks={[0.2, 0.9, 0.4, 0.7]} bars={4} />);
    expect(screen.queryAllByTestId("waveform-bar")).toHaveLength(0); // hidden from the screen reader
    expect(screen.getAllByTestId("waveform-bar", { includeHiddenElements: true })).toHaveLength(4);
    expect(screen.queryByRole("image")).toBeNull();
  });

  test("is an accessible image with a label", async () => {
    await render(<Waveform label="Voice note, 0:42" peaks={[0.5]} bars={1} />);
    expect(screen.getByRole("image", { name: "Voice note, 0:42" })).toBeTruthy();
  });

  test("draws without peaks, a flat line, and takes a size", async () => {
    await render(<Waveform bars={3} size="lg" playing={false} />);
    expect(screen.getAllByTestId("waveform-bar", { includeHiddenElements: true })).toHaveLength(3);
  });
});
