import { ProductLogo } from "@krizaka/ui";
import { UpdatePrompt } from "@krizaka/ui/update-prompt";

// The soft update: the backend said `updateMode: "soft"` — a banner the person can dismiss for this version.
export default function UpdatePromptDefault() {
  return (
    <UpdatePrompt
      mark={<ProductLogo id="orazaka" size={40} animated={false} />}
      title="A new version is available"
      message="Faster chats and a fix for uploads on slow networks."
      versionLabel="1.2.0 → 1.4.0"
      updateLabel="Update"
      onUpdate={() => undefined}
      laterLabel="Later"
      onLater={() => undefined}
    />
  );
}
