import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, getAuthCookieName } from "@/lib/auth";
import { signLawxSSOToken } from "@/lib/lawx-sso";

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const cookieName = getAuthCookieName();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });
  }

  const secret = process.env.CENTRALIA_SSO_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "SSO não configurado." },
      { status: 503 }
    );
  }

  const ssoToken = signLawxSSOToken(payload.email, secret);
  return NextResponse.json({ token: ssoToken });
}
