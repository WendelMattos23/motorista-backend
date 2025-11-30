const express = require("express");
const pool = require("../db/db");

const router = express.Router();

/* ===============================
   CRIAR DEVOLUÇÃO
================================ */
router.post("/devolucoes", async (req, res) => {
  const { pacote_id, motorista_cad_id, motivo } = req.body;

  if (!pacote_id || !motorista_cad_id || !motivo) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    await pool.query(
      `
      INSERT INTO devolucoes (pacote_id, motorista_cad_id, motivo)
      VALUES ($1, $2, $3)
      `,
      [pacote_id, motorista_cad_id, motivo]
    );

    await pool.query(
      `
      UPDATE pacotes
      SET status = 'DEVOLVIDO'
      WHERE id = $1
      `,
      [pacote_id]
    );

    res.status(201).json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao registrar devolução" });
  }
});

/* ===============================
   LISTAR DEVOLUÇÕES
================================ */
router.get("/devolucoes", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        d.id,
        d.motivo,
        d.created_at,
        p.codigo AS pacote_codigo,
        m.nome AS motorista
      FROM devolucoes d
      JOIN pacotes p ON p.id = d.pacote_id
      JOIN motoristascad m ON m.id = d.motorista_cad_id
      ORDER BY d.created_at DESC
      `
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar devoluções" });
  }
});

module.exports = router;
