/**
 * Utility functions for generating correct internal Admin and Main Platform URLs
 * across both subdomain configurations (e.g. `admin.openlabs.org.in`, `admin.localhost:3000`)
 * and direct path-based routing (`/admin/*`).
 */

/**
 * Returns whether the current client session is hosted on an `admin.` subdomain.
 */
export function isAdminSubdomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith("admin.");
}

/**
 * Transforms an `/admin/*` path to a subdomain-safe path if running on `admin.*`,
 * or keeps the full `/admin/*` route when running on the main domain.
 *
 * Example:
 *  - On `openlabs.org.in`: `getAdminHref("/admin/users")` -> `"/admin/users"`
 *  - On `admin.openlabs.org.in`: `getAdminHref("/admin/users")` -> `"/users"`
 *  - On `admin.openlabs.org.in`: `getAdminHref("/admin")` -> `"/"`
 */
export function getAdminHref(path: string): string {
  if (isAdminSubdomain()) {
    return path.replace(/^\/admin/, "") || "/";
  }
  return path;
}

/**
 * Transforms a student / public platform route to the root domain when currently
 * on an `admin.` subdomain, or returns the relative root path when on the main domain.
 *
 * Example:
 *  - On `openlabs.org.in`: `getMainSiteHref("/blog/my-post")` -> `"/blog/my-post"`
 *  - On `admin.openlabs.org.in`: `getMainSiteHref("/blog/my-post")` -> `"https://openlabs.org.in/blog/my-post"`
 *  - On `admin.localhost:3000`: `getMainSiteHref("/labs/ohms-law")` -> `"http://localhost:3000/labs/ohms-law"`
 */
export function getMainSiteHref(path: string): string {
  if (isAdminSubdomain()) {
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : "";
    const mainHost = window.location.hostname.replace(/^admin\./, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${protocol}//${mainHost}${port}${cleanPath}`;
  }
  return path.startsWith("/") ? path : `/${path}`;
}
