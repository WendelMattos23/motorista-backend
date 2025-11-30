const express = require("express");
const pool = require("../db/db");

const router = express.Router();

/* 📦 BIPAR DEVOLUÇÃO */
router.post("/devolucoes/bipar", async (req, res) => {
  const { codigo } = req.body;

  try {
    const { rows } = await pool.query(
      `
      SELECT p.id AS pacote_id,
             p.motivo,
             mo.motorista_cad_id
      FROM pacotes p
      JOIN motoristas_operacionais mo
        ON mo.id = p.motorista_operacional_id
      WHERE p.codigo = $1
      `,
      [codigo]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: "Pacote não encontrado" });
    }

    const { pacote_id, motivo, motorista_cad_id } = rows[0];

    if (!motivo) {
      return res.status(400).json({
        erro: "Motivo ainda não informado pelo motorista"
      });
    }

    await pool.query(
      `
      INSERT INTO devolucoes (pacote_id, motorista_cad_id, motivo)
      VALUES ($1,$2,$3)
      `,
      [pacote_id, motorista_cad_id, motivo]
    );

    await pool.query(
      `UPDATE pacotes SET status = 'DEVOLVIDO' WHERE id = $1`,
      [pacote_id]
    );

    res.status(201).json({
      sucesso: true,
      pacote_id,
      motivo
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao registrar devolução" });
  }
});

module.exports = router;
