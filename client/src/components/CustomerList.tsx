import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, Customer } from "../api";

function healthColor(score: number) {
  if (score >= 75) return "var(--green)";
  if (score >= 50) return "var(--yellow)";
  return "var(--red)";
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.getCustomers().then(setCustomers);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.company_name.toLowerCase().includes(filter.toLowerCase()) ||
      c.industry.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-title">Customers</h1>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name or industry..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 14px",
            color: "var(--text)",
            width: 320,
            fontSize: 14,
          }}
        />
      </div>
      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Industry</th>
              <th>Tier</th>
              <th>Health</th>
              <th>Churn Risk</th>
              <th>Contract Value</th>
              <th>Renewal</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/customers/${c.id}`} className="link">
                    {c.company_name}
                  </Link>
                </td>
                <td>{c.industry}</td>
                <td><span className="badge" style={{ background: "rgba(99,102,241,0.15)", color: "var(--accent-light)" }}>{c.tier}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="health-bar" style={{ width: 60 }}>
                      <div className="health-fill" style={{ width: `${c.health_score}%`, background: healthColor(c.health_score) }} />
                    </div>
                    <span style={{ fontSize: 12 }}>{c.health_score}</span>
                  </div>
                </td>
                <td><span className={`badge badge-${c.churn_risk}`}>{c.churn_risk}</span></td>
                <td>${Number(c.contract_value_usd).toLocaleString()}</td>
                <td>{c.contract_renewal_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
