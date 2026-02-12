import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <main className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Vital</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Bem-vindo. Faça login ou crie uma conta para continuar.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Registrar</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
