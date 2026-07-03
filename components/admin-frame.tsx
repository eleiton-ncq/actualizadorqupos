"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Database,
  FileSpreadsheet,
  LayoutDashboard,
  LockKeyhole,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { PrimaryButton } from "@/components/ui";
import { DataProvider } from "@/lib/data-store";

const navItems = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/workers", label: "Usuarios", icon: Users },
  { href: "/admin/clients", label: "Clientes", icon: Database },
  { href: "/admin/import", label: "Importar", icon: FileSpreadsheet },
  { href: "/admin/progress", label: "Avance", icon: BarChart3 },
];

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [input, setInput] = useState("");
  const [allowed, setAllowed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("admin-key-ok") === "true",
  );
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: input }),
    });

    if (response.ok) {
      localStorage.setItem("admin-key-ok", "true");
      setAllowed(true);
      return;
    }

    setError("Clave administrativa invalida.");
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-[#fff8f2] text-[#201a17]">
        <div className="mx-auto grid min-h-screen max-w-6xl px-5 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8">
          <section className="hidden lg:block">
            <BrandLogo />
            <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight">
              Una campaña de datos con control, ritmo y trazabilidad.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#7f6b60]">
              Administra usuarios, reparte clientes y mide avance sin exponer
              la base completa a cada operador.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {["Carga", "Asignacion", "Exportacion"].map((item, index) => (
                <div
                  className="rounded-lg border border-[#ffd5bd] bg-white p-4 shadow-sm"
                  key={item}
                >
                  <p className="grid h-8 w-8 place-items-center rounded-md bg-[#f7b231] text-sm font-bold">
                    {index + 1}
                  </p>
                  <p className="mt-3 text-sm font-bold">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <form
            className="mx-auto w-full max-w-md rounded-lg border border-[#ffd5bd] bg-white p-6 shadow-[0_24px_80px_rgba(96,47,17,0.12)]"
            onSubmit={submit}
          >
            <div className="flex items-center justify-between gap-4">
              <BrandLogo />
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[#fff1e7] text-[#fd5b00]">
                <LockKeyhole size={20} />
              </span>
            </div>
            <div className="mt-7">
              <p className="text-sm font-bold uppercase text-[#b13e00]">
                Panel administrativo
              </p>
              <h2 className="mt-1 text-2xl font-bold">Entrar a la campaña</h2>
              <p className="mt-2 text-sm leading-6 text-[#7f6b60]">
                Usa la clave administrativa para gestionar colas, usuarios,
                importacion y reportes.
              </p>
            </div>
            <label className="mt-6 block text-sm font-bold" htmlFor="adminKey">
              Clave administrativa
            </label>
            <input
              className="mt-2 w-full rounded-md border border-[#f3c27b] bg-[#fffdfb] px-3 py-3 outline-none transition focus:border-[#fd5b00] focus:ring-4 focus:ring-[#fd5b00]/10"
              id="adminKey"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ingresa la clave"
              type="password"
              value={input}
            />
            <PrimaryButton className="mt-4 w-full" type="submit">
              Entrar al panel
            </PrimaryButton>
            {error ? (
              <p className="mt-4 rounded-md bg-[#fff1e7] px-3 py-2 text-xs font-bold text-[#b13e00]">
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </main>
    );
  }

  return (
    <DataProvider>
      <main className="min-h-screen bg-[#fff8f2] text-[#201a17]">
        <div className="mx-auto flex max-w-[1500px] gap-0 lg:min-h-screen">
          <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-[#f1ddcf] bg-[#201a17] p-5 text-white lg:block">
            <BrandLogo inverted />
            <nav className="mt-8 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-[#fd5b00] text-white shadow-[0_14px_35px_rgba(253,91,0,0.35)]"
                        : "text-white/[0.72] hover:bg-white/[0.08] hover:text-white"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/10 bg-white/[0.07] p-4">
              <p className="text-xs font-bold uppercase text-white/50">
                Campaña
              </p>
              <p className="mt-1 text-sm font-bold">Actualizacion de datos</p>
              <p className="mt-2 text-xs leading-5 text-white/[0.55]">
                Cola operativa conectada a la base configurada.
              </p>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-10 border-b border-[#f1ddcf] bg-white/[0.92] px-5 py-4 backdrop-blur lg:hidden">
              <div className="flex items-center justify-between gap-4">
                <BrandLogo compact />
                <nav className="flex gap-1 overflow-x-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        aria-label={item.label}
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${
                          active
                            ? "bg-[#fd5b00] text-white"
                            : "bg-[#fff2e9] text-[#8a3500]"
                        }`}
                        href={item.href}
                        key={item.href}
                      >
                        <Icon size={18} />
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </header>
            <div className="px-5 py-6 lg:px-8 lg:py-8">{children}</div>
          </div>
        </div>
      </main>
    </DataProvider>
  );
}
