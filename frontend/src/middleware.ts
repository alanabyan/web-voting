/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);

// Fungsi untuk memverifikasi token
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  if (!token) {
    if (url.pathname !== "/login") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    console.log("Token tidak valid");
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const { role } = decoded as { role: string };

  if (url.pathname === "/login") {
    if (role === "ADMIN") {
      url.pathname = "/dashboard";
    } else {
      url.pathname = "/";
    }
    return NextResponse.redirect(url);
  }

  if (url.pathname === "/dashboard" && role !== "ADMIN") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/login", "/vote"],
};
