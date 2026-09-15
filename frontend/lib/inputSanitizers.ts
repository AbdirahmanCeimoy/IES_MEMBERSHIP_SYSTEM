/**
 * Client-side character filters used at type-time to block obviously
 * invalid characters (letters in phone fields, digits in name fields,
 * a second '@' in email fields). These are UX helpers, not security.
 * Server-side validation is still authoritative.
 */

/** Letters, spaces, apostrophes and hyphens - for human names. */
export const sanitizeName = (value: string): string =>
  value.replace(/[^A-Za-zÀ-ɏḀ-ỿ' -]/g, '');

/** Digits, plus, hyphen, spaces, parentheses - for phone numbers. */
export const sanitizePhone = (value: string): string =>
  value.replace(/[^0-9+\-() ]/g, '');

/** Digits only. Optionally cap length. */
export const sanitizeDigitsOnly = (value: string, maxLength?: number): string => {
  const digits = value.replace(/\D/g, '');
  return maxLength ? digits.slice(0, maxLength) : digits;
};

/** Letters and digits (no symbols, no spaces) - for usernames. */
export const sanitizeUsername = (value: string): string =>
  value.replace(/[^A-Za-z0-9]/g, '').toLowerCase();

/**
 * Email: allow letters, digits, dots, hyphens, underscores, plus, and a
 * single '@'. If a second '@' is typed, drop it. Also strips spaces.
 */
export const sanitizeEmail = (value: string): string => {
  const stripped = value.replace(/[^A-Za-z0-9._%+\-@]/g, '').toLowerCase();
  const firstAt = stripped.indexOf('@');
  if (firstAt === -1) return stripped;
  return stripped.slice(0, firstAt + 1) + stripped.slice(firstAt + 1).replace(/@/g, '');
};
