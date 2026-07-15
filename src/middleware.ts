import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/partner") && role !== "PARTNER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/inloggen" },
  }
);

// Let op: /partner/registreren staat hier bewust NIET in, want die pagina moet
// toegankelijk zijn voor bezoekers zonder account (het is het registratieformulier).
export const config = {
  matcher: ["/dashboard/:path*", "/partner", "/partner/werkgebied/:path*", "/partner/abonnement/:path*", "/partner/statistieken/:path*", "/partner/profiel/:path*", "/admin/:path*"],
};
