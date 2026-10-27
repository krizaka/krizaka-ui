// The native templates built on Screen: ListDetail, FormFlow, StateScreen and the pull to refresh of Screen.
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { FormFlow } from "./form-flow";
import { ListDetail } from "./list-detail";
import { PullToRefresh } from "./pull-to-refresh";
import { Screen } from "./screen";
import { OfflineBanner, StateScreen } from "./state-screen";
import { ThemeProvider } from "./theme";

const layout = (width: number) => ({ nativeEvent: { layout: { x: 0, y: 0, width, height: 640 } } });
const insets = { top: 47, right: 0, bottom: 34, left: 0 };

describe("ListDetail", () => {
  const element = (props: Partial<React.ComponentProps<typeof ListDetail>> = {}) => (
    <ThemeProvider insets={insets}>
      <ListDetail testID="ld" fontScale={1} listTitle="Messages" list={<Text>Camille, lease</Text>} detailTitle="Camille" empty="Select a message" backLabel="Messages" onBack={() => undefined} {...props} />
    </ThemeProvider>
  );

  test("one pane at a time in a narrow room: the list, then the item with the way back", async () => {
    const onBack = jest.fn();
    const view = await render(element({ onBack }));
    await act(async () => fireEvent(screen.getByTestId("ld"), "layout", layout(360)));
    expect(screen.getByTestId("ld").props["data-panes"]).toBe("one");
    expect(screen.getByText("Camille, lease")).toBeTruthy();
    expect(screen.queryByText("Select a message")).toBeNull();
    await view.rerender(element({ onBack, detail: <Text>Hello</Text> }));
    expect(screen.getByText("Hello")).toBeTruthy();
    expect(screen.queryByText("Camille, lease")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: /Messages/ }));
    expect(onBack).toHaveBeenCalled();
  });

  test("both panes side by side when the room holds them — and no way back, the list is there", async () => {
    await render(element());
    await act(async () => fireEvent(screen.getByTestId("ld"), "layout", layout(820)));
    expect(screen.getByTestId("ld").props["data-panes"]).toBe("both");
    expect(screen.getByText("Camille, lease")).toBeTruthy();
    expect(screen.getByText("Select a message")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Messages/ })).toBeNull();
  });

  test("larger text needs more room for the detail: at 200 % the same room shows one pane", async () => {
    await render(element({ fontScale: 2 }));
    await act(async () => fireEvent(screen.getByTestId("ld"), "layout", layout(820)));
    expect(screen.getByTestId("ld").props["data-panes"]).toBe("one");
  });
});

describe("FormFlow", () => {
  const labels = { next: "Next", done: "Create my account", back: "Back", position: (n: number, total: number) => `Step ${n} of ${total}` };
  const steps = (valid = true) => [
    { id: "a", title: "Your name", description: "First name", valid, content: <Text>Field A</Text> },
    { id: "b", title: "Your email", content: <Text>Field B</Text> },
  ];

  test("walks the steps: the position in words, the action says Next then what happens, Back returns", async () => {
    const onDone = jest.fn();
    const onStep = jest.fn();
    await render(
      <ThemeProvider insets={insets}>
        <FormFlow steps={steps()} labels={labels} onDone={onDone} onStepChange={onStep} onExit={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByRole("progressbar", { name: "Step 1 of 2" })).toBeTruthy();
    expect(screen.getByText("Field A")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    expect(onStep).toHaveBeenCalledWith(1);
    expect(screen.getByRole("progressbar", { name: "Step 2 of 2" })).toBeTruthy();
    expect(screen.getByText("Field B")).toBeTruthy();
    expect(onDone).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("Field A")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    await fireEvent.press(screen.getByRole("button", { name: "Create my account" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  test("a step that is not valid dims the action and does not go on", async () => {
    await render(
      <ThemeProvider insets={insets}>
        <FormFlow steps={steps(false)} labels={labels} onDone={() => undefined} />
      </ThemeProvider>,
    );
    const next = screen.getByRole("button", { name: "Next" });
    expect(next.props.accessibilityState?.disabled ?? next.props["aria-disabled"]).toBeTruthy();
    await fireEvent.press(next);
    expect(screen.getByText("Field A")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });

  test("the app can drive the step", async () => {
    const onStep = jest.fn();
    await render(
      <ThemeProvider insets={insets}>
        <FormFlow steps={steps()} labels={labels} step={1} onStepChange={onStep} onDone={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByText("Field B")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(onStep).toHaveBeenCalledWith(0);
    expect(screen.getByText("Field B")).toBeTruthy();
  });
});

describe("StateScreen", () => {
  test("an error is an alert with its way out and a quieter second one; an offline state is a status; an empty one is neither", async () => {
    const retry = jest.fn();
    const help = jest.fn();
    const view = await render(
      <ThemeProvider>
        <StateScreen testID="state" kind="error" title="We could not load your files" description="Nothing was lost." action={{ label: "Try again", onPress: retry }} secondary={{ label: "Contact support", onPress: help }} />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("state").props.role).toBe("alert");
    expect(screen.getByRole("heading", { name: "We could not load your files" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    await fireEvent.press(screen.getByRole("button", { name: "Contact support" }));
    expect(retry).toHaveBeenCalled();
    expect(help).toHaveBeenCalled();
    await view.rerender(
      <ThemeProvider>
        <StateScreen testID="state" kind="offline" title="No connection" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("state").props.role).toBe("status");
    await view.rerender(
      <ThemeProvider>
        <StateScreen testID="state" kind="empty" title="No files yet" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("state").props.role).toBeUndefined();
  });

  test("the offline banner is a status with a retry, clear of the status bar", async () => {
    const retry = jest.fn();
    await render(
      <ThemeProvider insets={insets}>
        <OfflineBanner testID="banner" label="You are offline." actionLabel="Try again" onAction={retry} />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("banner").props.role).toBe("status");
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalled();
  });
});

describe("Screen pull to refresh", () => {
  test("a screen with onRefresh scrolls with a refresh control that calls back; without it there is none", async () => {
    const onRefresh = jest.fn();
    const view = await render(
      <ThemeProvider>
        <Screen testID="scroll" onRefresh={onRefresh} refreshing={false} refreshLabel="Pull to refresh">
          <Text>content</Text>
        </Screen>
      </ThemeProvider>,
    );
    const control = screen.getByTestId("scroll").props.refreshControl;
    expect(control.type).toBe(PullToRefresh);
    expect(control.props.label).toBe("Pull to refresh");
    control.props.onRefresh();
    expect(onRefresh).toHaveBeenCalled();
    await view.rerender(
      <ThemeProvider>
        <Screen testID="scroll">
          <Text>content</Text>
        </Screen>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("scroll").props.refreshControl).toBeUndefined();
  });
});
