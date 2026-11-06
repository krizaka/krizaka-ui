import { ProductLogo } from "@krizaka/ui";
import { EngineFlow } from "@krizaka/ui/engine-flow";

const ids = ["verikora", "folioviv"] as const;

// On a phone: the products in a row above, flowing down into the engine; the detail line names the chosen one.
export default function EngineFlowCompact() {
  return (
    <div style={{ maxWidth: 360 }}>
      <EngineFlow
        className="brand-sovkora"
        label="Sovkora and the products it powers"
        layout="top-to-bottom"
        compactLayout={false}
        hub={{ label: "Sovkora", mark: <ProductLogo id="sovkora" size={44} animated={false} /> }}
        hint="Tap a product."
        defaultActive="verikora"
        nodes={ids.map((id, i) => ({
          id,
          label: id[0]!.toUpperCase() + id.slice(1),
          className: `brand-${id}`,
          mark: <ProductLogo id={id} size={24} animated={false} />,
          flow: i < 1 ? "both" : "in",
          planned: i >= 1,
          description: i < 1 ? "Requests in, results back." : "Planned: not wired yet.",
        }))}
      />
    </div>
  );
}
