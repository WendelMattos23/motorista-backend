const express = require("express");
const router = express.Router();
const pool = require("../db");

// Cadastrar motorista (APP)
router.post("/motorista", async (req, res) => {
  const { nome } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO motoristas (nome) VALUES ($1) RETURNING id, nome",
      [nome]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar motorista" });
  }
});

// Login simples do motorista (APP)
router.post("/motorista/login", async (req, res) => {
  const { nome } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, nome FROM motoristas WHERE nome = $1",
      [nome]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Motorista não encontrado" });
    }

    res.json(result.rows[0]); // retorna ID para o app buscar pacotes
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Listar motoristas para o site
router.get("/motoristas", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nome FROM motoristas");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar motoristas" });
  }
});

// Pacotes do motorista (APP)
router.get("/motorista/:id/pacotes", async (req, res) => {
  const { id } = req.params;
  const { empresa } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT id, codigo, empresa
      FROM pacotes_bipados
      WHERE motorista_id = $1
      AND ($2::text IS NULL OR empresa = $2)
      ORDER BY id DESC
      `,
      [id, empresa || null]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pacotes do motorista" });
  }
});


module.exports = router;
