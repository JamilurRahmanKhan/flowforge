const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("flowforge_token")
      : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("flowforge_token");
      }
      throw new Error("UNAUTHORIZED");
    }

    let errorMessage = "Request failed";

    try {
      const errorData = await response.json();
      errorMessage =
        errorData?.message ||
        errorData?.error ||
        errorMessage;
    } catch {
      // ignore JSON parse error for empty/non-JSON error response
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}