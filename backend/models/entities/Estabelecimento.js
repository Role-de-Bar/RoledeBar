const db = require("../db");
const { DataTypes } = require("sequelize");

const Estabelecimento = db.sequelize.define(
  "estabelecimento",
  {
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    tipoEstabelecimento: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tipoMusica: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    estiloMusical: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    comodidades: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    rua: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
  },
  {
    freezeTableName: true,
  }
);

module.exports = Estabelecimento;
