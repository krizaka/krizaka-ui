// Chat on React Native: a bubble with rich content (a model's answer), and the composer's meta line (#246 parts 2-3).
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";

import { ComposerMeta, MessageBubble, MessageComposer } from "./chat";
import { Txt } from "./txt";

afterEach(async () => cleanup());

describe("MessageBubble rich content (native)", () => {
  test("children replace the text, in the same bubble, and are read as they are", async () => {
    await render(
      <MessageBubble time="19:02">
        <Txt>Answer with **markdown** stand-in</Txt>
      </MessageBubble>,
    );
    expect(screen.getByText("Answer with **markdown** stand-in")).toBeTruthy();
    expect(screen.getByText("19:02")).toBeTruthy();
    expect(screen.queryByLabelText("19:02")).toBeNull(); // no container label hiding the content
  });

  test("plain text still works and names the bubble", async () => {
    await render(<MessageBubble mine text="Hi" time="19:02" />);
    expect(screen.getByLabelText("Hi, 19:02")).toBeTruthy();
  });
});

describe("ComposerMeta / MessageComposer meta (native)", () => {
  test("shows the model chip, which opens the choice, and the status line", async () => {
    const onPress = jest.fn();
    await render(<ComposerMeta model={{ label: "Local model", onPress, accessibilityLabel: "Model: Local model" }} status="0 bytes left your network" />);
    await fireEvent.press(screen.getByRole("button", { name: "Model: Local model" }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText("0 bytes left your network")).toBeTruthy();
  });

  test("renders nothing without a model or a status", async () => {
    const { toJSON } = await render(<ComposerMeta />);
    expect(toJSON()).toBeNull();
  });

  test("the composer puts the meta above the input, and hides it when it cannot write", async () => {
    const props = { value: "", onValueChange: () => {}, onSend: () => {}, placeholder: "Message", sendLabel: "Send" };
    const { rerender } = await render(<MessageComposer {...props} meta={<ComposerMeta status="Private" />} />);
    expect(screen.getByText("Private")).toBeTruthy();
    expect(screen.getByLabelText("Message")).toBeTruthy();
    await rerender(<MessageComposer {...props} meta={<ComposerMeta status="Private" />} disabledReason="Blocked" />);
    expect(screen.queryByText("Private")).toBeNull();
    expect(screen.getByText("Blocked")).toBeTruthy();
  });
});
