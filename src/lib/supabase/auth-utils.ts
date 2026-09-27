export const ADMIN_APP_METADATA_KEY = "role";
export const ADMIN_ROLE = "admin";

type AppMetadataLike = Record<string, unknown> | null | undefined;

export function isAdminMetadata(appMetadata: AppMetadataLike) {
  if (!appMetadata || typeof appMetadata !== "object") {
    return false;
  }

  return (appMetadata as Record<string, unknown>)[ADMIN_APP_METADATA_KEY] === ADMIN_ROLE;
}

export function isAdminUser(user: { app_metadata?: unknown } | null) {
  if (!user) {
    return false;
  }

  return isAdminMetadata(user.app_metadata as AppMetadataLike);
}

export function isProtectedAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isPublicAdminPath(pathname: string) {
  return pathname === "/admin/login";
}
