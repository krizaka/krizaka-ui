import { AnalysisReport, type AnalysisReportLabels } from "@krizaka/ui/analysis-report";

// The words come from the app's messages (demo wording here).
const labels: AnalysisReportLabels = {
  status: { inconsistent: "Fails", attention: "Check", unverified: "Unknown", consistent: "Passes" },
  findings: "Results", mayIndicate: "Could mean", location: "At:", evidence: "Proof", details: "More",
  limits: "Not examined", nextSteps: "What to do", provenance: "Origin",
  model: "Rules", runId: "Id", duration: "Time", version: "Build",
  copyJson: "JSON", copyMarkdown: "Markdown", copied: "Done", streaming: "Loading", noFindings: "Nothing.",
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
