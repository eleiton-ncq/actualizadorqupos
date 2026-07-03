"use client";

import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  LoaderCircle,
  Shuffle,
} from "lucide-react";
import { Card, Pill, PrimaryButton, ProgressBar, Section, StatCard } from "@/components/ui";
import { useDataStore } from "@/lib/data-store";

export default function AdminPage() {
  const { campaigns, stats, workerProgress, assignPending, isRemote, loading } =
    useDataStore();

  if (loading) {
    return <p className="text-sm text-[#756b66]">Cargando datos...</p>;
  }

  return (
    <>
      <section className="mb-7 overflow-hidden rounded-lg border border-[#f1ddcf] bg-white shadow-[0_18px_55px_rgba(77,39,17,0.07)]">
        <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
          <div className="p-6">
            <Pill tone={isRemote ? "green" : "brand"}>
              {isRemote ? "Conectado a Supabase" : "Modo demo local"}
            </Pill>
            <h2 className="mt-4 text-3xl font-bold">
              {campaigns[0]?.name ?? "Actualizacion de datos"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f6b60]">
              Supervisa la operacion, distribuye pendientes y mantén el avance
              visible sin exponer la base completa a los operadores.
            </p>
            <PrimaryButton
              className="mt-5"
              onClick={() => void assignPending()}
              type="button"
            >
              <Shuffle size={17} />
              Asignar pendientes
            </PrimaryButton>
          </div>
          <div className="bg-[#201a17] p-6 text-white">
            <p className="text-sm font-bold text-white/[0.55]">Avance total</p>
            <p className="mt-2 text-5xl font-bold">
              {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </p>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/[0.12]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#fd5b00,#f7b231)]"
                style={{
                  width: `${
                    stats.total
                      ? Math.round((stats.completed / stats.total) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Resumen de cola"
        description="Vista ejecutiva del estado actual de los registros."
      >
        <div className="grid gap-3 md:grid-cols-4">
          <StatCard
            icon={<Database size={20} />}
            label="Total de clientes"
            tone="brand"
            value={stats.total}
          />
          <StatCard
            icon={<Clock3 size={20} />}
            label="Pendientes"
            tone="amber"
            value={stats.pending}
          />
          <StatCard
            icon={<LoaderCircle size={20} />}
            label="En proceso"
            tone="blue"
            value={stats.inProgress}
          />
          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Completados"
            tone="green"
            value={stats.completed}
          />
        </div>
      </Section>

      <Section title="Avance por usuario">
        <div className="grid gap-4 lg:grid-cols-4">
          {workerProgress.map(({ worker, assigned, completed, pending }) => {
            const percent = assigned ? Math.round((completed / assigned) * 100) : 0;

            return (
              <Card className="p-5" key={worker.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{worker.name}</h3>
                    <p className="mt-1 text-xs text-[#6b7b74]">
                      {worker.access_key}
                    </p>
                  </div>
                  <Pill tone={worker.is_active ? "brand" : "neutral"}>
                    {worker.is_active ? "Activo" : "Inactivo"}
                  </Pill>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <p className="text-3xl font-semibold">{percent}%</p>
                  <p className="inline-flex items-center gap-1 text-xs font-bold text-[#9a7b68]">
                    <BarChart3 size={13} />
                    completado
                  </p>
                </div>
                <ProgressBar className="mt-3" value={percent} />
                <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-[#667870]">Asignados</dt>
                    <dd className="font-semibold">{assigned}</dd>
                  </div>
                  <div>
                    <dt className="text-[#667870]">Listos</dt>
                    <dd className="font-semibold">{completed}</dd>
                  </div>
                  <div>
                    <dt className="text-[#667870]">Pend.</dt>
                    <dd className="font-semibold">{pending}</dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>
      </Section>
    </>
  );
}
