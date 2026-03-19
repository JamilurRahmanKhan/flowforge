import { getToken } from "@/lib/auth";

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:8080";

function buildUrl(input: string) {
  if (/^https?:\/\//i.test(input)) {
    return input;
  }

  if (!input.startsWith("/")) {
    return `${API_BASE_URL}/${input}`;
  }

  return `${API_BASE_URL}${input}`;
}

function buildHeaders(options?: RequestInit): Headers {
  const headers = new Headers(options?.headers || {});
  const contentType = headers.get("Content-Type") || headers.get("content-type");

  if (!contentType && options?.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();

      if (typeof data === "string" && data.trim()) {
        return data;
      }

      if (typeof data?.message === "string" && data.message.trim()) {
        return data.message;
      }

      if (typeof data?.error === "string" && data.error.trim()) {
        return data.error;
      }

      return `Request failed with status ${response.status}`;
    }

    const text = await response.text();

    if (text.includes("<!DOCTYPE html") || text.includes("<html")) {
      if (response.status === 404) {
        return "API endpoint not found. Check your backend URL and server.";
      }
      return "The frontend received an HTML page instead of an API response.";
    }

    if (text.trim()) {
      return text;
    }
  } catch {
    // ignore parse failure
  }

  if (response.status === 401) return "UNAUTHORIZED";
  if (response.status === 403) {
    return "You do not have permission to perform this action";
  }
  if (response.status === 404) return "Resource not found";
  if (response.status >= 500) return "Server error. Please try again.";

  return "Request failed";
}

export async function apiClient<T>(
  input: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = true, ...fetchOptions } = options;

  const headers = buildHeaders(fetchOptions);

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(input), {
    ...fetchOptions,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return (await response.text()) as T;
}