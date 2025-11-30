const express = require("express");
const router = express.Router();
const Consumidor = require("../models/entities/Consumidor");

//////////////////////////////////////////////// CREATE ////////////////////////////////////////////////

router.post("/cadastro", (req, res) => {
  const { nome, email, senha, telefone, data_nascimento, cep } = req.body;
  Consumidor.create({
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

// app.get("/Consumidors", (req, res) => {
//   Consumidor.findAll()
//     .then((Consumidors) => {
//       res.send(Consumidors);
//     })
//     .catch((erro) => {
//       res.send("Erro ao buscar os dados: " + erro);
//     });
// });

router.get("/:id", (req, res) => {
  Consumidor.findAll({ where: { id: req.params.id } })
    .then((Consumidor) => {
      res.send(Consumidor);
    })
    .catch((erro) => {
      res.send("Erro ao buscar os dados: " + erro);
    });
});

//////////////////////////////////////////////// UPDATE ////////////////////////////////////////////////

router.patch("/:id", (req, res) => {
  const { nome, email, senha, telefone, data_nascimento, cep } = req.body;
  Consumidor.update(
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
  Consumidor.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.send("Usuário excluído com sucesso.");
    })
    .catch((erro) => {
      res.send("Erro ao excluir conta: " + erro);
    });
});

module.exports = router;