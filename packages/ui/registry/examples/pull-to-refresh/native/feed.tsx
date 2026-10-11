import { ListItem, PullToRefresh } from "@krizaka/ui/native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

// The platform's pull to refresh, in the accent: the `refreshControl` of any ScrollView.
export default function NativePullToRefreshFeed() {
  const [refreshing, setRefreshing] = useState(true);
  return (
    <View style={{ width: 360, height: 240 }}>
      <ScrollView refreshControl={<PullToRefresh refreshing={refreshing} onRefresh={() => setRefreshing(false)} label="Pull to refresh" />}>
        <ListItem title="Sunset session" description="Elena · 2.4K views" />
        <ListItem title="Acoustic dare" description="Alex · 918 views" />
      </ScrollView>
    </View>
  );
}
