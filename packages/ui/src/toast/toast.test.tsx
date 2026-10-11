import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { groupedToast, progressToast, toast, toastClassNames, Toaster, undoToast } from "./index";

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

describe("toast helpers", () => {
  it("undoToast: undo restores, and nothing is committed", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    const onCommit = vi.fn();
    render(<Toaster label="Notifications" closeLabel="Dismiss" />);
    act(() => void undoToast("Archived", { undoLabel: "Undo", onUndo, onCommit }));
    const li = (await screen.findByText("Archived")).closest("[data-sonner-toast]") as HTMLElement;
    expect(li.className).toContain("kz-toast");
    expect(li.style.getPropertyValue("--kz-toast-duration")).toBe("6000ms");
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalledOnce();
    act(() => void toast.dismiss());
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("undoToast: commits when it is closed without an undo", async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();
    render(<Toaster label="Notifications" closeLabel="Dismiss" />);
    act(() => void undoToast("Deleted", { undoLabel: "Undo", onUndo: () => {}, onCommit }));
    await screen.findByText("Deleted");
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(onCommit).toHaveBeenCalledOnce());
  });

  it("progressToast: one toast updated in place, a success at the end", async () => {
    render(<Toaster label="Notifications" closeLabel="Dismiss" />);
    let id: string | number = "";
    act(() => void (id = progressToast("Uploading", { value: 0.3 })));
    expect(await screen.findByText("30 %")).toBeTruthy();
    act(() => void progressToast("Uploading", { id, value: 0.8 }));
    expect(await screen.findByText("80 %")).toBeTruthy();
    expect(document.querySelectorAll("[data-sonner-toast]")).toHaveLength(1);
    act(() => void progressToast("Uploading", { id, value: 1, doneMessage: "Uploaded" }));
    const done = (await screen.findByText("Uploaded")).closest("[data-sonner-toast]") as HTMLElement;
    expect(done.dataset.type).toBe("success");
  });

  it("groupedToast: repeats fold into one toast that counts", async () => {
    render(<Toaster label="Notifications" closeLabel="Dismiss" />);
    act(() => {
      for (let i = 0; i < 3; i++) groupedToast("msg", "New message", { countLabel: (n) => `${n} new messages` });
    });
    expect(await screen.findByText("3 new messages")).toBeTruthy();
    expect(document.querySelectorAll("[data-sonner-toast]")).toHaveLength(1);
  });
});
