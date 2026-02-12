"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lawx", label: "Lawx" },
] as const;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 gap-6">
      <aside
        className="flex w-52 shrink-0 flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--muted))] py-4"
        aria-label="Navegação principal"
      >
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Menu
        </p>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <ProtectedNavLink key={item.href} href={item.href}>
              {item.label}
            </ProtectedNavLink>
          ))}
        </nav>
      </aside>
      <div className="min-h-0 min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ProtectedNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
          : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
      }`}
    >
      {children}
    </Link>
  );
}
