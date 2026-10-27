// QrCode on React Native: an image named by its label, one drawing, a copy button that hands the text to the app.
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";

import { QrCode } from "./qr-code";

afterEach(async () => cleanup());

describe("QrCode (native)", () => {
  test("is an image named by its label", async () => {
    await render(<QrCode value="https://akinaza.com/ical/x.ics" label="Calendar feed" />);
    expect(screen.getByRole("image", { name: "Calendar feed" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  test("gives the text to the app when the person copies", async () => {
    const onCopy = jest.fn();
    await render(<QrCode value="https://akinaza.com/ical/x.ics" label="Calendar feed" copyLabel="Copy the link" onCopy={onCopy} />);
    await fireEvent.press(screen.getByRole("button", { name: "Copy the link" }));
    expect(onCopy).toHaveBeenCalledWith("https://akinaza.com/ical/x.ics");
  });
});
