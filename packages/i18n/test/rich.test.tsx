import { renderToStaticMarkup } from "react-dom/server";

import DefaultRich from "../src/rich";
import { Rich } from "../src/rich";

const html = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("Rich", () => {
  it("renders plain text as text, never as HTML", () => {
    expect(html(<Rich text="Hello & <i>you</i>" />)).toBe("Hello &amp; &lt;i&gt;you&lt;/i&gt;");
    expect(html(<Rich text="" />)).toBe("");
  });

  it("renders <b> as <strong>", () => {
    expect(html(<Rich text="A <b>bold</b> move, <b>twice</b>." />)).toBe("A <strong>bold</strong> move, <strong>twice</strong>.");
    expect(html(<DefaultRich text="<b>all</b>" />)).toBe("<strong>all</strong>");
  });

  it("renders <a> with the hrefs in order, or the words alone without one", () => {
    expect(html(<Rich text="Read <a>the docs</a>." href="/docs" />)).toBe('Read <a href="/docs">the docs</a>.');
    expect(html(<Rich text="<a>one</a> and <a>two</a> and <a>three</a>" href={["/1", "/2"]} />)).toBe(
      '<a href="/1">one</a> and <a href="/2">two</a> and three',
    );
  });

  it("nests <b> and <a> once, and shows an unbalanced tag as written", () => {
    expect(html(<Rich text="<a>go <b>now</b></a>" href="/x" />)).toBe('<a href="/x">go <strong>now</strong></a>');
    expect(html(<Rich text="<b>see <a>this</a></b>" href="/y" />)).toBe('<strong>see <a href="/y">this</a></strong>');
    expect(html(<Rich text="<b>x <a>y <b>z</b></a></b>" href="/z" />)).toBe(
      "<strong>x &lt;a&gt;y &lt;b&gt;z</strong>&lt;/a&gt;&lt;/b&gt;",
    );
  });

  it("hands each link to renderLink", () => {
    const seen: unknown[] = [];
    const out = html(
      <Rich
        text="<a>a</a> <a>b</a>"
        href={["/a"]}
        renderLink={({ href, index, children }) => {
          seen.push([href, index]);
          return <em data-href={href ?? "none"}>{children}</em>;
        }}
      />,
    );
    expect(out).toBe('<em data-href="/a">a</em> <em data-href="none">b</em>');
    expect(seen).toEqual([["/a", 0], [undefined, 1]]);
  });

  it("puts nodes in place of {slots}, in plain text, bold and links", () => {
    const slots = { email: <em>a@b.c</em>, n: 3 };
    expect(html(<Rich text="Sent to {email}, {n} times; {other} stays." slots={slots} />)).toBe(
      "Sent to <em>a@b.c</em>, 3 times; {other} stays.",
    );
    expect(html(<Rich text="<b>{email}</b> <a>{n}</a>" href="/x" slots={slots} />)).toBe(
      '<strong><em>a@b.c</em></strong> <a href="/x">3</a>',
    );
    expect(html(<Rich text="{toString}" slots={{}} />)).toBe("{toString}");
    expect(html(<Rich text="{email}" />)).toBe("{email}");
  });

  it("hands each <b> to renderBold", () => {
    expect(html(<Rich text="a <b>b</b>" renderBold={(children) => <b className="x">{children}</b>} />)).toBe('a <b class="x">b</b>');
  });
});
