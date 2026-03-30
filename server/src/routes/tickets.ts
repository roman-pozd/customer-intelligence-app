import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT t.*, c.company_name
    FROM support_tickets t
    JOIN customers c ON c.id = t.customer_id
    ORDER BY t.created_at DESC
  `);
  res.json(rows);
});

router.get("/stats", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT
      count(*) as total_tickets,
      count(*) FILTER (WHERE status = 'open') as open_tickets,
      count(*) FILTER (WHERE sla_breached = true) as sla_breached,
      round(avg(first_response_minutes)) as avg_first_response_min,
      round(avg(resolution_minutes)) as avg_resolution_min,
      round(avg(satisfaction_rating), 1) as avg_satisfaction
    FROM support_tickets
  `);
  res.json(rows[0]);
});

export default router;
