import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

/* 🔄 REGISTRAR DEVOLUÇÃO */
router.post("/devolucoes", async (req, res) => {
  const { pacote_id, motivo, motorista_cad_id } = req.body;

  await pool.query(
    `
    INSERT INTO devolucoes (pacote_id, motorista_cad_id, motivo)
    VALUES ($1,$2,$3)
    `,
    [pacote_id, motorista_cad_id, motivo]
  );

  await pool.query(
    "UPDATE pacotes SET status = 'DEVOLVIDO' WHERE id = $1",
    [pacote_id]
  );

  res.status(201).json({ sucesso: true });
});

/* 📊 LISTAR DEVOLUÇÕES */
router.get("/devolucoes", async (_req, res) => {
  const { rows } = await pool.query(
    `
    SELECT d.*, p.codigo, m.nome
    FROM devolucoes d
    JOIN pacotes p ON p.id = d.pacote_id
    JOIN motoristascad m ON m.id = d.motorista_cad_id
    `
  );

  res.json(rows);
});

export default router;
