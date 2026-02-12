"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type User = { id: string; email: string; name: string | null };

export function DashboardWelcome() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => data.user && setUser(data.user))
      .catch(() => {});
  }, []);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Área protegida. Carregando…</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[hsl(var(--muted-foreground))]">Aguarde.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Área protegida. Você está autenticado.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[hsl(var(--muted-foreground))]">
          Bem-vindo, <strong>{user.name || user.email}</strong>.
        </p>
      </CardContent>
    </Card>
  );
}
