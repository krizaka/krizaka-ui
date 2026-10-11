// The data and media primitives of /native: Pagination, SearchField, and the entries that need an Expo module
// (VideoPlayer on expo-video, MediaCapture on expo-camera — mocked here, see src/native/mocks).
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";

import { MediaCapture } from "./media-capture";
import { Pagination } from "./pagination";
import { SearchField } from "./search-field";
import { VideoPlayer } from "./video-player";

const labels = { previous: "Previous page", next: "Next page", compact: (p: number, n: number) => `Page ${p} of ${n}` };

describe("Pagination", () => {
  test("says where the list stands and disables what leads nowhere", async () => {
    const pages: number[] = [];
    await render(<Pagination page={1} pageCount={3} onPageChange={(p) => pages.push(p)} labels={labels} />);
    expect(screen.getByText("Page 1 of 3")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await fireEvent.press(screen.getByRole("button", { name: "Next page" }));
    expect(pages).toEqual([2]);
  });

  test("runs on a cursor", async () => {
    const onNext = jest.fn();
    await render(<Pagination hasNext onNext={onNext} status="Payouts 1–20" labels={labels} />);
    expect(screen.getByText("Payouts 1–20")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Next page" }));
    expect(onNext).toHaveBeenCalled();
  });
});

describe("SearchField", () => {
  test("is a named searchbox; clears, submits, and searches once typing pauses", async () => {
    jest.useFakeTimers();
    const onSearch = jest.fn();
    const onSubmit = jest.fn();
    await render(<SearchField label="Search videos" clearLabel="Clear search" onSearch={onSearch} onSubmit={onSubmit} debounce={200} />);
    const input = screen.getByRole("searchbox", { name: "Search videos" });
    await fireEvent.changeText(input, "cat");
    expect(onSearch).not.toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(200));
    expect(onSearch).toHaveBeenCalledWith("cat");
    await fireEvent(input, "submitEditing");
    expect(onSubmit).toHaveBeenCalledWith("cat");
    await fireEvent.press(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    jest.useRealTimers();
  });
});

describe("VideoPlayer (expo-video)", () => {
  test("names the frame and shows the poster until the first frame", async () => {
    await render(<VideoPlayer title="Video: sunset" source={{ uri: "https://example.com/a.m3u8", contentType: "hls" }} poster={{ uri: "https://example.com/a.jpg" }} />);
    expect(screen.getByLabelText("Video: sunset")).toBeTruthy();
    expect(screen.getByTestId("expo-video-view", { includeHiddenElements: true })).toBeTruthy();
  });
});

describe("MediaCapture (expo-camera)", () => {
  test("explains why before asking, with the button that asks", async () => {
    await render(
      <MediaCapture
        onCapture={() => undefined}
        labels={{
          prompt: "Take a profile picture.",
          start: "Turn on the camera",
          denied: "Camera access is off.",
          settings: "Open Settings",
          takePhoto: "Take photo",
          startRecording: "Record",
          stopRecording: "Stop",
          switchCamera: "Switch camera",
        }}
      />,
    );
    expect(screen.getByText("Take a profile picture.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Turn on the camera" })).toBeTruthy();
  });
});
