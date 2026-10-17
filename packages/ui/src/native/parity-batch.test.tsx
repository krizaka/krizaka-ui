// The native sides that the phone apps wrote by hand (krizaka-ui#275, #246): Stat, Alert, Separator, AuthLayout, the
// settings rows and the rich message bubble — each read by a screen reader the way the web's is.
import { describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Text } from "react-native";

import { Alert } from "./alert";
import { AuthLayout } from "./auth-layout";
import { MessageBubble } from "./chat";
import { Separator } from "./separator";
import { SettingsRow, SettingsSection } from "./settings-layout";
import { Stat, StatGrid } from "./stat";
import { Switch } from "./switch";

describe("native parity batch", () => {
  test("Stat is one element read label, value, change, hint; StatGrid lays them out", async () => {
    await render(
      <StatGrid columns={2}>
        <Stat label="Earnings" value="$12,480" trend="up" trendLabel="+12 %" hint="vs last month" />
        <Stat label="Payout" value="$3,120" />
      </StatGrid>,
    );
    expect(screen.getByLabelText("Earnings, $12,480, +12 %, vs last month")).toBeTruthy();
    expect(screen.getByLabelText("Payout, $3,120")).toBeTruthy();
  });

  test("a trend without words draws no arrow and says nothing", async () => {
    await render(<Stat label="Views" value="980" trend="up" />);
    expect(screen.getByLabelText("Views, 980")).toBeTruthy();
  });

  test("Alert: danger and warning are alerts announced at once, info and success polite statuses", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    await render(<Alert testID="a" tone="danger" title="Payment failed">The bank declined the card.</Alert>);
    expect(screen.getByTestId("a").props).toMatchObject({ role: "alert", "aria-live": "assertive" });
    expect(announce).toHaveBeenCalledWith("Payment failed. The bank declined the card.");
    announce.mockClear();
    await render(<Alert testID="a" tone="success" title="Saved" />);
    expect(screen.getByTestId("a").props).toMatchObject({ role: "status", "aria-live": "polite" });
    expect(announce).not.toHaveBeenCalled();
  });

  test("Separator is hidden from screen readers unless it is not decorative", async () => {
    await render(<Separator testID="line" />);
    expect(screen.getByTestId("line", { includeHiddenElements: true }).props["aria-hidden"]).toBe(true);
    await render(<Separator decorative={false} orientation="vertical" testID="line" />);
    const line = screen.getByTestId("line");
    expect(line.props.role).toBe("separator");
    expect(line.props["aria-orientation"]).toBe("vertical");
  });

  test("AuthLayout: the title is the heading, the form, the other way and the fine print follow", async () => {
    await render(
      <AuthLayout title="Welcome back" description="Sign in to continue." footer="No account yet?" legal="Terms apply.">
        <Text>form</Text>
      </AuthLayout>,
    );
    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeTruthy();
    for (const words of ["Sign in to continue.", "form", "No account yet?", "Terms apply."]) expect(screen.getByText(words)).toBeTruthy();
  });

  test("SettingsSection names its group; a row with onPress is a button read with its value and hint", async () => {
    const open = jest.fn();
    await render(
      <SettingsSection title="Account" description="Who you are on the app.">
        <SettingsRow label="Language" value="English" hint="The app's words" onPress={open} />
        <SettingsRow label="Push" accessory={<Switch label="Push" checked onCheckedChange={() => {}} />} />
        <SettingsRow label="Sign out" destructive onPress={open} />
      </SettingsSection>,
    );
    expect(screen.getByLabelText("Account")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Language, English, The app's words" }));
    expect(open).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("switch", { name: "Push" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^Push/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
  });

  test("MessageBubble draws rich children in place of the text, and keeps the text as its name", async () => {
    await render(
      <MessageBubble text="The lease is 12 months." time="10:41">
        <Text>rich answer</Text>
      </MessageBubble>,
    );
    expect(screen.getByText("rich answer")).toBeTruthy();
    expect(screen.queryByText("The lease is 12 months.")).toBeNull();
    expect(screen.getByLabelText("The lease is 12 months., 10:41")).toBeTruthy();
  });
});
