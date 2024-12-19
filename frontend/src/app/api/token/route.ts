import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Dekode token
    const { payload } = await jwtVerify(token, secret);

    // Jika berhasil, kembalikan payload yang sudah terdekripsi
    return NextResponse.json({ payload });
  } catch (error) {
    // Tangani error jika token tidak valid atau kedaluwarsa
    console.error("Error decoding token:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
