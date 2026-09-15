export const USERNAME_REGEX = /^(?=.{3,32}$)[a-z0-9]+$/i;
export const GMAIL_REGEX = /^[a-z0-9._%+-]+@gmail\.com$/i;
/** 8–16 chars, must contain at least one uppercase, one lowercase and one number. */
export const SECURE_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

export const USERNAME_RULE =
  'Username: 3-32 letters or numbers only.';

export const EMAIL_RULE = 'Email must end with @gmail.com.';

export const SECURE_PASSWORD_RULE =
  '8–16 characters · uppercase · lowercase · number';

export const normalizeUsername = (value: string) =>
  value.trim().toLowerCase();

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const isValidUsername = (value: string) =>
  USERNAME_REGEX.test(normalizeUsername(value));

export const isValidGmail = (value: string) =>
  GMAIL_REGEX.test(normalizeEmail(value));

export const isValidSecurePassword = (value: string) =>
  SECURE_PASSWORD_REGEX.test(value.trim());
