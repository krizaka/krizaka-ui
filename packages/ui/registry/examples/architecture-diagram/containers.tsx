import { ArchitectureDiagram, type ArchView } from "@krizaka/ui/architecture-diagram";

/** A container view: the system is a group (a compound node) and its containers sit inside it. */
const view = {
  id: "shop_containers",
  title: "The shop · containers",
  dynamic: false,
  bounds: { x: 0, y: 0, width: 660, height: 420 },
  nodes: [
    { id: "shop", parent: null, kind: "system", shape: "rectangle", title: "Shop", technology: null, description: "Sells and books.", compound: true, x: 0, y: 0, width: 660, height: 260 },
    { id: "shop.web", parent: "shop", kind: "container", shape: "browser", title: "Storefront", technology: "Next.js", description: "The pages a customer sees.", compound: false, x: 40, y: 70, width: 240, height: 150 },
    { id: "shop.jobs", parent: "shop", kind: "container", shape: "queue", title: "Booking jobs", technology: "PostgreSQL queue", description: "Confirms and reminds.", compound: false, x: 380, y: 100, width: 240, height: 90 },
    { id: "db", parent: null, kind: "container", shape: "storage", title: "Database", technology: "PostgreSQL 18", description: "Orders, bookings, customers.", compound: false, x: 210, y: 320, width: 240, height: 100 },
  ],
  edges: [
    { id: "enqueue", source: "shop.web", target: "shop.jobs", label: "enqueues", points: [[280, 145], [313, 145], [347, 145], [380, 145]], labelBBox: { x: 296, y: 120, width: 70, height: 18 }, step: null, back: false },
    { id: "store", source: "shop.web", target: "db", label: "reads and writes", points: [[160, 220], [180, 270], [250, 290], [290, 320]], labelBBox: { x: 60, y: 276, width: 130, height: 18 }, step: null, back: false },
    { id: "jobs-db", source: "shop.jobs", target: "db", label: null, points: [[500, 190], [480, 250], [420, 290], [390, 320]], labelBBox: null, step: null, back: false },
  ],
} satisfies ArchView;

export default function ContainersExample() {
  return <ArchitectureDiagram view={view} subtitle="C4 · level 2" />;
}
