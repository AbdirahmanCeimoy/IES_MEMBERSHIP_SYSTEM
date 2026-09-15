const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

const isBrowser = () => typeof window !== 'undefined';

export const getAuthToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const getStoredUser = <T>(): T | null => {
  if (!isBrowser()) {
    return null;
  }

  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const saveAuthSession = (token: string, user: unknown): void => {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearAuthSession = (): void => {
  if (!isBrowser()) {
    return;
  }
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

/** Merge partial user fields into the stored user without changing the token. */
export const patchStoredUser = (patch: Record<string, unknown>): void => {
  if (!isBrowser()) return;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  const current = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
};

export const buildAuthHeader = (
  token: string | null | undefined
): Record<string, string> => {
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};
