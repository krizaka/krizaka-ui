import { AnalysisReport, type AnalysisReportLabels } from "@krizaka/ui/analysis-report";

// The words come from the app's messages (demo wording here).
const labels: AnalysisReportLabels = {
  status: { inconsistent: "Altered", attention: "Doubtful", unverified: "Not checked", consistent: "Authentic" },
  findings: "Signs found",
  mayIndicate: "Could mean",
  location: "Seen at:",
  evidence: "Raw data",
  details: "More",
  limits: "Outside this check",
  nextSteps: "What to do",
  provenance: "Where this comes from",
  model: "Rules",
  runId: "Run id",
  duration: "Took",
  version: "Rules version",
  copyJson: "Copy as JSON",
  copyMarkdown: "Copy as Markdown",
  copied: "Copied to the clipboard",
  streaming: "Signs are arriving",
  noFindings: "No sign found.",
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
