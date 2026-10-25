import { call, EVENTS, type TauriBridge } from "./bridge";

/**
 * Deep links (`yomizaka://app/rapports`, the product's web links): the native side turns each into a route inside the app
 * or drops it; `navigate` receives the route. The links that opened the app before the page listened are taken once
 * listening has started, so none is lost (one that arrives in between may come twice; navigating twice to the same route
 * is harmless).
 */
export async function followLinks(bridge: TauriBridge, navigate: (route: string) => void): Promise<() => void> {
  const stop = await bridge.listen<string>(EVENTS.open, (event) => navigate(event.payload));
  for (const route of await call<string[]>(bridge, "take_links")) navigate(route);
  return stop;
}
