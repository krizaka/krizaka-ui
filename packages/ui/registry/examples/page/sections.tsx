import { Section } from "@krizaka/ui/page";

// Sections on one rhythm, in one frame: the same edges at every width. The hairline (`divider`) is the transition.
export default function PageSections() {
  return (
    <div className="w-full">
      <Section id="why" eyebrow="Why" title="Nothing leaves your servers" lead="Inference runs on your hardware; nothing calls home." spacing="sm">
        <p className="text-sm text-fg-secondary">Local models by default, one governed pipeline, zero telemetry.</p>
      </Section>
      <Section id="how" eyebrow="How" title="One pipeline, every request" spacing="sm" divider>
        <p className="text-sm text-fg-secondary">Every request crosses the same interceptors, in the same order.</p>
      </Section>
    </div>
  );
}
