import { renderLlms } from "@/lib/llms";

// Built once per deployment, from the same source as the pages.
export const dynamic = "force-static";

export function GET() {
  return new Response(renderLlms(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
