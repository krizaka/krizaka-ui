// The native brand marks: KrizakaMark, OrazakaMark, OrochiaMark, YasakiaMark, YororisMark, ProductMark.
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import * as React from "react";

import { KrizakaMark } from "./KrizakaMark";
import { OrazakaMark } from "./OrazakaMark";
import { OrochiaMark } from "./OrochiaMark";
import { ProductMark } from "./ProductMark";
import { YasakiaMark } from "./YasakiaMark";
import { YororisMark } from "./YororisMark";

describe("marks", () => {
  test.each([
    ["Krizaka", KrizakaMark],
    ["Orazaka", OrazakaMark],
    ["Orochia", OrochiaMark],
    ["Yasakia", YasakiaMark],
    ["Yororis", YororisMark],
  ])("%s is an image with a title, hidden without one", async (name, Mark) => {
    await render(<Mark title={name} animated={false} />);
    expect(screen.getByRole("image", { name })).toBeOnTheScreen();
    await render(<Mark animated={false} />);
    expect(screen.queryByRole("image")).toBeNull();
  });

  test("ProductMark picks the mark by id", async () => {
    await render(<ProductMark id="orazaka" title="Orazaka" size={24} />);
    expect(screen.getByRole("image", { name: "Orazaka" })).toBeOnTheScreen();
    await render(<ProductMark id="yasakia" title="Yasakia" size={24} />);
    expect(screen.getByRole("image", { name: "Yasakia" })).toBeOnTheScreen();
    await render(<ProductMark id="yororis" title="Yororis" size={24} />);
    expect(screen.getByRole("image", { name: "Yororis" })).toBeOnTheScreen();
    await render(<ProductMark id="krizaka" title="Krizaka" />);
    expect(screen.getByRole("image", { name: "Krizaka" })).toBeOnTheScreen();
  });
});
