// The dating kit of /native: the age gate, distances, the deck, the photo menu's actions, tags at their limit, the step
// head, the chat parts and the range — what a screen reader hears and the ticks the app's haptics play.
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";

import { ConversationItem, MessageBubble } from "./chat";
import { PhotoGrid } from "./photo-grid";
import { StepProgress } from "./step-progress";
import { PersonCard, SwipeDeck } from "./swipe-deck";
import { TagSelector } from "./tag-selector";
import { type HapticKind, ThemeProvider } from "./theme";

const ticks = () => {
  const calls: HapticKind[] = [];
  return { calls, wrap: (ui: React.ReactElement) => <ThemeProvider haptics={(k) => calls.push(k)}>{ui}</ThemeProvider> };
};

describe("dating kit (native)", () => {
  test("SwipeDeck offers Like and Pass to screen readers, with a tick", async () => {
    const { calls, wrap } = ticks();
    const decided: string[] = [];
    await render(
      wrap(
        <SwipeDeck
          items={[{ id: "e", name: "Elena" }]}
          getId={(p) => p.id}
          onSwipe={(p, d) => decided.push(`${p.name}:${d}`)}
          labels={{ like: "Like", pass: "Pass" }}
          renderCard={(p) => <PersonCard photos={[]} name={p.name} age={29} />}
        />,
      ),
    );
    expect(screen.getByRole("img", { name: /^Elena, 29/ })).toBeTruthy();
    await act(async () => fireEvent.press(screen.getByRole("button", { name: "Like" })));
    await act(async () => new Promise((r) => setTimeout(r, 300)));
    expect(decided).toEqual(["Elena:like"]);
    expect(calls).toContain("impact");
  });

  test("PhotoGrid moves a photo through its accessibility action", async () => {
    const changes: string[][] = [];
    await render(
      <PhotoGrid
        value={[{ id: "a", uri: "a.png" }, { id: "b", uri: "b.png" }]}
        onValueChange={(p) => changes.push(p.map((x) => x.id))}
        labels={{ add: "Add", main: "Main", photo: (n) => `Photo ${n}`, makeMain: "Make main", moveEarlier: "Earlier", moveLater: "Later", remove: "Remove", cancel: "Cancel" }}
      />,
    );
    await act(async () => fireEvent(screen.getByRole("button", { name: "Photo 2" }), "accessibilityAction", { nativeEvent: { actionName: "makeMain" } }));
    expect(changes).toEqual([["b", "a"]]);
  });

  test("TagSelector rests the others at the limit; StepProgress says the step", async () => {
    await render(<TagSelector label="Interests" options={[{ value: "a", label: "Music" }, { value: "b", label: "Surf" }]} value={["a"]} onValueChange={() => undefined} max={1} countLabel={(n, m) => `${n} of ${m}`} />);
    expect(screen.getByRole("checkbox", { name: "Surf" })).toBeDisabled();
    await render(<StepProgress step={2} total={5} label={(n, t) => `Step ${n} of ${t}`} />);
    expect(screen.getByRole("progressbar", { name: "Step 2 of 5" })).toBeTruthy();
  });

  test("chat parts: a failed message retries, a conversation reads its unread count", async () => {
    const retry = jest.fn();
    await render(<MessageBubble mine text="Hi" time="19:02" status="failed" onRetry={retry} labels={{ retry: "Tap to retry" }} />);
    await fireEvent.press(screen.getByRole("button", { name: "Hi, 19:02, Not sent. Tap to retry" }));
    expect(retry).toHaveBeenCalled();
    await render(<ConversationItem name="Elena" preview="typing…" typing unread={2} unreadLabel="2 unread" time="19:06" />);
    expect(screen.getByRole("button", { name: "Elena, typing…, 19:06, 2 unread" })).toBeTruthy();
  });

});
