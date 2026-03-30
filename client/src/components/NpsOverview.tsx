import { useEffect, useState } from "react";
import { api, NpsResponse, NpsSummary } from "../api";

export default function NpsOverview() {
  const [responses, setResponses] = useState<NpsResponse[]>([]);
  const [summary, setSummary] = useState<NpsSummary[]>([]);

  useEffect(() => {
    api.getNps().then(setResponses);
    api.getNpsSummary().then(setSummary);
  }, []);

  return (
    <div>
      <h1 className="page-title">NPS</h1>

      <div className="card">
        <div className="card-title">NPS by Quarter</div>
        {summary.map((q) => {
          const total = Number(q.responses);
          const pPct = total > 0 ? (Number(q.promoters) / total) * 100 : 0;
          const paPct = total > 0 ? (Number(q.passives) / total) * 100 : 0;
          const dPct = total > 0 ? (Number(q.detractors) / total) * 100 : 0;
          const npsScore = Math.round(pPct - dPct);

          return (
            <div className="nps-bar-group" key={q.quarter}>
              <span className="label">{q.quarter}</span>
              <div className="bar">
                <div className="bar-promoter" style={{ width: `${pPct}%` }} />
                <div className="bar-passive" style={{ width: `${paPct}%` }} />
                <div className="bar-detractor" style={{ width: `${dPct}%` }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, minWidth: 45, textAlign: "right" }}>
                {npsScore > 0 ? "+" : ""}{npsScore}
              </span>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 24, marginTop: 12, fontSize: 12, color: "var(--text-dim)" }}>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "var(--green)", marginRight: 4 }} />Promoters</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "var(--yellow)", marginRight: 4 }} />Passives</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "var(--red)", marginRight: 4 }} />Detractors</span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <div className="card-title" style={{ padding: "24px 24px 0" }}>All Responses</div>
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Score</th>
              <th>Category</th>
              <th>Quarter</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((n) => (
              <tr key={n.id}>
                <td>{n.company_name}</td>
                <td style={{ fontWeight: 600, color: n.score >= 9 ? "var(--green)" : n.score <= 6 ? "var(--red)" : "var(--yellow)" }}>{n.score}</td>
                <td>{n.category}</td>
                <td>{n.quarter}</td>
                <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
