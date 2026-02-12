"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type User = { id: string; email: string; name: string | null } | null;

export function HeaderAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User>(undefined as unknown as User);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.resolve(null)))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (user === undefined) {
    return (
      <nav className="flex items-center gap-4">
        <span className="text-sm text-[hsl(var(--muted-foreground))]">
          Carregando…
        </span>
      </nav>
    );
  }

  if (user) {
    return (
      <nav className="flex items-center gap-4">
        <span className="text-sm text-[hsl(var(--muted-foreground))]">
          {user.name || user.email}
        </span>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Sair
        </Button>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Entrar</Link>
      </Button>
      <Button asChild variant="outline" size="sm">
        <Link href="/register">Registrar</Link>
      </Button>
    </nav>
  );
}
