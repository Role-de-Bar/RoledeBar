const db = require("../db");
const { DataTypes } = require("sequelize");

const Comentario = db.sequelize.define(
  "comentario",
  {
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estabelecimento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "estabelecimento",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    consumidor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "consumidor",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    proprietario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "proprietario",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tipo_autor: {
      type: DataTypes.ENUM("Consumidor", "Proprietario"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Comentario;
