import { ProductMark, UpdatePrompt } from "@krizaka/ui/native";

// The soft update as a card at the top of the home screen; "Later" is remembered for this version.
export default function NativeUpdatePromptDefault() {
  return (
    <UpdatePrompt
      mark={<ProductMark id="orazaka" size={40} animated={false} />}
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
