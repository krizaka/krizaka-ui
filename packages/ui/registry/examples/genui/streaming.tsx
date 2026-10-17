import { baseGenUiCatalog, GenUiStream } from "@krizaka/ui/genui";

// The answer stops mid-way: the card has arrived, its table not yet.
const PARTIAL = [
  "Here is the summary so far.",
  "```a2ui",
  '{"version":"v0.9","createSurface":{"surfaceId":"s1","catalogId":"krizaka:genui/v1"}}',
  '{"version":"v0.9","updateComponents":{"surfaceId":"s1","components":[{"id":"root","component":"Card","title":"Weekly signups","child":"body"}]}}',
  '{"version":"v0.9","updateComponents":{"surfaceId":"s1","comp',
].join("\n");

export default function GenUiStreaming() {
  return <GenUiStream text={PARTIAL} catalog={baseGenUiCatalog} streaming />;
}
