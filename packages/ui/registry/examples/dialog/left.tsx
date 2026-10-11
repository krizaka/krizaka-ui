import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";

const conversations = ["Pricing questions", "Onboarding Eric", "Weekly report"];

// `placement="left"`: a navigation drawer — the conversations of a chat app on a phone, sliding in from the left.
export default function DialogLeft({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger asChild>
        <Button>Conversations</Button>
      </Dialog.Trigger>
      <Dialog.Content closeLabel="Close" placement="left" size="sm">
        <Dialog.Header>
          <Dialog.Title>Conversations</Dialog.Title>
          <Dialog.Description>Your last three conversations.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <ul className="flex flex-col gap-1">
            {conversations.map((c) => (
              <li key={c}>
                <a href="#chat" className="block rounded-lg px-3 py-2.5 text-sm text-fg hover:bg-surface-2">
                  {c}
                </a>
              </li>
            ))}
          </ul>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
}
