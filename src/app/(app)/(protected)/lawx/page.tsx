"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LAWX_BASE_URL = process.env.LAWX_BASE_URL ?? "https://lawx.vitalsolutions.com.br/dashboard";

export default function LawxPage() {
  const router = useRouter();
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadToken() {
      try {
        const res = await fetch("/api/me/lawx-sso-token", { credentials: "include" });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (res.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          router.push("/login?from=/lawx");
          return;
        }

        if (res.status === 503) {
          setError("SSO do LawX não está configurado. Contate o administrador.");
          return;
        }

        if (!res.ok || !data.token) {
          setError("Não foi possível obter o token de acesso ao LawX.");
          return;
        }

        const url = `${LAWX_BASE_URL}?sso_token=${encodeURIComponent(data.token)}`;
        setIframeSrc(url);
      } catch {
        if (!cancelled) setError("Erro ao conectar ao LawX.");
      }
    }

    loadToken();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-xl font-semibold">Lawx</h1>
        <p className="text-[hsl(var(--destructive))]">{error}</p>
      </div>
    );
  }

  if (!iframeSrc) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-xl font-semibold">Lawx</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Carregando LawX…</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Lawx</h1>
      <iframe
        src={iframeSrc}
        title="LawX Dashboard"
        className="h-full min-h-0 w-full flex-1 rounded-md border border-[hsl(var(--border))]"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
}
