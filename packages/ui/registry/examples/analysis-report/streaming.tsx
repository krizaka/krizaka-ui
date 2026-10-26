import { AnalysisReport, type AnalysisReportLabels } from "@krizaka/ui/analysis-report";

const labels: AnalysisReportLabels = {
  status: { inconsistent: "Inconsistent", attention: "Needs attention", unverified: "Not verified", consistent: "Consistent" },
  findings: "Findings", mayIndicate: "May indicate", location: "Where:", evidence: "Evidence", details: "Details",
  limits: "Limits", nextSteps: "Next steps", provenance: "Provenance", model: "Model", runId: "Run", duration: "Duration", version: "Version",
  copyJson: "Copy JSON", copyMarkdown: "Copy Markdown", copied: "Copied", streaming: "Findings are arriving", noFindings: "No finding yet.",
};

// While the run is open, `streaming` marks the report busy and announces each arrival politely; the actions can be hidden.
export default function AnalysisReportStreaming() {
  return (
    <AnalysisReport
      labels={labels}
      streaming
      hideActions
      title="Lease compliance"
      summary="Reading the lease, clause by clause…"
      status="unverified"
      findings={[{ id: "1", status: "consistent", code: "LEASE-TERM-001", title: "Term is 12 months", observation: "Start and end dates agree with the stated term.", location: "clause 3" }]}
    />
  );
}
