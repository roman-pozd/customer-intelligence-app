import { useEffect, useState } from "react";
import { api, DashboardData } from "../api";

function fmt(val: string | number) {
  const n = Number(val);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.getDashboard().then(setData);
  }, []);

  if (!data) return <div className="loading">Loading...</div>;

  const npsScore = Number(data.nps.avg_nps);
  const promoters = Number(data.nps.promoters);
  const detractors = Number(data.nps.detractors);
  const total = Number(data.nps.total);
  const npsNet = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Customers</div>
          <div className="kpi-value">{data.totalCustomers}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Contract Value</div>
          <div className="kpi-value">{fmt(data.totalContractValue)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pipeline Value</div>
          <div className="kpi-value">{fmt(data.pipelineValue)}</div>
          <div className="kpi-sub">{data.activeDeals} active deals</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">NPS Score</div>
          <div className="kpi-value">{npsNet > 0 ? "+" : ""}{npsNet}</div>
          <div className="kpi-sub">Avg rating: {npsScore}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Churn Risk Distribution</div>
          {data.churnRisk.map((r) => (
            <div key={r.churn_risk} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span className={`badge badge-${r.churn_risk}`}>{r.churn_risk}</span>
              <div className="health-bar" style={{ flex: 1 }}>
                <div
                  className="health-fill"
                  style={{
                    width: `${(Number(r.count) / Number(data.totalCustomers)) * 100}%`,
                    background: r.churn_risk === "low" ? "var(--green)" : r.churn_risk === "medium" ? "var(--yellow)" : "var(--red)",
                  }}
                />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, minWidth: 24 }}>{r.count}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Support Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <div className="kpi-label">Open Tickets</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{data.tickets.open_tickets}</div>
            </div>
            <div>
              <div className="kpi-label">SLA Breaches</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Number(data.tickets.sla_breaches) > 0 ? "var(--red)" : "var(--green)" }}>
                {data.tickets.sla_breaches}
              </div>
            </div>
            <div>
              <div className="kpi-label">Avg CSAT</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{data.tickets.avg_csat}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
