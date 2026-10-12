import { createQueryClient, KrizakaQueryProvider } from "@krizaka/query";
import { KrizakaHydration } from "@krizaka/query/server";

import { Videos, videosQuery } from "./videos";

// @krizaka/query as documented: a Server Component prefetches with its own client and hydrates the client list,
// which renders the same key without refetching.
export default function QueryPage() {
  const client = createQueryClient();
  return (
    <main>
      <h1>@krizaka/query</h1>
      <KrizakaQueryProvider>
        <KrizakaHydration client={client} queries={[videosQuery]}>
          <Videos />
        </KrizakaHydration>
      </KrizakaQueryProvider>
    </main>
  );
}
