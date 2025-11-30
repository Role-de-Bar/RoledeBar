const Consumidor = require("./entities/Consumidor");
const Proprietario = require("./entities/Proprietario");
const Estabelecimento = require("./entities/Estabelecimento");
const Comentario = require("./entities/Comentario");
const Favorito = require("./entities/Favorito"); 

function setupAssociations() {
    // --- 1. Relações Proprietario <-> Estabelecimento (1:N) ---
    Proprietario.hasMany(Estabelecimento, { foreignKey: 'proprietario_id', as: 'estabelecimentos' });
    Estabelecimento.belongsTo(Proprietario, { foreignKey: 'proprietario_id', as: 'proprietario' });

    // --- 2. Relações de Favoritos (1:N Polimórficas com Tabela Única) ---

    // 2a. Estabelecimento (Pai) tem Muitos Favoritos
    Estabelecimento.hasMany(Favorito, { foreignKey: 'estabelecimento_id', as: 'favoritadoPor' });
    Favorito.belongsTo(Estabelecimento, { foreignKey: 'estabelecimento_id', as: 'estabelecimento' });

    // 2b. Consumidor (Autor) tem Muitos Favoritos
    Consumidor.hasMany(Favorito, { foreignKey: 'consumidor_id', as: 'meusFavoritosConsumidor' });
    Favorito.belongsTo(Consumidor, { foreignKey: 'consumidor_id', as: 'consumidor' });

    // 2c. Proprietario (Autor) tem Muitos Favoritos
    Proprietario.hasMany(Favorito, { foreignKey: 'proprietario_id', as: 'meusFavoritosProprietario' });
    Favorito.belongsTo(Proprietario, { foreignKey: 'proprietario_id', as: 'proprietario' });

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