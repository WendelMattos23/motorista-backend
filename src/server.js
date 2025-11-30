const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const devolucoesRoutes = require("./routes/devolucoes.routes");
const motoristasRoutes = require("./routes/motorista.routes");
const pacotesRoutes = require("./routes/pacotes.routes");
const distribuir = require("./routes/distribuicoes.routes");
const empresa = require("./routes/empresa.routes");
const motoristasAuth = require("./routes/motoristasAuth");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", motoristasRoutes);
app.use("/api", pacotesRoutes);
app.use("/api", distribuir);
app.use("/api", empresa);
app.use("/api", devolucoesRoutes);
app.use("/api", motoristasAuth);

app.get("/", (_req, res) => {
  res.send("API rodando 🟢");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Servidor rodando na porta " + PORT);
});
