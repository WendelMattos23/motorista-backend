import { Router } from "express";
import { pool } from "../db/db";

const router = Router();

router.post("/", async (req, res) => {
  const { motoristaId, empresaId, pacotes } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const distribRes = await client.query(
      `INSERT INTO distribuicoes (motorista_id, empresa_id)
       VALUES ($1, $2)
       RETURNING id`,
      [motoristaId, empresaId]
    );

    const distribuicaoId = distribRes.rows[0].id;

    for (const codigo of pacotes) {
      const pacoteRes = await client.query(
        "SELECT id, status FROM pacotes WHERE codigo = $1",
        [codigo]
      );

      if (!pacoteRes.rows.length) {
        throw new Error(`Pacote ${codigo} não existe`);
      }

      if (pacoteRes.rows[0].status !== "na_base") {
        throw new Error(`Pacote ${codigo} não disponível`);
      }

      const pacoteId = pacoteRes.rows[0].id;

      await client.query(
        `INSERT INTO distribuicao_pacotes (distribuicao_id, pacote_id)
         VALUES ($1, $2)`,
        [distribuicaoId, pacoteId]
      );

      await client.query(
        "UPDATE pacotes SET status = 'distribuido' WHERE id = $1",
        [pacoteId]
      );
    }

    await client.query("COMMIT");

    res.json({ success: true });

  } catch (error: any) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

export default router;
