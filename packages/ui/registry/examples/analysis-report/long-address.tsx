import { AnalysisReport, type AnalysisReportLabels } from "@krizaka/ui/analysis-report";

// The words come from the app's messages (demo wording here).
const labels: AnalysisReportLabels = {
  status: { inconsistent: "Not compliant", attention: "To check", unverified: "Not applicable", consistent: "Respected" },
  findings: "Findings", mayIndicate: "May indicate", location: "Where:", evidence: "Evidence", details: "Details",
  limits: "What this report did not examine", nextSteps: "Next steps", provenance: "Provenance",
  model: "Ruleset", runId: "Run", duration: "Duration", version: "Version",
  copyJson: "Copy JSON", copyMarkdown: "Copy Markdown", copied: "Copied", streaming: "Findings are arriving", noFindings: "No finding.",
};


const address = "1234-rue-Sainte-Catherine-Ouest-appartement-5-Montreal-Quebec-H3B1A7-Canada-adresse-du-logement-loue-sans-espace-ni-tiret-final";

// A token with no space (an address, a URL, an identifier) wraps inside the card instead of leaving the screen.
export default function AnalysisReportLongAddress() {
  return (
    <AnalysisReport
      labels={labels}
      title="Lease review"
      summary="The address of the dwelling is read as one long token."
      status="attention"
      hideActions
      findings={[{ id: "1", status: "attention", title: "Address to confirm", observation: address, quote: address, reference: { label: address } }]}
    />
  );
}
