import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

// Buscar motoristas ativos
router.get("/", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, nome FROM motoristas WHERE ativo = true ORDER BY nome"
  );
  res.json(rows);
});

// Cadastro do motorista (App)
router.post("/", async (req, res) => {
  const { nome, telefone } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO motoristas (nome, telefone)
     VALUES ($1, $2)
     RETURNING *`,
    [nome, telefone]
  );

  res.status(201).json(rows[0]);
});

export default router;
