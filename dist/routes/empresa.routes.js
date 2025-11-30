"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db/db");
const router = (0, express_1.Router)();
router.get("/empresas", async (_req, res) => {
    const { rows } = await db_1.pool.query("SELECT id, nome FROM empresas ORDER BY nome");
    res.json(rows);
});
exports.default = router;
