const express = require("express");
const router = express.Router();
const pool = require("../db");

// Listar pacotes bipados
router.get("/pacotes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.codigo, p.entregue, m.nome AS motorista
      FROM pacotes_bipados p
      LEFT JOIN motoristas m ON p.motorista_id = m.id
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pacotes" });
  }
});

// Atualizar pacote
router.put("/pacote/:id", async (req, res) => {
  const { id } = req.params;
  const { entregue, motorista_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE pacotes_bipados
       SET entregue = $1, motorista_id = $2
       WHERE id = $3
       RETURNING *`,
      [entregue, motorista_id || null, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar pacote" });
  }
});

module.exports = router;
