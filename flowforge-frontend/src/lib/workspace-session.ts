const WORKSPACE_KEY = "flowforge_active_workspace_slug";

export function getActiveWorkspaceSlug() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(WORKSPACE_KEY) || "";
}

export function setActiveWorkspaceSlug(slug: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WORKSPACE_KEY, slug);
}

export function clearActiveWorkspaceSlug() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WORKSPACE_KEY);
}