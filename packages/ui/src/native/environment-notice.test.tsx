// EnvironmentNotice on React Native: the stage drives it, production renders nothing.
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";

import { EnvironmentNotice } from "./environment-notice";

afterEach(async () => cleanup());

const words = { title: "Development version", message: "Data can be reset at any time. Not a commercial offer." };

describe("EnvironmentNotice (native)", () => {
  test("shows the title and the line for the stage development, as a named region", async () => {
    await render(<EnvironmentNotice stage="development" {...words} />);
    expect(screen.getByLabelText("Development version")).toBeTruthy();
    expect(screen.getByText(words.message)).toBeTruthy();
  });

  test("renders nothing in production", async () => {
    await render(<EnvironmentNotice stage="production" {...words} />);
    expect(screen.queryByText(words.title)).toBeNull();
  });

  test("renders nothing for prod, whatever the case", async () => {
    await render(<EnvironmentNotice stage="PROD" {...words} />);
    expect(screen.queryByText(words.title)).toBeNull();
  });

  test("calls the app for its link", async () => {
    const onLinkPress = jest.fn();
    await render(<EnvironmentNotice stage="staging" {...words} link={{ label: "What this means" }} onLinkPress={onLinkPress} />);
    await fireEvent.press(screen.getByText("What this means"));
    expect(onLinkPress).toHaveBeenCalledTimes(1);
  });
});
