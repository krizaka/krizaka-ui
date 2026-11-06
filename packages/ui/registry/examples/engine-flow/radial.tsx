import { ProductLogo } from "@krizaka/ui";
import { EngineFlow } from "@krizaka/ui/engine-flow";

const products = [
  { id: "verikora", label: "Verikora", flow: "both", description: "Reads the lease and checks each passage." },
  { id: "folioviv", label: "Folioviv", flow: "in", planned: true, description: "The tax assistant, not wired yet." },
] as const;

// One engine at the hub, the products it powers around it: both ways where results come back, planned ones still.
export default function EngineFlowRadial() {
  return (
    <EngineFlow
      className="brand-sovkora"
      label="Sovkora and the products it powers"
      hub={{ label: "Sovkora", caption: "the engine", mark: <ProductLogo id="sovkora" size={56} animated={false} /> }}
      hint="Point at a product to see what it uses the engine for."
      defaultActive="verikora"
      nodes={products.map((p) => ({
        ...p,
        className: `brand-${p.id}`,
        mark: <ProductLogo id={p.id} size={32} animated={false} />,
        href: `https://dev.${p.id}.com`,
        linkLabel: `dev.${p.id}.com`,
        status: "planned" in p ? "planned" : undefined,
      }))}
    />
  );
}
