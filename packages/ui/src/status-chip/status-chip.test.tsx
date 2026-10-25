import { type StatusSet, undoOf } from "@krizaka/organize/contract";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { StatusChip } from "./index";

const label = (fr: string, en: string) => ({ fr, en });
const files: StatusSet = {
  key: "applicant-file",
  label: label("Dossier", "File"),
  mode: "editable",
  initial: "to-decide",
  states: [
    { key: "to-decide", label: label("À décider", "To decide"), tone: "accent" },
    { key: "selected", label: label("Retenu", "Selected"), tone: "success", final: true },
    { key: "declined", label: label("Non retenu", "Declined"), tone: "neutral", final: true },
  ],
  transitions: [
    { from: "to-decide", to: "selected", roles: ["owner"], confirm: true },
    { from: "to-decide", to: "declined", roles: ["owner"], reasons: [{ key: "incomplete", label: label("Dossier incomplet", "Incomplete file") }] },
  ],
};
const open = async (user: ReturnType<typeof userEvent.setup>) => {
  screen.getByRole("button").focus();
  await user.keyboard("{Enter}");
  return screen.findByRole("menu");
};

describe("StatusChip (#627)", () => {
  it("is read-only without onMove, for a role with no move, after a final state, and for a derived set", async () => {
    const derived: StatusSet = { ...files, mode: "derived" };
    const { container } = render(
      <>
        <StatusChip set={files} state="to-decide" role="owner" locale="en" />
        <StatusChip set={files} state="to-decide" role="viewer" locale="en" onMove={() => {}} />
        <StatusChip set={files} state="selected" role="owner" locale="en" onMove={() => {}} />
        <StatusChip set={derived} state="to-decide" role="owner" locale="en" onMove={() => {}} />
      </>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelectorAll("[data-status]")).toHaveLength(4);
    expect(screen.getByText("Selected").closest("[data-tone]")?.getAttribute("data-tone")).toBe("success");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("reads the label in the language of the person", () => {
    render(<StatusChip set={files} state="to-decide" role="viewer" locale="fr" />);
    expect(screen.getByText("À décider")).toBeTruthy();
  });

  it("shows the unknown state by its key instead of failing", () => {
    render(<StatusChip set={files} state="archived" role="owner" locale="en" />);
    expect(screen.getByText("archived")).toBeTruthy();
  });

  it("lists the moves of the role in the set's order, and a move without confirm runs at once", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    const set: StatusSet = { ...files, transitions: files.transitions.map((t) => ({ ...t, confirm: false, reasons: undefined })) };
    const { container } = render(<StatusChip set={set} state="to-decide" role="owner" locale="en" onMove={onMove} />);
    expect(screen.getByRole("button", { name: "Change the status, now To decide" })).toBeTruthy();
    const menu = await open(user);
    expect(within(menu).getAllByRole("menuitem").map((i) => i.textContent)).toEqual(["Selected", "Declined"]);
    await user.click(within(menu).getByRole("menuitem", { name: "Declined" }));
    expect(onMove).toHaveBeenCalledWith({ transition: expect.objectContaining({ from: "to-decide", to: "declined" }), reason: null });
    expect(await axeViolations(container)).toEqual([]);
  });

  it("asks for a second press when the move must be confirmed, and says so", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<StatusChip set={files} state="to-decide" role="owner" locale="en" onMove={onMove} />);
    const menu = await open(user);
    await user.click(within(menu).getByRole("menuitem", { name: "Selected" }));
    expect(onMove).not.toHaveBeenCalled();
    const second = await screen.findByRole("menuitem", { name: "Confirm: Selected" });
    await user.click(second);
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove.mock.calls[0]![0].transition.to).toBe("selected");
  });

  it("picks a reason from the list of the move (never typed)", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<StatusChip set={files} state="to-decide" role="owner" locale="fr" onMove={onMove} />);
    const menu = await open(user);
    const trigger = within(menu).getByRole("menuitem", { name: /Non retenu/ });
    trigger.focus();
    await user.keyboard("{ArrowRight}");
    await user.click(await screen.findByRole("menuitem", { name: "Dossier incomplet" }));
    expect(onMove).toHaveBeenCalledWith({ transition: expect.objectContaining({ to: "declined" }), reason: "incomplete" });
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("composes with the contract's undo: a move to a final state has none, a non-final one does", () => {
    expect(undoOf(files, { from: "to-decide", to: "selected" }, "owner")).toBeNull();
    const reversible: StatusSet = {
      ...files,
      states: files.states.map((s) => ({ ...s, final: false })),
      transitions: [...files.transitions, { from: "selected", to: "to-decide", roles: ["owner"] }],
    };
    expect(undoOf(reversible, { from: "to-decide", to: "selected" }, "owner")?.to).toBe("to-decide");
  });
});
