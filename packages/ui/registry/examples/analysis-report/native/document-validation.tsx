import { AnalysisReport, type AnalysisReportLabels } from "@krizaka/ui/native";
import { View } from "react-native";

const labels: AnalysisReportLabels = {
  status: { inconsistent: "Inconsistent", attention: "Needs attention", unverified: "Not verified", consistent: "Consistent" },
  findings: "Findings", mayIndicate: "May indicate", location: "Where:", evidence: "Evidence", details: "Details",
  limits: "What this report did not examine", nextSteps: "Next steps", provenance: "Provenance",
  model: "Model", runId: "Run", duration: "Duration", version: "Version",
  copyJson: "Copy JSON", copyMarkdown: "Copy Markdown", copied: "Copied", streaming: "Findings are arriving", noFindings: "No finding.",
};

// The phone has no clipboard here: `onCopy` receives the text and the app copies it (expo-clipboard).
export default function NativeAnalysisReportDocumentValidation() {
  return (
    <View style={{ width: 360 }}>
      <AnalysisReport
        labels={labels}
        title="Document validation"
        summary="Two signals disagree with the document's own dates."
        status="inconsistent"
        findings={[
          { id: "1", status: "inconsistent", code: "PDF-META-002", title: "Modified after it was signed", observation: "The file was saved 12 days after the signature date.", mayIndicate: "An edit after signing. Not proof of tampering.", location: "metadata" },
          { id: "2", status: "consistent", code: "PDF-PAGE-001", title: "Page count matches", observation: "4 pages, as the footer says." },
        ]}
        limits={["Handwritten signatures were not compared."]}
        nextSteps={["Ask the sender for the original file."]}
        provenance={{ model: "demo-model-1", runId: "run_8f3a21" }}
        onCopy={() => undefined}
      />
    </View>
  );
}
