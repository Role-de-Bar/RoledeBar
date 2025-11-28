const db = require("../db");
const { DataTypes } = require("sequelize");

const FavoritosConsumidor = db.sequelize.define(
  "favoritos_consumidor",
  {
    consumidorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: "consumidorId",
      references: {
        model: "consumidor",
        key: "id",
      },
    },
    estabelecimentoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: "estabelecimentoId",
      references: {
        model: "estabelecimento",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["consumidorId", "estabelecimentoId"],
      },
    ],
  }
);

module.exports = FavoritosConsumidor;
