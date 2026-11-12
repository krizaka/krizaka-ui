import { AnalysisReport, type AnalysisReportLabels } from "@krizaka/ui/analysis-report";

// The words come from the app's messages (demo wording here).
const labels: AnalysisReportLabels = {
  status: { inconsistent: "Altered", attention: "Doubtful", unverified: "Not checked", consistent: "Authentic" },
  findings: "Findings", mayIndicate: "May indicate", location: "Where:", evidence: "Evidence", details: "Details",
  limits: "What this report did not examine", nextSteps: "Next steps", provenance: "Provenance",
  model: "Ruleset", runId: "Run", duration: "Duration", version: "Version",
  copyJson: "Copy JSON", copyMarkdown: "Copy Markdown", copied: "Copied", streaming: "Findings are arriving", noFindings: "No finding.",
};

// Three levels of authenticity map to the existing statuses: authentic → consistent, doubtful → attention, altered → inconsistent.
export default function AnalysisReportAuthenticity() {
  return (
    <AnalysisReport
      labels={labels}
      title="Authenticity check"
      summary="The pay stub shows one sign of alteration and one doubtful detail."
      status="inconsistent"
      folded={["consistent"]}
      provenanceFolded
      hideActions
      findings={[
        { id: "1", status: "inconsistent", title: "Amount edited", quote: "Net pay: 2 480,00 $", observation: "The digits sit on a different background than the line around them.", mayIndicate: "A retouched figure. Not proof of fraud.", location: "page 1" },
        { id: "2", status: "attention", title: "Employer name spacing", quote: "Atelier Dumont inc.", location: "header" },
        { id: "3", status: "consistent", title: "File history", observation: "One save, by the issuing software." },
      ]}
      limits={["The employer was not contacted."]}
      nextSteps={["Ask for the original from the employer."]}
      provenance={{ model: "authenticity-rules", runId: "run_77d1a0", version: "1.0.0" }}
    />
  );
}
