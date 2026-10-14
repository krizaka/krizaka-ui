import { BrandedRefresh, Txt } from "@krizaka/ui/native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

// The product's mark as the pull: it grows into place as you pull and turns while it refreshes.
export default function NativePullToRefreshBranded() {
  const [refreshing, setRefreshing] = useState(true);
  return (
    <View style={{ width: 360, height: 240 }}>
      <BrandedRefresh product="orochia" refreshing={refreshing} onRefresh={() => setRefreshing(true)} label="Refreshing your videos">
        {(scroll) => (
          <ScrollView {...scroll} contentContainerStyle={{ paddingTop: 56 }}>
            {["Sunset session · Elena · 2.4K views", "Acoustic dare · Alex · 918 views"].map((line) => (
              <Txt key={line} style={{ padding: 16 }}>
                {line}
              </Txt>
            ))}
          </ScrollView>
        )}
      </BrandedRefresh>
    </View>
  );
}
