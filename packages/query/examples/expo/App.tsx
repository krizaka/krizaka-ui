import { configureKrizakaFetch, createQueryClient, defineKeys, krizakaFetch, useQuery } from "@krizaka/query";
import { bindNativeLifecycle, nativeQueryDefaults } from "@krizaka/query/native";
import { createPersister, PERSIST_MAX_AGE, persistOptions,PersistQueryClientProvider } from "@krizaka/query/persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { AppState, FlatList, Text } from "react-native";
import { z } from "zod";

const Story = z.object({ id: z.string(), title: z.string() });
const storyKeys = defineKeys("stories", { feed: () => [] });

// Once, at start-up: the API's address and the session's bearer token.
configureKrizakaFetch({
  baseUrl: "https://api.example.com",
  getToken: () => AsyncStorage.getItem("session-token"),
});
bindNativeLifecycle({ appState: AppState, netInfo: NetInfo });

const client = createQueryClient({ gcTime: PERSIST_MAX_AGE, defaultOptions: nativeQueryDefaults });
const persister = createPersister({ storage: AsyncStorage });

function Stories() {
  const stories = useQuery({
    queryKey: storyKeys.feed(),
    queryFn: ({ signal }) => krizakaFetch("/api/stories", { schema: z.array(Story), signal }),
    meta: { list: true },
  });
  return <FlatList data={stories.data ?? []} keyExtractor={(story) => story.id} renderItem={({ item }) => <Text>{item.title}</Text>} />;
}

export default function App() {
  return (
    // the stories read offline come from the saved cache, then refresh when the network is back
    <PersistQueryClientProvider client={client} persistOptions={persistOptions({ persister, buster: "1" })}>
      <Stories />
    </PersistQueryClientProvider>
  );
}
