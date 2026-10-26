import { fireEvent, render, screen } from "@testing-library/react";

import DocumentValidation from "../../registry/examples/analysis-report/document-validation";
import { axeViolations } from "../test/axe";
import { AnalysisReport, type AnalysisReportData, type AnalysisReportLabels,countByStatus, groupFindings, reportToJson, reportToMarkdown } from "./index";

const labels: AnalysisReportLabels = {
  status: { inconsistent: "Inconsistent", attention: "Attention", unverified: "Unverified", consistent: "Consistent" },
  findings: "Findings", mayIndicate: "May indicate", location: "Where:", evidence: "Evidence", details: "Details",
  limits: "Limits", nextSteps: "Next steps", provenance: "Provenance", model: "Model", runId: "Run", duration: "Duration", version: "Version",
  copyJson: "Copy JSON", copyMarkdown: "Copy Markdown", copied: "Copied", streaming: "Arriving", noFindings: "No finding.",
};
const report: AnalysisReportData = {
  title: "Doc check",
  summary: "One thing to read.",
  status: "attention",
  findings: [
    { id: "a", status: "consistent", title: "Pages match" },
    { id: "b", status: "inconsistent", code: "X-1", title: "Edited after signing", mayIndicate: "An edit. Not proof.", location: "page 2", evidence: "ModDate: later" },
    { id: "c", status: "attention", title: "Odd font" },
  ],
  limits: ["Signatures not compared"],
  nextSteps: ["Ask for the original"],
  provenance: { model: "demo", runId: "run_1" },
};

describe("report rules", () => {
  it("groups the most serious first and leaves empty groups out", () => {
    expect(groupFindings(report.findings).map((g) => g.status)).toEqual(["inconsistent", "attention", "consistent"]);
  });
  it("counts by status, zero included", () => {
    expect(countByStatus(report.findings)).toEqual({ inconsistent: 1, attention: 1, unverified: 0, consistent: 1 });
  });
  it("exports JSON that round-trips and Markdown in the page's order", () => {
    expect(JSON.parse(reportToJson(report))).toEqual(report);
    const md = reportToMarkdown(report, labels);
    expect(md.indexOf("## Inconsistent")).toBeLessThan(md.indexOf("## Consistent"));
    expect(md).toContain("### `X-1` · Edited after signing");
    expect(md).toContain("**May indicate** An edit. Not proof.");
    expect(md).toContain("- Model: demo");
  });
});

describe("AnalysisReport", () => {
  it("shows the summary, the status counts, the groups, the limits and the provenance, with no axe violation", async () => {
    const { container } = render(<AnalysisReport {...report} labels={labels} />);
    expect(screen.getByRole("region", { name: "Doc check" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Inconsistent · 1" })).toBeTruthy();
    expect(screen.getByText("Signatures not compared")).toBeTruthy();
    expect(screen.getByLabelText("Provenance").textContent).toContain("run_1");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("the documented example is accessible", async () => {
    const { container } = render(<DocumentValidation />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("copies JSON and Markdown, says so politely, and hands the text to onCopy", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const onCopy = vi.fn();
    render(<AnalysisReport {...report} labels={labels} onCopy={onCopy} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy Markdown" }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("# Doc check"));
    expect(onCopy).toHaveBeenCalledWith("markdown", expect.stringContaining("## Inconsistent"));
    expect(await screen.findByText("Copied")).toBeTruthy();
  });

  it("makes a location a button only when onLocate is given", () => {
    const onLocate = vi.fn();
    const { rerender } = render(<AnalysisReport {...report} labels={labels} />);
    expect(screen.queryByRole("button", { name: /Where: page 2/ })).toBeNull();
    rerender(<AnalysisReport {...report} labels={labels} onLocate={onLocate} />);
    fireEvent.click(screen.getByRole("button", { name: /Where: page 2/ }));
    expect(onLocate).toHaveBeenCalledWith(expect.objectContaining({ id: "b" }));
  });

  it("while streaming: busy, announced, no empty message, actions hideable", () => {
    const { container } = render(<AnalysisReport {...report} findings={[]} labels={labels} streaming hideActions />);
    expect(container.querySelector("section")?.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("status").textContent).toBe("Arriving");
    expect(screen.queryByText("No finding.")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("says when there is no finding", () => {
    render(<AnalysisReport {...report} findings={[]} labels={labels} />);
    expect(screen.getByText("No finding.")).toBeTruthy();
  });
});
