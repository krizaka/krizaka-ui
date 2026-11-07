import { ChatShowcase } from "@krizaka/orazaka-design-system";

// Eric, finance lead, asks about a contract: the engine answers on premises, nothing leaves.
export default function SovereignAnswer() {
  return (
    <ChatShowcase
      labels={{
        agent: "Orazaka · Finance desk",
        status: "On premises · online",
        model: "llama-3.1-70b",
        routed: "Answered locally",
        privacy: "0 bytes left your network",
        placeholder: "Ask about your documents…",
      }}
      question="Eric here — which supplier contracts renew before March, and at what notice?"
      answer="Three renew before March: Northwind (90 days' notice, by Dec 2), Calder Logistics (60 days, by Jan 4) and Ivo Print (30 days, by Feb 1). Northwind's clause also caps the increase at 3 %."
      pipeline={["PII masked", "Policy checked", "Routed locally", "Cited 3 contracts"]}
    />
  );
}
