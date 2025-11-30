const express = require("express");
const router = express.Router();
const Favorito = require("../models/entities/Favorito");

//////////////////////////////////////////////// CREATE ////////////////////////////////////////////////

router.post("/add", (req, res) => {
  const { nome, email, senha, telefone, data_nascimento, cep } = req.body;
  Favorito.create({
    nome: nome,
    email: email,
    senha: senha,
    telefone: telefone,
    data_nascimento: data_nascimento,
    cep: cep,
  })
    .then(() => {
      res.send("Usuário cadastrado com sucesso!");
    })
    .catch((erro) => {
      res.send("Erro ao cadastrar usuário: " + erro);
    });
});

//////////////////////////////////////////////// READ ////////////////////////////////////////////////

router.get("/:id", (req, res) => {
  Favorito.findAll({ where: { id: req.params.id } })
    .then((Favorito) => {
      res.send(Favorito);
    })
    .catch((erro) => {
      res.send("Erro ao buscar os dados: " + erro);
    });
});

//////////////////////////////////////////////// DELETE ////////////////////////////////////////////////

router.delete("/:id", (req, res) => {
  Favorito.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.send("Usuário excluído com sucesso.");
    })
    .catch((erro) => {
      res.send("Erro ao excluir conta: " + erro);
    });
});

module.exports = router;