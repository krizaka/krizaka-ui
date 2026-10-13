import { ConversationItem } from "@krizaka/ui/chat";

// The inbox: online, the last message or “typing…”, the time, the unread count.
export default function ChatInbox() {
  return (
    <div className="flex max-w-md flex-col rounded-xl border border-border-default bg-surface-0 py-1">
      <ConversationItem name="Elena" online onlineLabel="online" preview="typing…" typing time="19:06" unread={2} unreadLabel="2 unread" href="#/chats/elena" />
      <ConversationItem name="Noah" preview="See you Saturday then!" time="Mon" href="#/chats/noah" />
      <ConversationItem name="Mina" preview="You: haha same" time="Sun" href="#/chats/mina" />
    </div>
  );
}
