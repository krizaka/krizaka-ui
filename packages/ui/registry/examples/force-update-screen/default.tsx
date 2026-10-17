import { ProductLogo } from "@krizaka/ui";
import { ForceUpdateScreen } from "@krizaka/ui/force-update-screen";

// The blocking screen: the backend answered 426, or `updateMode: "force"`. It replaces the whole app.
export default function ForceUpdateScreenDefault() {
  return (
    <ForceUpdateScreen
      className="min-h-0"
      mark={<ProductLogo id="orochia" size={96} animated={false} />}
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
