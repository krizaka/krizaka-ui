import { GradeStamp } from "@krizaka/ui/grade-stamp";

// Lighthouse scores come out of 100: each becomes a grade out of 20, with its own source and remark.
const audit = { date: "2026-10-23", scores: [["Performance", 98, "Excellent"], ["Accessibility", 100, "Parfait"], ["SEO", 92, "Bien joué"]] as const };

export default function GradeStampLighthouse() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
      {audit.scores.map(([name, score, remark]) => (
        <GradeStamp key={name} value={score / 5} remark={remark} source={`Lighthouse ${name}, ${score}/100, ${audit.date}`} sourceLabel="Source" />
      ))}
    </div>
  );
}
