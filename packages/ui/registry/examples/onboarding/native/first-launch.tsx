import { Mascot, Onboarding } from "@krizaka/ui/native";
import { View } from "react-native";

// Three promises, a bird each; Skip at any time, Get started on the last.
export default function NativeOnboardingFirstLaunch() {
  return (
    <View style={{ width: 360, height: 560 }}>
      <Onboarding
        slides={[
          { visual: <Mascot bird="flamingo" mood="welcome" size={140} />, title: "Get paid for what you love", description: "Tips, auctions and dares from your fans — paid out every week." },
          { visual: <Mascot bird="falcon" mood="thinking" size={140} />, title: "Your money, watched over", description: "Pledges wait in escrow until the challenge is done." },
          { visual: <Mascot bird="pigeon" mood="success" size={140} />, title: "Never miss a bid", description: "Hear when you are outbid, wherever you are." },
        ]}
        labels={{ next: "Next", done: "Get started", skip: "Skip", position: (n, total) => `Step ${n} of ${total}` }}
        onDone={() => undefined}
      />
    </View>
  );
}
