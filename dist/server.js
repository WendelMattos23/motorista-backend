"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const devolucoes_routes_1 = __importDefault(require("./routes/devolucoes.routes"));
const motorista_routes_1 = __importDefault(require("./routes/motorista.routes"));
const pacotes_routes_1 = __importDefault(require("./routes/pacotes.routes"));
const distribuicoes_routes_1 = __importDefault(require("./routes/distribuicoes.routes"));
const empresa_routes_1 = __importDefault(require("./routes/empresa.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", motorista_routes_1.default);
app.use("/api", pacotes_routes_1.default);
app.use("/api", distribuicoes_routes_1.default);
app.use("/api", empresa_routes_1.default);
app.use("/api", devolucoes_routes_1.default);
app.get("/", (_req, res) => {
    res.send("API rodando 🟢");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("✅ Servidor rodando na porta " + PORT);
});
