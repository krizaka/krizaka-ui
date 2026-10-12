/** A fake HTTP server: each call answers the next scripted response and is recorded. */
export function fakeHttp(...answers: Array<Response | Error | (() => Response)>) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fn = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    calls.push({ url: String(input), init });
    const answer = answers.length > 1 ? answers.shift()! : answers[0]!;
    if (answer instanceof Error) throw answer;
    return typeof answer === "function" ? answer() : answer.clone();
  }) as typeof fetch;
  return { fetch: fn, calls };
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

export const problem = (body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status: body.status as number, headers: { "content-type": "application/problem+json", ...headers } });
