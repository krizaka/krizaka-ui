// Client (the composer's draft). A conversation's parts — the bubble with its time and receipt, the typing dots, the
// composer, a conversation in a list — the same API as React Native. Words are props.
import * as React from "react";
import { tv } from "tailwind-variants";

import { Avatar } from "../avatar";

export const chat = tv({
  slots: {
    row: "flex flex-col gap-0.5",
    bubble: "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-snug",
    context: "mb-0.5 block text-xs opacity-85",
    time: "mt-0.5 block text-right text-[11px] tabular-nums",
    status: "flex items-center gap-1 text-xs text-fg-secondary data-[status=failed]:text-fg-danger [&>svg]:h-3.5 [&>svg]:w-3.5",
    typing: "inline-flex items-center gap-1 self-start rounded-2xl bg-surface-2 px-3.5 py-3",
    dot: "h-[7px] w-[7px] rounded-full bg-fg-secondary motion-safe:animate-[kz-typing_1.2s_ease-in-out_infinite]",
    composer: "flex items-end gap-2 border-t border-border-subtle bg-surface-0 px-3 py-2",
    input:
      "max-h-32 min-h-10 flex-1 resize-none rounded-2xl border border-border-default bg-surface-1 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-muted " +
      "focus-visible:border-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    send:
      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent hover:bg-accent-hover focus-visible:outline-hidden " +
      "focus-visible:ring-2 focus-visible:ring-ring disabled:bg-surface-3 disabled:text-fg-muted [&>svg]:h-[18px] [&>svg]:w-[18px]",
    item: "flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    count: "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-extrabold text-on-accent",
  },
});

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type MessageBubbleLabels = {
  /** The words of each status, shown under the last message of yours. */
  status?: Partial<Record<MessageStatus, string>>;
  /** A failed message's retry button (“Retry”). */
  retry?: string;
};

const STATUS: Record<MessageStatus, string> = { sending: "Sending", sent: "Sent", delivered: "Delivered", read: "Read", failed: "Not sent" };

export type MessageBubbleProps = {
  /** The text. */
  text: string;
  /** Yours (right, in the accent) or theirs (left). */
  mine?: boolean;
  /** The time, written by the app (“14:02”). */
  time?: string;
  /** Where a message of yours stands; shown when `showStatus`. */
  status?: MessageStatus;
  /** Show the status under the bubble (the last message of yours). */
  showStatus?: boolean;
  /** A line above the text: what it answers. */
  context?: string;
  /** Sends a failed message again (a button under it). */
  onRetry?: () => void;
  /** Part of a run of the same sender: the corner towards the next one is tighter. */
  grouped?: "first" | "middle" | "last" | "single";
  /** The words, passed translated. */
  labels?: MessageBubbleLabels;
  /** Classes merged on the row. */
  className?: string;
};

const CORNERS = {
  mine: { first: "rounded-br-md", middle: "rounded-r-md", last: "rounded-tr-md", single: "" },
  theirs: { first: "rounded-bl-md", middle: "rounded-l-md", last: "rounded-tl-md", single: "" },
} as const;

