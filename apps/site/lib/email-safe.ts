/* Text that holds an « @ » between two words (@krizaka/ui@3.29.0, a contact address) reads as an e-mail address to
   Cloudflare's Scrape Shield, which rewrites it into a link in the HTML it serves — and React, hydrating a text it did
   not render, fails (#418). The sign is returned apart, so a component can put it in its own element. */

export type AtPart = string | { at: true };

/** The text cut at every « @ » that follows a word character; a leading scope (« @krizaka/ui ») stays in the text. */
export function splitAtSigns(text: string): AtPart[] {
  const parts: AtPart[] = [];
  let from = 0;
  for (let i = 1; i < text.length; i++) {
    if (text[i] !== "@" || !/[\w/.-]/.test(text[i - 1]!)) continue;
    parts.push(text.slice(from, i), { at: true });
    from = i + 1;
  }
  parts.push(text.slice(from));
  return parts.filter((p) => p !== "");
}
