import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Rutas públicas
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if(pathname.startsWith("/admin")) {
    try {
      const decoded = jwt.decode(token) as { esadmin?: string } | null;
      if(!decoded || decoded.esadmin !== "true") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    catch {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};