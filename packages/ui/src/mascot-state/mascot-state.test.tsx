import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { ErrorState, LoadingState, MascotState, SuccessState } from "./index";

describe("MascotState", () => {
  it("is a status with its words, the bird hidden, no axe violation", async () => {
    const { container } = render(
      <MascotState bird="pigeon" framed title="No messages yet" description="Start a conversation." action={<button type="button">Find creators</button>} />,
    );
    const status = screen.getByRole("status");
    expect(status.textContent).toContain("No messages yet");
    expect(status.textContent).toContain("Start a conversation.");
    expect(status.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("button", { name: "Find creators" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("an error is an alert, a long task is busy, a success a status", () => {
    const { unmount } = render(<ErrorState title="It failed" titleAs="h1" />);
    expect(screen.getByRole("alert").getAttribute("data-mood")).toBe("error");
    expect(screen.getByRole("heading", { level: 1, name: "It failed" })).toBeTruthy();
    unmount();
    render(<LoadingState title="Building" />);
    expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("true");
    render(<SuccessState title="Paid" />);
    expect(screen.getAllByRole("status")[1]?.getAttribute("data-mood")).toBe("success");
  });

  it("stages nothing when not animated, and lets the product's className win", () => {
    render(<MascotState title="Nothing" animated={false} framed className="py-4" />);
    const root = screen.getByRole("status");
    expect(root.hasAttribute("data-kzms-staged")).toBe(false);
    expect(root.querySelector(":scope > style")).toBeNull();
    expect(root.className.split(" ")).toContain("py-4");
    expect(root.className.split(" ")).not.toContain("py-10");
  });
});
