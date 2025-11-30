const express = require("express");
const pool = require("../db/db");

const router = express.Router();

/* ===============================
   LISTAR MOTORISTAS OPERACIONAIS
================================ */
router.get("/motoristas-operacionais", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        mo.id, 
        mo.nome, 
        e.nome AS empresa
      FROM motoristas_operacionais mo
      JOIN empresas e ON e.id = mo.empresa_id
      WHERE mo.ativo = true
      ORDER BY mo.nome
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar motoristas operacionais" });
  }
});

/* ===============================
   VINCULAR MOTORISTA DO APP
================================ */
router.post("/motoristas-operacionais/vincular", async (req, res) => {
  const { motorista_operacional_id, motorista_cad_id } = req.body;

  if (!motorista_operacional_id || !motorista_cad_id) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    await pool.query(
      `
      UPDATE motoristas_operacionais
      SET motorista_cad_id = $1
      WHERE id = $2
      `,
      [motorista_cad_id, motorista_operacional_id]
    );

    res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao vincular motorista" });
  }
});

/* ===============================
   EXPORTAÇÃO (SEMPRE NO FINAL)
================================ */
module.exports = router;
