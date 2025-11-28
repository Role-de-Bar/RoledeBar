const express = require("express");
const app = express();
const port = 8081;
const cors = require("cors");
const syncDatabase = require("./models/sync");
const setupAssociations = require("./models/associations");

const authRoutes = require("./routes/auths");
const consumidorRoutes = require("./routes/consumidor");
const proprietarioRoutes = require("./routes/proprietario");
const estabelecimentoRoutes = require("./routes/estabelecimento");
const favoritosRoutes = require("./routes/favoritos");
const comentariosRoutes = require("./routes/comentarios");
const graficosRoutes = require("./routes/graficos");

// configuração body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: "http://localhost:3000" }));

setupAssociations();
syncDatabase();

app.listen(port, function (req, res) {
  console.log(`Servidor rodando na porta ${port}.`);
});

app.use("/auth", authRoutes);
app.use("/consumidores", consumidorRoutes);
app.use("/proprietarios", proprietarioRoutes);
app.use("/estabelecimentos", estabelecimentoRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/comentarios", comentariosRoutes);
app.use("/graficos", graficosRoutes);


