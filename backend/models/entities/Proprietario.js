const db = require("../db");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

const Proprietario = db.sequelize.define(
  "proprietario",
  {
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[0-9+\-\s()]+$/i,
      },
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Proprietario.beforeCreate(async (user) => {
  user.senha = await bcrypt.hash(user.senha, 10);
});

module.exports = Proprietario;
