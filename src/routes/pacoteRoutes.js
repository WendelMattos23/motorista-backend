const express = require("express");
const router = express.Router();
const pool = require("../db");

// Listar pacotes bipados (SITE)
router.get("/pacotes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.codigo, 
        p.empresa,
        m.nome AS motorista
      FROM pacotes_bipados p
      LEFT JOIN motoristas m ON p.motorista_id = m.id
      ORDER BY p.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pacotes" });
  }
});

// Bipar pacote e associar motorista + empresa (SITE)
router.post("/pacote", async (req, res) => {
  const { codigo, motorista_id, empresa } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO pacotes_bipados (codigo, motorista_id, empresa)
       VALUES ($1, $2, $3)
       RETURNING id, codigo, motorista_id, empresa`,
      [codigo, motorista_id, empresa]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao bipar pacote" });
  }
});

module.exports = router;
