import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { toast, toastClassNames, Toaster } from "./index";

afterEach(() => act(() => void toast.dismiss()));

describe("Toaster", () => {
  it("names its region and styles toasts by roles, sonner's own styling off", async () => {
    const { container } = render(<Toaster label="Notifications" closeLabel="Dismiss" />);
    act(() => void toast.success("Saved", { description: "Your profile is up to date." }));
    const item = await screen.findByText("Saved");
    const li = item.closest("[data-sonner-toast]") as HTMLElement;
    expect(li.dataset.styled).toBe("false");
    expect(li.dataset.type).toBe("success");
    expect(li.className).toContain("bg-surface-2");
    expect(li.className).toContain("border-l-success");
    expect(li.className).not.toContain("border-l-danger");
    expect(container.querySelector("section")?.getAttribute("aria-label")).toContain("Notifications");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("maps every tone, closes with its translated button, and renders custom JSX", async () => {
    const user = userEvent.setup();
    render(<Toaster label="Notifications" closeLabel="Dismiss" />);
    act(() => void toast.error("Payment failed"));
    const li = (await screen.findByText("Payment failed")).closest("[data-sonner-toast]") as HTMLElement;
    expect(li.className).toContain("border-l-danger");
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(screen.queryByText("Payment failed")).toBeNull());

    act(() => void toast.custom(() => <p>A new follower</p>));
    expect(await screen.findByText("A new follower")).toBeTruthy();
  });

  it("merges the product's class names after the platform's", () => {
    render(<Toaster label="Notifications" closeLabel="Dismiss" toastOptions={{ classNames: { toast: "rounded-none" } }} />);
    act(() => void toast("Hello"));
    return screen.findByText("Hello").then((item) => {
      const li = item.closest("[data-sonner-toast]") as HTMLElement;
      expect(li.className).toContain("rounded-none");
      expect(li.className).not.toContain("rounded-xl");
      expect(toastClassNames.warning).toContain("border-l-warning");
    });
  });
});
