import { searchIndex } from "@/lib/search-index";

/* The English search index (/search.json), static. French: app/(fr)/fr/search.json. */
export const dynamic = "force-static";
export const { staticGET: GET } = searchIndex("en");
