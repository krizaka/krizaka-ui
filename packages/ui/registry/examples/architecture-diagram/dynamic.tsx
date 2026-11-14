import { ArchitectureDiagram, type ArchView } from "@krizaka/ui/architecture-diagram";

/** A dynamic view: the edges are the steps of one flow, numbered in the model's order. */
const view = {
  id: "pr_life",
  title: "A pull request's life",
  dynamic: true,
  bounds: { x: 0, y: 0, width: 640, height: 400 },
  nodes: [
    { id: "agent", parent: null, kind: "person", shape: "person", title: "Agent", technology: null, description: "Writes the change and its tests.", compound: false, x: 0, y: 20, width: 200, height: 100 },
    { id: "ci", parent: null, kind: "external", shape: "rectangle", title: "CI", technology: "GitHub Actions", description: "Runs every check.", compound: false, x: 440, y: 20, width: 200, height: 100 },
    { id: "train", parent: null, kind: "container", shape: "queue", title: "Merge train", technology: "Python", description: "Lands green pull requests one by one.", compound: false, x: 210, y: 300, width: 220, height: 100 },
  ],
  edges: [
    { id: "step-01", source: "agent", target: "ci", label: "opens the pull request", points: [[200, 70], [280, 70], [360, 70], [440, 70]], labelBBox: { x: 248, y: 40, width: 170, height: 18 }, step: 1, back: false },
    { id: "step-02", source: "ci", target: "train", label: "reports green", points: [[540, 120], [540, 220], [480, 300], [430, 330]], labelBBox: { x: 500, y: 210, width: 110, height: 18 }, step: 2, back: false },
    { id: "step-03", source: "train", target: "agent", label: "merges, tells the agent", points: [[210, 350], [120, 330], [100, 200], [100, 120]], labelBBox: { x: 20, y: 220, width: 180, height: 18 }, step: 3, back: false },
  ],
} satisfies ArchView;

export default function DynamicExample() {
  return <ArchitectureDiagram view={view} subtitle="dynamic view" />;
}
