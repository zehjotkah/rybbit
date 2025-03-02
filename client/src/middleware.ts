import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Check if we're on the exact site route (nothing after site name)
  const siteRoutePattern = /^\/([^/]+)$/;
  const match = path.match(siteRoutePattern);

  if (match) {
    const siteId = match[1];
    // Redirect to the main page for this site
    return NextResponse.redirect(new URL(`/${siteId}/main`, request.url));
  }

  return NextResponse.next();
}

// Only run middleware on specific paths to avoid unnecessary execution
export const config = {
  matcher: "/:site",
};
