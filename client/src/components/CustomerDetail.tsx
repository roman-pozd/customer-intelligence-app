import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, CustomerDetail as CustomerDetailType } from "../api";

function healthColor(score: number) {
  if (score >= 75) return "var(--green)";
  if (score >= 50) return "var(--yellow)";
  return "var(--red)";
}

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetailType | null>(null);

  useEffect(() => {
    if (id) api.getCustomer(Number(id)).then(setCustomer);
  }, [id]);

  if (!customer) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Link to="/customers" className="back-link">Back to Customers</Link>
      <div className="detail-header">
        <h1>{customer.company_name}</h1>
        <span className={`badge badge-${customer.churn_risk}`}>{customer.churn_risk} risk</span>
        <span className="badge" style={{ background: "rgba(99,102,241,0.15)", color: "var(--accent-light)" }}>{customer.tier}</span>
      </div>

      <div className="meta-grid">
        <div className="meta-item"><span className="label">Industry:</span> {customer.industry}</div>
        <div className="meta-item"><span className="label">Size:</span> {customer.company_size}</div>
        <div className="meta-item"><span className="label">Country:</span> {customer.country}, {customer.city}</div>
        <div className="meta-item"><span className="label">Revenue:</span> ${Number(customer.annual_revenue_usd).toLocaleString()}</div>
        <div className="meta-item"><span className="label">Contract:</span> ${Number(customer.contract_value_usd).toLocaleString()}</div>
        <div className="meta-item"><span className="label">Renewal:</span> {customer.contract_renewal_date}</div>
        <div className="meta-item"><span className="label">CSM:</span> {customer.assigned_csm}</div>
        <div className="meta-item">
          <span className="label">Health:</span>{" "}
          <span style={{ color: healthColor(customer.health_score), fontWeight: 600 }}>{customer.health_score}/100</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Deals ({customer.deals.length})</div>
          {customer.deals.length === 0 ? (
            <div style={{ color: "var(--text-dim)", fontSize: 13 }}>No deals</div>
          ) : (
            <table>
              <thead><tr><th>Deal</th><th>Stage</th><th>Value</th><th>Probability</th></tr></thead>
              <tbody>
                {customer.deals.map((d) => (
                  <tr key={d.id}>
                    <td>{d.deal_name}</td>
                    <td><span className={`badge badge-${d.stage}`}>{d.stage.replace("_", " ")}</span></td>
                    <td>${Number(d.deal_value_usd).toLocaleString()}</td>
                    <td>{d.win_probability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="card-title">NPS Responses ({customer.nps.length})</div>
          {customer.nps.length === 0 ? (
            <div style={{ color: "var(--text-dim)", fontSize: 13 }}>No responses</div>
          ) : (
            <table>
              <thead><tr><th>Quarter</th><th>Score</th><th>Category</th></tr></thead>
              <tbody>
                {customer.nps.map((n) => (
                  <tr key={n.id}>
                    <td>{n.quarter}</td>
                    <td style={{ fontWeight: 600, color: n.score >= 9 ? "var(--green)" : n.score <= 6 ? "var(--red)" : "var(--yellow)" }}>{n.score}</td>
                    <td>{n.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Support Tickets ({customer.tickets.length})</div>
        {customer.tickets.length === 0 ? (
          <div style={{ color: "var(--text-dim)", fontSize: 13 }}>No tickets</div>
        ) : (
          <table>
            <thead><tr><th>Ticket</th><th>Subject</th><th>Priority</th><th>Status</th><th>SLA</th></tr></thead>
            <tbody>
              {customer.tickets.map((t) => (
                <tr key={t.id}>
                  <td>{t.ticket_number}</td>
                  <td>{t.subject}</td>
                  <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td>{t.sla_breached ? <span style={{ color: "var(--red)" }}>Breached</span> : <span style={{ color: "var(--green)" }}>OK</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
