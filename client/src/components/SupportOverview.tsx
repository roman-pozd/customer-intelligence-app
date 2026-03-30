import { useEffect, useState } from "react";
import { api, Ticket, TicketStats } from "../api";

export default function SupportOverview() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);

  useEffect(() => {
    api.getTickets().then(setTickets);
    api.getTicketStats().then(setStats);
  }, []);

  return (
    <div>
      <h1 className="page-title">Support</h1>

      {stats && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total Tickets</div>
            <div className="kpi-value">{stats.total_tickets}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Open Tickets</div>
            <div className="kpi-value">{stats.open_tickets}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">SLA Breached</div>
            <div className="kpi-value" style={{ color: Number(stats.sla_breached) > 0 ? "var(--red)" : "var(--green)" }}>
              {stats.sla_breached}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg First Response</div>
            <div className="kpi-value">{stats.avg_first_response_min}<span style={{ fontSize: 14, color: "var(--text-dim)" }}> min</span></div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Resolution</div>
            <div className="kpi-value">{stats.avg_resolution_min}<span style={{ fontSize: 14, color: "var(--text-dim)" }}> min</span></div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Satisfaction</div>
            <div className="kpi-value">{stats.avg_satisfaction}<span style={{ fontSize: 14, color: "var(--text-dim)" }}> / 5</span></div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Company</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>SLA</th>
              <th>CSAT</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.ticket_number}</td>
                <td>{t.company_name}</td>
                <td style={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</td>
                <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                <td>{t.sla_breached ? <span style={{ color: "var(--red)" }}>Breached</span> : <span style={{ color: "var(--green)" }}>OK</span>}</td>
                <td>{t.satisfaction_rating ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
