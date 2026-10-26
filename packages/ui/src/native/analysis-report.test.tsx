// AnalysisReport on React Native: findings grouped, copy handed to the app, evidence unfolds.
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";

import { AnalysisReport, type AnalysisReportLabels } from "./analysis-report";

afterEach(async () => cleanup());

const labels: AnalysisReportLabels = {
  status: { inconsistent: "Inconsistent", attention: "Attention", unverified: "Unverified", consistent: "Consistent" },
  findings: "Findings", mayIndicate: "May indicate", location: "Where:", evidence: "Evidence", details: "Details",
  limits: "Limits", nextSteps: "Next steps", provenance: "Provenance", model: "Model", runId: "Run", duration: "Duration", version: "Version",
  copyJson: "Copy JSON", copyMarkdown: "Copy Markdown", copied: "Copied", streaming: "Arriving", noFindings: "No finding.",
};
const base = {
  title: "Doc check",
  summary: "One thing to read.",
  status: "attention" as const,
  findings: [
    { id: "a", status: "consistent" as const, title: "Pages match" },
    { id: "b", status: "inconsistent" as const, title: "Edited after signing", location: "page 2", evidence: "ModDate: later" },
  ],
  limits: ["Signatures not compared"],
  labels,
};

describe("AnalysisReport (native)", () => {
  test("groups the most serious first and shows limits", async () => {
    await render(<AnalysisReport {...base} />);
    expect(screen.getByText("Inconsistent · 1")).toBeTruthy();
    expect(screen.getByText("• Signatures not compared")).toBeTruthy();
  });

  test("hands the export text to the app", async () => {
    const onCopy = jest.fn();
    await render(<AnalysisReport {...base} onCopy={onCopy} />);
    await fireEvent.press(screen.getByText("Copy JSON"));
    expect(onCopy).toHaveBeenCalledWith("json", expect.stringContaining('"title": "Doc check"'));
  });

  test("unfolds the evidence and calls onLocate", async () => {
    const onLocate = jest.fn();
    await render(<AnalysisReport {...base} onLocate={onLocate} />);
    expect(screen.queryByText("ModDate: later")).toBeNull();
    await fireEvent.press(screen.getByText("Evidence"));
    expect(screen.getByText("ModDate: later")).toBeTruthy();
    await fireEvent.press(screen.getByText("Where: page 2"));
    expect(onLocate).toHaveBeenCalledWith(expect.objectContaining({ id: "b" }));
  });
});
