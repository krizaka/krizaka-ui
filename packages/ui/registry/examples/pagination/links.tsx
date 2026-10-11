import { Pagination } from "@krizaka/ui/pagination";

// Server-rendered: every page is a link, the page lives in the address (`?q=sunset&page=7`).
export default function PaginationLinks() {
  return <Pagination page={7} pageCount={42} getHref={(page) => `/explore?q=sunset&page=${page}`} siblings={2} />;
}
