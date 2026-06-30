const DEFAULT_BASE_URL = "http://localhost:3000";
const DEFAULT_FROM_ADDRESS = "JEVXO <info@jevxo.com>";
const DEFAULT_FOUNDER_EMAIL = "info@jevxo.com";

function isUsableEmail(value: string | undefined): value is string {
  return Boolean(value && value.includes("@"));
}

export function getBaseUrl() {
  return process.env.BASE_URL?.trim() || DEFAULT_BASE_URL;
}

export function getResendFromAddress() {
  return process.env.RESEND_FROM_ADDRESS?.trim() || DEFAULT_FROM_ADDRESS;
}

export function getFounderNotificationRecipients(...emails: Array<string | undefined>) {
  const deduped = new Map<string, string>();

  for (const email of [...emails, DEFAULT_FOUNDER_EMAIL]) {
    if (!isUsableEmail(email)) continue;
    deduped.set(email.trim().toLowerCase(), email.trim());
  }

  return Array.from(deduped.values());
}
