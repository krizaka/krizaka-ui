// The native brand marks: KrizakaMark, SovkoraMark, VerikoraMark, FoliovivMark, ProductMark.
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import * as React from "react";

import { FoliovivMark } from "./FoliovivMark";
import { KrizakaMark } from "./KrizakaMark";
import { ProductMark } from "./ProductMark";
import { SovkoraMark } from "./SovkoraMark";
import { VerikoraMark } from "./VerikoraMark";

describe("marks", () => {
  test.each([
    ["Krizaka", KrizakaMark],
    ["Sovkora", SovkoraMark],
    ["Verikora", VerikoraMark],
    ["Folioviv", FoliovivMark],
  ])("%s is an image with a title, hidden without one", async (name, Mark) => {
    await render(<Mark title={name} animated={false} />);
    expect(screen.getByRole("image", { name })).toBeOnTheScreen();
    await render(<Mark animated={false} />);
    expect(screen.queryByRole("image")).toBeNull();
  });

  test("ProductMark picks the mark by id", async () => {
    await render(<ProductMark id="sovkora" title="Sovkora" size={24} />);
    expect(screen.getByRole("image", { name: "Sovkora" })).toBeOnTheScreen();
    await render(<ProductMark id="verikora" title="Verikora" size={24} />);
    expect(screen.getByRole("image", { name: "Verikora" })).toBeOnTheScreen();
    await render(<ProductMark id="folioviv" title="Folioviv" size={24} />);
    expect(screen.getByRole("image", { name: "Folioviv" })).toBeOnTheScreen();
    await render(<ProductMark id="krizaka" title="Krizaka" />);
    expect(screen.getByRole("image", { name: "Krizaka" })).toBeOnTheScreen();
  });
});
