const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/dashboard", async (_req, res) => {
  try {
    const [
      pacotes,
      motoristas,
      devolucoes,
      empresas,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM pacotes"),
      pool.query("SELECT COUNT(*) FROM motoristas_operacionais WHERE ativo = true"),
      pool.query("SELECT COUNT(*) FROM devolucoes"),
      pool.query("SELECT COUNT(*) FROM empresas"),
    ]);

    res.json({
      pacotes: Number(pacotes.rows[0].count),
      motoristas: Number(motoristas.rows[0].count),
      devolucoes: Number(devolucoes.rows[0].count),
      empresas: Number(empresas.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao carregar dashboard" });
  }
});

module.exports = router;
