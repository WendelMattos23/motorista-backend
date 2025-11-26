const express = require("express");
const cors = require("cors");
require("dotenv").config();

const motoristaRoutes = require("./src/routes/motoristaRoutes");
const pacoteRoutes = require("./src/routes/pacoteRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota raiz
app.get("/", (req, res) => {
  res.send("Backend rodando! Conexão com Neon OK.");
});

// Rotas
app.use("/", motoristaRoutes);
app.use("/", pacoteRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
