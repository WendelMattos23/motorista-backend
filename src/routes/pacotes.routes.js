const express = require("express");
const pool = require("../db/db");

const router = express.Router();

/* ===============================
   CRIAR PACOTE
================================ */
router.post("/pacotes", async (req, res) => {
  const { codigo, empresa_id, motorista_operacional_id } = req.body;

  if (!codigo || !empresa_id || !motorista_operacional_id) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO pacotes (codigo, empresa_id, motorista_operacional_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [codigo, empresa_id, motorista_operacional_id]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar pacote" });
  }
});

/* ===============================
   PACOTES DO MOTORISTA (APP)
================================ */
router.get("/pacotes/me/:motoristaCadId", async (req, res) => {
  const { motoristaCadId } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT
        p.id,
        p.codigo,
        p.status,
        p.created_at,
        e.nome AS empresa
      FROM pacotes p
      JOIN motoristas_operacionais mo ON mo.id = p.motorista_operacional_id
      JOIN empresas e ON e.id = p.empresa_id
      WHERE mo.motorista_cad_id = $1
      ORDER BY p.created_at DESC
      `,
      [motoristaCadId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pacotes do motorista" });
  }
});

module.exports = router;
