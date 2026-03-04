import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_KEY } from "./lib/session-constants";
import { decrypt } from "./lib/session";

const publicRoutes = ["/login", "/"];
const userRoutes = ["/profile", "/documents"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isUserRoute = userRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get(SESSION_COOKIE_KEY)?.value;
  const session = await decrypt(cookie);

  // Redirect to /login if the user is not authenticated and is in an admin route or user route
  if ((isAdminRoute || isUserRoute) && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to the right access if the user is not in the right accessible page
  if (isAdminRoute && session?.role === "USER") {
    return NextResponse.redirect(new URL("/profile", req.nextUrl));
  }
  if (isUserRoute && session?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/storage", req.nextUrl));
  }

  // Redirect to admin page if the user is authenticated and an admin but is in a public route
  if (
    isPublicRoute &&
    session?.userId &&
    session?.role === "ADMIN" &&
    !req.nextUrl.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/admin/storage", req.nextUrl));
  }

  // Redirect to user page if the user is authenticated and a user but is in a public route
  if (
    isPublicRoute &&
    session?.userId &&
    session?.role === "USER" &&
    !req.nextUrl.pathname.startsWith("/profile")
  ) {
    return NextResponse.redirect(new URL("/profile", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
