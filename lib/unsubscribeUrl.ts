const SITE_URL = "https://lightpatternsonline.com";

export function unsubscribeUrl(email: string): string {
  const encoded = Buffer.from(email).toString("base64url");
  return `${SITE_URL}/unsubscribe?e=${encoded}`;
}

export function decodeUnsubscribeEmail(encoded: string): string | null {
  try {
    const decoded = Buffer.from(encoded, "base64url").toString("utf-8");
    // Basic sanity check
    return decoded.includes("@") ? decoded : null;
  } catch {
    return null;
  }
}
