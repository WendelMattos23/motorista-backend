import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

// Buscar pacote pelo código
router.get("/:codigo", async (req, res) => {
  const { codigo } = req.params;

  const { rows } = await pool.query(
    "SELECT * FROM pacotes WHERE codigo = $1",
    [codigo]
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Pacote não encontrado" });
  }

  res.json(rows[0]);
});

export default router;
