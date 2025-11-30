import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import devolucoesRoutes from "./routes/devolucoes.routes";
import motoristasRoutes from "./routes/motorista.routes";
import pacotesRoutes from "./routes/pacotes.routes";
import distribuir from "./routes/distribuicoes.routes";
import empresa from "./routes/empresa.routes";
import motoristasAuth from "./routes/motoristasAuth.js";



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
