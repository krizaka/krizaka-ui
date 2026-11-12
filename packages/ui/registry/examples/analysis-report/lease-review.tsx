import { AnalysisReport, type AnalysisReportLabels } from "@krizaka/ui/analysis-report";

// The words come from the app's messages (demo wording here).
const labels: AnalysisReportLabels = {
  status: { inconsistent: "Not compliant", attention: "To check", unverified: "Not applicable", consistent: "Respected" },
  findings: "Findings", mayIndicate: "May indicate", location: "Where:", evidence: "Evidence", details: "Details",
  limits: "What this report did not examine", nextSteps: "Next steps", provenance: "Provenance",
  model: "Ruleset", runId: "Run", duration: "Duration", version: "Version",
  copyJson: "Copy JSON", copyMarkdown: "Copy Markdown", copied: "Copied", streaming: "Findings are arriving", noFindings: "No finding.",
};

export default function AnalysisReportLeaseReview() {
  return (
    <AnalysisReport
      labels={labels}
      title="Lease review"
      summary="One clause goes against the Civil Code; two others are worth a second look."
      status="inconsistent"
      folded={["consistent", "unverified"]}
      provenanceFolded
      hideActions
      findings={[
        { id: "1", status: "inconsistent", title: "Deposit requested", quote: "The tenant pays a deposit of one month's rent on signing.", reference: { label: "C.c.Q., art. 1904, al. 1", href: "https://www.legisquebec.gouv.qc.ca/en/document/cs/CCQ-1991" }, location: "clause 6" },
        { id: "2", status: "attention", title: "Notice to change the rent", quote: "The landlord may revise the rent with a notice of 30 days.", reference: { label: "C.c.Q., art. 1942" }, location: "clause 9" },
        { id: "3", status: "consistent", title: "Term of the lease", quote: "The lease runs for twelve months from July 1.", reference: { label: "C.c.Q., art. 1851" } },
        { id: "4", status: "unverified", title: "Parking space", observation: "The lease does not mention a parking space." },
      ]}
      limits={["The building's by-laws were not provided."]}
      nextSteps={["Ask the landlord to remove the deposit clause."]}
      provenance={{ model: "lease-rules", runId: "run_5c20be", version: "2026.11" }}
    />
  );
}
