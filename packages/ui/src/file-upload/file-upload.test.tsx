import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { acceptsFile, Dropzone, formatBytes, UploadList, useUploadQueue } from "./index";

const file = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type });

describe("helpers", () => {
  it("matches an accept list by type, family and extension", () => {
    expect(acceptsFile(file("a.mp4", "video/mp4"), "video/*")).toBe(true);
    expect(acceptsFile(file("a.MOV", ""), ".mov")).toBe(true);
    expect(acceptsFile(file("a.png", "image/png"), "video/*,.pdf")).toBe(false);
  });
  it("writes sizes in the locale's words", () => {
    expect(formatBytes(820_000)).toBe("820 kB");
    expect(formatBytes(1_840_000_000)).toBe("1.8 GB");
  });
});

describe("Dropzone", () => {
  it("opens the picker from a described button, with no axe violation", async () => {
    const { container } = render(<Dropzone title="Drop your video" browseLabel="Choose a video" hint="MP4, up to 4 GB" onFiles={() => undefined} />);
    const button = screen.getByRole("button", { name: "Choose a video" });
    expect(button.getAttribute("aria-describedby")!.split(" ").map((id) => document.getElementById(id)?.textContent)).toEqual(["Drop your video", "MP4, up to 4 GB"]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("names the hidden file input: the title by default, or inputLabel", () => {
    const { container, rerender } = render(<Dropzone title="Drop your video" browseLabel="Choose" onFiles={() => undefined} />);
    expect(container.querySelector("input[type=file]")?.getAttribute("aria-label")).toBe("Drop your video");
    rerender(<Dropzone title="Drop your video" browseLabel="Choose" inputLabel="Video file" onFiles={() => undefined} />);
    expect(container.querySelector("input[type=file]")?.getAttribute("aria-label")).toBe("Video file");
  });

  it("accepts and refuses dropped files by type, size and count, and says why", () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    render(
      <Dropzone title="Drop" browseLabel="Browse" accept="video/*" maxSize={100} onFiles={onFiles} onReject={onReject} refusalLabel={(r) => `${r.file.name}: ${r.reason}`} />,
    );
    const zone = screen.getByText("Drop").parentElement!;
    fireEvent.dragEnter(zone, { dataTransfer: { files: [] } });
    expect(zone.hasAttribute("data-dragging")).toBe(true);
    const files = [file("ok.mp4", "video/mp4"), file("big.mp4", "video/mp4", 500), file("pic.png", "image/png"), file("two.mp4", "video/mp4")];
    fireEvent.drop(zone, { dataTransfer: { files } });
    expect(onFiles).toHaveBeenCalledWith([files[0]]);
    expect(onReject.mock.calls[0]![0].map((r: { reason: string }) => r.reason)).toEqual(["size", "type", "count"]);
    expect(screen.getByRole("alert").textContent).toContain("big.mp4: size");
  });

  it("takes files from the picker too", async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    render(<Dropzone title="Drop" browseLabel="Browse" multiple onFiles={onFiles} />);
    await user.upload(document.querySelector("input[type=file]") as HTMLInputElement, [file("a.pdf", "application/pdf"), file("b.pdf", "application/pdf")]);
    expect(onFiles.mock.calls[0]![0]).toHaveLength(2);
  });
});

describe("UploadList", () => {
  it("shows each state with its actions, progress and failure announced", async () => {
    const user = userEvent.setup();
    const onPause = vi.fn();
    const { container } = render(
      <UploadList
        items={[
          { id: "a", name: "clip.mp4", size: 1000, progress: 0.4, status: "uploading", speed: 100 },
          { id: "b", name: "fail.mp4", size: 1000, progress: 0.1, status: "error", error: "Connection lost" },
        ]}
        onPause={onPause}
        onRetry={() => undefined}
        onRemove={() => undefined}
      />,
    );
    expect(screen.getByRole("progressbar", { name: "clip.mp4" }).getAttribute("aria-valuenow")).toBe("40");
    expect(screen.getByText("6 s left")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toBe("Connection lost");
    await user.click(screen.getByRole("button", { name: "Pause clip.mp4" }));
    expect(onPause).toHaveBeenCalledWith("a");
    expect(screen.getByRole("button", { name: "Retry fail.mp4" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("useUploadQueue", () => {
  it("runs uploads with a concurrency, pauses by aborting and resumes with `resumed`", async () => {
    const calls: { name: string; resumed: boolean; signal: AbortSignal; done: () => void; progress: (n: number) => void }[] = [];
    const upload = vi.fn(
      (f: File, ctx: { signal: AbortSignal; resumed: boolean; onProgress: (n: number) => void }) =>
        new Promise<void>((resolve) => calls.push({ name: f.name, resumed: ctx.resumed, signal: ctx.signal, done: resolve, progress: ctx.onProgress })),
    );
    const { result } = renderHook(() => useUploadQueue({ upload, concurrency: 1, previews: false }));
    act(() => result.current.add([file("a.mp4", "video/mp4", 100), file("b.mp4", "video/mp4", 100)]));
    expect(result.current.items.map((i) => i.status)).toEqual(["uploading", "queued"]);
    act(() => calls[0]!.progress(50));
    expect(result.current.items[0]!.progress).toBe(0.5);
    const first = result.current.items[0]!.id;
    act(() => result.current.pause(first));
    expect(calls[0]!.signal.aborted).toBe(true);
    expect(result.current.items.map((i) => i.status)).toEqual(["paused", "uploading"]);
    await act(async () => calls[1]!.done());
    act(() => result.current.resume(first));
    expect(calls[2]).toMatchObject({ name: "a.mp4", resumed: true });
    await act(async () => calls[2]!.done());
    expect(result.current.items.map((i) => i.status)).toEqual(["done", "done"]);
  });

  it("retries a failed upload by itself, with a backoff, and shows the error only when the tries are spent", async () => {
    vi.useFakeTimers();
    const upload = vi.fn((_f: File, ctx: { resumed: boolean }) => (ctx.resumed ? Promise.resolve() : Promise.reject(new Error("Connection lost"))));
    const { result } = renderHook(() => useUploadQueue({ upload, previews: false, retries: 2, backoff: { kind: "fixed", baseMs: 100 } }));
    act(() => result.current.add([file("a.mp4", "video/mp4", 100)]));
    await act(async () => void (await vi.advanceTimersByTimeAsync(0)));
    expect(upload).toHaveBeenCalledTimes(1);
    expect(result.current.items[0]!.status).toBe("uploading");
    await act(async () => void (await vi.advanceTimersByTimeAsync(100)));
    expect(upload).toHaveBeenCalledTimes(2);
    expect(result.current.items[0]).toMatchObject({ status: "done", progress: 1 });
    vi.useRealTimers();
  });

  it("shows the error of an upload that is not retried, and retries it by hand", async () => {
    let fail = true;
    const upload = vi.fn(() => (fail ? Promise.reject(new Error("Disk full")) : Promise.resolve()));
    const { result } = renderHook(() => useUploadQueue({ upload, previews: false, shouldRetry: () => false, retries: 3 }));
    act(() => result.current.add([file("a.mp4", "video/mp4", 100)]));
    await act(async () => undefined);
    expect(result.current.items[0]).toMatchObject({ status: "error", error: "Disk full", speed: undefined });
    fail = false;
    act(() => result.current.retry(result.current.items[0]!.id));
    await act(async () => undefined);
    expect(result.current.items[0]!.status).toBe("done");
  });

  it("measures the speed while sending, and cancels an upload, revoking its preview", async () => {
    const revoke = vi.fn();
    const create = vi.fn(() => "blob:preview");
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    vi.useFakeTimers();
    const progress: Record<string, (n: number) => void> = {};
    const upload = vi.fn((f: File, ctx: { onProgress: (n: number) => void }) => new Promise<void>(() => (progress[f.name] = ctx.onProgress)));
    const { result, unmount } = renderHook(() => useUploadQueue({ upload }));
    act(() => result.current.add([file("a.mp4", "video/mp4", 1000), file("b.mp4", "video/mp4", 1000)]));
    expect(result.current.items[0]!.previewUrl).toBe("blob:preview");
    await act(async () => void (await vi.advanceTimersByTimeAsync(1000)));
    act(() => progress["a.mp4"]!(500));
    expect(result.current.items[0]!.speed).toBeGreaterThan(0);
    act(() => result.current.cancel(result.current.items[0]!.id));
    expect(revoke).toHaveBeenCalledWith("blob:preview");
    expect(result.current.items).toHaveLength(1);
    unmount();
    expect(revoke).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
