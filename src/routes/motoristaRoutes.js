const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Cadastrar motorista
router.post("/motorista", async (req, res) => {
  const { nome } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO motoristas (nome) VALUES ($1) RETURNING *",
      [nome]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar motorista" });
  }
});

// Listar motoristas
router.get("/motoristas", async (req, res) => {
  const { nome } = req.query;

  try {
    let query = "SELECT id, nome FROM motoristas";
    let params = [];

    if (nome) {
      query += " WHERE nome = $1";
      params.push(nome);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar motoristas" });
  }
});

module.exports = router;
