import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow access to register page and public assets
  // Also allow access to the logo and other static files in public
  if (
    path === "/register" || 
    path === "/re-register" || 
    path.startsWith("/api") || 
    path.startsWith("/_next") || 
    path.includes(".") ||
    path === "/logo_trindade.png"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  const isMember = token.isMember;
  const isSpecial = token.isSpecial;
  const isAdmin = token.isAdmin;

  if (!isMember && !isSpecial && !isAdmin) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
