const express = require("express");
const pool = require("../db/db");

const router = express.Router();

/* LISTAGEM SIMPLES */
router.get("/empresas", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, nome FROM empresas ORDER BY nome"
  );
  res.json(rows);
});

/* DASHBOARD EMPRESAS */
router.get("/empresas/dashboard", async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT
      e.id,
      e.nome,
      COUNT(DISTINCT p.id) AS total_pacotes,
      COUNT(DISTINCT d.id) AS total_devolucoes
    FROM empresas e
    LEFT JOIN pacotes p ON p.empresa_id = e.id
    LEFT JOIN devolucoes d ON d.pacote_id = p.id
    GROUP BY e.id, e.nome
    ORDER BY e.nome
  `);

  res.json(rows);
});

module.exports = router;
