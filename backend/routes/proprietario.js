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

module.exports = router;