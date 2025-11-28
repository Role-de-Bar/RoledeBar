const db = require("../db");
const { DataTypes } = require("sequelize");

const FavoritosProprietario = db.sequelize.define(
  "favoritos_proprietario",
  {
    proprietarioId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'proprietarioId',
        references: {
            model: 'proprietario',
            key: 'id'
        }
    },
    estabelecimentoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'estabelecimentoId',
        references: {
            model: 'estabelecimento',
            key: 'id'
        }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['proprietarioId', 'estabelecimentoId']
      }
    ]
  }
);

module.exports = FavoritosProprietario;