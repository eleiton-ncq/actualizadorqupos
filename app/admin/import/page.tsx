"use client";

import { useState } from "react";
import { PrimaryButton, SecondaryButton, Section } from "@/components/ui";
import { useDataStore } from "@/lib/data-store";

type ImportRow = {
  client_name: string;
  identification: string;
  current_phone: string;
  current_phone_2?: string | null;
  current_email: string;
  current_address: string;
  company_name: string;
  cli_code?: string | null;
  trade_name?: string | null;
  contact_info?: string | null;
  fax?: string | null;
  support_expires_at?: string | null;
  distributor?: string | null;
  contract_type?: string | null;
  contract_description?: string | null;
  licenses_light?: number | null;
  licenses_standard?: number | null;
  licenses_erp?: number | null;
  licenses_routes?: number | null;
  licenses_total?: number | null;
  source_sheet?: string | null;
};

const columnMap: Record<keyof ImportRow, string[]> = {
  client_name: ["Razón comercial", "Nombre del cliente", "Cliente", "client_name", "nombre"],
  identification: ["Cliente", "Código de cliente / CLI", "Identificacion", "Identificación", "identification"],
  current_phone: ["Teléfono 1", "Telefono actual", "Teléfono actual", "current_phone"],
  current_phone_2: ["Teléfono 2", "Telefono 2", "current_phone_2"],
  current_email: ["Correo", "Email", "Correo actual", "current_email"],
  current_address: ["Dirección", "Direccion actual", "Dirección actual", "current_address"],
  company_name: ["Razón social", "Empresa", "Razon social", "company_name"],
  cli_code: ["Código de cliente / CLI", "Cliente"],
  trade_name: ["Razón comercial"],
  contact_info: ["Contactos", "Información contactos"],
  fax: ["Fax"],
  support_expires_at: ["Fecha vence soporte"],
  distributor: ["Distribuidor"],
  contract_type: ["Tipo de contrato"],
  contract_description: ["Contrato / descripción"],
  licenses_light: ["Licencias Light"],
  licenses_standard: ["Licencias Estándar"],
  licenses_erp: ["Licencias ERP"],
  licenses_routes: ["Licencias Rutas"],
  licenses_total: ["Total de licencias"],
  source_sheet: [],
};

function readCell(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }

  return "";
}

function readNumber(row: Record<string, unknown>, keys: string[]) {
  const value = readCell(row, keys).replace(/,/g, "");
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function readDate(row: Record<string, unknown>, keys: string[]) {
  const raw = readCell(row, keys);
  if (!raw) return null;

  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slash) {
    const [, day, month, year] = slash;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function firstVisibleSheet(workbook: {
  SheetNames: string[];
  Workbook?: { Sheets?: { Hidden?: number }[] };
}) {
  const sheetMeta = workbook.Workbook?.Sheets ?? [];
  return (
    workbook.SheetNames.find((name, index) => !sheetMeta[index]?.Hidden) ??
    workbook.SheetNames[0]
  );
}

export default function ImportPage() {
  const { loadDemoData, importClients, assignPending } = useDataStore();
  const [message, setMessage] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const xlsx = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "array" });
    const sheetName = firstVisibleSheet(workbook);
    const sheet = workbook.Sheets[sheetName];
    const rawRows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet);
    const rows: ImportRow[] = rawRows
      .map((row) => ({
        client_name: readCell(row, columnMap.client_name),
        identification: readCell(row, columnMap.identification),
        current_phone: readCell(row, columnMap.current_phone),
        current_phone_2: readCell(row, columnMap.current_phone_2) || null,
        current_email: readCell(row, columnMap.current_email),
        current_address: readCell(row, columnMap.current_address),
        company_name: readCell(row, columnMap.company_name),
        cli_code: readCell(row, columnMap.cli_code) || null,
        trade_name: readCell(row, columnMap.trade_name) || null,
        contact_info: readCell(row, columnMap.contact_info) || null,
        fax: readCell(row, columnMap.fax) || null,
        support_expires_at: readDate(row, columnMap.support_expires_at),
        distributor: readCell(row, columnMap.distributor) || null,
        contract_type: readCell(row, columnMap.contract_type) || null,
        contract_description: readCell(row, columnMap.contract_description) || null,
        licenses_light: readNumber(row, columnMap.licenses_light),
        licenses_standard: readNumber(row, columnMap.licenses_standard),
        licenses_erp: readNumber(row, columnMap.licenses_erp),
        licenses_routes: readNumber(row, columnMap.licenses_routes),
        licenses_total: readNumber(row, columnMap.licenses_total),
        source_sheet: sheetName,
      }))
      .filter((row) => row.client_name && row.identification);

    await importClients(rows);
    setMessage(`${rows.length} clientes importados desde ${sheetName}.`);
  }

  async function seedDemo() {
    await loadDemoData();
    setMessage("Datos demo restaurados: 40 clientes y 4 usuarios.");
  }

  async function assign() {
    await assignPending();
    setMessage("Clientes pendientes asignados de forma balanceada.");
  }

  return (
    <>
      <Section
        title="Carga de clientes"
        description="El importador usa la primera hoja visible del Excel. Para el archivo real, toma Hoja3 y reconoce CLI, razon social/comercial, telefonos, contactos, correo, contrato, distribuidor y licencias."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-[#ffd7bd] bg-white p-5 shadow-sm">
            <p className="mb-3 grid h-9 w-9 place-items-center rounded-md bg-[#f7b231] text-sm font-bold text-[#231f20]">
              1
            </p>
            <h3 className="font-semibold">Usar datos demo</h3>
            <p className="mt-2 text-sm leading-6 text-[#756b66]">
              Restaura una campana con 40 clientes y 4 usuarios para validar el
              flujo completo antes de conectar la base real.
            </p>
            <PrimaryButton
              className="mt-4"
              onClick={() => void seedDemo()}
              type="button"
            >
              Cargar seed demo
            </PrimaryButton>
          </div>

          <div className="rounded-lg border border-[#ffd7bd] bg-white p-5 shadow-sm">
            <p className="mb-3 grid h-9 w-9 place-items-center rounded-md bg-[#fd5b00] text-sm font-bold text-white">
              2
            </p>
            <h3 className="font-semibold">Importar Excel</h3>
            <p className="mt-2 text-sm leading-6 text-[#756b66]">
              El archivo se procesa en el navegador con SheetJS y crea clientes
              pendientes listos para asignar.
            </p>
            <input
              accept=".xlsx,.xls,.csv"
              className="mt-4 block w-full rounded-md border border-[#f3c27b] bg-[#fff9f5] px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#fd5b00] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={(event) => void handleFile(event)}
              type="file"
            />
          </div>
        </div>
      </Section>

      <Section title="Asignacion">
        <div className="rounded-lg border border-[#ffd7bd] bg-white p-5 shadow-sm">
          <p className="text-sm leading-6 text-[#756b66]">
            La asignacion toma todos los clientes pendientes y los reparte entre
            usuarios activos con menor carga pendiente.
          </p>
          <SecondaryButton
            className="mt-4"
            onClick={() => void assign()}
            type="button"
          >
            Asignar registros
          </SecondaryButton>
          {message ? (
            <p className="mt-4 rounded-md bg-[#fff4ea] px-3 py-2 text-sm font-medium text-[#b54200]">
              {message}
            </p>
          ) : null}
        </div>
      </Section>
    </>
  );
}
