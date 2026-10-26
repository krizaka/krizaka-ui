import { AnalysisReport, type AnalysisReportLabels } from "@krizaka/ui/analysis-report";

// The words come from the app's messages (demo wording here).
const labels: AnalysisReportLabels = {
  status: { inconsistent: "Inconsistent", attention: "Needs attention", unverified: "Not verified", consistent: "Consistent" },
  findings: "Findings", mayIndicate: "May indicate", location: "Where:", evidence: "Evidence", details: "Details",
  limits: "What this report did not examine", nextSteps: "Next steps", provenance: "Provenance",
  model: "Model", runId: "Run", duration: "Duration", version: "Version",
  copyJson: "Copy JSON", copyMarkdown: "Copy Markdown", copied: "Copied", streaming: "Findings are arriving", noFindings: "No finding.",
};

export default function AnalysisReportDocumentValidation() {
  return (
    <AnalysisReport
      labels={labels}
      title="Document validation"
      summary="Two signals disagree with the document's own dates."
      status="inconsistent"
      findings={[
        { id: "1", status: "inconsistent", code: "PDF-META-002", title: "Modified after it was signed", observation: "The file was saved 12 days after the signature date.", mayIndicate: "An edit after signing, or a re-export. Not proof of tampering.", location: "metadata", evidence: "CreationDate: 2026-03-02\nModDate: 2026-03-14" },
        { id: "2", status: "attention", code: "PDF-FONT-001", title: "Two fonts on one line", observation: "A single line mixes two typefaces.", location: "page 2" },
        { id: "3", status: "consistent", code: "PDF-PAGE-001", title: "Page count matches", observation: "4 pages, as the footer says." },
      ]}
      limits={["Handwritten signatures were not compared.", "The sender's identity was not checked."]}
      nextSteps={["Ask the sender for the original file.", "Compare with the copy on record."]}
      provenance={{ model: "demo-model-1", runId: "run_8f3a21", duration: "4.2 s", version: "1.3.0" }}
    />
  );
}
