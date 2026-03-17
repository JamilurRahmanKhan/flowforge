const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("flowforge_token")
      : null;

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Cannot connect to backend. Make sure Spring Boot is running on http://localhost:8080");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("UNAUTHORIZED");
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        const data = await response.json();
        throw new Error(data.message || data.error || "Request failed");
      } catch {
        throw new Error("Request failed");
      }
    }

    try {
      const text = await response.text();
      throw new Error(text || "Request failed");
    } catch {
      throw new Error("Request failed");
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}