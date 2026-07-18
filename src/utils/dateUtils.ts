// ─── Date formatting utilities ─────────────────────────────────────────────────

/**
 * Formats a Date object to a human-readable US locale string.
 * e.g. "July 18, 2026"
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Returns today's date formatted for display.
 */
export function getDefaultIssueDate(): string {
  return formatDisplayDate(new Date());
}

/**
 * Returns a date 2 years from today formatted for display.
 * Used as default ID card expiry.
 */
export function getDefaultExpiryDate(): string {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 2);
  return formatDisplayDate(expiryDate);
}
