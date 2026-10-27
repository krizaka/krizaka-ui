import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { axeViolations } from "../test/axe";
import { EntityHeader } from "./index";

describe("EntityHeader", () => {
  it("is plain text when nothing can change it", async () => {
    const { container } = render(<EntityHeader name="Spring" description="March to May" tags={[{ id: "1", label: "Seasonal", marker: "blue" }]} tagsLabel="Tags" />);
    expect(screen.getByRole("heading", { level: 1, name: "Spring" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("list", { name: "Tags" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renames in place: Enter saves the trimmed name, Escape gives it back", async () => {
    const onNameChange = vi.fn();
    const { container } = render(<EntityHeader name="Spring" nameLabel="Rename" onNameChange={onNameChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Rename/ }));
    const field = screen.getByRole("textbox", { name: /Rename/ });
    fireEvent.change(field, { target: { value: "  Summer " } });
    fireEvent.keyDown(field, { key: "Enter" });
    await waitFor(() => expect(onNameChange).toHaveBeenCalledWith("Summer"));
    expect(await axeViolations(container)).toEqual([]);

    fireEvent.click(screen.getByRole("button", { name: /Rename/ }));
    const again = screen.getByRole("textbox", { name: /Rename/ });
    fireEvent.change(again, { target: { value: "Other" } });
    fireEvent.keyDown(again, { key: "Escape" });
    expect(screen.getByRole("button", { name: /Rename/ })).toBeTruthy();
    expect(onNameChange).toHaveBeenCalledTimes(1);
  });

  it("keeps the field open and says a refusal code in the product's words", async () => {
    const onNameChange = vi.fn(async () => {
      throw Object.assign(new Error("taken"), { code: "NAME_TAKEN" });
    });
    const { container } = render(<EntityHeader name="Spring" nameLabel="Rename" onNameChange={onNameChange} refusals={{ NAME_TAKEN: "Name already used.", DEFAULT_COLLECTION: "Not this one." }} />);
    fireEvent.click(screen.getByRole("button", { name: /Rename/ }));
    const field = screen.getByRole("textbox", { name: /Rename/ });
    fireEvent.change(field, { target: { value: "Archive" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect((await screen.findByRole("alert")).textContent).toBe("Name already used.");
    expect(screen.getByRole("textbox", { name: /Rename/ })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("says a refusal passed by the page, and nothing for a code without words", () => {
    const { rerender } = render(<EntityHeader name="Spring" refusal={{ code: "DEFAULT_COLLECTION" }} refusals={{ DEFAULT_COLLECTION: "The default one stays." }} />);
    expect(screen.getByRole("alert").textContent).toBe("The default one stays.");
    rerender(<EntityHeader name="Spring" refusal={{ code: "STALE" }} refusals={{ DEFAULT_COLLECTION: "x" }} />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("does not save an empty name", () => {
    const onNameChange = vi.fn();
    render(<EntityHeader name="Spring" nameLabel="Rename" onNameChange={onNameChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Rename/ }));
    const field = screen.getByRole("textbox", { name: /Rename/ });
    fireEvent.change(field, { target: { value: "   " } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onNameChange).not.toHaveBeenCalled();
  });
});

describe("EntityHeader tags", () => {
  it("lets the viewer remove a tag when asked to", () => {
    const onTagRemove = vi.fn();
    render(<EntityHeader name="Spring" tags={[{ id: "1", label: "Seasonal", marker: "blue" }]} onTagRemove={onTagRemove} tagRemoveLabel={(l) => `Remove ${l}`} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove Seasonal" }));
    expect(onTagRemove).toHaveBeenCalledWith("1");
  });
});
