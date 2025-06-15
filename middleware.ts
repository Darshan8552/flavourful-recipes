import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/token";

const protectedPaths = [
  "/dashboard",
  "/upload-recipe",
  "/profile",
  "/recipes",
  "/recipes/",
];

const authPaths = ["/signin", "/signup", "/verify"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  const token = request.cookies.get("auth-token")?.value;

  if (isProtectedPath && !token) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  if (token) {
    const { valid } = await verifyToken(token);
    if (!valid && isProtectedPath) {
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    if (valid && isAuthPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/dashbooard",
    "/upload-recipe",
    "/recipes",
    "/recipes/:id*",
  ],
};
