import { searchIndex } from "@/lib/search-index";

/* The French search index (/fr/search.json), static: the pages' French titles, French URLs. */
export const dynamic = "force-static";
export const { staticGET: GET } = searchIndex("fr");
