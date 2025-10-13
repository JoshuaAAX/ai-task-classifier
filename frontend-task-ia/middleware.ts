import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Obtener token desde cookies
  const token = req.cookies.get("auth_token")?.value

  // Si intenta acceder al dashboard sin token → redirigir
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/auth/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Definir qué rutas están protegidas
export const config = {
  matcher: ["/dashboard/:path*"], // protege /dashboard y sus subrutas
}