import { ComparisonTable } from "@krizaka/ui/comparison-table";

const dot = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.4" fill="currentColor" /></svg>;

// A fair comparison: the cloud answers stay neutral, yours is the highlighted band; on a phone, one card per question.
export default function ComparisonTableVersus() {
  return (
    <ComparisonTable
      label="The same AI. Different ownership."
      topicLabel="Question"
      highlight="orazaka"
      columns={[{ id: "cloud", label: "A cloud assistant", icon: dot }, { id: "orazaka", label: "Orazaka", icon: dot }]}
      rows={[
        { id: "where", icon: dot, topic: "Where do your prompts go?", answers: { cloud: { key: "To a provider's servers,", detail: "under their terms." }, orazaka: { key: "To your machines.", detail: "A cloud model only if you connect one." } } },
        { id: "pay", icon: dot, topic: "What do you pay?", answers: { cloud: { key: "Per seat and per token,", detail: "on their price list." }, orazaka: { key: "Your hardware and credits.", detail: "A Studio shows its estimate before it runs." } } },
        { id: "who", icon: dot, topic: "Who decides?", answers: { cloud: { key: "The vendor", detail: "changes models, limits and policies." }, orazaka: { key: "You do:", detail: "models, roles and what each team can run." } } },
      ]}
    />
  );
}
