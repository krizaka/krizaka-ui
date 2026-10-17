import { ForceUpdateScreen, ProductMark } from "@krizaka/ui/native";

// The blocking screen: the backend answered 426. `onUpdate` opens the store page (`Linking.openURL(storeUrl)`).
export default function NativeForceUpdateScreenDefault() {
  return (
    <ForceUpdateScreen
      fill={false}
      mark={<ProductMark id="orochia" size={96} animated={false} />}
      title="Update to keep going"
      message="This version can no longer talk to our servers. Updating takes a minute and keeps everything you have."
      versionLabel="You have 1.1.0 · 1.2.0 or later is required"
      updateLabel="Update the app"
      onUpdate={() => undefined}
      retryLabel="I already updated"
      onRetry={() => undefined}
    />
  );
}
