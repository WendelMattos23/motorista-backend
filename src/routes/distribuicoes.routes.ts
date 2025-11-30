import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/* 🚚 LISTAR MOTORISTAS PARA DISTRIBUIÇÃO */
router.get("/motoristas-operacionais", async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT 
      mo.id,
      mo.nome,
      e.nome AS empresa
    FROM motoristas_operacionais mo
    JOIN empresas e ON e.id = mo.empresa_id
    WHERE mo.ativo = true
    ORDER BY mo.nome
  `);

  res.json(rows);
});


/* 🔗 VINCULAR MOTORISTA DO APP */
router.post("/motoristas-operacionais/vincular", async (req, res) => {
  const { motorista_operacional_id, motorista_cad_id } = req.body;

  await pool.query(
    `
    UPDATE motoristas_operacionais
    SET motorista_cad_id = $1
    WHERE id = $2
    `,
    [motorista_cad_id, motorista_operacional_id]
  );

  res.json({ sucesso: true });
});

export default router;
