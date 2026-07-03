"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { Card, Pill, PrimaryButton } from "@/components/ui";
import { DataProvider, useDataStore } from "@/lib/data-store";
import type { ClientRecord } from "@/lib/types";

type FormState = {
  updated_phone: string;
  updated_email: string;
  updated_address: string;
  updated_contact_name: string;
  observations: string;
};

export default function WorkPage() {
  return (
    <DataProvider>
      <WorkQueue />
    </DataProvider>
  );
}

function WorkQueue() {
  const params = useParams<{ access_key: string }>();
  const accessKey = decodeURIComponent(params.access_key);
  const { workers, clients, loading, markInProgress, completeClient } =
    useDataStore();

  const worker = workers.find((item) => item.access_key === accessKey);
  const assignedClients = worker
    ? clients.filter((client) => client.assigned_worker_id === worker.id)
    : [];
  const completedClients = assignedClients.filter(
    (client) => client.status === "completed",
  );
  const workerPercent = assignedClients.length
    ? Math.round((completedClients.length / assignedClients.length) * 100)
    : 0;
  const currentClient = useMemo(() => {
    if (!worker) return null;

    return (
      clients.find(
        (client) =>
          client.assigned_worker_id === worker.id &&
          client.status === "in_progress",
      ) ??
      clients.find(
        (client) =>
          client.assigned_worker_id === worker.id &&
          client.status === "pending",
      ) ??
      null
    );
  }, [clients, worker]);

  useEffect(() => {
    if (currentClient?.status === "pending") {
      void markInProgress(currentClient.id);
    }
  }, [currentClient, markInProgress]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff8f2] px-5">
        <Card className="p-6">
          <BrandLogo />
          <p className="mt-4 text-sm text-[#756b66]">Cargando cola...</p>
        </Card>
      </main>
    );
  }

  if (!worker) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff8f2] px-5 text-[#231f20]">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mb-5 flex justify-center">
            <BrandLogo compact />
          </div>
          <h1 className="text-2xl font-semibold">Clave no valida</h1>
          <p className="mt-3 text-sm leading-6 text-[#756b66]">
            Revisa la URL asignada por administracion.
          </p>
        </Card>
      </main>
    );
  }

  if (!currentClient) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fff8f2] px-5 text-[#231f20]">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mb-5 flex justify-center">
            <BrandLogo compact />
          </div>
          <CheckCircle2 className="mx-auto text-[#16a060]" size={42} />
          <p className="text-sm font-semibold uppercase text-[#b54200]">
            {worker.name}
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Cola finalizada</h1>
          <p className="mt-3 text-sm leading-6 text-[#756b66]">
            No tienes clientes pendientes asignados.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8f2] px-5 py-5 text-[#231f20] lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 overflow-hidden rounded-lg border border-[#f1ddcf] bg-white shadow-[0_18px_55px_rgba(77,39,17,0.07)]">
          <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
            <div className="p-5">
              <BrandLogo />
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-[#b54200]">
                    Cola de trabajo
                  </p>
                  <h1 className="text-3xl font-bold">{worker.name}</h1>
                </div>
                <Pill tone="brand">
                  {currentClient.status === "in_progress"
                    ? "En proceso"
                    : "Pendiente"}
                </Pill>
              </div>
            </div>
            <div className="bg-[#201a17] p-5 text-white">
              <p className="text-xs font-bold uppercase text-white/[0.55]">
                Tu avance
              </p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="text-4xl font-bold">{workerPercent}%</p>
                <p className="text-sm font-semibold text-white/[0.65]">
                  {completedClients.length}/{assignedClients.length} listos
                </p>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/[0.12]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#fd5b00,#f7b231)]"
                  style={{ width: `${workerPercent}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase text-[#b54200]">
              Cliente actual
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              {currentClient.client_name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#756b66]">
              Valida los datos visibles y captura solo los campos actualizados.
            </p>
            <dl className="mt-5 grid gap-3 text-sm">
              <Field
                icon={<UserRound size={16} />}
                label="CLI"
                value={currentClient.cli_code ?? currentClient.identification}
              />
              <Field
                icon={<Building2 size={16} />}
                label="Empresa"
                value={currentClient.company_name}
              />
              <Field
                icon={<Phone size={16} />}
                label="Telefono 1"
                value={currentClient.current_phone}
              />
              {currentClient.current_phone_2 ? (
                <Field
                  icon={<Phone size={16} />}
                  label="Telefono 2"
                  value={currentClient.current_phone_2}
                />
              ) : null}
              <Field
                icon={<Mail size={16} />}
                label="Correo"
                value={currentClient.current_email}
              />
              <Field
                icon={<MapPin size={16} />}
                label="Direccion"
                value={currentClient.current_address}
              />
              {currentClient.contact_info ? (
                <Field
                  icon={<FileText size={16} />}
                  label="Contactos registrados"
                  value={currentClient.contact_info}
                />
              ) : null}
              {currentClient.contract_type || currentClient.distributor ? (
                <Field
                  icon={<ShieldCheck size={16} />}
                  label="Contrato"
                  value={[
                    currentClient.contract_type,
                    currentClient.distributor,
                    currentClient.licenses_total
                      ? `${currentClient.licenses_total} licencia(s)`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                />
              ) : null}
            </dl>
          </Card>

          <ClientForm
            client={currentClient}
            completeClient={completeClient}
            key={currentClient.id}
          />
        </section>
      </div>
    </main>
  );
}

function ClientForm({
  client,
  completeClient,
}: {
  client: ClientRecord;
  completeClient: (
    clientId: string,
    fields: Pick<
      ClientRecord,
      | "updated_phone"
      | "updated_email"
      | "updated_address"
      | "updated_contact_name"
      | "observations"
    >,
  ) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>({
    updated_phone: client.updated_phone ?? "",
    updated_email: client.updated_email ?? "",
    updated_address: client.updated_address ?? "",
    updated_contact_name: client.updated_contact_name ?? "",
    observations: client.observations ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    await completeClient(client.id, form);
    setSaving(false);
  }

  return (
    <form
      className="rounded-lg border border-[#f1ddcf] bg-white p-5 shadow-[0_18px_55px_rgba(77,39,17,0.07)]"
      onSubmit={submit}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#b54200]">
            <ClipboardCheck size={15} />
            Captura
          </p>
          <h2 className="mt-1 text-2xl font-bold">Actualizar datos</h2>
          <p className="mt-1 text-sm leading-6 text-[#7f6b60]">
            Completa los campos confirmados. Puedes dejar observaciones para el
            equipo administrativo.
          </p>
        </div>
        <span className="rounded-full bg-[#fff0dc] px-3 py-1 text-xs font-semibold text-[#8f3900]">
          5 campos
        </span>
      </div>
      <div className="mt-4 grid gap-4">
        <Input
          label="Telefono actualizado"
          onChange={(value) =>
            setForm((current) => ({ ...current, updated_phone: value }))
          }
          value={form.updated_phone}
        />
        <Input
          label="Correo actualizado"
          onChange={(value) =>
            setForm((current) => ({ ...current, updated_email: value }))
          }
          type="email"
          value={form.updated_email}
        />
        <Input
          label="Direccion actualizada"
          onChange={(value) =>
            setForm((current) => ({ ...current, updated_address: value }))
          }
          value={form.updated_address}
        />
        <Input
          label="Nombre de contacto actualizado"
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              updated_contact_name: value,
            }))
          }
          value={form.updated_contact_name}
        />
        <label className="text-sm font-medium">
          <span className="font-bold text-[#3c302a]">Observaciones</span>
          <textarea
            className="mt-1 min-h-28 w-full rounded-md border border-[#f3c27b] bg-[#fffdfb] px-3 py-3 outline-none transition focus:border-[#fd5b00] focus:ring-4 focus:ring-[#fd5b00]/10"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                observations: event.target.value,
              }))
            }
            value={form.observations}
          />
        </label>
      </div>
      <PrimaryButton className="mt-5 w-full" disabled={saving} type="submit">
        {saving ? "Guardando..." : "Guardar y siguiente"}
      </PrimaryButton>
    </form>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-[#f5e4d8] bg-[#fffaf6] p-3">
      <dt className="mt-0.5 text-[#fd5b00]">{icon}</dt>
      <dd className="min-w-0">
        <p className="text-xs font-bold uppercase text-[#a56a42]">{label}</p>
        <p className="mt-1 break-words font-semibold">{value}</p>
      </dd>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm font-medium">
      <span className="font-bold text-[#3c302a]">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-[#f3c27b] bg-[#fffdfb] px-3 py-3 outline-none transition focus:border-[#fd5b00] focus:ring-4 focus:ring-[#fd5b00]/10"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}
