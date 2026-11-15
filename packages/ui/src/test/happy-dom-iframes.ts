// happy-dom, the DOM of the web tests, never loads an iframe's page (its setting `disableIframePageLoading`: no browser, no network).
// Each mounted <iframe> (ShopComposer's preview, EmbedFacade's player) makes it call console.error with a DOMException « Failed to load
// iframe page "…". Iframe page loading is disabled. »: 18 per run, and in CI each one was printed with the window it holds, thousands
// of lines in the Release log of the run the runner stopped (krizaka-internal#3904). That notice is about the test DOM, never about
// the code under test: it is dropped here, every other console.error still prints. happy-dom writes to the console it was given when
// vitest created its window, Node's own (`node:console`), not to the `console` vitest gives the tests: that one is filtered.

import nodeConsole from "node:console";


const IFRAME_DISABLED = /^Failed to load iframe page ".*"\. Iframe page loading is disabled\.$/s;

/** True for happy-dom's « iframe page loading is disabled » notice, and only for it. */
export function isIframeLoadingNotice(args: readonly unknown[]): boolean {
  const [first] = args;
  return args.length === 1 && first instanceof Error && first.name === "NotSupportedError" && IFRAME_DISABLED.test(first.message);
}

/** Marks a quieted sink: the setup module is evaluated again for each test file of a worker, the wrapper is installed once. */
const QUIETED = Symbol.for("krizaka.ui.test.quietIframeLoadingNotices");

type ErrorSink = { error: (...args: unknown[]) => void; [QUIETED]?: true };

/** Replaces `sink.error` by one that drops the notice and passes everything else through. */
export function quietIframeLoadingNotices(sink: ErrorSink): void {
  if (sink[QUIETED]) return;
  sink[QUIETED] = true;
  const error = sink.error.bind(sink);
  sink.error = (...args: unknown[]) => {
    if (!isIframeLoadingNotice(args)) error(...args);
  };
}

quietIframeLoadingNotices(nodeConsole);
