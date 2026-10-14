// React Native: the web `Markdown`'s AST (TanStack Markdown, via the same `parseSource`) drawn in Text and View. Raw HTML
// is never rendered, executable URLs are dropped, `streaming` heals the unfinished end of a text that is arriving. Its own
// entry (`@krizaka/ui/native/markdown`): the parser and the code grammars never load in an app that does not use it.
import { type Theme, Txt, useTheme } from "@krizaka/ui/native";
import * as React from "react";
import { Image, Linking, ScrollView, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { codeHighlighter } from "../code-block/highlighter";
import { type BlockNode, type InlineNode, parseSource, textOf } from "../markdown/parse";

export type MarkdownProps = {
  /** The Markdown source. */
  children: string;
  /** The text is still arriving (an AI answer): the unfinished end is closed, so no `**` or half a link shows. */
  streaming?: boolean;
  /** Called with the address of a link that is pressed. Default: opens `http(s)`, `mailto:` and `tel:` links with the system. */
  onLinkPress?: (href: string) => void;
  /** Styles merged on the container. */
  style?: StyleProp<ViewStyle>;
};

type Context = { theme: Theme; mono: string | undefined; open: (href: string) => void };

const SYSTEM = /^(https?:|mailto:|tel:)/i;

function Inlines({ nodes, ctx }: { nodes: readonly InlineNode[]; ctx: Context }) {
  return nodes.map((node, i) => <Inline key={i} node={node} ctx={ctx} />);
}

function Inline({ node, ctx }: { node: InlineNode; ctx: Context }): React.ReactNode {
  const { theme } = ctx;
  switch (node.type) {
    case "text":
      return node.value;
    case "inlineCode":
      return <Text style={{ fontFamily: ctx.mono, fontSize: 13.5, backgroundColor: theme.surface3 }}>{` ${node.value} `}</Text>;
    case "strong":
      return (
        <Text style={styles.strong}>
          <Inlines nodes={node.children} ctx={ctx} />
        </Text>
      );
    case "emphasis":
      return (
        <Text style={styles.em}>
          <Inlines nodes={node.children} ctx={ctx} />
        </Text>
      );
    case "strike":
      return (
        <Text style={styles.strike}>
          <Inlines nodes={node.children} ctx={ctx} />
        </Text>
      );
    case "break":
      return "\n";
    case "link":
      return (
        <Text role="link" onPress={() => ctx.open(node.href)} style={{ color: theme.accentText, textDecorationLine: "underline" }}>
          <Inlines nodes={node.children} ctx={ctx} />
        </Text>
      );
    // A picture inside a sentence cannot be drawn in a Text everywhere: its description stands in.
    case "image":
      return node.alt;
    case "footnoteReference":
      return <Text style={{ color: theme.accentText, fontSize: 11 }}>{` [${node.number}]`}</Text>;
    case "inlineHtml":
      return node.value;
    default:
      return null;
  }
}

/** Code, coloured by the web's grammars from the theme's text roles. */
function Code({ node, ctx }: { node: Extract<BlockNode, { type: "code" }>; ctx: Context }) {
  const { theme } = ctx;
  const colour: Record<string, string> = {
    comment: theme.textSecondary,
    string: theme.successText,
    inserted: theme.successText,
    attr: theme.warningText,
    meta: theme.warningText,
    keyword: theme.accentText,
    tag: theme.accentText,
    selector: theme.accentText,
    command: theme.accentText,
    heading: theme.accentText,
    link: theme.accentText,
    type: theme.infoText,
    function: theme.infoText,
    number: theme.infoText,
    literal: theme.infoText,
    deleted: theme.dangerText,
  };
  const { tokens } = codeHighlighter.tokenize(node.value, { lang: node.lang ?? "text" });
  return (
    <View style={[styles.code, { backgroundColor: theme.surface1, borderColor: theme.borderDefault }]}>
      {node.title || node.file ? (
        <Txt variant="caption" tone="secondary" style={[styles.codeTitle, { backgroundColor: theme.surface2 }]}>
          {node.title ?? node.file}
        </Txt>
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.codeBody}>
        <Text style={{ fontFamily: ctx.mono, fontSize: 12.5, lineHeight: 20, color: theme.textPrimary }}>
          {tokens.map((token, i) => (
            <Text key={i} style={token.className && colour[token.className] ? { color: colour[token.className] } : null}>
              {token.value}
            </Text>
          ))}
        </Text>
      </ScrollView>
    </View>
  );
}

function Blocks({ nodes, ctx }: { nodes: readonly BlockNode[]; ctx: Context }) {
  return nodes.map((node, i) => <Block key={i} node={node} ctx={ctx} />);
}

function Block({ node, ctx }: { node: BlockNode; ctx: Context }): React.ReactNode {
  const { theme } = ctx;
  switch (node.type) {
    case "heading":
      return node.depth === 1 ? (
        <Txt variant="display">
          <Inlines nodes={node.children} ctx={ctx} />
        </Txt>
      ) : node.depth === 2 ? (
        <Txt variant="title" style={styles.h2}>
          <Inlines nodes={node.children} ctx={ctx} />
        </Txt>
      ) : (
        <Txt variant="label" role="heading" style={styles.h3}>
          <Inlines nodes={node.children} ctx={ctx} />
        </Txt>
      );
    case "paragraph": {
      const pictures = node.children.filter((child) => child.type === "image");
      const onlyPictures = pictures.length > 0 && node.children.every((child) => child.type === "image" || (child.type === "text" && !child.value.trim()));
      if (onlyPictures) {
        return pictures.map((picture, i) => <Image key={i} source={{ uri: picture.src }} alt={picture.alt} accessibilityLabel={picture.alt} resizeMode="contain" style={styles.image} />);
      }
      return (
        <Txt>
          <Inlines nodes={node.children} ctx={ctx} />
        </Txt>
      );
    }
    case "code":
      return <Code node={node} ctx={ctx} />;
    case "list":
      return (
        <View role="list" style={styles.list}>
          {node.items.map((item, i) => (
            <View key={i} role="listitem" style={styles.item}>
              <Txt tone="secondary" style={styles.marker}>
                {item.checked !== undefined ? (item.checked ? "☑" : "☐") : node.ordered ? `${(node.start ?? 1) + i}.` : "•"}
              </Txt>
              <View style={styles.itemBody}>
                <Blocks nodes={item.children} ctx={ctx} />
              </View>
            </View>
          ))}
        </View>
      );
    case "blockquote":
      return (
        <View style={[styles.quote, { borderLeftColor: theme.accent }]}>
          <Blocks nodes={node.children} ctx={ctx} />
        </View>
      );
    case "table":
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} role="grid">
          <View style={[styles.table, { borderColor: theme.borderSubtle }]}>
            {[node.header, ...node.rows].map((row, r) => (
              <View key={r} style={[styles.row, { borderBottomColor: theme.borderSubtle }, r === 0 ? { backgroundColor: theme.surface2 } : null]}>
                {row.map((cell, c) => (
                  <Txt key={c} variant={r === 0 ? "label" : "body"} tone={r === 0 ? "secondary" : "text"} style={[styles.cell, { textAlign: node.align[c] ?? "left" }]}>
                    <Inlines nodes={cell.children} ctx={ctx} />
                  </Txt>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
    case "thematicBreak":
      return <View style={[styles.rule, { backgroundColor: theme.borderDefault }]} />;
    case "footnotes":
      return (
        <View style={styles.list}>
          {node.items.map((item) => (
            <View key={item.id} style={styles.item}>
              <Txt variant="caption" tone="secondary" style={styles.marker}>{`${item.number}.`}</Txt>
              <View style={styles.itemBody}>
                <Blocks nodes={item.children} ctx={ctx} />
              </View>
            </View>
          ))}
        </View>
      );
    case "html":
      return <Txt>{node.value}</Txt>;
    default:
      return null;
  }
}

/** A Markdown text in Text and View: headings, paragraphs, lists (and tasks), quotes, tables, coloured code, links, pictures. */
export function Markdown({ children, streaming, onLinkPress, style }: MarkdownProps) {
  const { theme, fonts } = useTheme();
  const blocks = React.useMemo(() => parseSource(children, { streaming }), [children, streaming]);
  const open = React.useCallback(
    (href: string) => {
      if (onLinkPress) return onLinkPress(href);
      if (SYSTEM.test(href)) void Linking.openURL(href);
    },
    [onLinkPress],
  );
  const ctx: Context = { theme, mono: fonts.mono ?? "Menlo", open };
  return (
    <View aria-busy={streaming || undefined} style={[styles.root, style]}>
      <Blocks nodes={blocks} ctx={ctx} />
    </View>
  );
}

export { textOf };

const styles = StyleSheet.create({
  root: { gap: 12 },
  strong: { fontWeight: "700" },
  em: { fontStyle: "italic" },
  strike: { textDecorationLine: "line-through" },
  h2: { marginTop: 8 },
  h3: { marginTop: 4 },
  image: { width: "100%", aspectRatio: 16 / 9, borderRadius: 12 },
  list: { gap: 6 },
  item: { flexDirection: "row", gap: 8 },
  marker: { minWidth: 20, textAlign: "right" },
  itemBody: { flex: 1, gap: 6 },
  quote: { gap: 8, paddingLeft: 12, borderLeftWidth: 3 },
  code: { overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderRadius: 12 },
  codeTitle: { paddingHorizontal: 12, paddingVertical: 6 },
  codeBody: { padding: 12 },
  table: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 8, overflow: "hidden" },
  row: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  cell: { width: 120, paddingHorizontal: 10, paddingVertical: 8 },
  rule: { height: StyleSheet.hairlineWidth },
});
