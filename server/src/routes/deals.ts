import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT d.*, c.company_name
    FROM deals d
    JOIN customers c ON c.id = d.customer_id
    ORDER BY d.created_at DESC
  `);
  res.json(rows);
});

router.get("/pipeline", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT stage,
           count(*) as count,
           sum(deal_value_usd) as total_value,
           avg(win_probability) as avg_probability
    FROM deals
    WHERE stage NOT IN ('closed_won', 'closed_lost')
    GROUP BY stage
    ORDER BY avg(win_probability)
  `);
  res.json(rows);
});

export default router;
