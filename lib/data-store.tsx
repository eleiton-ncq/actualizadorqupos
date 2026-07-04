"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildDemoData, demoCampaign } from "@/lib/seed";
import { hasSupabaseConfig, insertRows, selectRows, upsertRows } from "@/lib/supabase-rest";
import type {
  ClientRecord,
  DashboardStats,
  UpdateCampaign,
  Worker,
  WorkerProgress,
} from "@/lib/types";

type StoreState = ReturnType<typeof buildDemoData>;

type CompleteClientFields = Pick<
  ClientRecord,
  | "updated_phone"
  | "updated_email"
  | "updated_address"
  | "updated_contact_name"
  | "updated_main_contact_name"
  | "updated_main_contact_phone"
  | "updated_main_contact_email"
  | "updated_billing_contact_name"
  | "updated_billing_contact_phone"
  | "updated_billing_contact_email"
  | "updated_support_contact_name"
  | "updated_support_contact_phone"
  | "updated_support_contact_email"
  | "updated_address_province"
  | "updated_address_canton"
  | "updated_address_district"
  | "updated_address_details"
  | "observations"
>;

type NewClientInput = Pick<
  ClientRecord,
  | "client_name"
  | "identification"
  | "current_phone"
  | "current_email"
  | "current_address"
  | "company_name"
> &
  Partial<
    Pick<
      ClientRecord,
      | "current_phone_2"
      | "cli_code"
      | "trade_name"
      | "contact_info"
      | "fax"
      | "support_expires_at"
      | "distributor"
      | "contract_type"
      | "contract_description"
      | "licenses_light"
      | "licenses_standard"
      | "licenses_erp"
      | "licenses_routes"
      | "licenses_total"
      | "source_sheet"
    >
  >;

type DataStore = StoreState & {
  loading: boolean;
  error: string | null;
  isRemote: boolean;
  stats: DashboardStats;
  workerProgress: WorkerProgress[];
  createWorker: (name: string) => Promise<Worker>;
  updateWorkerName: (workerId: string, name: string) => Promise<void>;
  toggleWorker: (workerId: string) => Promise<void>;
  assignPending: () => Promise<void>;
  loadDemoData: () => Promise<void>;
  importClients: (rows: NewClientInput[]) => Promise<void>;
  markInProgress: (clientId: string) => Promise<void>;
  completeClient: (clientId: string, fields: CompleteClientFields) => Promise<void>;
};

const DataContext = createContext<DataStore | null>(null);
const storageKey = "actualizacion-datos-demo";

function now() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makeAccessKey(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);

  return `${slug || "usuario"}-${Math.random().toString(36).slice(2, 8)}`;
}

const updatedDataFields = [
  "updated_phone",
  "updated_email",
  "updated_address",
  "updated_contact_name",
  "updated_main_contact_name",
  "updated_main_contact_phone",
  "updated_main_contact_email",
  "updated_billing_contact_name",
  "updated_billing_contact_phone",
  "updated_billing_contact_email",
  "updated_support_contact_name",
  "updated_support_contact_phone",
  "updated_support_contact_email",
  "updated_address_province",
  "updated_address_canton",
  "updated_address_district",
  "updated_address_details",
] as const satisfies readonly (keyof CompleteClientFields)[];

function hasUpdatedData(fields: CompleteClientFields) {
  return updatedDataFields.some((field) => fields[field]?.trim());
}

function hasObservation(client: Pick<ClientRecord, "observations">) {
  return Boolean(client.observations?.trim());
}

