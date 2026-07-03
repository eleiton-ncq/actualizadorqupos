"use client";

import { EmptyState, Pill, Section } from "@/components/ui";
import { useDataStore } from "@/lib/data-store";
import type { ClientStatus } from "@/lib/types";

const statusTone: Record<ClientStatus, "amber" | "blue" | "green"> = {
  pending: "amber",
  in_progress: "blue",
  completed: "green",
};

const statusLabel: Record<ClientStatus, string> = {
  pending: "Pendiente",
  in_progress: "En proceso",
  completed: "Completado",
};

export default function ClientsPage() {
  const { clients, workers, loading } = useDataStore();

  if (loading) {
    return <p className="text-sm text-[#756b66]">Cargando clientes...</p>;
  }

  return (
    <Section
      title="Clientes cargados"
      description="Esta tabla completa solo existe para administracion. Los usuarios de trabajo ven un cliente a la vez."
    >
      {clients.length ? (
        <div className="overflow-x-auto rounded-lg border border-[#ffd7bd] bg-white shadow-sm">
          <table className="w-full min-w-[1360px] text-left text-sm">
            <thead className="bg-[#fff4ea] text-[#7b2f00]">
              <tr>
                <th className="px-4 py-3 font-semibold">CLI</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Razon social</th>
                <th className="px-4 py-3 font-semibold">Telefono 1</th>
                <th className="px-4 py-3 font-semibold">Telefono 2</th>
                <th className="px-4 py-3 font-semibold">Correo</th>
                <th className="px-4 py-3 font-semibold">Contacto</th>
                <th className="px-4 py-3 font-semibold">Asignado</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffe4d1]">
              {clients.map((client) => {
                const worker = workers.find(
                  (item) => item.id === client.assigned_worker_id,
                );

                return (
                  <tr key={client.id}>
                    <td className="px-4 py-3 font-mono text-xs">
                      {client.cli_code ?? client.identification}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {client.client_name}
                    </td>
                    <td className="px-4 py-3">{client.company_name}</td>
                    <td className="px-4 py-3">{client.current_phone}</td>
                    <td className="px-4 py-3">{client.current_phone_2 ?? ""}</td>
                    <td className="px-4 py-3">{client.current_email}</td>
                    <td className="max-w-[260px] truncate px-4 py-3">
                      {client.contact_info ?? ""}
                    </td>
                    <td className="px-4 py-3">
                      {worker?.name ?? "Sin asignar"}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={statusTone[client.status]}>
                        {statusLabel[client.status]}
                      </Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={client.source_sheet === "Hoja1+Hoja3" ? "brand" : "neutral"}>
                        {client.source_sheet ?? "Manual"}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No hay clientes cargados todavia." />
      )}
    </Section>
  );
}
