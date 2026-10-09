import { Fragment, type ReactNode } from "react";

/** What `renderLink` receives for each `<a>…</a>` of a message, in order of appearance. */
export interface RichLink {
  /** The href given for this link (`href[index]`, or `href` itself when it is a string), if any. */
  href: string | undefined;
  /** The position of the link in the message: 0 for the first `<a>`. */
  index: number;
  children: ReactNode;
}

export interface RichProps {
  /** The message: plain text with `<b>…</b>` emphasis and `<a>…</a>` links, the only markup messages may carry. */
  text: string;
  /** The target of each `<a>`, in order (a string for a single link). The words stay in the message, the URL in code. */
  href?: string | readonly string[];
  /** Renders a link (e.g. with `next/link`). Default: `<a href>`, or the plain words when the link has no href. */
  renderLink?: (link: RichLink) => ReactNode;
  /** Renders a `<b>…</b>` (e.g. with the app's classes). Default: `<strong>`. */
  renderBold?: (children: ReactNode) => ReactNode;
  /**
   * Nodes put in place of `{name}` placeholders (a link, an emphasised value): `slots={{ email: <strong>{email}</strong> }}`.
   * A placeholder without a slot stays as written. Plain values go through `format` / `t` before, not here.
   */
  slots?: Readonly<Record<string, ReactNode>>;
}

const TAG = /<(b|a)>([\s\S]*?)<\/\1>/g;

const SLOT = /\{(\w+)\}/;

function defaultLink({ href, children }: RichLink): ReactNode {
  return href === undefined ? children : <a href={href}>{children}</a>;
}

function defaultBold(children: ReactNode): ReactNode {
  return <strong>{children}</strong>;
}

/**
 * Renders a message with its markup — `<b>` → `<strong>`, `<a>` → a link — and everything else as text (never HTML:
 * no `dangerouslySetInnerHTML`, an unknown or unbalanced tag is shown as written). `<b>` and `<a>` may hold each other.
 * No hook, no context: usable in a Server Component.
 *
 * ```tsx
 * <Rich text={t.home.lead} />
 * <Rich text="Read <a>the docs</a>, <b>now</b>." href="/docs" renderLink={({ href, children }) => <Link href={href!}>{children}</Link>} />
 * <Rich text="We sent a link to {email}." slots={{ email: <strong>{email}</strong> }} />
 * ```
 */
export function Rich({ text, href, renderLink = defaultLink, renderBold = defaultBold, slots }: RichProps): ReactNode {
  const hrefs = typeof href === "string" ? [href] : (href ?? []);
  let links = 0;

  /** Plain text, with its `{slot}` placeholders replaced by their nodes. */
  const plain = (source: string, key: string): ReactNode => {
    if (!slots) return <Fragment key={key}>{source}</Fragment>;
    const parts = source.split(SLOT);
    return (
      <Fragment key={key}>
        {parts.map((part, i) =>
          i % 2 === 0 ? part : <Fragment key={i}>{Object.hasOwn(slots, part) ? slots[part] : `{${part}}`}</Fragment>,
        )}
      </Fragment>
    );
  };

  // The match is lazy: inside <b>…</b> there is no </b>, so only an <a> can match there (and the other way round).
  const render = (source: string, prefix: string): ReactNode[] => {
    const out: ReactNode[] = [];
    let last = 0;
    for (const match of source.matchAll(TAG)) {
      const [whole, tag, inner] = match as unknown as [string, "a" | "b", string];
      const at = match.index as number;
      const key = `${prefix}${out.length}`;
      if (at > last) out.push(plain(source.slice(last, at), `${key}t`));
      if (tag === "b") {
        out.push(<Fragment key={key}>{renderBold(render(inner, `${key}.`))}</Fragment>);
      } else {
        const index = links++;
        out.push(
          <Fragment key={key}>{renderLink({ href: hrefs[index], index, children: render(inner, `${key}.`) })}</Fragment>,
        );
      }
      last = at + whole.length;
    }
    if (last < source.length) out.push(plain(source.slice(last), `${prefix}end`));
    return out;
  };

  return <>{render(text, "")}</>;
}

export default Rich;
