import { baseGenUiCatalog, GenUiStream } from "@krizaka/ui/genui";

const ANSWER = [
  "Three cities sold more than 100 passes this month.",
  "```a2ui",
  '{"version":"v0.9","createSurface":{"surfaceId":"s1","catalogId":"krizaka:genui/v1"}}',
  '{"version":"v0.9","updateComponents":{"surfaceId":"s1","components":[{"id":"root","component":"Column","children":["note","grid"]},{"id":"note","component":"Callout","tone":"success","title":"Montréal leads","text":"412 passes, +18 % on last month."},{"id":"grid","component":"Table","caption":"Passes by city","columns":[{"key":"city","label":"City"},{"key":"passes","label":"Passes","format":"integer"}],"rows":{"path":"/cities"}}]}}',
  '{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/cities","value":[{"city":"Montréal","passes":412},{"city":"Québec","passes":187},{"city":"Laval","passes":121}]}}',
  "```",
].join("\n");

export default function GenUiTable() {
  return <GenUiStream text={ANSWER} catalog={baseGenUiCatalog} />;
}
