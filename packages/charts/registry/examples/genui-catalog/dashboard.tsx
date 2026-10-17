import { chartsGenUiCatalog } from "@krizaka/charts/genui";
import { baseGenUiCatalog, GenUiStream } from "@krizaka/ui/genui";

const catalog = { ...baseGenUiCatalog, ...chartsGenUiCatalog };
const days = ["2026-10-11", "2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15"].map((day, i) => ({ day, views: [40, 52, 47, 61, 75][i] }));

const ANSWER = [
  "Views grew all week; likes followed.",
  "```a2ui",
  '{"version":"v0.9","createSurface":{"surfaceId":"week","catalogId":"krizaka:genui/v1"}}',
  '{"version":"v0.9","updateComponents":{"surfaceId":"week","components":[{"id":"root","component":"Column","children":["figures","trend"]},{"id":"figures","component":"Row","children":["views","likes"]},{"id":"views","component":"KpiStat","label":"Views","value":275,"previous":211,"format":"integer"},{"id":"likes","component":"KpiStat","label":"Likes","value":38,"previous":30,"format":"integer"},{"id":"trend","component":"ChartCard","title":"Views per day","kind":"area","x":"day","series":[{"key":"views","label":"Views"}],"data":{"path":"/days"}}]}}',
  JSON.stringify({ version: "v0.9", updateDataModel: { surfaceId: "week", path: "/days", value: days } }),
  "```",
].join("\n");

export default function GenUiDashboard() {
  return <GenUiStream text={ANSWER} catalog={catalog} />;
}
