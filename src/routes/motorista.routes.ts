import { Router } from "express";
import { pool } from "../db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

/* 🔐 CADASTRO */
router.post("/motoristas/register", async (req, res) => {
  const { nome, email, placa, senha } = req.body;

  const senhaHash = await bcrypt.hash(senha, 10);

  const { rows } = await pool.query(
    `
    INSERT INTO motoristascad (nome, email, placa, password_hash)
    VALUES ($1,$2,$3,$4)
    RETURNING id, nome, email
    `,
    [nome, email, placa, senhaHash]
  );

  res.status(201).json(rows[0]);
});

/* 🔑 LOGIN */
router.post("/motoristas/login", async (req, res) => {
  const { email, senha } = req.body;

  const { rows } = await pool.query(
    "SELECT * FROM motoristascad WHERE email = $1 AND ativo = true",
    [email]
  );

  if (!rows.length) return res.status(401).json({ erro: "Credenciais inválidas" });

  const motorista = rows[0];
  const ok = await bcrypt.compare(senha, motorista.password_hash);

  if (!ok) return res.status(401).json({ erro: "Credenciais inválidas" });

  const token = jwt.sign(
    { id: motorista.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

export default router;
