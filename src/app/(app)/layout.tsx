import Link from "next/link";
import { HeaderAuth } from "@/components/header-auth";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link href="/" className="font-semibold">
            Vital
          </Link>
          <HeaderAuth />
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col p-4 md:p-6">{children}</main>
    </div>
  );
}
