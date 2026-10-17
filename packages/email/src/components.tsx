import { Body } from "@react-email/body";
import { Button as RButton } from "@react-email/button";
import { Column } from "@react-email/column";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Heading as RHeading } from "@react-email/heading";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Text as RText } from "@react-email/text";
import type { CSSProperties, ReactNode } from "react";

import { useEmail } from "./context";
import type { EmailTheme } from "./theme";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/**
 * The dark scheme, as classes: Apple Mail, Gmail (web, Android) and Outlook (app) read `prefers-color-scheme`;
 * Outlook.com reads `[data-ogsc]`. Every rule is `!important` because the light colours are inline (the only thing
 * every client keeps). Only theme constants go in: no user input ever reaches this string.
 */
export function darkCss(theme: EmailTheme): string {
  const d = theme.neutrals.dark;
  const c = theme.colours;
  const rules = [
    `.kz-page{background-color:${d.page}!important}`,
    `.kz-card{background-color:${d.card}!important;border-color:${d.border}!important}`,
    `.kz-quote{background-color:${d.quote}!important;border-color:${d.border}!important}`,
    `.kz-text{color:${d.text}!important}`,
    `.kz-muted{color:${d.muted}!important}`,
    `.kz-rule{border-color:${d.border}!important}`,
    `.kz-link{color:${c.link.dark}!important}`,
    `.kz-btn{background-color:${c.accent.dark}!important;border-color:${c.accent.dark}!important;color:${c.onAccent.dark}!important}`,
    `.kz-btn-text{color:${c.onAccent.dark}!important}`,
    `.kz-logo-light{display:none!important;max-height:0!important;overflow:hidden!important}`,
    `.kz-logo-dark{display:inline-block!important;max-height:none!important}`,
  ];
  const media = `@media (prefers-color-scheme:dark){${rules.join("")}}`;
  const outlook = rules.map((r) => `[data-ogsc] ${r}`).join("");
  return `:root{color-scheme:light dark;supported-color-schemes:light dark}.kz-logo-dark{display:none;max-height:0;overflow:hidden}${media}${outlook}@media (max-width:620px){.kz-pad{padding-left:20px!important;padding-right:20px!important}.kz-h1{font-size:24px!important;line-height:30px!important}}`;
}

/** The frame of every email: language, colour schemes, a hidden preheader, one 600 px column on the page colour. */
export function EmailShell({ preheader, children }: { preheader: string; children: ReactNode }) {
  const { theme, locale } = useEmail();
  const light = theme.neutrals.light;
  return (
    <Html lang={locale} dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style dangerouslySetInnerHTML={{ __html: darkCss(theme) }} />
      </Head>
      <Preview>{preheader}</Preview>
      <Body className="kz-page" style={{ margin: 0, padding: 0, fontFamily: FONT }}>
        {/* The page colour is on a table of its own: a client that drops the body's background keeps it, and the dark class reaches it. */}
        <Section className="kz-page" style={{ backgroundColor: light.page }}>
          <Container style={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: "24px 12px" }}>{children}</Container>
        </Section>
      </Body>
    </Html>
  );
}

/** The brand: its mark (a hosted PNG, alt text, a light and a dark one swapped by the scheme) and its name in live text. */
export function Header() {
  const { theme } = useEmail();
  const light = theme.neutrals.light;
  const alt = theme.name;
  return (
    <Section style={{ padding: "8px 8px 20px" }} role="banner">
      <Row>
        <Column style={{ width: 44, verticalAlign: "middle" }}>
          <Img className="kz-logo-light" src={theme.logo.light} width={36} height={36} alt={alt} style={{ display: "block", border: 0 }} />
          <Img className="kz-logo-dark" src={theme.logo.dark} width={36} height={36} alt={alt} style={{ display: "none", maxHeight: 0, overflow: "hidden", border: 0 }} />
        </Column>
        <Column style={{ verticalAlign: "middle" }}>
          <RText className="kz-text" style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "0.2px", color: light.text, fontFamily: FONT }}>
            {theme.name}
          </RText>
        </Column>
      </Row>
    </Section>
  );
}

