const express = require("express");
const pool = require("../db/db");

const router = express.Router();

/* ===============================
   LISTAR EMPRESAS
================================ */
router.get("/empresas", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, nome FROM empresas ORDER BY nome"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar empresas" });
  }
});

module.exports = router;
