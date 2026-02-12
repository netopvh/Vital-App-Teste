import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  createToken,
  getAuthCookieName,
  getCookieOptions,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { message: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail.length < 3) {
      return NextResponse.json({ message: "E-mail inválido." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Já existe uma conta com este e-mail." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        passwordHash,
        name: typeof name === "string" && name.trim() ? name.trim() : null,
      },
    });

    const token = await createToken({ sub: user.id, email: user.email });
    const cookieName = getAuthCookieName();
    const options = getCookieOptions();
    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
    response.cookies.set(cookieName, token, options);

    return response;
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json(
      { message: "Erro ao criar conta." },
      { status: 500 }
    );
  }
}
