export type ClientStatus = "pending" | "in_progress" | "completed";
export type CampaignStatus = "draft" | "active" | "closed";

export type UpdateCampaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  created_at: string;
};

export type Worker = {
  id: string;
  name: string;
  access_key: string;
  is_active: boolean;
  created_at: string;
};

export type ClientRecord = {
  id: string;
  campaign_id: string;
  assigned_worker_id: string | null;
  client_name: string;
  identification: string;
  current_phone: string;
  current_phone_2: string | null;
  current_email: string;
  current_address: string;
  company_name: string;
  cli_code: string | null;
  trade_name: string | null;
  contact_info: string | null;
  fax: string | null;
  support_expires_at: string | null;
  distributor: string | null;
  contract_type: string | null;
  contract_description: string | null;
  licenses_light: number | null;
  licenses_standard: number | null;
  licenses_erp: number | null;
  licenses_routes: number | null;
  licenses_total: number | null;
  source_sheet: string | null;
  updated_phone: string | null;
  updated_email: string | null;
  updated_address: string | null;
  updated_contact_name: string | null;
  observations: string | null;
  status: ClientStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DashboardStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};

export type WorkerProgress = {
  worker: Worker;
  assigned: number;
  completed: number;
  pending: number;
};
