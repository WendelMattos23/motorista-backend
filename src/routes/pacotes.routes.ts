import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/* 📦 BIPAR PACOTE */
router.post("/pacotes", async (req, res) => {
  const { codigo, empresa_id, motorista_operacional_id } = req.body;

  if (!codigo || !empresa_id || !motorista_operacional_id) {
    return res.status(400).json({ erro: "Dados obrigatórios" });
  }

  const { rows } = await pool.query(
    `
    INSERT INTO pacotes (codigo, empresa_id, motorista_operacional_id)
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [codigo, empresa_id, motorista_operacional_id]
  );

  res.status(201).json(rows[0]);
});

/* 📱 PACOTES DO MOTORISTA (APP) */
router.get("/pacotes/me/:motoristaCadId", async (req, res) => {
  const { motoristaCadId } = req.params;

  const { rows } = await pool.query(
    `
    SELECT p.*
    FROM pacotes p
    JOIN motoristas_operacionais mo ON mo.id = p.motorista_operacional_id
    WHERE mo.motorista_cad_id = $1
    `,
    [motoristaCadId]
  );

  res.json(rows);
});

export default router;
