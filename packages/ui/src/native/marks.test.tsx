// The native brand marks: KrizakaMark, OrazakaMark, YomizakaMark, AkinazaMark, ProductMark.
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import * as React from "react";

import { AkinazaMark } from "./AkinazaMark";
import { KrizakaMark } from "./KrizakaMark";
import { OrazakaMark } from "./OrazakaMark";
import { ProductMark } from "./ProductMark";
import { YomizakaMark } from "./YomizakaMark";

describe("marks", () => {
  test.each([
    ["Krizaka", KrizakaMark],
    ["Orazaka", OrazakaMark],
    ["Yomizaka", YomizakaMark],
    ["Akinaza", AkinazaMark],
  ])("%s is an image with a title, hidden without one", async (name, Mark) => {
    await render(<Mark title={name} animated={false} />);
    expect(screen.getByRole("image", { name })).toBeOnTheScreen();
    await render(<Mark animated={false} />);
    expect(screen.queryByRole("image")).toBeNull();
  });

  test("ProductMark picks the mark by id", async () => {
    await render(<ProductMark id="orazaka" title="Orazaka" size={24} />);
    expect(screen.getByRole("image", { name: "Orazaka" })).toBeOnTheScreen();
    await render(<ProductMark id="yomizaka" title="Yomizaka" size={24} />);
    expect(screen.getByRole("image", { name: "Yomizaka" })).toBeOnTheScreen();
    await render(<ProductMark id="akinaza" title="Akinaza" size={24} />);
    expect(screen.getByRole("image", { name: "Akinaza" })).toBeOnTheScreen();
    await render(<ProductMark id="krizaka" title="Krizaka" />);
    expect(screen.getByRole("image", { name: "Krizaka" })).toBeOnTheScreen();
  });
});
