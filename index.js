require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./src/routes/motorista.routes"));
app.use("/api", require("./src/routes/distribuicoes.routes"));
app.use("/api", require("./src/routes/pacotes.routes"));
app.use("/api", require("./src/routes/devolucoes.routes"));
app.use("/api", require("./src/routes/empresa.routes"));
app.use("/api", require("./src/routes/dashboard.routes"));




app.get("/", (_req, res) => {
  res.send("API rodando 🟢");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Servidor rodando na porta", PORT);
});
