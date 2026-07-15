"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Package, LogOut, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  { href: "/hoe-werkt-het", label: "Hoe werkt het" },
  { href: "/voor-partners", label: "Voor partners" },
  { href: "/blog", label: "Blog" },
  { href: "/veelgestelde-vragen", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  const dashboardHref = role === "ADMIN" ? "/admin" : role === "PARTNER" ? "/partner" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-ink-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Package size={18} />
          </span>
          <span className="hidden sm:inline">IkWilVanMeSpullenAf</span>
          <span className="sm:hidden">IWMSA</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink-600 hover:text-ink-900">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <Link href={dashboardHref} className="btn-ghost text-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary text-sm">
                <LogOut size={16} /> Uitloggen
              </button>
            </>
          ) : (
            <>
              <Link href="/inloggen" className="btn-ghost text-sm">
                Inloggen
              </Link>
              <Link href="/aanvraag" className="btn-primary text-sm">
                Spullen kwijt?
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <hr className="my-1 border-ink-100" />
            {session ? (
              <>
                <Link href={dashboardHref} className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-left text-sm font-medium text-ink-700">
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link href="/inloggen" className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>
                  Inloggen
                </Link>
                <Link href="/aanvraag" className="btn-primary w-full text-sm" onClick={() => setOpen(false)}>
                  Spullen kwijt?
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