/** A message: yours in the accent on the right, theirs on the left, the time inside, the receipt under the last of yours. */
export function MessageBubble({ text, mine, time, status, showStatus, context, onRetry, grouped = "single", labels, className }: MessageBubbleProps) {
  const s = chat();
  const words = { ...STATUS, ...labels?.status };
  return (
    <div className={s.row({ className: [mine ? "items-end" : "items-start", className].filter(Boolean).join(" ") })}>
      <p
        className={s.bubble({
          className: [mine ? "bg-accent text-on-accent" : "bg-surface-2 text-fg", CORNERS[mine ? "mine" : "theirs"][grouped], status === "failed" ? "ring-2 ring-danger" : "", status === "sending" ? "opacity-70" : ""].join(" "),
        })}
      >
        {context ? <span className={s.context()}>{context}</span> : null}
        {text}
        {time ? <span className={s.time()}>{time}</span> : null}
      </p>
      {showStatus && status ? (
        <p className={s.status()} data-status={status}>
          {status === "sent" || status === "delivered" || status === "read" ? (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={status === "read" ? "stroke-accent" : "stroke-fg-secondary"}>
              <path d={status === "sent" ? "M5 12.5l4.5 4.5L19 7.5" : "M2 12.5l4.5 4.5L16 7.5M9 15l2 2 9.5-9.5"} />
            </svg>
          ) : null}
          {words[status]}
          {status === "failed" && onRetry ? (
            <button type="button" onClick={onRetry} className="ml-1 font-semibold text-fg underline underline-offset-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
              {labels?.retry ?? "Retry"}
            </button>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

export type TypingIndicatorProps = {
  /** What is read and shown beside the dots (“Elena is typing”) — passed translated. */
  label: string;
  /** Show the words beside the dots. */
  showLabel?: boolean;
  /** Classes merged on the root. */
  className?: string;
};

/** Three dots that breathe while the other person types, announced politely; still under reduced motion. */
export function TypingIndicator({ label, showLabel, className }: TypingIndicatorProps) {
  const s = chat();
  return (
    <div role="status" className={["flex items-center gap-2", className].filter(Boolean).join(" ")}>
      <style href="krizaka-typing" precedence="default">{"@keyframes kz-typing{0%,60%,100%{opacity:.35;transform:none}30%{opacity:1;transform:translateY(-2px)}}"}</style>
      <span className={s.typing()} aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={s.dot()} style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </span>
      <span className={showLabel ? "text-xs text-fg-secondary" : "sr-only"}>{label}</span>
    </div>
  );
}

export type MessageComposerProps = {
  /** The draft (controlled). */
  value: string;
  /** Called on every key. */
  onValueChange: (text: string) => void;
  /** Sends the draft (Enter, or the button); Shift+Enter adds a line. */
  onSend: () => void;
  /** The input's name and placeholder (“Message”). */
  placeholder: string;
  /** The send button's name (“Send”). */
  sendLabel: string;
  /** Before the input: an attach button. */
  leading?: React.ReactNode;
  /** Cannot write: the reason in its place. */
  disabledReason?: string;
  /** The longest message. Default 4000. */
  maxLength?: number;
  /** Classes merged on the root. */
  className?: string;
};

/** Where a message is written: a growing textarea (Enter sends, Shift+Enter a new line), an attach slot, a send button. */
export function MessageComposer({ value, onValueChange, onSend, placeholder, sendLabel, leading, disabledReason, maxLength = 4000, className }: MessageComposerProps) {
  const s = chat();
  const ready = value.trim().length > 0;
  return (
    <form
      className={s.composer({ className })}
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSend();
      }}
    >
      {disabledReason ? (
        <p className="m-0 flex-1 py-2 text-sm text-fg-secondary">{disabledReason}</p>
      ) : (
        <>
          {leading}
          <textarea
            aria-label={placeholder}
            placeholder={placeholder}
            rows={1}
            maxLength={maxLength}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                if (ready) onSend();
              }
            }}
            className={s.input()}
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button type="submit" aria-label={sendLabel} disabled={!ready} className={s.send()}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />
            </svg>
          </button>
        </>
      )}
    </form>
  );
}

export type ConversationItemProps = {
  /** The other person's name. */
  name: string;
  /** Their avatar's URL. */
  avatar?: string | null;
  /** The last message, or “typing…”. */
  preview: string;
  /** The preview is the typing signal: in the accent. */
  typing?: boolean;
  /** When (“14:02”, “Mon”). */
  time?: string;
  /** Unread messages: a count, the name in bold. */
  unread?: number;
  /** The unread count in words (“3 unread”). */
  unreadLabel?: string;
  /** Before the name: a presence dot (online). */
  online?: boolean;
  /** The presence in words (“online”). */
  onlineLabel?: string;
  /** Opens the conversation (a link). */
  href?: string;
  /** Opens the conversation (a button). */
  onSelect?: () => void;
  /** Classes merged on the row. */
  className?: string;
};

/** A conversation in the list: avatar, name, the last message or typing, the time, the unread count. */
export function ConversationItem({ name, avatar, preview, typing, time, unread = 0, unreadLabel, online, onlineLabel, href, onSelect, className }: ConversationItemProps) {
  const s = chat();
  const body = (
    <>
      <span className="relative shrink-0">
        <Avatar src={avatar ?? null} alt="" fallback={name.charAt(0)} size="lg" />
        {online ? <span aria-hidden className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-surface-0" /> : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-2">
          <span className={["min-w-0 flex-1 truncate text-sm text-fg", unread > 0 ? "font-extrabold" : "font-semibold"].join(" ")}>
            {name}
            {online && onlineLabel ? <span className="sr-only">{`, ${onlineLabel}`}</span> : null}
          </span>
          {time ? <span className={["shrink-0 text-xs tabular-nums", unread > 0 ? "text-fg-accent" : "text-fg-secondary"].join(" ")}>{time}</span> : null}
        </span>
        <span className="flex items-center gap-2">
          <span className={["min-w-0 flex-1 truncate text-xs", typing ? "text-fg-accent" : unread > 0 ? "text-fg" : "text-fg-secondary"].join(" ")}>{preview}</span>
          {unread > 0 ? (
            <span className={s.count()}>
              <span aria-hidden>{unread > 99 ? "99+" : unread}</span>
              <span className="sr-only">{unreadLabel ?? String(unread)}</span>
            </span>
          ) : null}
        </span>
      </span>
    </>
  );
  return href ? (
    <a href={href} className={s.item({ className })}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={onSelect} className={s.item({ className })}>
      {body}
    </button>
  );
}
