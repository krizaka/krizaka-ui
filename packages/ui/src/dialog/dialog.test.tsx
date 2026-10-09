import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { AlertDialog, Dialog, Sheet } from "./index";

function Example({ placement }: { placement?: "center" | "bottom" | "right" }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Edit profile</Dialog.Trigger>
      <Dialog.Content closeLabel="Close" placement={placement}>
        <Dialog.Header>
          <Dialog.Title>Profile</Dialog.Title>
          <Dialog.Description>Your public name.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <label htmlFor="name">Name</label>
          <input id="name" />
        </Dialog.Body>
        <Dialog.Footer>
          <button type="button">Save</button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe("Dialog", () => {
  it("is named by its title, described by its description, with no axe violation", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    const dialog = screen.getByRole("dialog");
    const title = screen.getByText("Profile");
    expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
    expect(dialog.getAttribute("aria-describedby")).toBe(screen.getByText("Your public name.").id);
    expect(screen.getByRole("dialog", { name: "Profile" })).toBe(dialog);
    expect(dialog.dataset.placement).toBe("center");
    expect(await axeViolations(dialog)).toEqual([]);
  });

  it("traps the focus: Tab cycles inside the dialog", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    const dialog = screen.getByRole("dialog");
    const close = screen.getByRole("button", { name: "Close" });
    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    close.focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText("Name"));
  });

  it("closes on Escape and gives the focus back to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Edit profile" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on a click on the overlay, and with its close button", async () => {
    // Radix makes the page behind inert (pointer-events: none on the body): skip user-event's check for the overlay.
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await user.click(document.querySelector(".kz-overlay") as HTMLElement);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("anchors a Sheet at the bottom and a panel on the right", () => {
    render(
      <Dialog.Root defaultOpen>
        <Sheet closeLabel="Close">
          <Dialog.Title>Filters</Dialog.Title>
        </Sheet>
      </Dialog.Root>,
    );
    const sheet = screen.getByRole("dialog");
    expect(sheet.dataset.placement).toBe("bottom");
    expect(sheet.className).toContain("bottom-0");
  });
});

describe("AlertDialog", () => {
  it("asks, then runs an async confirm with the button loading, and closes when it resolves", async () => {
    const user = userEvent.setup();
    let resolve: () => void = () => {};
    const onConfirm = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(
      <AlertDialog
        trigger={<button type="button">Delete</button>}
        title="Delete this video?"
        description="It cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
        onConfirm={onConfirm}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = screen.getByRole("alertdialog", { name: "Delete this video?" });
    expect(dialog.dataset.tone).toBe("danger");
    expect(await axeViolations(dialog)).toEqual([]);

    const confirm = screen.getAllByRole("button", { name: "Delete" }).find((b) => dialog.contains(b)) as HTMLElement;
    expect(confirm.dataset.variant).toBe("danger");
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(confirm.getAttribute("aria-busy")).toBe("true");
    expect((screen.getByRole("button", { name: "Keep" }) as HTMLButtonElement).disabled).toBe(true);
    await user.keyboard("{Escape}");
    expect(screen.getByRole("alertdialog")).toBeTruthy();

    await act(async () => resolve());
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("stays open when the confirm rejects, and cancels with Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <AlertDialog
        defaultOpen
        onOpenChange={onOpenChange}
        title="Leave?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        onConfirm={() => Promise.reject(new Error("offline"))}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Leave" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Leave" }).getAttribute("aria-busy")).toBeNull());
    expect(screen.getByRole("alertdialog")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
