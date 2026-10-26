import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { Field, Textarea } from "@krizaka/ui/field";
import { SplitView } from "@krizaka/ui/split-view";

const THREADS = [
  { id: "lea", name: "Léa M.", last: "Will part 3 be out before Friday?", time: "09:12", unread: true },
  { id: "samir", name: "Samir K.", last: "Thanks for the backstage cut!", time: "Yesterday" },
  { id: "ines", name: "Inès B.", last: "I won the auction 🎉", time: "Mon" },
];

// TEMPLATE — a creator's messages: the threads beside the open one; on a phone the open thread replaces the
// list (`showDetail`, from the address) with the way back above it. The reply box stays at the foot of the thread.
export default function SplitViewMessages() {
  return (
    <SplitView
      className="w-full"
      listTitle="Messages"
      showDetail
      back={<a href="#messages" className="text-sm font-medium text-fg-secondary">← Messages</a>}
      list={
        <ul>
          {THREADS.map((t, i) => (
            <li key={t.id}>
              <a href={`#${t.id}`} aria-current={i === 0 ? "page" : undefined} className="flex items-center gap-3 border-b border-border-subtle px-4 py-3 text-sm no-underline hover:bg-surface-2 aria-[current=page]:bg-accent-soft">
                <Avatar fallback={t.name.slice(0, 2)} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-2"><span className="font-semibold text-fg">{t.name}</span><span className="text-xs text-fg-secondary">{t.time}</span></span>
                  <span className={t.unread ? "block truncate font-medium text-fg" : "block truncate text-fg-secondary"}>{t.last}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      }
      detailHead={<span className="text-sm font-bold text-fg">Léa M.</span>}
      detail={
        <div className="flex h-full flex-col gap-4">
          <p className="max-w-[80%] rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-2 text-sm text-fg">Will part 3 be out before Friday?</p>
          <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-accent-soft px-3.5 py-2 text-sm text-fg">Thursday evening — you'll be the first to know.</p>
          <form className="mt-auto flex items-end gap-2">
            <Field.Root className="flex-1">
              <Field.Label htmlFor="reply" className="sr-only">Reply to Léa</Field.Label>
              <Textarea id="reply" rows={2} placeholder="Write a reply…" />
            </Field.Root>
            <Button type="submit" variant="primary">Send</Button>
          </form>
        </div>
      }
    />
  );
}
