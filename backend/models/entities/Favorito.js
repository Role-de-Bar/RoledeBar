const db = require("../db");
const { DataTypes } = require("sequelize");

const Favorito = db.sequelize.define(
  "favorito",
  {
    estabelecimento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "estabelecimento",
        key: "id",
      },
      onDelete: 'CASCADE', 
    },
    consumidor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "consumidor",
        key: "id",
      },
      onDelete: 'CASCADE', 
    },
    proprietario_id: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: "proprietario",
        key: "id",
      },
      onDelete: 'CASCADE', 
    },
  },
  {
    freezeTableName: true,
    timestamps: true, 
    indexes: [
      {
        unique: true,
        fields: ['estabelecimento_id', 'consumidor_id', 'proprietario_id']
      }
    ]
  }
);

module.exports = Favorito;