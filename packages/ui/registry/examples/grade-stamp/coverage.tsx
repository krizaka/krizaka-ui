import { GradeStamp } from "@krizaka/ui/grade-stamp";

// The grade is computed from the measure, never typed: 94.1 % of lines covered → 18.8 out of 20.
const coverage = { percent: 94.1, source: "Vitest coverage report, lines, 2026-10-23" };

export default function GradeStampCoverage() {
  return <GradeStamp value={Math.round((coverage.percent / 100) * 20 * 10) / 10} outOf={20} remark="Très bien, continue" source={coverage.source} />;
}
