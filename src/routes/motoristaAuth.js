const express = require("express");
const pool = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ===============================
   CADASTRO MOTORISTA (APP)
================================ */
router.post("/motoristas/register", async (req, res) => {
  const { nome, email, placa, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "Nome, email e senha são obrigatórios" });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    const { rows } = await pool.query(
      `
      INSERT INTO motoristas
        (nome, email, placa, password_hash, ativo)
      VALUES
        ($1, $2, $3, $4, true)
      RETURNING id, nome, email, placa
      `,
      [nome, email, placa || null, hash]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }

    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar motorista" });
  }
});

/* ===============================
   LOGIN MOTORISTA
================================ */
router.post("/motoristas/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha obrigatórios" });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT id, nome, email, placa, password_hash
      FROM motoristas
      WHERE email = $1 AND ativo = true
      `,
      [email]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: "Motorista não encontrado" });
    }

    const motorista = rows[0];
    const senhaOk = await bcrypt.compare(senha, motorista.password_hash);

    if (!senhaOk) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: motorista.id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({
      id: motorista.id,
      nome: motorista.nome,
      email: motorista.email,
      placa: motorista.placa,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no login" });
  }
});

module.exports = router;
