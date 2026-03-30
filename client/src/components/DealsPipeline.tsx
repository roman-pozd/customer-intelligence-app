import { useEffect, useState } from "react";
import { api, Deal, PipelineStage } from "../api";

const STAGE_ORDER = ["discovery", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];

export default function DealsPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);

  useEffect(() => {
    api.getDeals().then(setDeals);
    api.getPipeline().then(setPipeline);
  }, []);

  const maxValue = Math.max(...pipeline.map((p) => Number(p.total_value)), 1);

  return (
    <div>
      <h1 className="page-title">Deals Pipeline</h1>

      <div className="card">
        <div className="card-title">Active Pipeline</div>
        {pipeline.map((p) => (
          <div className="pipeline-stage" key={p.stage}>
            <span className="stage-name">{p.stage.replace("_", " ")}</span>
            <div style={{ flex: 1 }}>
              <div
                className="stage-bar"
                style={{ width: `${(Number(p.total_value) / maxValue) * 100}%` }}
              />
            </div>
            <span className="stage-value">${(Number(p.total_value) / 1000).toFixed(0)}K</span>
            <span style={{ color: "var(--text-dim)", fontSize: 12, width: 60 }}>{p.count} deals</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <div className="card-title" style={{ padding: "24px 24px 0" }}>All Deals</div>
        <table>
          <thead>
            <tr>
              <th>Deal</th>
              <th>Company</th>
              <th>Stage</th>
              <th>Value</th>
              <th>Probability</th>
              <th>Close Date</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {deals
              .sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage))
              .map((d) => (
                <tr key={d.id}>
                  <td>{d.deal_name}</td>
                  <td>{d.company_name}</td>
                  <td><span className={`badge badge-${d.stage}`}>{d.stage.replace("_", " ")}</span></td>
                  <td>${Number(d.deal_value_usd).toLocaleString()}</td>
                  <td>{d.win_probability}%</td>
                  <td>{d.expected_close_date}</td>
                  <td>{d.owner}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
