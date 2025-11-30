import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

router.get("/empresas", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, nome FROM empresas ORDER BY nome"
  );
  res.json(rows);
});

export default router;
