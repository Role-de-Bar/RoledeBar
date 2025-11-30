const express = require("express");
const router = express.Router();
const Proprietario = require("../models/entities/Proprietario");

//////////////////////////////////////////////// CREATE ////////////////////////////////////////////////

router.post("/cadastro", (req, res) => {
  const { nome, cpf, email, senha, telefone, data_nascimento, cep } = req.body;
  Proprietario.create({
    nome: nome,
    cpf: cpf,
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
  Proprietario.findAll({ where: { id: req.params.id } })
    .then((Proprietario) => {
      res.send(Proprietario);
    })
    .catch((erro) => {
      res.send("Erro ao buscar os dados: " + erro);
    });
});

//////////////////////////////////////////////// UPDATE ////////////////////////////////////////////////

router.patch("/:id", (req, res) => {
  const { nome, cpf, email, senha, telefone, data_nascimento, cep } = req.body;
  Proprietario.update(
    {
      nome: nome,
      cpf: cpf,
      email: email,
      senha: senha,
      telefone: telefone,
      data_nascimento: data_nascimento,
      cep: cep,
    },
    { where: { id: req.params.id } }
  )
    .then(() => {
      res.send("Usuário atualizado com sucesso!");
    })
    .catch((erro) => {
      res.send("Erro ao atualizar usuário: " + erro);
    });
});

//////////////////////////////////////////////// DELETE ////////////////////////////////////////////////

router.delete("/:id", (req, res) => {
  Proprietario.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.send("Usuário excluído com sucesso.");
    })
    .catch((erro) => {
      res.send("Erro ao excluir conta: " + erro);
    });
});

module.exports = router;