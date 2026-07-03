"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { ProgressBar } from "@/components/ui";

const flow = [
  { label: "Carga Excel", icon: FileSpreadsheet },
  { label: "Asigna colas", icon: Users },
  { label: "Actualiza datos", icon: ClipboardList },
  { label: "Exporta avance", icon: BarChart3 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f2] text-[#201a17]">
      <header className="border-b border-[#f1ddcf] bg-white/90 backdrop-blur">
        <div className="flex w-full items-center justify-between px-5 py-4 lg:px-10">
          <BrandLogo />
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-[#201a17] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#3a2e27]"
            href="/admin"
          >
            Entrar
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-52 bg-[linear-gradient(90deg,#fd5b00,#f7b231)]" />
        <div className="relative grid w-full gap-7 px-5 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-12">
          <div className="rounded-lg bg-[#201a17] p-6 text-white shadow-[0_30px_90px_rgba(48,23,11,0.28)] lg:p-8">
            <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase text-white/75">
              Campaña activa
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Actualiza datos de clientes sin perder control de la cola.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
              Un administrador reparte registros y cada usuario trabaja un solo
              cliente a la vez. Menos ruido, menos errores, avance visible.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-[#fd5b00] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(253,91,0,0.35)]"
                href="/admin"
              >
                Abrir panel admin
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[#f1ddcf] bg-white p-5 shadow-[0_28px_80px_rgba(96,47,17,0.14)]">
            <div className="flex flex-col gap-4 border-b border-[#f4e2d6] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#8a3500]">
                  Flujo de trabajo
                </p>
              <h2 className="mt-1 text-2xl font-bold">
                Gestión privada de campañas
              </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8ef] px-3 py-1 text-xs font-bold text-[#166044]">
                <CheckCircle2 size={14} />
                Operativo
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="Base real" value="389" />
              <Metric label="Equipo" value="Activo" />
              <Metric label="Acceso" value="Privado" />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold">Preparado para campaña</span>
                <span className="font-bold text-[#fd5b00]">100%</span>
              </div>
              <ProgressBar value={100} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {flow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    className="rounded-lg border border-[#f4e2d6] bg-[#fffaf6] p-4"
                    key={item.label}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-[#fff0dc] text-[#fd5b00]">
                      <Icon size={18} />
                    </span>
                    <p className="mt-3 text-sm font-bold">{item.label}</p>
                    <p className="mt-1 text-xs font-semibold text-[#9a7b68]">
                      Paso {index + 1}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-[#fff8f2] p-4">
      <p className="text-xs font-bold uppercase text-[#9a7b68]">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
