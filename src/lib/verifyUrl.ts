const DEFAULT_ORIGIN =
  typeof process !== "undefined" && process.env.BASE_URL
    ? process.env.BASE_URL.replace(/\/$/, "")
    : "https://www.jevxo.com";

export function normalizeVerifyId(id: string): string {
  return decodeURIComponent(id).trim();
}

export function buildVerifyUrl(id: string, origin?: string): string {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : DEFAULT_ORIGIN);
  const normalized = id.replace(/\//g, "-");
  return `${base}/verify/${encodeURIComponent(normalized)}`;
}
