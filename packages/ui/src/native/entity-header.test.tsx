// EntityHeader on React Native: the name edits in place, a refusal code is said in the product's words.
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";

import { EntityHeader } from "./entity-header";

afterEach(async () => cleanup());

describe("EntityHeader (native)", () => {
  test("is text without onNameChange", async () => {
    await render(<EntityHeader name="Spring" />);
    expect(screen.getByText("Spring")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  test("renames in place and says a refusal in words", async () => {
    const onNameChange = jest.fn(async (name: string) => {
      if (name === "Archive") throw Object.assign(new Error("taken"), { code: "NAME_TAKEN" });
    });
    await render(<EntityHeader name="Spring" nameLabel="Rename" onNameChange={onNameChange} refusals={{ NAME_TAKEN: "Name already used." }} />);
    await fireEvent.press(screen.getByRole("button", { name: /Rename/ }));
    await fireEvent.changeText(screen.getByLabelText("Rename"), "Archive");
    await fireEvent(screen.getByLabelText("Rename"), "submitEditing");
    expect(await screen.findByText("Name already used.")).toBeTruthy();
    expect(onNameChange).toHaveBeenCalledWith("Archive");
  });
});
