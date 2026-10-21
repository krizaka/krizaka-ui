const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** Standard base64 (RFC 4648 §4, padded). Written here because the JavaScript engines of phones do not all ship `atob`. */
export function bytesToBase64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!;
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    const n = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    out += ALPHABET[(n >> 18) & 63]! + ALPHABET[(n >> 12) & 63]!;
    out += b === undefined ? "=" : ALPHABET[(n >> 6) & 63]!;
    out += c === undefined ? "=" : ALPHABET[n & 63]!;
  }
  return out;
}

export function base64ToBytes(text: string): Uint8Array {
  if (text.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(text)) throw new Error("invalid base64");
  const padding = text.endsWith("==") ? 2 : text.endsWith("=") ? 1 : 0;
  const bytes = new Uint8Array((text.length / 4) * 3 - padding);
  let written = 0;
  for (let i = 0; i < text.length; i += 4) {
    let n = 0;
    for (let j = 0; j < 4; j++) n = (n << 6) | (text[i + j] === "=" ? 0 : ALPHABET.indexOf(text[i + j]!));
    for (let j = 0; j < 3 && written < bytes.length; j++) bytes[written++] = (n >> (16 - 8 * j)) & 255;
  }
  return bytes;
}

const encoder = new TextEncoder();
export const utf8 = (text: string): Uint8Array => encoder.encode(text);
