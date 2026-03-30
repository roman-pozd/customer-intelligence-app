import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT n.*, c.company_name
    FROM nps_responses n
    JOIN customers c ON c.id = n.customer_id
    ORDER BY n.responded_at DESC
  `);
  res.json(rows);
});

router.get("/summary", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT
      quarter,
      count(*) as responses,
      round(avg(score), 1) as avg_score,
      count(*) FILTER (WHERE score >= 9) as promoters,
      count(*) FILTER (WHERE score >= 7 AND score <= 8) as passives,
      count(*) FILTER (WHERE score <= 6) as detractors
    FROM nps_responses
    GROUP BY quarter
    ORDER BY quarter
  `);
  res.json(rows);
});

export default router;
