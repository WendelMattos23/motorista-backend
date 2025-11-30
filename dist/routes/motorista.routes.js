"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
/* 🔐 CADASTRO */
router.post("/motoristas/register", async (req, res) => {
    const { nome, email, placa, senha } = req.body;
    const senhaHash = await bcryptjs_1.default.hash(senha, 10);
    const { rows } = await db_1.pool.query(`
    INSERT INTO motoristascad (nome, email, placa, password_hash)
    VALUES ($1,$2,$3,$4)
    RETURNING id, nome, email
    `, [nome, email, placa, senhaHash]);
    res.status(201).json(rows[0]);
});
/* 🔑 LOGIN */
router.post("/motoristas/login", async (req, res) => {
    const { email, senha } = req.body;
    const { rows } = await db_1.pool.query("SELECT * FROM motoristascad WHERE email = $1 AND ativo = true", [email]);
    if (!rows.length)
        return res.status(401).json({ erro: "Credenciais inválidas" });
    const motorista = rows[0];
    const ok = await bcryptjs_1.default.compare(senha, motorista.password_hash);
    if (!ok)
        return res.status(401).json({ erro: "Credenciais inválidas" });
    const token = jsonwebtoken_1.default.sign({ id: motorista.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
});
exports.default = router;
