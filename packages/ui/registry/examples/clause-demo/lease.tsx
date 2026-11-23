import { ClauseDemo } from "@krizaka/ui/clause-demo";

// The visitor touches a line and reads what the recorded check said of it; it opens on the line to check.
export default function ClauseDemoLease() {
  return (
    <ClauseDemo
      title="Touch a clause."
      tag="Fictional lease"
      lines={[
        { id: "rent", text: "The rent is paid on the first day.", finding: { verdict: "Fine", tone: "success", title: "Nothing to change.", reference: "Art. 1903" } },
        {
          id: "deposit",
          text: "A deposit of two months of rent.",
          finding: { verdict: "To check", tone: "danger", title: "A deposit cannot be asked for.", quote: "two months of rent", reference: "Art. 1904" },
        },
        { id: "keys", text: "The keys are given on the first day." },
      ]}
    />
  );
}
