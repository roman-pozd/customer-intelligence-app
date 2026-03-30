import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT * FROM customers ORDER BY company_name"
  );
  res.json(rows);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rows: customer } = await pool.query(
    "SELECT * FROM customers WHERE id = $1",
    [id]
  );
  if (!customer.length) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  const { rows: deals } = await pool.query(
    "SELECT * FROM deals WHERE customer_id = $1 ORDER BY created_at DESC",
    [id]
  );
  const { rows: tickets } = await pool.query(
    "SELECT * FROM support_tickets WHERE customer_id = $1 ORDER BY created_at DESC",
    [id]
  );
  const { rows: nps } = await pool.query(
    "SELECT * FROM nps_responses WHERE customer_id = $1 ORDER BY responded_at DESC",
    [id]
  );
  res.json({ ...customer[0], deals, tickets, nps });
});

export default router;
