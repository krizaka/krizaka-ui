// A contact card (vCard 3.0, RFC 2426) from public facts, for a QR code or a « copy the vCard » action. Pure and server-safe:
// no dependency, nothing sent anywhere. Lines without a value are left out.

export interface VCardFields {
  /** The name a phone shows (FN): the trade name, or the person's name. */
  name: string;
  /** The organisation (ORG): the legal name. */
  organization?: string | null;
  /** The postal address, each part optional. */
  address?: { street?: string | null; city?: string | null; region?: string | null; postalCode?: string | null; country?: string | null } | null;
  email?: string | null;
  phone?: string | null;
  /** The website (URL). */
  url?: string | null;
}

/** Escapes a value for a vCard text field: backslash, newline, comma and semicolon. */
export const escapeVCard = (value: string): string => value.replace(/[\\,;]/g, String.raw`\$&`).replace(/\r?\n/g, String.raw`\n`);

const present = (value: string | null | undefined): value is string => typeof value === "string" && value.trim() !== "";

/** The vCard 3.0 text of the fields, lines joined by CRLF as the format asks. */
export function vCard(fields: VCardFields): string {
  const { name, organization, address, email, phone, url } = fields;
  const parts = address ? [address.street, address.city, address.region, address.postalCode, address.country] : [];
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(name.trim())}`,
    present(organization) ? `ORG:${escapeVCard(organization.trim())}` : null,
    parts.some(present) ? `ADR;TYPE=WORK:;;${parts.map((part) => escapeVCard((part ?? "").trim())).join(";")}` : null,
    present(email) ? `EMAIL;TYPE=WORK:${escapeVCard(email.trim())}` : null,
    present(phone) ? `TEL;TYPE=WORK:${escapeVCard(phone.trim())}` : null,
    present(url) ? `URL:${escapeVCard(url.trim())}` : null,
    "END:VCARD",
  ];
  return lines.filter((line): line is string => line !== null).join("\r\n");
}