async function readInitialState(): Promise<StoreState> {
  if (hasSupabaseConfig) {
    const [campaigns, workers, clients] = await Promise.all([
      selectRows<UpdateCampaign>(
        "update_campaigns",
        "select=*&order=created_at.desc",
      ),
      selectRows<Worker>("workers", "select=*&order=created_at.asc"),
      selectRows<ClientRecord>("clients", "select=*&order=created_at.asc"),
    ]);

    if (campaigns.length || workers.length || clients.length) {
      return { campaigns, workers, clients };
    }
  }

  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved) as StoreState;
    }
  }

  return buildDemoData();
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(() => buildDemoData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isRemote = hasSupabaseConfig;

  const persist = useCallback(
    async (next: StoreState) => {
      setState(next);

      if (isRemote) {
        await Promise.all([
          upsertRows("update_campaigns", next.campaigns),
          upsertRows("workers", next.workers),
          upsertRows("clients", next.clients),
        ]);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
    },
    [isRemote],
  );

  useEffect(() => {
    let mounted = true;

    readInitialState()
      .then((next) => {
        if (!mounted) return;
        setState(next);
        if (!isRemote) {
          localStorage.setItem(storageKey, JSON.stringify(next));
        }
      })
      .catch((reason: unknown) => {
        if (!mounted) return;
        setError(reason instanceof Error ? reason.message : String(reason));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isRemote]);

  const stats = useMemo<DashboardStats>(() => {
    return {
      total: state.clients.length,
      pending: state.clients.filter((client) => client.status === "pending")
        .length,
      inProgress: state.clients.filter(
        (client) => client.status === "in_progress",
      ).length,
      completed: state.clients.filter((client) => client.status === "completed")
        .length,
      omitted: state.clients.filter((client) => client.status === "omitted")
        .length,
    };
  }, [state.clients]);

  const workerProgress = useMemo<WorkerProgress[]>(() => {
    return state.workers.map((worker) => {
      const assigned = state.clients.filter(
        (client) => client.assigned_worker_id === worker.id,
      );

      return {
        worker,
        assigned: assigned.length,
        completed: assigned.filter((client) => client.status === "completed")
          .length,
        pending: assigned.filter((client) => client.status !== "completed")
          .length,
      };
    });
  }, [state.clients, state.workers]);

  const createWorker = useCallback(
    async (name: string) => {
      const worker: Worker = {
        id: newId("worker"),
        name,
        access_key: makeAccessKey(name),
        is_active: true,
        created_at: now(),
      };
      const next = { ...state, workers: [...state.workers, worker] };

      if (isRemote) {
        await insertRows("workers", worker);
        setState(next);
      } else {
        await persist(next);
      }

      return worker;
    },
    [isRemote, persist, state],
  );

  const toggleWorker = useCallback(
    async (workerId: string) => {
      const workers = state.workers.map((worker) =>
        worker.id === workerId
          ? { ...worker, is_active: !worker.is_active }
          : worker,
      );
      const changed = workers.find((worker) => worker.id === workerId);

      if (isRemote && changed) {
        await upsertRows("workers", changed);
        setState({ ...state, workers });
      } else {
        await persist({ ...state, workers });
      }
    },
    [isRemote, persist, state],
  );

  const updateWorkerName = useCallback(
    async (workerId: string, name: string) => {
      const cleanedName = name.trim();
      if (!cleanedName) {
        throw new Error("El nombre del gestor no puede estar vacio.");
      }

      const workers = state.workers.map((worker) =>
        worker.id === workerId ? { ...worker, name: cleanedName } : worker,
      );
      const changed = workers.find((worker) => worker.id === workerId);

      if (isRemote && changed) {
        await upsertRows("workers", changed);
        setState({ ...state, workers });
      } else {
        await persist({ ...state, workers });
      }
    },
    [isRemote, persist, state],
  );

  const assignPending = useCallback(async () => {
    const activeWorkers = state.workers.filter((worker) => worker.is_active);
    if (!activeWorkers.length) {
      throw new Error("No hay usuarios activos para asignar registros.");
    }

    const counts = new Map(
      activeWorkers.map((worker) => [
        worker.id,
        state.clients.filter(
          (client) =>
            client.assigned_worker_id === worker.id &&
            client.status !== "completed" &&
            client.status !== "omitted",
        ).length,
      ]),
    );

    const changedClients: ClientRecord[] = [];
    const clients = state.clients.map((client) => ({ ...client }));
    for (const client of clients.filter(
      (item) =>
        item.status === "pending" ||
        (item.status === "omitted" && !hasObservation(item)),
    )) {
      const worker = [...activeWorkers].sort(
        (a, b) => (counts.get(a.id) ?? 0) - (counts.get(b.id) ?? 0),
      )[0];
      client.assigned_worker_id = worker.id;
      client.status = "pending";
      client.updated_at = now();
      changedClients.push(client);
      counts.set(worker.id, (counts.get(worker.id) ?? 0) + 1);
    }

    if (isRemote) {
      if (changedClients.length) {
        await upsertRows("clients", changedClients);
      }
      setState({ ...state, clients });
    } else {
      await persist({ ...state, clients });
    }
  }, [isRemote, persist, state]);

  const loadDemoData = useCallback(async () => {
    await persist(buildDemoData());
  }, [persist]);

  const importClients = useCallback(
    async (rows: NewClientInput[]) => {
      const campaign = state.campaigns[0] ?? demoCampaign;
      const created = now();
      const clients: ClientRecord[] = rows.map((row, index) => ({
        id: newId(`import-${index + 1}`),
        campaign_id: campaign.id,
        assigned_worker_id: null,
        client_name: row.client_name,
        identification: row.identification,
        current_phone: row.current_phone,
        current_phone_2: row.current_phone_2 ?? null,
        current_email: row.current_email,
        current_address: row.current_address,
        company_name: row.company_name,
        cli_code: row.cli_code ?? null,
        trade_name: row.trade_name ?? null,
        contact_info: row.contact_info ?? null,
        fax: row.fax ?? null,
        support_expires_at: row.support_expires_at ?? null,
        distributor: row.distributor ?? null,
        contract_type: row.contract_type ?? null,
        contract_description: row.contract_description ?? null,
        licenses_light: row.licenses_light ?? null,
        licenses_standard: row.licenses_standard ?? null,
        licenses_erp: row.licenses_erp ?? null,
        licenses_routes: row.licenses_routes ?? null,
        licenses_total: row.licenses_total ?? null,
        source_sheet: row.source_sheet ?? null,
        updated_phone: null,
        updated_email: null,
        updated_address: null,
        updated_contact_name: null,
        updated_main_contact_name: null,
        updated_main_contact_phone: null,
        updated_main_contact_email: null,
        updated_billing_contact_name: null,
        updated_billing_contact_phone: null,
        updated_billing_contact_email: null,
        updated_support_contact_name: null,
        updated_support_contact_phone: null,
        updated_support_contact_email: null,
        updated_address_province: null,
        updated_address_canton: null,
        updated_address_district: null,
        updated_address_details: null,
        observations: null,
        status: "pending",
        started_at: null,
        completed_at: null,
        created_at: created,
        updated_at: created,
      }));

      const next = {
        campaigns: state.campaigns.length ? state.campaigns : [campaign],
        workers: state.workers,
        clients: [...state.clients, ...clients],
      };

      if (isRemote) {
        await Promise.all([
          upsertRows("update_campaigns", next.campaigns),
          insertRows("clients", clients),
        ]);
        setState(next);
      } else {
        await persist(next);
      }
    },
    [isRemote, persist, state],
  );

  const markInProgress = useCallback(
    async (clientId: string) => {
      let changed: ClientRecord | null = null;
      const clients = state.clients.map((client) =>
        client.id === clientId && client.status === "pending"
          ? (changed = {
                ...client,
                status: "in_progress" as const,
                started_at: now(),
                updated_at: now(),
              })
          : client,
      );

      if (isRemote && changed) {
        await upsertRows("clients", changed);
        setState({ ...state, clients });
      } else {
        await persist({ ...state, clients });
      }
    },
    [isRemote, persist, state],
  );

  const completeClient: DataStore["completeClient"] = useCallback(
    async (clientId, fields) => {
      let changed: ClientRecord | null = null;
      const nextStatus = hasUpdatedData(fields) ? "completed" : "omitted";
      const timestamp = now();
      const clients = state.clients.map((client) =>
        client.id === clientId
          ? (changed = {
                ...client,
                ...fields,
                assigned_worker_id:
                  nextStatus === "omitted" ? null : client.assigned_worker_id,
                status: nextStatus,
                completed_at: nextStatus === "completed" ? timestamp : null,
                updated_at: timestamp,
              })
          : client,
      );

      if (isRemote && changed) {
        await upsertRows("clients", changed);
        setState({ ...state, clients });
      } else {
        await persist({ ...state, clients });
      }
    },
    [isRemote, persist, state],
  );

  const value = useMemo<DataStore>(
    () => ({
      ...state,
      loading,
      error,
      isRemote,
      stats,
      workerProgress,
      createWorker,
      updateWorkerName,
      toggleWorker,
      assignPending,
      loadDemoData,
      importClients,
      markInProgress,
      completeClient,
    }),
    [
      assignPending,
      completeClient,
      createWorker,
      error,
      importClients,
      isRemote,
      loadDemoData,
      loading,
      markInProgress,
      state,
      stats,
      toggleWorker,
      updateWorkerName,
      workerProgress,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataStore() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataStore debe usarse dentro de DataProvider.");
  }

  return context;
}
