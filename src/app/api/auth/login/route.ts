import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createToken, getAuthCookieName, getCookieOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { message: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (!user) {
      return NextResponse.json(
        { message: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { message: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const token = await createToken({ sub: user.id, email: user.email });
    const cookieName = getAuthCookieName();
    const options = getCookieOptions();
    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } }
    );
    response.cookies.set(cookieName, token, options);

    return response;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { message: "Erro ao entrar." },
      { status: 500 }
    );
  }
}
