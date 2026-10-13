import { PullToRefresh, Txt } from "@krizaka/ui/native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

// The platform's pull to refresh, in the accent: the `refreshControl` of any ScrollView.
export default function NativePullToRefreshFeed() {
  const [refreshing, setRefreshing] = useState(true);
  return (
    <View style={{ width: 360, height: 240 }}>
      <ScrollView refreshControl={<PullToRefresh refreshing={refreshing} onRefresh={() => setRefreshing(false)} label="Pull to refresh" />}>
        {["Sunset session · Elena · 2.4K views", "Acoustic dare · Alex · 918 views"].map((line) => (
          <Txt key={line} style={{ padding: 16 }}>
            {line}
          </Txt>
        ))}
      </ScrollView>
    </View>
  );
}
