import { ProductLogo } from "@krizaka/ui";
import { EngineFlow } from "@krizaka/ui/engine-flow";

const ids = ["verikora", "folioviv"] as const;

// The calm level, in a small tile: the photons and the breath run at a low rate, nothing to tune, nothing to read.
export default function EngineFlowCalm() {
  return (
    <div style={{ maxWidth: 420 }}>
      <EngineFlow
        calm
        className="brand-sovkora"
        label="Sovkora and the products it powers"
        hub={{ label: "Sovkora", mark: <ProductLogo id="sovkora" size={44} animated={false} /> }}
        nodes={ids.map((id) => ({
          id,
          label: id[0]!.toUpperCase() + id.slice(1),
          flow: "both" as const,
          className: `brand-${id}`,
          mark: <ProductLogo id={id} size={26} animated={false} />,
        }))}
      />
    </div>
  );
}
