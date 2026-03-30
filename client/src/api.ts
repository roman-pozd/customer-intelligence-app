const BASE = "/api";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface Customer {
  id: number;
  company_name: string;
  industry: string;
  company_size: string;
  annual_revenue_usd: string;
  country: string;
  city: string;
  website: string;
  health_score: number;
  churn_risk: "low" | "medium" | "high";
  customer_since: string;
  contract_value_usd: string;
  contract_renewal_date: string;
  tier: string;
  assigned_csm: string;
}

export interface Deal {
  id: number;
  customer_id: number;
  company_name: string;
  deal_name: string;
  stage: string;
  deal_value_usd: string;
  currency: string;
  win_probability: number;
  expected_close_date: string;
  actual_close_date: string | null;
  lost_reason: string | null;
  deal_source: string;
  owner: string;
}

export interface Ticket {
  id: number;
  customer_id: number;
  company_name: string;
  ticket_number: string;
  subject: string;
  priority: string;
  status: string;
  category: string;
  first_response_minutes: number;
  resolution_minutes: number | null;
  sla_breached: boolean;
  satisfaction_rating: number | null;
}

export interface NpsResponse {
  id: number;
  customer_id: number;
  company_name: string;
  score: number;
  category: string;
  comment: string;
  quarter: string;
}

export interface DashboardData {
  totalCustomers: string;
  totalContractValue: string;
  totalAnnualRevenue: string;
  activeDeals: string;
  pipelineValue: string;
  churnRisk: { churn_risk: string; count: string }[];
  nps: {
    avg_nps: string;
    promoters: string;
    detractors: string;
    total: string;
  };
  tickets: {
    open_tickets: string;
    sla_breaches: string;
    avg_csat: string;
  };
}

export interface NpsSummary {
  quarter: string;
  responses: string;
  avg_score: string;
  promoters: string;
  passives: string;
  detractors: string;
}

export interface PipelineStage {
  stage: string;
  count: string;
  total_value: string;
  avg_probability: string;
}

export interface TicketStats {
  total_tickets: string;
  open_tickets: string;
  sla_breached: string;
  avg_first_response_min: string;
  avg_resolution_min: string;
  avg_satisfaction: string;
}

export interface CustomerDetail extends Customer {
  deals: Deal[];
  tickets: Ticket[];
  nps: NpsResponse[];
}

export const api = {
  getDashboard: () => fetchJson<DashboardData>("/dashboard"),
  getCustomers: () => fetchJson<Customer[]>("/customers"),
  getCustomer: (id: number) => fetchJson<CustomerDetail>(`/customers/${id}`),
  getDeals: () => fetchJson<Deal[]>("/deals"),
  getPipeline: () => fetchJson<PipelineStage[]>("/deals/pipeline"),
  getTickets: () => fetchJson<Ticket[]>("/tickets"),
  getTicketStats: () => fetchJson<TicketStats>("/tickets/stats"),
  getNps: () => fetchJson<NpsResponse[]>("/nps"),
  getNpsSummary: () => fetchJson<NpsSummary[]>("/nps/summary"),
};
