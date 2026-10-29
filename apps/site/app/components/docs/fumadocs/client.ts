/* The browser half of the one door to Fumadocs UI (ADR-008 §7): the search context and the root provider, which client
   components import from here. tests/fumadocs-adapter.test.mjs refuses a `fumadocs-ui` import outside app/components/docs/fumadocs/. */
export { useSearchContext } from "fumadocs-ui/contexts/search";
export { RootProvider } from "fumadocs-ui/provider/next";
