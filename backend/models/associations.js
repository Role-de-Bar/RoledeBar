const Consumidor = require("./entities/Consumidor");
const Proprietario = require("./entities/Proprietario");
const Estabelecimento = require("./entities/Estabelecimento");
const Comentario = require("./entities/Comentario");
const FavoritosConsumidor = require("./entities/FavoritosConsumidor");
const FavoritosProprietario = require("./entities/FavoritosProprietario");

function setupAssociations() {
    // --- 1. Relações Proprietario <-> Estabelecimento (1:N) ---
    Proprietario.hasMany(Estabelecimento, { foreignKey: 'proprietario_id', as: 'estabelecimentos' });
    Estabelecimento.belongsTo(Proprietario, { foreignKey: 'proprietario_id', as: 'proprietario' });

    // --- 2. Relações de Favoritos (M:N) ---

    // Proprietario <-> Estabelecimento (via FavoritosProprietario)
    Proprietario.belongsToMany(Estabelecimento, {
        through: FavoritosProprietario,
        foreignKey: 'proprietarioId',
        as: 'favoritosProprietario'
    });
    Estabelecimento.belongsToMany(Proprietario, {
        through: FavoritosProprietario,
        foreignKey: 'estabelecimentoId',
        as: 'favoritadoPorProprietarios'
    });

    // Consumidor <-> Estabelecimento (via FavoritosConsumidor)
    Consumidor.belongsToMany(Estabelecimento, {
        through: FavoritosConsumidor,
        foreignKey: 'consumidorId',
        as: 'favoritosConsumidor'
    });
    Estabelecimento.belongsToMany(Consumidor, {
        through: FavoritosConsumidor,
        foreignKey: 'estabelecimentoId',
        as: 'favoritadoPorConsumidores'
    });

    // --- 3. Relações de Comentários (1:N com 3 destinos) ---
    Comentario.belongsTo(Estabelecimento, { foreignKey: 'estabelecimento_id', as: 'estabelecimento' });
    Comentario.belongsTo(Consumidor, { foreignKey: 'consumidor_id', as: 'autorConsumidor' });
    Comentario.belongsTo(Proprietario, { foreignKey: 'proprietario_id', as: 'autorProprietario' });

    Estabelecimento.hasMany(Comentario, { foreignKey: 'estabelecimento_id', as: 'comentarios' });
    Consumidor.hasMany(Comentario, { foreignKey: 'consumidor_id', as: 'comentariosConsumidor' });
    Proprietario.hasMany(Comentario, { foreignKey: 'proprietario_id', as: 'comentariosProprietario' });

    console.log("Associações de modelos configuradas com sucesso.");
}

module.exports = setupAssociations;