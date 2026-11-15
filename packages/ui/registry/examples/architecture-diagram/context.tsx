import { ArchitectureDiagram, type ArchView } from "@krizaka/ui/architecture-diagram";

/** A context view as @krizaka/architecture lays it out: who uses the system, and what it relies on outside. */
const view = {
  id: "blog_context",
  title: "The blog · context",
  dynamic: false,
  bounds: { x: 0, y: 0, width: 520, height: 470 },
  nodes: [
    { id: "reader", parent: null, kind: "person", shape: "person", title: "Reader", technology: null, description: "Reads the posts on a phone or a laptop.", compound: false, x: 150, y: 0, width: 220, height: 100 },
    { id: "blog", parent: null, kind: "system", shape: "browser", title: "Blog", technology: "Next.js, static export", description: "Publishes the posts and their diagrams.", compound: false, x: 130, y: 180, width: 260, height: 110 },
    { id: "cdn", parent: null, kind: "external", shape: "storage", title: "Media CDN", technology: "Bunny", description: "Serves the images and the fonts.", compound: false, x: 150, y: 370, width: 220, height: 100 },
  ],
  edges: [
    { id: "reads", source: "reader", target: "blog", label: "reads", points: [[260, 100], [260, 127], [260, 153], [260, 180]], labelBBox: { x: 272, y: 131, width: 44, height: 18 }, step: null, back: false },
    { id: "loads", source: "blog", target: "cdn", label: "loads images from", points: [[260, 290], [260, 317], [260, 343], [260, 370]], labelBBox: { x: 272, y: 321, width: 140, height: 18 }, step: null, back: false },
  ],
} satisfies ArchView;

export default function ContextExample() {
  return <ArchitectureDiagram view={view} subtitle="C4 · level 1" links={{ blog: "https://blog.krizaka.com" }} />;
}
