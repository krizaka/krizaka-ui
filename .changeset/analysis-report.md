---
"@krizaka/ui": minor
---

`@krizaka/ui/analysis-report` (web) and `AnalysisReport` in `@krizaka/ui/native`: the result of an AI analysis — a header with the studio, one sentence, the overall status and counts; findings grouped by status (the most serious first) with what was observed, what it may indicate, a location (`onLocate`) and folded evidence; the limits and the next steps; the provenance; copy as JSON or Markdown (`onCopy` hands the text to the app on the phone). `streaming` announces findings as they arrive. Words arrive through `labels`. Rules exported: `groupFindings`, `countByStatus`, `reportToJson`, `reportToMarkdown` (krizaka-ui#210).
