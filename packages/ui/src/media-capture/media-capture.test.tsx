import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { MediaCapture } from "./index";

function stubCamera(getUserMedia: () => Promise<MediaStream>) {
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia: vi.fn(getUserMedia), enumerateDevices: async () => [] } });
}

describe("MediaCapture", () => {
  afterEach(() => Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: undefined }));

  it("explains first and asks only on a press, with no axe violation", async () => {
    stubCamera(async () => ({ getTracks: () => [] }) as unknown as MediaStream);
    const { container } = render(<MediaCapture onCapture={() => undefined} />);
    expect(screen.getByRole("region", { name: "Camera" })).toBeTruthy();
    expect(screen.getByText("Use your camera to take a photo or record a clip.")).toBeTruthy();
    expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("shows the shutter once the camera is on", async () => {
    stubCamera(async () => Object.assign(new MediaStream(), { getTracks: () => [] }));
    const user = userEvent.setup();
    const onError = vi.fn();
    render(<MediaCapture onCapture={() => undefined} onError={onError} />);
    await user.click(screen.getByRole("button", { name: "Turn on the camera" }));
    await waitFor(() => expect(onError.mock.calls[0]?.[0] ?? screen.getByRole("button", { name: "Take photo" })).toBeTruthy());
    expect(onError).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Take photo" })).toBeTruthy();
    expect((screen.getByRole("button", { name: "Switch camera" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("announces a refusal and offers the file picker, which captures too", async () => {
    stubCamera(async () => {
      throw Object.assign(new Error("denied"), { name: "NotAllowedError" });
    });
    const user = userEvent.setup();
    const onCapture = vi.fn();
    render(<MediaCapture onCapture={onCapture} />);
    await user.click(screen.getByRole("button", { name: "Turn on the camera" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Camera access is blocked"));
    URL.createObjectURL = vi.fn(() => "blob:photo");
    await user.upload(document.querySelector("input[type=file]") as HTMLInputElement, new File(["x"], "me.jpg", { type: "image/jpeg" }));
    expect(onCapture).toHaveBeenCalledWith(expect.objectContaining({ kind: "photo", url: "blob:photo" }));
  });

  it("falls back to the file picker where there is no camera API", () => {
    render(<MediaCapture onCapture={() => undefined} mode="video" />);
    expect(screen.getByRole("button", { name: "Choose a file" })).toBeTruthy();
    expect((document.querySelector("input[type=file]") as HTMLInputElement).accept).toBe("video/*");
  });
});