/** The white (or dark) card holding the message. */
export function Card({ children }: { children: ReactNode }) {
  const { theme } = useEmail();
  const light = theme.neutrals.light;
  return (
    <Section className="kz-card kz-pad" role="main" style={{ backgroundColor: light.card, border: `1px solid ${light.border}`, borderRadius: 12, padding: "32px 32px 28px" }}>
      {children}
    </Section>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  const light = useEmail().theme.neutrals.light;
  return (
    <RHeading as="h1" className="kz-text kz-h1" style={{ margin: "0 0 16px", fontSize: 26, lineHeight: "32px", fontWeight: 700, color: light.text, fontFamily: FONT }}>
      {children}
    </RHeading>
  );
}

/** A small label above a heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  const { theme } = useEmail();
  return (
    <RText className="kz-link" style={{ margin: "0 0 8px", fontSize: 12, lineHeight: "16px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: theme.colours.link.light, fontFamily: FONT }}>
      {children}
    </RText>
  );
}

export function Text({ children, muted = false, small = false }: { children: ReactNode; muted?: boolean; small?: boolean }) {
  const light = useEmail().theme.neutrals.light;
  return (
    <RText className={muted ? "kz-muted" : "kz-text"} style={{ margin: "0 0 16px", fontSize: small ? 13 : 16, lineHeight: small ? "20px" : "26px", color: muted ? light.muted : light.text, fontFamily: FONT }}>
      {children}
    </RText>
  );
}

/** Text with line breaks kept (a visitor's message): each line is escaped by React, joined with `<br>`. */
export function Multiline({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  );
}

/** The one action of the email: a brand-coloured button, bulletproof in Outlook, at least 44 px tall. */
export function Button({ href, children }: { href: string; children: ReactNode }) {
  const { theme } = useEmail();
  const { accent, onAccent } = theme.colours;
  return (
    <Section style={{ margin: "8px 0 20px" }}>
      <RButton
        href={href}
        className="kz-btn"
        style={{ display: "inline-block", backgroundColor: accent.light, border: `1px solid ${accent.light}`, borderRadius: 8, padding: "14px 28px", fontSize: 16, lineHeight: "20px", fontWeight: 700, textDecoration: "none", color: onAccent.light, fontFamily: FONT }}
      >
        <span className="kz-btn-text" style={{ color: onAccent.light }}>
          {children}
        </span>
      </RButton>
    </Section>
  );
}

/** « If the button doesn't work »: the link, small and wrapped, for the mail clients that block buttons. */
export function FallbackLink({ href }: { href: string }) {
  const { theme, t } = useEmail();
  const light = theme.neutrals.light;
  return (
    <Section data-skip-in-text="true">
      <RText className="kz-muted" style={{ margin: "0 0 4px", fontSize: 12, lineHeight: "18px", color: light.muted, fontFamily: FONT }}>
        {t("common.fallback")}
      </RText>
      <RText style={{ margin: "0 0 16px", fontSize: 12, lineHeight: "18px", wordBreak: "break-all", overflowWrap: "anywhere", fontFamily: FONT }}>
        <Link className="kz-link" href={href} style={{ color: theme.colours.link.light, textDecoration: "underline" }}>
          {href}
        </Link>
      </RText>
    </Section>
  );
}

/** A quoted block (the visitor's own message, a comment excerpt): a quiet panel with the brand's rule on the left. */
export function Quote({ children }: { children: ReactNode }) {
  const { theme } = useEmail();
  const light = theme.neutrals.light;
  return (
    <Section className="kz-quote" style={{ margin: "0 0 20px", padding: "14px 16px", backgroundColor: light.quote, borderLeft: `3px solid ${theme.colours.accent.light}`, borderRadius: 6 }}>
      <RText className="kz-text" style={{ margin: 0, fontSize: 15, lineHeight: "24px", color: light.text, fontFamily: FONT }}>
        {children}
      </RText>
    </Section>
  );
}

/** A post in an email: cover (when there is one), title, excerpt. The button is the template's. */
export function PostPreview({ eyebrow, title, excerpt, coverUrl, coverAlt }: { eyebrow: string; title: string; excerpt: string; coverUrl?: string | undefined; coverAlt?: string | undefined }) {
  return (
    <Section>
      {coverUrl ? <Img src={coverUrl} alt={coverAlt ?? ""} width={536} style={{ display: "block", width: "100%", maxWidth: 536, height: "auto", borderRadius: 8, margin: "0 0 20px", border: 0 }} /> : null}
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading>{title}</Heading>
      <Text>{excerpt}</Text>
    </Section>
  );
}

/** A one-time code or a key: large, spaced, monospaced, selectable. */
export function Code({ children }: { children: ReactNode }) {
  const light = useEmail().theme.neutrals.light;
  return (
    <Section className="kz-quote" style={{ margin: "0 0 20px", padding: "16px", backgroundColor: light.quote, borderRadius: 8, textAlign: "center" }}>
      <RText className="kz-text" style={{ margin: 0, fontSize: 28, lineHeight: "36px", fontWeight: 700, letterSpacing: "6px", fontFamily: MONO, color: light.text }}>
        {children}
      </RText>
    </Section>
  );
}

/** A table of labelled values (the contact notification): label, value, one row each. */
export function Facts({ rows }: { rows: readonly (readonly [string, string])[] }) {
  const light = useEmail().theme.neutrals.light;
  return (
    <Section style={{ margin: "0 0 20px" }}>
      {rows.map(([label, value]) => (
        <Row key={label} style={{ borderBottom: `1px solid ${light.border}` }} className="kz-rule">
          <Column style={{ width: 110, padding: "8px 8px 8px 0", verticalAlign: "top" }}>
            <RText className="kz-muted" style={{ margin: 0, fontSize: 13, lineHeight: "20px", color: light.muted, fontFamily: FONT }}>
              {label}
            </RText>
          </Column>
          <Column style={{ padding: "8px 0", verticalAlign: "top" }}>
            <RText className="kz-text" style={{ margin: 0, fontSize: 14, lineHeight: "20px", color: light.text, fontFamily: FONT }}>
              <Multiline text={value} />
            </RText>
          </Column>
        </Row>
      ))}
    </Section>
  );
}

/** The signature: a person (or the team), with the avatar slot. */
export function Signature() {
  const { signature, theme } = useEmail();
  const light = theme.neutrals.light;
  const avatar: CSSProperties = { display: "block", borderRadius: 24, border: 0 };
  return (
    <Section style={{ margin: "8px 0 0" }}>
      <Hr className="kz-rule" style={{ borderColor: light.border, margin: "0 0 16px" }} />
      <Row>
        {signature.avatarUrl ? (
          <Column style={{ width: 60, verticalAlign: "middle" }}>
            <Img src={signature.avatarUrl} width={48} height={48} alt={signature.name} style={avatar} />
          </Column>
        ) : null}
        <Column style={{ verticalAlign: "middle" }}>
          <RText className="kz-text" style={{ margin: 0, fontSize: 15, lineHeight: "22px", fontWeight: 700, color: light.text, fontFamily: FONT }}>
            {signature.name}
          </RText>
          {signature.role ? (
            <RText className="kz-muted" style={{ margin: 0, fontSize: 13, lineHeight: "18px", color: light.muted, fontFamily: FONT }}>
              {signature.role}
            </RText>
          ) : null}
        </Column>
      </Row>
    </Section>
  );
}

/** The quiet footer: why you receive this, one-click unsubscribe, the legal sender, privacy and contact (CASL, Loi 25). */
export function Footer() {
  const { theme, t, why, unsubscribeUrl, legal, links } = useEmail();
  const light = theme.neutrals.light;
  const style = { margin: "0 0 8px", fontSize: 12, lineHeight: "18px", color: light.muted, fontFamily: FONT } satisfies CSSProperties;
  const link = { color: theme.colours.link.light, textDecoration: "underline" } satisfies CSSProperties;
  return (
    <Section role="contentinfo" className="kz-pad" style={{ padding: "20px 16px 8px" }}>
      <RText className="kz-muted" style={style}>
        {why}
      </RText>
      <RText className="kz-muted" style={style}>
        {unsubscribeUrl ? (
          <>
            <Link className="kz-link" href={unsubscribeUrl} style={link}>
              {t("common.footer.unsubscribe")}
            </Link>
            {" · "}
          </>
        ) : null}
        <Link className="kz-link" href={links.privacy} style={link}>
          {t("common.footer.privacy")}
        </Link>
        {" · "}
        <Link className="kz-link" href={links.contact} style={link}>
          {t("common.footer.contact")}
        </Link>
      </RText>
      <RText className="kz-muted" style={style}>
        {t("common.footer.sender", { legal: legal.name, address: legal.address })}
      </RText>
    </Section>
  );
}
