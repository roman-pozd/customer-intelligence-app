import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const [customers, revenue, pipeline, churn, nps, tickets] =
    await Promise.all([
      pool.query("SELECT count(*) as total FROM customers"),
      pool.query(
        "SELECT sum(contract_value_usd) as total_contract_value, sum(annual_revenue_usd) as total_annual_revenue FROM customers"
      ),
      pool.query(`
        SELECT count(*) as active_deals,
               sum(deal_value_usd) as pipeline_value
        FROM deals
        WHERE stage NOT IN ('closed_won', 'closed_lost')
      `),
      pool.query(`
        SELECT churn_risk, count(*) as count
        FROM customers
        GROUP BY churn_risk
      `),
      pool.query(`
        SELECT round(avg(score), 1) as avg_nps,
               count(*) FILTER (WHERE score >= 9) as promoters,
               count(*) FILTER (WHERE score <= 6) as detractors,
               count(*) as total
        FROM nps_responses
      `),
      pool.query(`
        SELECT count(*) FILTER (WHERE status != 'resolved' AND status != 'closed') as open_tickets,
               count(*) FILTER (WHERE sla_breached = true) as sla_breaches,
               round(avg(satisfaction_rating), 1) as avg_csat
        FROM support_tickets
      `),
    ]);

  res.json({
    totalCustomers: customers.rows[0].total,
    totalContractValue: revenue.rows[0].total_contract_value,
    totalAnnualRevenue: revenue.rows[0].total_annual_revenue,
    activeDeals: pipeline.rows[0].active_deals,
    pipelineValue: pipeline.rows[0].pipeline_value,
    churnRisk: churn.rows,
    nps: nps.rows[0],
    tickets: tickets.rows[0],
  });
});

export default router;
