const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("roledebar", "root", "Giulia@TEMP1501", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(function () {
    console.log("Banco de dados conextado com sucesso!");
  })
  .catch(function (erro) {
    console.log(`Erro ao conectar com o banco de dados: ${erro}`);
  });

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};
