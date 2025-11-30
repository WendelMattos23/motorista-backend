import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/**
 * 🔄 Criar devolução
 * Usado quando um pacote não pôde ser entregue
 */
router.post("/devolucoes", async (req, res) => {
  const { pacote_id, motivo, motorista_id } = req.body;

  if (!pacote_id || !motivo || !motorista_id) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO devolucoes (pacote_id, motivo, motorista_id, data_devolucao)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
      `,
      [pacote_id, motivo, motorista_id]
    );

    // Atualiza status do pacote para DEVOLVIDO
    await pool.query(
      "UPDATE pacotes SET status = 'DEVOLVIDO' WHERE id = $1",
      [pacote_id]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao registrar devolução" });
  }
});

/**
 * 📦 Listar devoluções
 * Usado no dashboard
 */
router.get("/devolucoes", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        d.id,
        d.motivo,
        d.data_devolucao,
        m.nome AS motorista,
        p.codigo AS pacote
      FROM devolucoes d
      JOIN motoristas m ON m.id = d.motorista_id
      JOIN pacotes p ON p.id = d.pacote_id
      ORDER BY d.data_devolucao DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar devoluções" });
  }
});

export default router;
