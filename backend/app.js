const express = require("express");
const app = express();
const path = require("path");
const port = 8081;
const cors = require("cors");

const syncDatabase = require("./models/sync");
const setupAssociations = require("./models/associations");

// Rotas
const authRoutes = require("./routes/auths");
const consumidorRoutes = require("./routes/consumidor");
const proprietarioRoutes = require("./routes/proprietario");
const estabelecimentoRoutes = require("./routes/estabelecimento");
const favoritosRoutes = require("./routes/favoritos");
const comentariosRoutes = require("./routes/comentarios");
const graficosRoutes = require("./routes/graficos");

// Middleware básico
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imagens da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Associações do Sequelize
setupAssociations();

// Rotas
app.use("/auth", authRoutes);
app.use("/estabelecimentos", estabelecimentoRoutes);
app.use("/consumidores", consumidorRoutes);
app.use("/proprietarios", proprietarioRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/comentarios", comentariosRoutes);
app.use("/graficos", graficosRoutes);

// Iniciar servidor após sync
syncDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});

module.exports = app;
