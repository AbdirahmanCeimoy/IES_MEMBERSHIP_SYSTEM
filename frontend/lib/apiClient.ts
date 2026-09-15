export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api';

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
}

const parseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const apiRequest = async <T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const data = (await parseBody(response)) as T | null;

  return {
    ok: response.ok,
    status: response.status,
    data
  };
};

export const apiJsonRequest = async <T>(
  path: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body: unknown,
  init?: Omit<RequestInit, 'body' | 'method'>
): Promise<ApiResponse<T>> => {
  const extraHeaders = (init?.headers || {}) as Record<string, string>;

  return apiRequest<T>(path, {
    ...init,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders
    },
    body: JSON.stringify(body)
  });
};
