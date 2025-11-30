const express = require("express");
const router = express.Router();
const Comentario = require("../models/entities/Comentario");

//////////////////////////////////////////////// CREATE ////////////////////////////////////////////////

router.post("/cadastro", (req, res) => {
  const { nome, email, senha, telefone, data_nascimento, cep } = req.body;
  Comentario.create({
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

router.get("/all", (req, res) => {
  Comentario.findAll()
    .then((Comentarios) => {
      res.send(Comentarios);
    })
    .catch((erro) => {
      res.send("Erro ao buscar os dados: " + erro);
    });
});

//////////////////////////////////////////////// UPDATE ////////////////////////////////////////////////

router.patch("/:id", (req, res) => {
  const { nome, email, senha, telefone, data_nascimento, cep } = req.body;
  Comentario.update(
    {
      nome: nome,
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
  Comentario.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.send("Usuário excluído com sucesso.");
    })
    .catch((erro) => {
      res.send("Erro ao excluir conta: " + erro);
    });
});

module.exports = router;