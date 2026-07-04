"use client";

import { PrimaryButton, SecondaryButton, Section, StatCard } from "@/components/ui";
import { useDataStore } from "@/lib/data-store";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function ProgressPage() {
  const { clients, workers, stats, workerProgress, loading } = useDataStore();

  function rows() {
    return clients.map((client) => {
      const worker = workers.find((item) => item.id === client.assigned_worker_id);

      return {
        cli: client.cli_code ?? client.identification,
        cliente: client.client_name,
        razon_comercial: client.trade_name ?? client.client_name,
        razon_social: client.company_name,
        telefono_actual: client.current_phone,
        telefono_2_actual: client.current_phone_2 ?? "",
        correo_actual: client.current_email,
        direccion_actual: client.current_address,
        contactos_actuales: client.contact_info ?? "",
        fax: client.fax ?? "",
        fecha_vence_soporte: client.support_expires_at ?? "",
        distribuidor: client.distributor ?? "",
        tipo_contrato: client.contract_type ?? "",
        descripcion_contrato: client.contract_description ?? "",
        licencias_light: client.licenses_light ?? "",
        licencias_estandar: client.licenses_standard ?? "",
        licencias_erp: client.licenses_erp ?? "",
        licencias_rutas: client.licenses_routes ?? "",
        total_licencias: client.licenses_total ?? "",
        telefono_actualizado: client.updated_phone ?? "",
        correo_actualizado: client.updated_email ?? "",
        direccion_actualizada: client.updated_address ?? "",
        contacto_actualizado: client.updated_contact_name ?? "",
        contacto_principal_nombre:
          client.updated_main_contact_name ?? client.updated_contact_name ?? "",
        contacto_principal_numero:
          client.updated_main_contact_phone ?? client.updated_phone ?? "",
        contacto_principal_correo:
          client.updated_main_contact_email ?? client.updated_email ?? "",
        contacto_cobros_nombre: client.updated_billing_contact_name ?? "",
        contacto_cobros_numero: client.updated_billing_contact_phone ?? "",
        contacto_cobros_correo: client.updated_billing_contact_email ?? "",
        contacto_servicio_nombre: client.updated_support_contact_name ?? "",
        contacto_servicio_numero: client.updated_support_contact_phone ?? "",
        contacto_servicio_correo: client.updated_support_contact_email ?? "",
        provincia_actualizada: client.updated_address_province ?? "",
        canton_actualizado: client.updated_address_canton ?? "",
        distrito_actualizado: client.updated_address_district ?? "",
        otras_senas_actualizadas:
          client.updated_address_details ?? client.updated_address ?? "",
        observaciones: client.observations ?? "",
        estado: client.status,
        usuario_asignado: worker?.name ?? "",
        completado_en: client.completed_at ?? "",
      };
    });
  }

  function exportCsv() {
    const exportRows = rows();
    const headers = Object.keys(exportRows[0] ?? {});
    const csv = [
      headers.join(","),
      ...exportRows.map((row) =>
        headers
          .map((header) => csvEscape(row[header as keyof typeof row]))
          .join(","),
      ),
    ].join("\n");

    downloadBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      "actualizacion-datos.csv",
    );
  }

  async function exportExcel() {
    const xlsx = await import("xlsx");
    const worksheet = xlsx.utils.json_to_sheet(rows());
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Clientes");
    const output = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
    downloadBlob(
      new Blob([output], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "actualizacion-datos.xlsx",
    );
  }

  if (loading) {
    return <p className="text-sm text-[#756b66]">Cargando avance...</p>;
  }

  return (
    <>
      <Section title="Progreso general">
        <div className="grid gap-3 md:grid-cols-5">
          <StatCard label="Total" tone="brand" value={stats.total} />
          <StatCard label="Pendientes" tone="amber" value={stats.pending} />
          <StatCard label="En proceso" tone="blue" value={stats.inProgress} />
          <StatCard label="Completados" tone="green" value={stats.completed} />
          <StatCard label="Omitidos" tone="neutral" value={stats.omitted} />
        </div>
      </Section>

      <Section title="Progreso por usuario">
        <div className="overflow-x-auto rounded-lg border border-[#ffd7bd] bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#fff4ea] text-[#7b2f00]">
              <tr>
                <th className="px-4 py-3 font-semibold">Usuario</th>
                <th className="px-4 py-3 font-semibold">Asignados</th>
                <th className="px-4 py-3 font-semibold">Completados</th>
                <th className="px-4 py-3 font-semibold">Pendientes</th>
                <th className="px-4 py-3 font-semibold">Avance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffe4d1]">
              {workerProgress.map(({ worker, assigned, completed, pending }) => {
                const percent = assigned
                  ? Math.round((completed / assigned) * 100)
                  : 0;

                return (
                  <tr key={worker.id}>
                    <td className="px-4 py-3 font-medium">{worker.name}</td>
                    <td className="px-4 py-3">{assigned}</td>
                    <td className="px-4 py-3">{completed}</td>
                    <td className="px-4 py-3">{pending}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 rounded-full bg-[#fff0dc]">
                          <div
                            className="h-2 rounded-full bg-[#fd5b00]"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="font-semibold">{percent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Exportar informacion actualizada"
        description="Incluye datos originales, campos actualizados, observaciones, estado y usuario asignado."
      >
        <div className="flex flex-wrap gap-3">
          <SecondaryButton onClick={exportCsv} type="button">
            Exportar CSV
          </SecondaryButton>
          <PrimaryButton
            onClick={() => void exportExcel()}
            type="button"
          >
            Exportar Excel
          </PrimaryButton>
        </div>
      </Section>
    </>
  );
}
