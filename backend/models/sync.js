const Proprietario = require('./entities/Proprietario');
const Consumidor = require('./entities/Consumidor');
const Estabelecimento = require('./entities/Estabelecimento');
const Comentario = require('./entities/Comentario');
const Favorito = require('./entities/Favorito');

async function syncDatabase() {
  console.log("Iniciando sincronização de modelos...");

  try {
    await Proprietario.sync({ alter: false });
    await Consumidor.sync({ alter: false });
    await Estabelecimento.sync({ alter: false });
    await Favorito.sync({ alter: false });
    await Comentario.sync({ alter: false });

    console.log("Todos os modelos foram sincronizados com sucesso.");
  } catch (error) {
    console.error("Erro durante a sincronização do banco de dados:", error);
    throw error;
  }
}

module.exports = syncDatabase;