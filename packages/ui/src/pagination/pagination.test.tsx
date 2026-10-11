import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { pageRange,Pagination } from "./index";

describe("pageRange", () => {
  it("keeps the ends, the current page and its siblings, and folds the rest", () => {
    expect(pageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageRange(6, 20)).toEqual([1, "…", 5, 6, 7, "…", 20]);
    expect(pageRange(3, 20)).toEqual([1, 2, 3, 4, "…", 20]);
    expect(pageRange(10, 20, 2, 2)).toEqual([1, 2, "…", 8, 9, 10, 11, 12, "…", 19, 20]);
  });
});

describe("Pagination", () => {
  it("is a named navigation with the current page marked, with no axe violation", async () => {
    const { container } = render(<Pagination page={4} pageCount={20} onPageChange={() => undefined} labels={{ nav: "Pages of results" }} />);
    expect(screen.getByRole("navigation", { name: "Pages of results" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Page 4" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByText("Page 4 of 20")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves with the keyboard and disables what leads nowhere", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />);
    expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Page 1" }));
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    screen.getByRole("button", { name: "Next" }).focus();
    await user.keyboard(" ");
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it("renders links when the page lives in the address, the unavailable one without href", () => {
    render(<Pagination page={1} pageCount={9} getHref={(p) => `/explore?page=${p}`} />);
    expect(screen.getByRole("link", { name: "Page 2" }).getAttribute("href")).toBe("/explore?page=2");
    const previous = screen.getByRole("link", { name: "Previous" });
    expect(previous.getAttribute("href")).toBeNull();
    expect(previous.getAttribute("aria-disabled")).toBe("true");
  });

  it("works on a cursor and changes the page size", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const onPageSizeChange = vi.fn();
    render(<Pagination hasNext onNext={onNext} status="Jobs 1–25" pageSize={20} pageSizeOptions={[10, 20]} onPageSizeChange={onPageSizeChange} />);
    expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onNext).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /^Page / })).toBeNull();
    await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "10");
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });
});
