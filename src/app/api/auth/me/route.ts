import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken, getAuthCookieName } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieName = getAuthCookieName();
  const token =
    cookieStore.get(cookieName)?.value ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ message: "Token inválido ou expirado." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json({ message: "Usuário não encontrado." }, { status: 401 });
  }

  return NextResponse.json({ user });
}
