// src/routes/api.js
const express = require("express");
const db = require("../db/db");
const router = express.Router();

/**
 * ROTAS:
 * POST /motorista         -> cria motorista
 * GET  /motoristas        -> lista motoristas (opcional ?nome=)
 * POST /pacotes           -> criar pacote bipado
 * GET  /codigos           -> listar codigos (opcional ?motorista_id=)
 * PUT  /codigo/:id        -> atualizar entregue e motorista
 */

/* MOTORISTAS */
router.post("/motorista", async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome obrigatório" });
  try {
    const result = await db.query(
      "INSERT INTO motoristas (nome) VALUES ($1) RETURNING *",
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

router.get("/motoristas", async (req, res) => {
  const { nome } = req.query;
  try {
    if (nome) {
      const result = await db.query("SELECT * FROM motoristas WHERE nome = $1", [nome]);
      return res.json(result.rows);
    } else {
      const result = await db.query("SELECT * FROM motoristas ORDER BY id DESC");
      return res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

/* PACOTES / CÓDIGOS */
router.post("/pacotes", async (req, res) => {
  const { codigo, conta_id, motorista_id } = req.body;
  if (!codigo) return res.status(400).json({ error: "Código obrigatório" });
  try {
    const result = await db.query(
      `INSERT INTO pacotes_bipados (codigo, conta_id, motorista_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [codigo, conta_id || null, motorista_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

router.get("/codigos", async (req, res) => {
  const { motorista_id } = req.query;
  try {
    if (motorista_id) {
      const result = await db.query(
        `SELECT p.*, m.nome as motorista_nome, c.nome as conta_nome
         FROM pacotes_bipados p
         LEFT JOIN motoristas m ON p.motorista_id = m.id
         LEFT JOIN contas c ON p.conta_id = c.id
         WHERE p.motorista_id = $1
         ORDER BY p.criado_em DESC`,
        [motorista_id]
      );
      return res.json(result.rows);
    } else {
      const result = await db.query(
        `SELECT p.*, m.nome as motorista_nome, c.nome as conta_nome
         FROM pacotes_bipados p
         LEFT JOIN motoristas m ON p.motorista_id = m.id
         LEFT JOIN contas c ON p.conta_id = c.id
         ORDER BY p.criado_em DESC`
      );
      return res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

router.put("/codigo/:id", async (req, res) => {
  const { id } = req.params;
  const { entregue, motorista } = req.body; // motorista pode ser nome ou motorista_id
  try {
    // Se recebeu motorista como número (id), use direto; se recebeu nome, converta para id
    let motorista_id = null;
    if (typeof motorista === "number") {
      motorista_id = motorista;
    } else if (typeof motorista === "string" && motorista.trim() !== "") {
      const m = await db.query("SELECT id FROM motoristas WHERE nome = $1 LIMIT 1", [motorista]);
      if (m.rows.length > 0) motorista_id = m.rows[0].id;
    }

    const result = await db.query(
      `UPDATE pacotes_bipados
       SET entregue = $1, motorista_id = $2
       WHERE id = $3
       RETURNING *`,
      [entregue, motorista_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
