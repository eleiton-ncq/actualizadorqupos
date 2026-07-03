import type { ClientRecord, UpdateCampaign, Worker } from "@/lib/types";

const now = "2026-07-03T10:00:00.000Z";

export const demoCampaign: UpdateCampaign = {
  id: "campaign-actualizacion-datos",
  name: "Actualizacion de datos",
  status: "active",
  created_at: now,
};

export const demoWorkers: Worker[] = [
  {
    id: "worker-ana",
    name: "Ana Morales",
    access_key: "ana-demo-2026",
    is_active: true,
    created_at: now,
  },
  {
    id: "worker-bruno",
    name: "Bruno Castro",
    access_key: "bruno-demo-2026",
    is_active: true,
    created_at: now,
  },
  {
    id: "worker-carla",
    name: "Carla Vega",
    access_key: "carla-demo-2026",
    is_active: true,
    created_at: now,
  },
  {
    id: "worker-diego",
    name: "Diego Solis",
    access_key: "diego-demo-2026",
    is_active: true,
    created_at: now,
  },
];

const names = [
  "Almacen Central",
  "Clinica Santa Lucia",
  "Transportes Rivera",
  "Cafe Montano",
  "Ferreteria El Roble",
  "Soluciones Beta",
  "Panaderia La Espiga",
  "Servicios Luna",
  "Distribuidora Norte",
  "Textiles Prisma",
  "Auto Repuestos Vega",
  "Agroinsumos Verde",
  "Constructora Horizonte",
  "Muebles Aurora",
  "Optica Vista Clara",
  "Farmacia Los Pinos",
  "Hotel Bahia Azul",
  "Importadora Pacifico",
  "Electro Hogar",
  "Super Centro Uno",
];

export const demoClients: ClientRecord[] = Array.from({ length: 40 }, (_, i) => {
  const worker = demoWorkers[i % demoWorkers.length];
  const company = names[i % names.length];
  const id = `client-${String(i + 1).padStart(2, "0")}`;
  const completed = i < 8;
  const inProgress = i >= 8 && i < 12;

  return {
    id,
    campaign_id: demoCampaign.id,
    assigned_worker_id: worker.id,
    client_name: `${company} ${i + 1}`,
    identification: `J-${310100000 + i}`,
    current_phone: `+506 22${String(100000 + i * 317).slice(0, 6)}`,
    current_phone_2: i % 3 === 0 ? `+506 70${String(300000 + i).slice(0, 6)}` : null,
    current_email: `contacto${i + 1}@demo-clientes.com`,
    current_address: `Calle ${i + 11}, zona comercial ${((i % 5) + 1)}`,
    company_name: `${company} S.A.`,
    cli_code: `CLI${String(1000 + i).padStart(4, "0")}`,
    trade_name: company,
    contact_info: i % 4 === 0 ? `Contacto demo ${i + 1},Administracion,88888888` : null,
    fax: null,
    support_expires_at: null,
    distributor: i % 2 === 0 ? "NCQ" : "Demo",
    contract_type: i % 2 === 0 ? "Alquiler de SW" : "Venta de SW",
    contract_description: null,
    licenses_light: i % 2,
    licenses_standard: 1,
    licenses_erp: 0,
    licenses_routes: 0,
    licenses_total: 1 + (i % 2),
    source_sheet: "Demo",
    updated_phone: completed ? `+506 88${String(700000 + i).slice(0, 6)}` : null,
    updated_email: completed ? `actualizado${i + 1}@demo-clientes.com` : null,
    updated_address: completed ? `Direccion validada ${i + 1}` : null,
    updated_contact_name: completed ? `Contacto ${i + 1}` : null,
    updated_main_contact_name: completed ? `Contacto principal ${i + 1}` : null,
    updated_main_contact_phone: completed ? `+506 88${String(700000 + i).slice(0, 6)}` : null,
    updated_main_contact_email: completed ? `principal${i + 1}@demo-clientes.com` : null,
    updated_billing_contact_name: completed ? `Cobros ${i + 1}` : null,
    updated_billing_contact_phone: completed ? `+506 86${String(500000 + i).slice(0, 6)}` : null,
    updated_billing_contact_email: completed ? `cobros${i + 1}@demo-clientes.com` : null,
    updated_support_contact_name: completed ? `Servicio ${i + 1}` : null,
    updated_support_contact_phone: completed ? `+506 87${String(600000 + i).slice(0, 6)}` : null,
    updated_support_contact_email: completed ? `servicio${i + 1}@demo-clientes.com` : null,
    updated_address_province: completed ? "San Jose" : null,
    updated_address_canton: completed ? "San Jose" : null,
    updated_address_district: completed ? "Carmen" : null,
    updated_address_details: completed ? `Otras señas demo ${i + 1}` : null,
    observations: completed ? "Registro demo completado." : null,
    status: completed ? "completed" : inProgress ? "in_progress" : "pending",
    started_at: completed || inProgress ? now : null,
    completed_at: completed ? now : null,
    created_at: now,
    updated_at: now,
  };
});

export function buildDemoData() {
  return {
    campaigns: [demoCampaign],
    workers: demoWorkers,
    clients: demoClients,
  };
}
